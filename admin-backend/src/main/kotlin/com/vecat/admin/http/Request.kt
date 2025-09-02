package com.vecat.admin.http

import io.ktor.http.*

/**
 * Http请求
 *
 * @author Virit
 * @since 2025-01-18
 */
class HttpRequest(
  val url: Url,
  val method: HttpMethod,
  val headers: Headers,
  val body: String?,
  val proxy: ProxyConfig?,
)

/**
 * 请求构建器
 *
 * @author Virit
 * @since 2025-01-18
 */
class HttpRequestBuilder(url: Url, var method: HttpMethod, private val clientProxy: ProxyConfig?) {

  var urlBuilder = URLBuilder(url)
  val headersBuilder = HeadersBuilder()
  var bodyContent: String? = null
  var proxy: ProxyConfig? = null

  fun resetUrl(url: Url) {
    urlBuilder = URLBuilder(url)
  }

  fun url(builder: URLBuilder.() -> Unit) = urlBuilder.apply(builder)

  fun headers(builder: HeadersBuilder.() -> Unit) = headersBuilder.apply(builder)

  fun accept(contentType: ContentType) {
    headersBuilder.apply {
      remove("Accept")
      append("Accept", contentType.toString())
    }
  }

  fun setBody(body: String) {
    this.bodyContent = body
  }

  fun setJsonBody(body: Any, contentType: ContentType = ContentType.Application.Json) {
    headersBuilder.apply {
      remove("Content-Type")
      append("Content-Type", contentType.toString())
    }
    setBody(httpJsonObjectMapper.writeValueAsString(body))
  }

  fun setFormBody(
    builder: ParametersBuilder.() -> Unit,
    contentType: ContentType
  ) {
    headersBuilder.apply {
      remove("Content-Type")
      append("Content-Type", contentType.toString())
    }
    val parameters = ParametersBuilder().apply(builder).build()
    setBody(parameters.formUrlEncode())
  }

  fun setFormBody(
    builder: ParametersBuilder.() -> Unit
  ) {
    setFormBody(builder, ContentType.Application.FormUrlEncoded.withCharset(Charsets.UTF_8))
  }

  fun buildRequest(): HttpRequest {
    return HttpRequest(urlBuilder.build(), method, headersBuilder.build(), bodyContent, proxy ?: clientProxy)
  }
}