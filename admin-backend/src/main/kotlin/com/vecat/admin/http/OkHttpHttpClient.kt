package com.vecat.admin.http

import io.ktor.http.*
import okhttp3.Credentials
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.net.InetSocketAddress

class OkHttpHttpClient(scope: HttpClientConfig.() -> Unit = {}) : HttpClient(scope) {

  companion object {
    val default by lazy { OkHttpHttpClient() }
  }

  private val httpClient by lazy {
    val clientBuilder = OkHttpClient.Builder()
    config.proxy?.let {
      if (it.type == ProxyType.HTTP) {
        clientBuilder.proxy(java.net.Proxy(java.net.Proxy.Type.HTTP, InetSocketAddress(it.host, it.port)))
        if (!it.username.isNullOrBlank() && !it.password.isNullOrBlank()) {
          clientBuilder.proxyAuthenticator { _, response ->
            val credential = Credentials.basic(it.username!!, it.password!!)
            response.request.newBuilder().header("Proxy-Authorization", credential).build()
          }
        }
      }
    }
    clientBuilder.build()
  }

  override fun processNetwork(httpRequest: HttpRequest): HttpResponseData {
    // set url
    val requestBuilder = Request.Builder()
    requestBuilder.url(httpRequest.url.toString())
    // handle request method type
    val contentType = (httpRequest.headers["Content-Type"] ?: ContentType.Any.toString()).toMediaType()
    val requestBody = (httpRequest.body ?: "").toRequestBody(contentType)
    when (httpRequest.method) {
      HttpMethod.Get -> requestBuilder.get()
      HttpMethod.Post -> requestBuilder.post(requestBody)
      HttpMethod.Put -> requestBuilder.put(requestBody)
      HttpMethod.Delete -> requestBuilder.delete(requestBody)
      HttpMethod.Patch -> requestBuilder.patch(requestBody)
      HttpMethod.Head -> requestBuilder.head()
      HttpMethod.Options -> TODO()
    }
    httpRequest.headers.forEach { name, values ->
      values.forEach {
        requestBuilder.header(name, it)
      }
    }
    val response = httpClient.newCall(requestBuilder.build()).execute()
    val responseHeaders = mutableListOf<Pair<String, String>>()
    response.headers.forEach { (name, value) ->
      responseHeaders.add(Pair(name, value))
    }
    val headers: Map<String, List<String>> = response.headers.groupBy({ it.first }) { it.second }

    return HttpResponseData(
      HttpStatusCode.fromValue(response.code),
      HeadersImpl(headers),
      response.body?.bytes(),
    )
  }
}
