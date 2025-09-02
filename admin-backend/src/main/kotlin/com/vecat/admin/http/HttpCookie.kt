package com.vecat.admin.http

import io.ktor.http.CookieEncoding
import io.ktor.util.date.GMTDate
import kotlinx.serialization.Serializable

@Serializable
data class HttpCookie(
  var name: String,
  var value: String,
  var encoding: CookieEncoding = CookieEncoding.URI_ENCODING,
  var maxAge: Int? = null,
  var expires: GMTDate? = null,
  var domain: String? = null,
  var path: String? = null,
  var secure: Boolean = false,
  var httpOnly: Boolean = false,
  var extensions: Map<String, String?> = emptyMap(),
  var createdAt: Long? = null,
)
