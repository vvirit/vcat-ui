package com.vecat.admin.remote

import com.fasterxml.jackson.annotation.JsonFormat
import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import com.vecat.admin.entity.TaskInstance
import com.vecat.admin.entity.TaskInstanceStatus
import com.vecat.admin.repository.TaskInstanceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.concurrent.TimeUnit

@Service
class NodeService(
    private val taskInstanceRepository: TaskInstanceRepository,
    private val remoteService: RemoteService,
) {

    val nodes: Cache<String, NodeInfo> = Caffeine.newBuilder()
        .expireAfterWrite(10, TimeUnit.SECONDS)
        .maximumSize(1000)
        .build<String, NodeInfo>()

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
        nodes.cleanUp()
        return nodes.asMap().values.toList()
    }

    fun updateNode(nodeInfo: NodeInfo) {
        nodes.put(nodeInfo.id, nodeInfo)
    }

    data class DispatchTaskDTO(
        val nodeId: String,
        val name: String,
        val taskName: String,
        val argument: String,
        val remarks: String = "",
        var instanceId: String? = null
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
        taskInstanceRepository.save(taskInstance)
        dto.instanceId = taskInstance.id.toString()
        remoteService.sendRemote(dto.nodeId, RemoteAction.RUN_TASK, taskInstance)
    }
}