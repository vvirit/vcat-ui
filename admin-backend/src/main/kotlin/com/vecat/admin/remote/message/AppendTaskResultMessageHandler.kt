package com.vecat.admin.remote.message

import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.remote.MessageHandler
import com.vecat.admin.remote.ServerAction
import com.vecat.admin.remote.TaskResultListener
import com.vecat.admin.service.TaskInstanceService
import com.vecat.admin.service.TaskInstanceService.AppendTaskResultDTO
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

/**
 * 追加任务结果
 *
 * @author Virit
 * @since 2025-08-28
 */
@Component
class AppendTaskResultMessageHandler(
    private val taskInstanceService: TaskInstanceService,
    private val taskResultListeners: List<TaskResultListener<*>>,
    private val objectMapper: ObjectMapper,
): MessageHandler<AppendTaskResultDTO> {

    override val action: ServerAction = ServerAction.APPEND_TASK_RESULT
    override val messageType: KClass<AppendTaskResultDTO> = AppendTaskResultDTO::class

    override fun handleMessage(nodeId: String, payload: AppendTaskResultDTO) {
        taskInstanceService.appendTaskResult(payload)
        val taskInstance = taskInstanceService.getById(payload.instanceId)
        for (listener in taskResultListeners) {
            if (listener.taskName == taskInstance.taskName) {
                val data = objectMapper.readValue(payload.data, listener.dataType.java)
                (listener as TaskResultListener<Any>)
                    .onReceivedTaskResult(nodeId, taskInstance.id.toString(), data)
            }
        }
    }
}