package com.vecat.admin.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.TaskInstance
import com.vecat.admin.entity.TaskInstanceResultItem
import com.vecat.admin.entity.TaskInstanceStatus
import com.vecat.admin.repository.TaskInstanceRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TaskInstanceService(
    val repository: TaskInstanceRepository,
    val redisTemplate: StringRedisTemplate,
    val objectMapper: ObjectMapper,
) {

    data class UpdateTaskInstanceDTO(
        val taskId: String,
        val info: String? = null,
        val status: TaskInstanceStatus? = null,
        val errorMessage: String? = null,
    )

    @Transactional
    fun updateTaskInstance(dto: UpdateTaskInstanceDTO) {
        val id = dto.taskId.replace("task-", "").toLong()
        val taskInstance = repository.findById(id).get()
        taskInstance.apply {
            if (!dto.info.isNullOrBlank()) {
                this.information = dto.info
            }
            if (dto.status != null) {
                this.status = dto.status
            }
            if (!dto.errorMessage.isNullOrBlank()) {
                this.errorMessage = dto.errorMessage
            }
        }
        repository.save(taskInstance)
    }

    data class QueryTaskInstancePageDTO(
        val id: Long,
        val nodeId: String,
        val name: String,
        val taskName: String,
        val remarks: String,
        val status: TaskInstanceStatus,
        val argument: String,
        val information: String,
        val errorMessage: String,
    )

    @Transactional
    fun getPagedList(page: Int, size: Int): PageView<QueryTaskInstancePageDTO> {
        val sort = Sort.by(TaskInstance::id.name).descending()
        val pageable = PageRequest.of(page, size, sort)
        val entityPage = repository.findAll(pageable)
        val list = entityPage.content.map { entity ->
            QueryTaskInstancePageDTO(
                id = entity.id!!,
                nodeId = entity.nodeId,
                name = entity.name,
                taskName = entity.taskName,
                remarks = entity.remarks,
                status = entity.status,
                argument = entity.argument,
                information = entity.information ?: "",
                errorMessage = entity.errorMessage ?: "",
            )
        }
        return PageView(list, page, size, entityPage.totalElements)
    }

    fun deleteById(id: Long) {
        repository.deleteById(id)
    }

    @Transactional
    fun takeTask(nodeId: String): TaskInstance? {
        val taskInstance = repository.findFirstByNodeIdAndStatus(nodeId, TaskInstanceStatus.CREATED) ?: return null
        taskInstance.status = TaskInstanceStatus.DISPATCHED
        repository.save(taskInstance)
        return taskInstance
    }

    data class TaskInstanceDTO(
        val id: Long,
        val nodeId: String,
        val name: String,
        val taskName: String,
        val remarks: String,
        val status: TaskInstanceStatus,
        val argument: String,
        val information: String,
        val errorMessage: String,
        val state: String,
        val results: List<TaskInstanceResultItemDTO>,
    )

    data class TaskInstanceResultItemDTO(
        val id: Long,
        val data: String,
    )

    @Transactional
    fun getById(id: Long): TaskInstanceDTO {
        val instance = repository.findById(id).get()
        val state = redisTemplate.opsForValue().get("task:$id:state") ?: ""
        return TaskInstanceDTO(
            id = instance.id!!,
            nodeId = instance.nodeId,
            name = instance.name,
            taskName = instance.taskName,
            remarks = instance.remarks,
            status = instance.status,
            argument = instance.argument,
            information = instance.information ?: "",
            errorMessage = instance.errorMessage ?: "",
            results = instance.resultItems.map {
                TaskInstanceResultItemDTO(
                    id = it.id!!,
                    data = it.data,
                )
            },
            state = state,
        )
    }

    data class AppendTaskResultDTO(
        val instanceId: Long,
        val data: String,
        val errorMessage: String = "",
    )

    @Transactional
    fun appendTaskResult(dto: AppendTaskResultDTO) {
        val taskInstance = repository.findById(dto.instanceId).get()
        taskInstance.resultItems.add(
            TaskInstanceResultItem(
                instance = taskInstance,
                data = dto.data,
                errorMessage = dto.errorMessage,
            )
        )
        repository.save(taskInstance)
    }
}