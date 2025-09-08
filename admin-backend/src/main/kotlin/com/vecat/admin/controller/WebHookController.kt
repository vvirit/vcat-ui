package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.entity.WebHook
import com.vecat.admin.entity.WebHookMethod
import com.vecat.admin.entity.WebHookType
import com.vecat.admin.service.WebHookService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/web-hook")
class WebHookController(
    val service: WebHookService,
) {

    data class PageListVO(
        val id: Long,
        val name: String,
        val type: WebHookType,
        val url: String,
        val method: WebHookMethod,
        val body: String,
    )

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<PageListVO> {
        val list = service.getPagedList(page, pageSize) {
            PageListVO(
                id = it.id!!,
                name = it.name,
                type = it.type,
                url = it.url,
                method = it.method,
                body = it.body,
            )
        }
        return list
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseData<Unit> {
        service.delete(id)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    data class AddWebHookRequest(
        val name: String,
        val type: WebHookType,
        val url: String,
        val method: WebHookMethod,
        val body: String,
    )

    @PostMapping
    fun add(@RequestBody request: AddWebHookRequest): ResponseData<Unit> {
        val webHook = WebHook(
            name = request.name,
            type = request.type,
            url = request.url,
            method = request.method,
            body = request.body,
        )
        service.addWebHook(webHook)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    data class UpdateWebHookRequest(
        val id: Long,
        val name: String,
        val type: WebHookType,
        val url: String,
        val method: WebHookMethod,
        val body: String,
    )

    @PutMapping
    fun update(@RequestBody request: UpdateWebHookRequest): ResponseData<Unit> {
        service.updateWebHook(request.id) {
            name = request.name
            type = request.type
            url = request.url
            method = request.method
            body = request.body
        }
        return ResponseData(code = StatusCode.SUCCESS)
    }
}