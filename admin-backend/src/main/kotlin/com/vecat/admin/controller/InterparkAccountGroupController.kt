package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.service.InterparkAccountGroupService
import com.vecat.admin.service.InterparkAccountGroupService.*
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/interpark-account-group")
class InterparkAccountGroupController(
    val service: InterparkAccountGroupService,
) {

    data class InterparkPerformView(
        val id: Long,
        val name: String,
    )

    @GetMapping("/all")
    fun allList(): List<InterparkPerformView> {
        return service.allGroups { InterparkPerformView(id = it.id!!, name = it.name) }
    }

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<InterparkAccountGroupPageDTO> {
        val list = service.getPagedList(page, pageSize)
        return list
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseData<Unit> {
        service.deletePool(id)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PostMapping
    fun add(@RequestBody dto: AddAccountGroupDTO): ResponseData<Unit> {
        service.addGroup(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PutMapping
    fun update(@RequestBody dto: UpdateAccountGroupDTO): ResponseData<Unit> {
        service.updatePool(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }
}