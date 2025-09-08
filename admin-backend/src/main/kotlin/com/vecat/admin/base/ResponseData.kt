package com.vecat.admin.base

import com.vecat.admin.constant.StatusCode
import org.springframework.data.domain.Page

data class ResponseData<D>(
    val code: StatusCode,
    val data: D? = null,
    val message: String? = null,
)

data class PageData<D>(
    val list: List<D>,
    val total: Long,
    val totalPages: Int,
)

typealias ResponsePageData<T> = ResponseData<PageData<T>>

fun <T, R> Page<T>.convertTo(converter: (T) -> R): ResponsePageData<R> {
    val list = this.content.map(converter)
    return ResponsePageData(
        code = StatusCode.SUCCESS,
        PageData(
            list = list,
            total = this.totalElements,
            totalPages = this.totalPages,
        )
    )
}

fun <T> Page<T>.convertTo(): ResponsePageData<T> {
    return ResponsePageData(
        code = StatusCode.SUCCESS,
        PageData(
            list = this.content,
            total = this.totalElements,
            totalPages = this.totalPages,
        )
    )
}