package com.vecat.admin.remote.listener

import com.fasterxml.jackson.databind.ObjectMapper
import com.vecat.admin.entity.InterparkOrder
import com.vecat.admin.remote.TaskResultListener
import com.vecat.admin.service.InterparkOrderService
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

data class InterparkBookingResultDTO(
    val email: String,
    val cookie: String,
    val productCode: String,
    val seatInfo: SeatInfo,
    val bookingForm: List<FormItem>,
    val bookingUserInfo: BookingUserInfo,
    val orderDate: String = "",
    val orderSeq: String = "",
)

data class SeatInfo(
    val seatTitle: String,
    val seatJs: String,
    val playDate: String,
    val playSequence: String,
    val blockCode: String,
    val seatGrade: String,
    val floor: String,
    val rowNo: String,
    val seatNo: String,
    val seatGradeName: String,
)

data class BookingUserInfo(
    val name: String,
    val birthDay: String,
)

data class FormItem(
    val name: String,
    val value: String,
)

/**
 *  interpark 订单结果监听器
 *
 *  @author Virit
 *  @since 2025-08-28
 */
@Component
class InterparkBookingResultListener(
    val interparkOrderService: InterparkOrderService,
    val objectMapper: ObjectMapper,
) : TaskResultListener<InterparkBookingResultDTO> {

    override val taskName: String = "interpark/booking"
    override val dataType: KClass<InterparkBookingResultDTO> = InterparkBookingResultDTO::class

    override fun onReceivedTaskResult(nodeId: String, taskId: String, result: InterparkBookingResultDTO) {
        interparkOrderService.addOrder(
            InterparkOrder(
                email = result.email,
                cookie = result.cookie,
                productCode = result.productCode,
                playDate = result.seatInfo.playDate,
                playSequence = result.seatInfo.playSequence,
                blockCode = result.seatInfo.blockCode,
                seatGrade = result.seatInfo.seatGrade,
                floor = result.seatInfo.floor,
                rowNo = result.seatInfo.rowNo,
                seatNo = result.seatInfo.seatNo,
                seatGradeName = result.seatInfo.seatGradeName,
                bookingUserName = result.bookingUserInfo.name,
                bookingUserBirthDay = result.bookingUserInfo.birthDay,
                bookingUserPhone = "",
                seatInfo = objectMapper.writeValueAsString(result.seatInfo),
                bookingForm = objectMapper.writeValueAsString(result.bookingForm),
            )
        )
    }
}