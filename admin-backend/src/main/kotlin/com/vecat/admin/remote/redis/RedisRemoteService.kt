package com.vecat.admin.remote.redis

import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.remote.RemoteAction
import com.vecat.admin.remote.RemoteService
import org.springframework.data.redis.connection.stream.StreamRecords
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

/**
 * Redis远程服务
 *
 * @author Virit
 * @since 2025-08-28
 */
@Service
class RedisRemoteService(
    private val redisTemplate: StringRedisTemplate,
    private val objectMapper: ObjectMapper,
) : RemoteService {

    override fun sendRemote(nodeId: String, action: RemoteAction, payload: String) {
        val record = StreamRecords.mapBacked<String, String, String>(
            mapOf(
                "action" to action.name,
                "payload" to payload,
            )
        ).withStreamKey(getDispatchStreamKey(nodeId))
        val ops = redisTemplate.opsForStream<String, String>()
        ops.add(record)
    }

    override fun sendRemote(nodeId: String, action: RemoteAction, payload: Any) {
        sendRemote(nodeId, action, objectMapper.writeValueAsString(payload))
    }

    private fun getDispatchStreamKey(nodeId: String): String {
        return "node:stream:$nodeId"
    }
}