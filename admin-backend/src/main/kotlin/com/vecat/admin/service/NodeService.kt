package com.vecat.admin.service

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

@Service
class NodeService(
    val redisTemplate: StringRedisTemplate,
    val objectMapper: ObjectMapper,
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
        val prefix = "scheduler:node:"
        val nodeKeys = redisTemplate.keys("$prefix*")
        return nodeKeys.map { key ->
            val jsonString = redisTemplate.opsForValue().get(key)
            objectMapper.readValue((jsonString as String), NodeInfo::class.java)
        }
    }
}