package com.vecat.admin.remote

import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.service.TaskInstanceService
import com.vecat.admin.service.TaskInstanceService.UpdateTaskInstanceDTO
import com.vecat.admin.service.TaskService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

enum class ServerAction {
    INIT,
    UPDATE_TASK,
}

/**
 * 默认的远程消息处理
 *
 * @author Virit
 * @since 2025-08-28
 */
@Component
class DefaultReceiveRemoteMessageHandler(
    val objectMapper: ObjectMapper,
    val taskInstanceService: TaskInstanceService,
): RemoteMessageHandler {

    private val logger = LoggerFactory.getLogger(javaClass)

    override fun onReceiveData(nodeId: String, action: ServerAction, payload: String) {
        when (action) {
            ServerAction.INIT -> {
                logger.info("received init stream key message, ignored")
            }
            ServerAction.UPDATE_TASK -> handleUpdateTask(nodeId, payload)
        }
    }

    data class HeartBeatMessage(
        val id: String,
        val startTime: Long,
        val version: String,
        val versionNo: Long,
    )

    /**
     * 处理任务节点心跳，维持在线状态
     */
    private fun handleUpdateTask(nodeId: String, payload: String) {
        val dto = objectMapper.readValue(payload, UpdateTaskInstanceDTO::class.java)
        taskInstanceService.updateTaskInstance(dto)
    }
}