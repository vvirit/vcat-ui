package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.entity.InterparkPerform
import com.vecat.admin.entity.InterparkSeatRotatePool
import com.vecat.admin.service.InterparkSeatRotatePoolService
import com.vecat.admin.service.InterparkSeatRotatePoolService.InterparkSeatRotatePoolPageDTO
import org.springframework.data.domain.Page
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * Interpark轮换池接口
 *
 * @author Virit
 * @since 2025-08-17
 */
@RestController
@RequestMapping("/interpark-seat-rotate-pool")
class InterparkSeatRotatePoolController(
    val service: InterparkSeatRotatePoolService,
) {

    @GetMapping("/all")
    fun allList(): List<InterparkSeatRotatePoolPageDTO> {
        return service.getAll()
    }

    @GetMapping
    fun getPagedList(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<InterparkSeatRotatePoolPageDTO> {
        val list = service.getPagedList(page, pageSize)
        return list
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseData<Unit> {
        service.deletePool(id)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PostMapping
    fun add(@RequestBody dto: InterparkSeatRotatePoolService.AddPoolDTO): ResponseData<Unit> {
        service.addPool(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PutMapping
    fun update(@RequestBody dto: InterparkSeatRotatePoolService.UpdatePoolDTO): ResponseData<Unit> {
        service.updatePool(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @GetMapping("/list")
    fun getAll(): List<InterparkSeatRotatePoolPageDTO> {
        return service.getAll()
    }
}