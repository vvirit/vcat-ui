package com.vecat.admin.http

class BeforeRequestData(
  val requestId: String,
  val client: HttpClient,
  val requestBuilder: HttpRequestBuilder
) {
  var interceptResponse: HttpResponse? = null
  fun setResponse(response: HttpResponse) {
    interceptResponse = response
  }
}

class AfterRequestData(
  val requestId: String,
  val client: HttpClient,
  val requestBuilder: HttpRequestBuilder,
  val request: HttpRequest,
  val response: HttpResponse
) {
  var interceptResponse: HttpResponse? = null
  fun setResponse(response: HttpResponse) {
    interceptResponse = response
  }
}

class ImpersonateHttpInterceptor(
  val beforeRequest: (BeforeRequestData.() -> Unit)?,
  val afterRequest: (AfterRequestData.() -> Unit)?,
)

fun createBeforeRequestInterceptor(beforeRequest: BeforeRequestData.() -> Unit): ImpersonateHttpInterceptor {
  return ImpersonateHttpInterceptor(beforeRequest, null)
}

fun createAfterRequestInterceptor(afterRequest: AfterRequestData.() -> Unit): ImpersonateHttpInterceptor {
  return ImpersonateHttpInterceptor(null, afterRequest)
}

fun createRequestInterceptor(
  beforeRequest: (BeforeRequestData.() -> Unit),
  afterRequest: (AfterRequestData.() -> Unit),
): ImpersonateHttpInterceptor {
  return ImpersonateHttpInterceptor(beforeRequest, afterRequest)
}
