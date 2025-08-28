package com.vecat.admin.remote

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

/**
 * 默认的远程消息处理
 *
 * @author Virit
 * @since 2025-08-28
 */
@Component
class DefaultReceiveRemoteMessageHandler(
    val objectMapper: ObjectMapper,
    val handlers: List<MessageHandler<*>>,
): RemoteMessageHandler {

    override fun onReceiveData(nodeId: String, action: ServerAction, payload: String) {
        for (handler in handlers) {
            if (handler.action == action) {
                val payload = objectMapper.readValue(payload, handler.messageType.java)
                (handler as MessageHandler<Any>).handleMessage(nodeId, payload!!)
            }
        }
    }
}