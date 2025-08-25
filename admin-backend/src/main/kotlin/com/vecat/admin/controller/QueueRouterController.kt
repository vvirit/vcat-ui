package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.entity.QueueRouterType
import com.vecat.admin.service.QueueRouterService
import com.vecat.admin.service.QueueRouterService.AddRouterDTO
import com.vecat.admin.service.QueueRouterService.UpdateRouterDTO
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/queue-router")
class QueueRouterController(
  val service: QueueRouterService,
) {

  @GetMapping
  fun list(
    @RequestParam(defaultValue = "0") page: Int,
    @RequestParam(defaultValue = "10") pageSize: Int
  ): PageView<QueueRouterService.QueueRouterPageDTO> {
    val list = service.getPagedList(page, pageSize)
    return list
  }

  @DeleteMapping("/{id}")
  fun delete(@PathVariable id: Long): ResponseData<Unit> {
    service.deleteById(id)
    return ResponseData(code = StatusCode.SUCCESS)
  }

  @PostMapping
  fun add(@RequestBody dto: AddRouterDTO): ResponseData<Unit> {
    service.addRouter(dto)
    return ResponseData(code = StatusCode.SUCCESS)
  }

  @PutMapping
  fun update(@RequestBody dto: UpdateRouterDTO): ResponseData<Unit> {
    service.updateRouter(dto)
    return ResponseData(code = StatusCode.SUCCESS)
  }

  @GetMapping("/list")
  fun getListByType(type: QueueRouterType): List<QueueRouterService.QueueRouterPageDTO> {
    return service.getListByType(type)
  }
}