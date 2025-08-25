package com.vecat.admin.service

import com.vecat.admin.entity.InterparkPerform
import com.vecat.admin.entity.Proxy
import com.vecat.admin.entity.ProxyType
import com.vecat.admin.repository.ProxyRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class ProxyService(
    val repository: ProxyRepository,
) {
    fun getPagedProxies(page: Int, size: Int): Page<Proxy> {
        val pageable = PageRequest.of(page, size)
        return repository.findAll(pageable)
    }

    @Transactional
    fun add(proxy: Proxy) {
        repository.save(proxy)
    }

    data class PagedProxyDTO(
        val id: Long,
        val name: String,
        val type: ProxyType,
        val host: String?,
        val port: Int?,
        val username: String?,
        val password: String?,
    )

    @Transactional
    fun allProxies(): List<PagedProxyDTO> {
        return repository.findAll().map {
            PagedProxyDTO(
                id = it.id!!,
                name = it.name!!,
                type = it.type!!,
                host = it.host,
                port = it.port,
                username = it.username,
                password = it.password,
            )
        }
    }
}