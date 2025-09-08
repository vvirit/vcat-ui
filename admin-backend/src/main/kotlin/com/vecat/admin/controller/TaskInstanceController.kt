package com.vecat.admin.controller

import com.vecat.admin.service.TaskInstanceService
import com.vecat.admin.service.TaskInstanceService.QueryTaskInstancePageDTO
import com.vecat.admin.service.TaskInstanceService.TaskInstanceDTO
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/task-instance")
class TaskInstanceController(
    val service: TaskInstanceService,
) {

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<QueryTaskInstancePageDTO> {
        val list = service.getPagedList(page, pageSize)
        return list
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): TaskInstanceDTO? {
        return service.getById(id)
    }
}