package com.vecat.admin.http

import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.http.*
import org.jsoup.Jsoup
import org.jsoup.nodes.Document

class HttpResponseData(
  val status: HttpStatusCode,
  val headers: Headers,
  val bodyContent: ByteArray?,
)

class HttpResponse(
  val status: HttpStatusCode,
  val headers: Headers,
  val bodyContent: ByteArray?,
  val withRedirection: Boolean,
  val executions: List<HttpRequestExecution>,
  val request: HttpRequest,
  val requestStartTime: Long,
  val requestEndTime: Long,
) {
  val success = status.isSuccess()
  val contentType = ContentType.parse(headers[HttpHeaders.ContentType] ?: "")
  val requestCostTime = requestEndTime - requestStartTime
  val stringBody = if (bodyContent != null) String(bodyContent, contentType.charset() ?: Charsets.UTF_8) else ""

  fun stringBody(): String {
    return stringBody
  }

  inline fun <reified T> jsonBody(): T {
    return httpJsonObjectMapper.readValue<T>(stringBody())
  }

  fun xmlBody(): Document {
    return Jsoup.parse(stringBody())
  }

  fun throwIfNotSuccess() {
    if (!success) {
      throw RuntimeException("接口调用失败(${this.status}): ${this.request.url}")
    }
  }
}