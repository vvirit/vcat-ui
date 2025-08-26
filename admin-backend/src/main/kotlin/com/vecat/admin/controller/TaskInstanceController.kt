package com.vecat.admin.controller

import com.vecat.admin.service.TaskInstanceService
import com.vecat.admin.service.TaskInstanceService.ExecuteTaskDTO
import com.vecat.admin.service.TaskInstanceService.QueryTaskInstancePageDTO
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/task-instance")
class TaskInstanceController(
    val service: TaskInstanceService,
) {

    @PostMapping("/execute-task")
    fun executeTask(@RequestBody dto: ExecuteTaskDTO) {
        service.execute(dto)
    }

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<QueryTaskInstancePageDTO> {
        val list = service.getPagedList(page, pageSize)
        return list
    }
}