package com.vecat.admin.controller

data class PageView<T>(
    val list: List<T>,
    val pageNumber: Int,
    val pageSize: Int,
    val totalElements: Long,
)
