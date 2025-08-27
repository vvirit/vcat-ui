package com.vecat.admin.remote.redis

import com.vecat.admin.remote.RemoteMessageHandler
import com.vecat.admin.remote.ServerAction
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.dao.DataAccessException
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.connection.stream.Consumer
import org.springframework.data.redis.connection.stream.MapRecord
import org.springframework.data.redis.connection.stream.ReadOffset
import org.springframework.data.redis.connection.stream.StreamOffset
import org.springframework.data.redis.connection.stream.StreamRecords
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.data.redis.stream.StreamMessageListenerContainer
import java.util.UUID
import kotlin.time.Duration.Companion.seconds
import kotlin.time.toJavaDuration

@Configuration
class RedisStreamsConfig(
    private val factory: RedisConnectionFactory,
    private val remoteMessageHandler: RemoteMessageHandler,
) {

    companion object {
        const val STREAM_KEY = "server"
        const val GROUP = "workers"
    }

    private val consumerName = "c-" + UUID.randomUUID().toString().take(8)

    @Bean
    fun streamContainer(template: StringRedisTemplate): StreamMessageListenerContainer<String, MapRecord<String, String, String>> {

        val ops = template.opsForStream<String, String>()
        if (!template.hasKey(STREAM_KEY)) {
            ops.add(
                StreamRecords.mapBacked<String, String, String>(mapOf("action" to "INIT")).withStreamKey(STREAM_KEY)
            )
        }
        try {
            ops.createGroup(STREAM_KEY, ReadOffset.latest(), GROUP)
        } catch (_: DataAccessException) {
        }

        val options = StreamMessageListenerContainer
            .StreamMessageListenerContainerOptions
            .builder()
            .pollTimeout(2.seconds.toJavaDuration())
            .batchSize(10)
            .build()

        val container = StreamMessageListenerContainer.create(factory, options)

        container.receiveAutoAck(
            Consumer.from(GROUP, consumerName),
            StreamOffset.create(STREAM_KEY, ReadOffset.lastConsumed()),
        ) { msg ->
            val map = msg.value
            val nodeId = map["nodeId"]!!
            val action = map["action"]!!
            val payload = map["payload"]!!
            remoteMessageHandler.onReceiveData(nodeId, ServerAction.valueOf(action), payload)
            ops.delete(STREAM_KEY, msg.id)
        }
        container.start()
        return container
    }
}