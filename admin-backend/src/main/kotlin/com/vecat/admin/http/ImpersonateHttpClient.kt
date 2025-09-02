package com.vecat.admin.http

import io.ktor.http.*
import net.covers1624.curl4j.CURL
import net.covers1624.curl4j.curl_slist
import net.covers1624.curl4j.util.HeaderCollector
import net.covers1624.curl4j.util.MemoryCurlOutput
import java.util.concurrent.ConcurrentHashMap
import kotlin.concurrent.getOrSet

/**
 * 浏览器模拟Http客户端
 *
 * @author Virit
 * @since 2025-01-18
 */
class ImpersonateHttpClient(scope: HttpClientConfig.() -> Unit = {}): HttpClient(scope) {

  companion object {
    init {
      loadLibrary()
    }
  }

  private val curlHandle = ThreadLocal<ConcurrentHashMap<String, Long>>()

  private fun getCurlHandle(host: String): Long {
    val hashMap = curlHandle.getOrSet { ConcurrentHashMap() }
    return hashMap.computeIfAbsent(host) { CURL.curl_easy_init() }
  }

  // 为空时使用curl-impersonate默认的ua
  var userAgent = ""

  override fun processNetwork(httpRequest: HttpRequest): HttpResponseData {
    val curl = getCurlHandle(httpRequest.url.host)
    var statusCode = 0
    var responseBody: ByteArray? = null
    var headers: Map<String, List<String>>
    var headerList: curl_slist? = null
    try {
      MemoryCurlOutput.create().use { output ->
        HeaderCollector().use { headerCollector ->
          if (userAgent.isNotBlank()) {
            headerList = CURL.curl_slist_append(headerList, "user-agent: ${userAgent}")
          }
          if (!httpRequest.headers.isEmpty()) {
            httpRequest.headers.forEach { name, values ->
              values.forEach { valueItem ->
                headerList = CURL.curl_slist_append(headerList, "${name}: $valueItem")
              }
            }
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_HTTPHEADER, headerList)
          }

          // set cookies
          if (httpRequest.headers.contains(HttpHeaders.Cookie)) {
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_COOKIE, httpRequest.headers[HttpHeaders.Cookie])
          }

          // set proxy
          httpRequest.proxy?.let {
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_PROXY, "${it.type.name.lowercase()}://${it.host}:${it.port}")
            if (!it.username.isNullOrBlank()) {
              CURL.curl_easy_setopt(curl, CURL.CURLOPT_PROXYUSERNAME, it.username)
            }
            if (!it.password.isNullOrBlank()) {
              CURL.curl_easy_setopt(curl, CURL.CURLOPT_PROXYPASSWORD, it.password)
            }
          }

          CURL.curl_easy_setopt(curl, CURL.CURLOPT_SSL_VERIFYHOST, 0L)
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_SSL_VERIFYPEER, 0L)
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_WRITEFUNCTION, output.callback())
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_HEADERFUNCTION, headerCollector.callback())
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_URL, httpRequest.url.toString())
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_CUSTOMREQUEST, httpRequest.method.value)
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_ACCEPT_ENCODING, "gzip")
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_CONNECTTIMEOUT_MS, config.connectionTimeout)
          CURL.curl_easy_setopt(curl, CURL.CURLOPT_TIMEOUT_MS, config.timeout)
          CURL.curl_easy_impersonate(curl, config.browserVersion.impersonateTag, true)
          if (config.reuseConnection) {
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_FORBID_REUSE, false)
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_TCP_KEEPALIVE, 1L)
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_TCP_KEEPIDLE, 120L)
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_TCP_KEEPINTVL, 20L)
          } else {
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_FORBID_REUSE, true)
          }
          httpRequest.body?.let {
            CURL.curl_easy_setopt(curl, CURL.CURLOPT_COPYPOSTFIELDS, httpRequest.body)
          }
          val result = CURL.curl_easy_perform(curl)
          val message = CURL.curl_easy_strerror(result)
          if (result != CURL.CURLE_OK) {
            throw RuntimeException(message)
          }
          statusCode = CURL.curl_easy_getinfo_long(curl, CURL.CURLINFO_RESPONSE_CODE).toInt()
          responseBody = output.bytes()
          headers = headerCollector.headers
        }
      }
    } finally {
      if (headerList != null) {
        CURL.curl_slist_free_all(headerList)
      }
      CURL.curl_easy_reset(curl)
    }
    return HttpResponseData(
      HttpStatusCode.fromValue(statusCode),
      HeadersImpl(headers),
      responseBody
    )
  }

  fun closeConnection() {
    val map = curlHandle.get()
    if (map != null) {
      for (key in map.keys()) {
        val handle = map[key]
        if (handle != null) {
          CURL.curl_easy_cleanup(handle)
          map.remove(key)
        }
      }
    }
  }
}

fun createHttpClient(scope: HttpClientConfig.() -> Unit = {}): ImpersonateHttpClient {
  return ImpersonateHttpClient(scope)
}
