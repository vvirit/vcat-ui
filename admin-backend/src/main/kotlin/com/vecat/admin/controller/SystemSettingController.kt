package com.vecat.admin.controller

import com.vecat.admin.service.QueueRouterService
import com.vecat.admin.service.SystemSettingService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * 系统参数
 *
 * @author Virit
 * @since 2025-08-30
 */
@RestController
@RequestMapping("/system-setting")
class SystemSettingController(
    val service: SystemSettingService,
) {

    data class SystemSettingPageView(
        val id: Long,
        val name: String,
        val description: String,
        val value: String,
    )

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int,
    ): PageView<SystemSettingPageView> {
        return service.getPagedList(page, pageSize) {
            SystemSettingPageView(
                id = it.id!!,
                name = it.name.name,
                description = it.description,
                value = it.value,
            )
        }
    }

    data class SetSettingValueRequest(
        val id: Long,
        val value: String,
    )

    @PutMapping("/set-setting-value")
    fun setSettingValue(@RequestBody request: SetSettingValueRequest) {
        service.update(request.id) {
            value = request.value
        }
    }
}