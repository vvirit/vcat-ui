package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.Task
import com.vecat.admin.entity.TaskCategory
import com.vecat.admin.entity.TaskType
import com.vecat.admin.repository.TaskRepository
import com.vecat.admin.service.InterparkTaskService.InterparkBookingTaskDTO
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TaskService(
    val repository: TaskRepository,
    val interparkTaskService: InterparkTaskService,
) {

    data class AddTaskDTO(
        val category: TaskCategory,
        val taskType: TaskType,
        val name: String,
        val remarks: String,
        val interparkBookingTask: InterparkBookingTaskDTO? = null,
    )

    @Transactional
    fun addTask(dto: AddTaskDTO) {
        val task = Task(
            category = dto.category,
            taskType = dto.taskType,
            name = dto.name,
            remarks = dto.remarks,
            interparkBookingTask = interparkTaskService.toInterparkBookingTask(dto.interparkBookingTask)
        )
        repository.save(task)
    }

    data class UpdateTaskDTO(
        val id: Long,
        val category: TaskCategory,
        val taskType: TaskType,
        val name: String,
        val remarks: String,
        val interparkBookingTask: InterparkBookingTaskDTO? = null,
    )

    @Transactional
    fun updateTask(dto: UpdateTaskDTO) {
        val task = repository.findById(dto.id).get()
        task.apply {
            category = dto.category
            taskType = dto.taskType
            name = dto.name
            remarks = dto.remarks
            interparkBookingTask = interparkTaskService.toInterparkBookingTask(dto.interparkBookingTask)
        }
        repository.save(task)
    }

    data class QueryTaskPageDTO(
        val id: Long,
        val category: TaskCategory,
        val taskType: TaskType,
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
                taskType = entity.taskType,
                name = entity.name,
                remarks = entity.remarks,
            )
        }
        return PageView(list, page, size, entityPage.totalElements)
    }

    fun deleteById(id: Long) {
        repository.deleteById(id)
    }
}