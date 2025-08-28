package com.vecat.admin.remote.message

import com.vecat.admin.remote.MessageHandler
import com.vecat.admin.remote.ServerAction
import com.vecat.admin.service.TaskInstanceService
import com.vecat.admin.service.TaskInstanceService.UpdateTaskInstanceDTO
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Component
class UpdateTaskMessageHandler(
    private val taskInstanceService: TaskInstanceService,
) : MessageHandler<UpdateTaskInstanceDTO> {

    override val action: ServerAction = ServerAction.UPDATE_TASK
    override val messageType: KClass<UpdateTaskInstanceDTO> = UpdateTaskInstanceDTO::class

    override fun handleMessage(nodeId: String, payload: UpdateTaskInstanceDTO) {
        taskInstanceService.updateTaskInstance(payload)
    }
}