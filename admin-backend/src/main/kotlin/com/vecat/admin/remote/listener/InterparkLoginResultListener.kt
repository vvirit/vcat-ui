package com.vecat.admin.remote.listener

import com.vecat.admin.remote.TaskResultListener
import com.vecat.admin.service.InterparkAccountService
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

data class InterparkLoginResultDTO(
    val email: String,
    val success: Boolean,
    val message: String,
    val cookie: String,
    val enterEncryptVal: String,
    val memberCode: String,
    val mc: String,
)

@Component
class InterparkLoginResultListener(
    val interparkAccountService: InterparkAccountService,
) : TaskResultListener<InterparkLoginResultDTO> {
    override val taskName: String = "interpark/login"
    override val dataType: KClass<InterparkLoginResultDTO> = InterparkLoginResultDTO::class

    override fun onReceivedTaskResult(
        nodeId: String,
        taskId: String,
        result: InterparkLoginResultDTO
    ) {
        interparkAccountService.updateByEmail(result.email) {
            cookie = result.cookie
            enterEncryptVal = result.enterEncryptVal
            memberCode = result.memberCode
            mc = result.mc
        }
    }
}