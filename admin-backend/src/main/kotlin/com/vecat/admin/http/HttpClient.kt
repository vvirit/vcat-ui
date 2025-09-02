package com.vecat.admin.http

import com.vecat.admin.http.interceptors.AwsWafInterceptor
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.http.*
import kotlinx.serialization.encodeToString
import org.slf4j.LoggerFactory
import java.net.URI
import java.util.*
import kotlin.concurrent.getOrSet

enum class ProxyType {
    HTTP, SOCKS
}

data class ProxyConfig(
    var type: ProxyType,
    var host: String,
    var port: Int,
    var username: String? = null,
    var password: String? = null,
)

data class BrowserVersion(
    val impersonateTag: String,
    val userAgent: String = "",
)

object BrowserVersions {
    val CHROME_99 = BrowserVersion(impersonateTag = "chrome99")
    val CHROME_100 = BrowserVersion(impersonateTag = "chrome100")
    val CHROME_101 = BrowserVersion(impersonateTag = "chrome101")
    val CHROME_104 = BrowserVersion(impersonateTag = "chrome104")
    val CHROME_107 = BrowserVersion(impersonateTag = "chrome107")
    val CHROME_110 = BrowserVersion(impersonateTag = "chrome110")
    val CHROME_116 = BrowserVersion(
        impersonateTag = "chrome116",
        userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
    )
    val CHROME_119 = BrowserVersion(impersonateTag = "chrome119")
    val CHROME_120 = BrowserVersion(impersonateTag = "chrome120")
    val CHROME_123 = BrowserVersion(impersonateTag = "chrome123")
    val CHROME_124 = BrowserVersion(
        impersonateTag = "chrome124",
        userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )
    val CHROME_99_ANDROID = BrowserVersion(impersonateTag = "chrome99_android")
}

private fun appendUrl(url: String, path: String): Url {
    val append = URI(path)
    if (append.isAbsolute) {
        return Url(path)
    } else {
        val original = URI(url)
        return Url(original.resolve(append))
    }
}

val httpJsonObjectMapper = jacksonObjectMapper().apply {
    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
}

class HttpRequestExecution(
    val request: HttpRequest,
    val response: HttpResponseData,
)

class CookieStorage {
    private val container = mutableListOf<HttpCookie>()

    companion object {
        val objectMapper = jacksonObjectMapper()
    }

    fun addCookie(cookie: HttpCookie) {
        container.removeIf { it.domain == cookie.domain && it.name == cookie.name }
        container.add(cookie)
    }

    fun addCookies(vararg cookies: HttpCookie) {
        cookies.forEach { addCookie(it) }
    }

    fun removeIf(predicate: (HttpCookie) -> Boolean) {
        container.removeIf(predicate)
    }

    fun backup(): String {
        return objectMapper.writeValueAsString(container)
    }

    fun clear() {
        container.clear()
    }

    fun restore(json: String) {
        clear()
        container.addAll(objectMapper.readValue<List<HttpCookie>>(json))
    }

    fun allCookies(): List<HttpCookie> {
//    container.removeIf {
//      if (it.createdAt == null || it.maxAge == null || it.maxAge == 0) {
//        false
//      } else {
//        it.createdAt!! + it.maxAge!! * 1000L < System.currentTimeMillis()
//      }
//    }
        return container
    }

    fun getCookieByName(name: String): HttpCookie? {
        return container.firstOrNull { it.name == name }
    }
}

class HttpClientConfig {
    var proxy: ProxyConfig? = null
    var followRedirects = true
    var maxRedirectTimes = 20
    var browserVersion: BrowserVersion = BrowserVersions.CHROME_123
    var reuseConnection = true
    var connectionTimeout: Long = 30_000
    var timeout: Long = 30_000
    var cookieStorage = CookieStorage()

    // 调用间隔时间，模拟人操作
    var callInterval = 0L
    var logPerformance = false
}

abstract class HttpClient(scope: HttpClientConfig.() -> Unit = {}) {

    val clientId = UUID.randomUUID().toString()
    private val logger = LoggerFactory.getLogger(javaClass)
    private val interceptors = mutableListOf<ImpersonateHttpInterceptor>()

    val data = mutableMapOf<String, Any>()

    val config = HttpClientConfig().apply(scope)
    var cookieStorage = config.cookieStorage

    init {
        addInterceptor(AwsWafInterceptor)
    }

    fun addInterceptor(vararg interceptor: ImpersonateHttpInterceptor) {
        interceptors.addAll(interceptor)
    }

    fun get(url: Url, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return callWithRequestBuilder(url, HttpMethod.Get, requestBuilder)
    }

    fun get(url: String, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return get(Url(url), requestBuilder)
    }

    fun post(url: Url, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return callWithRequestBuilder(url, HttpMethod.Post, requestBuilder)
    }

    fun post(url: String, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return post(Url(url), requestBuilder)
    }

    fun put(url: Url, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return callWithRequestBuilder(url, HttpMethod.Put, requestBuilder)
    }

    fun put(url: String, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return put(Url(url), requestBuilder)
    }

    fun delete(url: Url, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return callWithRequestBuilder(url, HttpMethod.Delete, requestBuilder)
    }

    fun delete(url: String, requestBuilder: HttpRequestBuilder.() -> Unit = {}): HttpResponse {
        return delete(Url(url), requestBuilder)
    }

    private val lastCallTime = ThreadLocal<Long>()

    private fun callWithRequestBuilder(
        url: Url,
        method: HttpMethod,
        requestBuilderScope: HttpRequestBuilder.() -> Unit
    ): HttpResponse {
        if (config.callInterval > 0) {
            val lastTime = lastCallTime.getOrSet { 0L }
            val sleepTime = config.callInterval - (System.currentTimeMillis() - lastTime)
            if (sleepTime > 0) {
                Thread.sleep(sleepTime)
            }
            lastCallTime.set(System.currentTimeMillis())
        }
        val requestBuilder = HttpRequestBuilder(url, method, config.proxy).apply(requestBuilderScope)
        return execute(requestBuilder)
    }

    fun execute(requestBuilder: HttpRequestBuilder): HttpResponse {
        val requestId = UUID.randomUUID().toString()
        val beforeRequestData = BeforeRequestData(requestId, this, requestBuilder)
        for (interceptor in interceptors) {
            interceptor.beforeRequest?.let { it(beforeRequestData) }
            if (beforeRequestData.interceptResponse != null) {
                return beforeRequestData.interceptResponse!!
            }
        }
        val callResponse = call(requestBuilder)
        val afterRequestData =
            AfterRequestData(requestId, this, requestBuilder, callResponse.first, callResponse.second)
        for (interceptor in interceptors) {
            interceptor.afterRequest?.let { it(afterRequestData) }
            if (afterRequestData.interceptResponse != null) {
                return afterRequestData.interceptResponse!!
            }
        }
        val (request, response) = callResponse
        if (config.logPerformance) {
            logger.info("${response.requestCostTime}ms} [${request.method.value}] ${request.url}")
        }
        return response
    }

    private fun call(requestBuilder: HttpRequestBuilder): Pair<HttpRequest, HttpResponse> {
        val executions = mutableListOf<HttpRequestExecution>()
        var withRedirection = false
        var redirectTimes = 0
        val requestStartTime = System.currentTimeMillis()
        while (true) {
            if (redirectTimes > config.maxRedirectTimes) {
                throw RuntimeException("Max redirection times reached, ${config.maxRedirectTimes}")
            }
            val cookieValue = cookieStorage.allCookies()
                .filter {
                    requestBuilder.urlBuilder.host.contains(
                        it.domain?.removePrefix(".") ?: ""
                    ) && requestBuilder.urlBuilder.encodedPath.ifEmpty { "/" }
                        .contains(it.path ?: "") && it.value.isNotBlank()
                }
                .joinToString("; ") {
                    "${it.name}=${it.value}"
                }
            val currentRequestCookie = requestBuilder.headersBuilder["Cookie"]
            val cookieItems = mutableListOf<String>()
            if (cookieValue.isNotBlank()) {
                cookieItems.add(cookieValue)
            }
            if (currentRequestCookie?.isNotBlank() == true) {
                cookieItems.add(currentRequestCookie)
            }
            requestBuilder.headers {
                remove("Cookie")
                append("Cookie", cookieValue)
            }
            val request = requestBuilder.buildRequest()
            val response = handleRequest(request)
            val execution = HttpRequestExecution(request, response)
            executions.add(execution)
            // 处理重定向
            val redirectLocation = response.headers[HttpHeaders.Location] ?: ""
            if (config.followRedirects && request.method == HttpMethod.Get && response.status == HttpStatusCode.Found && redirectLocation.isNotBlank()) {
                withRedirection = true
                val redirectUrl = if (redirectLocation.startsWith("http:") || redirectLocation.startsWith("https:")) {
                    Url(redirectLocation)
                } else {
                    appendUrl(request.url.toString(), redirectLocation)
                }

                val encodedUrl = URLBuilder().apply {
                    protocol = redirectUrl.protocol
                    host = redirectUrl.host
                    encodedPath = redirectUrl.encodedPath
                    redirectUrl.parameters.forEach { name, values ->
                        values.forEach { value ->
                            parameters.append(name, value)
                        }
                    }
                }
                requestBuilder.urlBuilder = encodedUrl
                redirectTimes++
            } else {
                return Pair(
                    request, HttpResponse(
                        status = response.status,
                        headers = response.headers,
                        bodyContent = response.bodyContent,
                        withRedirection = withRedirection,
                        executions = executions,
                        request = request,
                        requestStartTime = requestStartTime,
                        requestEndTime = System.currentTimeMillis(),
                    )
                )
            }
        }
    }

    private fun handleRequest(httpRequest: HttpRequest): HttpResponseData {
        val response = processNetwork(httpRequest)
        val cookies = response.headers.getAll("Set-Cookie")
        cookies?.forEach { value ->
            val cookieValue = if (value.contains("오전") || value.contains("오후")) {
                value.replace(Regex("Expires=[^;]+;?\\s*"), "")
            } else {
                value
            }
            var cookie = parseServerSetCookieHeader(cookieValue)
            if (cookie.domain.isNullOrBlank()) {
                val domain = httpRequest.url.host
                cookie = cookie.copy(domain = domain)
            }
            if (cookie.value == "deleted") {
                config.cookieStorage.removeIf { it.name == cookie.name && it.domain == cookie.domain }
            } else {
                val httpCookie = HttpCookie(
                    name = cookie.name,
                    value = cookie.value,
                    domain = cookie.domain,
                    path = cookie.path,
                    maxAge = cookie.maxAge,
                    expires = cookie.expires,
                    secure = cookie.secure,
                    httpOnly = cookie.httpOnly,
                    extensions = cookie.extensions,
                    createdAt = System.currentTimeMillis(),
                )
                config.cookieStorage.addCookie(httpCookie)
            }
        }
        return response
    }

    abstract fun processNetwork(httpRequest: HttpRequest): HttpResponseData
}