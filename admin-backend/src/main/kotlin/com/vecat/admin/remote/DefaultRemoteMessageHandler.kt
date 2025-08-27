package com.vecat.admin.remote

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

enum class ServerAction {
    INIT,
    HEART_BEAT,
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
    val nodeService: NodeService,
): RemoteMessageHandler {

    private val logger = LoggerFactory.getLogger(javaClass)

    override fun onReceiveData(nodeId: String, action: ServerAction, payload: String) {
        when (action) {
            ServerAction.INIT -> {
                logger.info("received init stream key message, ignored")
            }
            ServerAction.HEART_BEAT -> handleHeartBeat(nodeId, payload)
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
    private fun handleHeartBeat(nodeId: String, payload: String) {
        val message = objectMapper.readValue(payload, HeartBeatMessage::class.java)
        nodeService.updateNode(NodeService.NodeInfo(
            id = nodeId,
            startTime = message.startTime,
            version = message.version,
            versionNo = message.versionNo,
        ))
    }
}