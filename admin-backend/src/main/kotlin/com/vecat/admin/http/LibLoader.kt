package com.vecat.admin.http

import net.covers1624.curl4j.CURL
import java.nio.file.Paths
import java.util.*
import kotlin.io.path.pathString

private val winLibraryList = listOf(
  "libzstd.dll",
  "libnghttp2-14.dll",
  "libiconv-2.dll",
  "libintl-8.dll",
  "libunistring-5.dll",
  "libidn2-0.dll",
  "libpsl-5.dll",
  "libbrotlicommon.dll",
  "libbrotlidec.dll",
  "zlib1.dll",
  "libcurl.dll",
)

private const val LINUX_LIBRARY = "libcurl-impersonate-chrome.so"

fun loadLibrary() {
  try {
    val libraryDirectory = System.getenv("CURL_IMPERSONATE_LIB")
    if (libraryDirectory.isNullOrBlank()) {
      throw RuntimeException("curl-impersonate目录未配置，请配置CURL_IMPERSONATE_LIB环境变量")
    }
    val os = System.getProperty("os.name").lowercase(Locale.getDefault())
    if (os.contains("win")) {
      winLibraryList.forEach { library ->
        System.load(Paths.get(libraryDirectory, library).pathString)
      }
      CURL.setLibCurlName(Paths.get(libraryDirectory, winLibraryList.last()).pathString)
    } else if (os.contains("nix") || os.contains("nux") || os.contains("mac")) {
      CURL.setLibCurlName(Paths.get(libraryDirectory, LINUX_LIBRARY).pathString)
    } else {
      throw UnsupportedOperationException("Unsupported operating system: $os");
    }
  } catch (e: Exception) {
    e.printStackTrace()
  }
}