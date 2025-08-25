package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.entity.Proxy
import com.vecat.admin.entity.ProxyType
import com.vecat.admin.service.ProxyService
import org.springframework.data.domain.Page
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/proxy")
class ProxyController(
    val service: ProxyService,
) {

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): Page<Proxy> = service.getPagedProxies(page, pageSize)

    data class AddProxyRequestProxy(
        val host: String,
        val port: Int,
        val username: String?,
        val password: String?,
    )

    data class AddProxyRequest(
        val name: String,
        val type: ProxyType,
        val host: String?,
        val port: Int?,
        val username: String?,
        val password: String?,
        val proxies: List<AddProxyRequestProxy>?,
    )

    @PostMapping
    fun addProxy(@RequestBody request: AddProxyRequest): ResponseData<Unit> {
        val proxies = if (request.type == ProxyType.POOL) {
            request.proxies?.map {
                Proxy(
                    host = it.host,
                    port = it.port,
                    username = it.username,
                    password = it.password,
                )
            } ?: listOf()
        } else {
            listOf()
        }
        val proxy = Proxy(
            name = request.name,
            type = request.type,
            host = request.host,
            port = request.port,
            username = request.username,
            password = request.password,
            proxies = proxies.toMutableList(),
        )
        proxies.forEach { it.parent = proxy }
        service.add(proxy)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @GetMapping("/all")
    fun allList(): List<ProxyService.PagedProxyDTO> {
        return service.allProxies()
    }
}