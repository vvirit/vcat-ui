package com.vecat.admin.controller

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.entity.TaskCategory
import com.vecat.admin.entity.TaskName
import com.vecat.admin.service.TaskService
import com.vecat.admin.service.TaskService.*
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/task")
class TaskController(
    val service: TaskService,
    val objectMapper: ObjectMapper,
) {

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<QueryTaskPageDTO> {
        val list = service.getPagedList(page, pageSize)
        return list
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseData<Unit> {
        service.deleteById(id)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PostMapping
    fun add(@RequestBody dto: AddTaskDTO): ResponseData<Unit> {
        service.addTask(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PutMapping
    fun update(@RequestBody dto: UpdateTaskDTO): ResponseData<Unit> {
        service.updateTask(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    data class TaskView(
        val id: Long,
        val category: TaskCategory,
        val taskName: TaskName,
        val name: String,
        val remarks: String,
        val argument: JsonNode,
    )

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): TaskView {
        return service.getById(id) {
            TaskView(
                id = it.id!!,
                category = it.category,
                taskName = it.taskName,
                name = it.name,
                remarks = it.remarks,
                argument = objectMapper.readTree(it.argument),
            )
        }
    }
}