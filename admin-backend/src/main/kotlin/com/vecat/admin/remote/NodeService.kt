package com.vecat.admin.remote

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.ObjectMapper
import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import com.vecat.admin.entity.TaskInstance
import com.vecat.admin.entity.TaskInstanceStatus
import com.vecat.admin.repository.TaskInstanceRepository
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

@Service
class NodeService(
    private val taskInstanceRepository: TaskInstanceRepository,
    private val remoteService: RemoteService,
    private val redisTemplate: StringRedisTemplate,
    private val objectMapper: ObjectMapper,
) {

    data class NodeInfo(
        val id: String,
        val startTime: Long,
        val version: String,
        val versionNo: Long,
    ) {
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        val onlineTime: LocalDateTime =
            LocalDateTime.ofInstant(Instant.ofEpochSecond(startTime), ZoneId.systemDefault())
    }

    fun getAllNodes(): List<NodeInfo> {
        val nodes = redisTemplate.opsForSet().members("nodes")?.toList() ?: return emptyList()
        val nodesInfo = redisTemplate.opsForValue().multiGet(nodes) ?: return emptyList()
        return nodesInfo.filter { !it.isNullOrBlank() }.map {
            objectMapper.readValue(it, NodeInfo::class.java)
        }
    }

    fun updateNode(nodeInfo: NodeInfo) {
    }

    data class DispatchTaskDTO(
        val nodeId: String,
        val name: String,
        val taskName: String,
        val argument: String,
        val remarks: String = "",
        var instanceId: String = "",
    )

    /**
     * 分发任务到任务节点
     */
    @Transactional
    fun dispatchTask(dto: DispatchTaskDTO) {
        val taskInstance = TaskInstance(
            nodeId = dto.nodeId,
            name = dto.name,
            taskName = dto.taskName,
            argument = dto.argument,
            remarks = dto.remarks,
            status = TaskInstanceStatus.CREATED,
        )
        val saved = taskInstanceRepository.save(taskInstance)
        dto.instanceId = saved.id.toString()
        remoteService.sendRemote(dto.nodeId, RemoteAction.RUN_TASK, dto)
    }
}