package com.vecat.admin.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.Task
import com.vecat.admin.entity.TaskCategory
import com.vecat.admin.entity.TaskName
import com.vecat.admin.remote.NodeService
import com.vecat.admin.remote.TaskArgumentBuilder
import com.vecat.admin.repository.TaskRepository
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TaskService(
    val repository: TaskRepository,
    val objectMapper: ObjectMapper,
    val nodeService: NodeService,
    val argumentBuilders: List<TaskArgumentBuilder<*, *>>,
) {

    data class AddTaskDTO(
        val category: TaskCategory,
        val taskName: TaskName,
        val name: String,
        val remarks: String,
        val argument: JsonNode,
    )

    @Transactional
    fun addTask(dto: AddTaskDTO) {
        val task = Task(
            category = dto.category,
            taskName = dto.taskName,
            name = dto.name,
            remarks = dto.remarks,
            argument = objectMapper.writeValueAsString(dto.argument),
        )
        repository.save(task)
    }

    data class UpdateTaskDTO(
        val nodeId: String? = null,
        val id: Long,
        val category: TaskCategory,
        val taskName: TaskName,
        val name: String,
        val remarks: String,
        val argument: JsonNode,
    )

    @Transactional
    fun updateTask(dto: UpdateTaskDTO) {
        val task = repository.findById(dto.id).get()
        task.apply {
            category = dto.category
            taskName = dto.taskName
            name = dto.name
            remarks = dto.remarks
            argument = objectMapper.writeValueAsString(dto.argument)
        }
        repository.save(task)
        if (!dto.nodeId.isNullOrBlank()) {
            val argumentBuilder = argumentBuilders.firstOrNull {
                it.taskCategory == task.category && it.taskName == task.taskName
            } as (TaskArgumentBuilder<Any, Any>?)
            if (argumentBuilder == null) {
                throw RuntimeException("argument builder not found, please contact administrator")
            }
            val argument = argumentBuilder.build(
                objectMapper.readValue(task.argument, argumentBuilder.configType.java)
            )
            nodeService.dispatchTask(
                NodeService.DispatchTaskDTO(
                    nodeId = dto.nodeId,
                    name = task.name,
                    taskName = "${task.category.category}/${task.taskName.taskName}",
                    argument = objectMapper.writeValueAsString(argument),
                    remarks = task.remarks,
                )
            )
        }
    }

    data class QueryTaskPageDTO(
        val id: Long,
        val category: TaskCategory,
        val taskName: TaskName,
        val name: String,
        val remarks: String,
    )

    @Transactional
    fun getPagedList(page: Int, size: Int): PageView<QueryTaskPageDTO> {
        val pageable = PageRequest.of(page, size)
        val entityPage = repository.findAll(pageable)
        val list = entityPage.content.map { entity ->
            QueryTaskPageDTO(
                id = entity.id!!,
                category = entity.category,
                taskName = entity.taskName,
                name = entity.name,
                remarks = entity.remarks,
            )
        }
        return PageView(list, page, size, entityPage.totalElements)
    }

    @Transactional
    fun deleteById(id: Long) {
        repository.deleteById(id)
    }

    @Transactional
    fun <T> getById(id: Long, transform: (Task) -> T): T {
        return repository.findById(id).get().let { transform(it) }
    }
}