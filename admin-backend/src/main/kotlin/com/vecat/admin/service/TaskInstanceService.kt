package com.vecat.admin.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.TaskInstance
import com.vecat.admin.entity.TaskInstanceStatus
import com.vecat.admin.repository.TaskInstanceRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TaskInstanceService(
    val repository: TaskInstanceRepository,
    val redisTemplate: StringRedisTemplate,
    val objectMapper: ObjectMapper,
) {

    data class ExecuteTaskDTO(
        val nodeId: String,
        val name: String,
        val taskName: String,
        val argument: String,
        val remarks: String = "",
    ) {
        var instanceId: String? = null
    }

    data class DispatchedData(
        val action: String,
        val data: String,
    )

    @Transactional
    fun execute(dto: ExecuteTaskDTO) {
        val taskInstance = TaskInstance(
            name = dto.name,
            taskName = dto.taskName,
            argument = dto.argument,
            remarks = dto.remarks,
            status = TaskInstanceStatus.CREATED,
        )
        val saved = repository.save(taskInstance)
        dto.instanceId = "instance-${saved.id}"
        val channelName = "scheduler:node:dispatch:${dto.nodeId}"
        val dispatchedData = DispatchedData(
            action = "run-task",
            data = objectMapper.writeValueAsString(dto)
        )
        redisTemplate.convertAndSend(channelName, objectMapper.writeValueAsString(dispatchedData))
    }

    data class QueryTaskInstancePageDTO(
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
        val pageable = PageRequest.of(page, size)
        val entityPage = repository.findAll(pageable)
        val list = entityPage.content.map { entity ->
            QueryTaskInstancePageDTO(
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
}