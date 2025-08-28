package com.vecat.admin.remote.listener

import com.vecat.admin.remote.TaskResultListener
import com.vecat.admin.service.InterparkAccountService
import org.springframework.stereotype.Component

data class InterparkBookingResultDTO(
    val account: String,
)

/**
 *  interpark 订单结果监听器
 *
 *  @author Virit
 *  @since 2025-08-28
 */
@Component
class InterparkBookingResultListener(
    val interparkOrderService: InterparkAccountService,
) : TaskResultListener<InterparkBookingResultDTO> {

    override val taskName: String = "interpark/booking"

    override fun onReceivedTaskResult(nodeId: String, taskId: String, result: InterparkBookingResultDTO) {
        
    }
}