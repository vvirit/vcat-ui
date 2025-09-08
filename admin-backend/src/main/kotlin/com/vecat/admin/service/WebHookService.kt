package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.WebHook
import com.vecat.admin.repository.WebHookRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class WebHookService(
    val repository: WebHookRepository,
) {

    @Transactional
    fun <T> getPagedList(page: Int, size: Int, transform: (WebHook) -> T): PageView<T> {
        val pageable = PageRequest.of(page, size)
        val pageData = repository.findAll(pageable)
        val list = pageData.content.map { transform(it) }
        return PageView(list, page, size, pageData.totalElements)
    }

    @Transactional
    fun addWebHook(webHook: WebHook) {
        repository.save(webHook)
    }

    @Transactional
    fun updateWebHook(id: Long, modifier: WebHook.() -> Unit) {
        val webHook = repository.findById(id).orElseThrow()
        modifier(webHook)
        repository.save(webHook)
    }

    @Transactional
    fun delete(id: Long) {
        repository.deleteById(id)
    }
}