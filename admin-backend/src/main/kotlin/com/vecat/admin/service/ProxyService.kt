package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.Proxy
import com.vecat.admin.entity.ProxyProtocol
import com.vecat.admin.entity.ProxyType
import com.vecat.admin.repository.ProxyRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

data class ProxyConfig(
    val type: ProxyType,
    val protocol: ProxyProtocol,
    val host: String,
    val port: Int,
    val username: String,
    val password: String,
    val proxies: List<ProxyConfig>? = null,
)

@Service
class ProxyService(
    val repository: ProxyRepository,
) {
    fun <T> getPagedProxies(page: Int, size: Int, transform: (Proxy) -> T): PageView<T> {
        val pageable = PageRequest.of(page, size)
        val pageData = repository.findAll(pageable)
        return PageView(pageData.content.map(transform), page, size, pageData.totalElements)
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

    @Transactional
    fun getById(id: Long): Proxy? {
        return repository.findById(id).orElse(null)
    }

    fun getProxyAsProxyConfig(proxyId: Long): ProxyConfig {
        val proxy = repository.findById(proxyId).get()
        return ProxyConfig(
            type = proxy.type!!,
            protocol = ProxyProtocol.HTTP,
            host = proxy.host ?: "",
            port = proxy.port ?: 0,
            username = proxy.username ?: "",
            password = proxy.password ?: "",
            proxies = proxy.proxies.map {
                ProxyConfig(
                    type = ProxyType.ITEM,
                    protocol = ProxyProtocol.HTTP,
                    host = it.host ?: "",
                    port = it.port ?: 0,
                    username = it.username ?: "",
                    password = it.password ?: "",
                )
            }
        )
    }
}