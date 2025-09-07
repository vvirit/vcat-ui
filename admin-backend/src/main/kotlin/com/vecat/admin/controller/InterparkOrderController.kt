package com.vecat.admin.controller

import com.fasterxml.jackson.annotation.JsonFormat
import com.vecat.admin.service.InterparkOrderService
import com.vecat.admin.service.InterparkPerformService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/interpark-order")
class InterparkOrderController(
    val service: InterparkOrderService,
    val interparkPerformService: InterparkPerformService,
) {

    data class OrderPageView(
        val id: Long,
        val email: String,
        val cookie: String,
        val productCode: String,
        val productName: String,
        val playDate: String,
        val playSequence: String,
        val blockCode: String,
        val seatGrade: String,
        val floor: String,
        val rowNo: String,
        val seatNo: String,
        val seatGradeName: String,
        val bookingUserName: String,
        val bookingUserBirthDay: String,
        val bookingUserPhone: String,
        @get:JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        val createdAt: LocalDateTime?,
    )

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<OrderPageView> {
        val list = service.getPagedList(page, pageSize) {
            OrderPageView(
                id = it.id!!,
                email = it.email,
                cookie = it.cookie,
                productCode = it.productCode,
                productName = interparkPerformService.findByPerformCode(it.productCode) { p -> p.name },
                playDate = it.playDate,
                playSequence = it.playSequence,
                blockCode = it.blockCode,
                seatGrade = it.seatGrade,
                floor = it.floor,
                rowNo = it.rowNo,
                seatNo = it.seatNo,
                seatGradeName = it.seatGradeName,
                bookingUserName = it.bookingUserName,
                bookingUserBirthDay = it.bookingUserBirthDay,
                bookingUserPhone = it.bookingUserPhone,
                createdAt = it.createdAt,
            )
        }
        return list
    }

    data class OrderDetailView(
        val id: Long,
        val email: String,
        val cookie: String,
        val productCode: String,
        val productName: String,
        val playDate: String,
        val playSequence: String,
        val blockCode: String,
        val seatGrade: String,
        val floor: String,
        val rowNo: String,
        val seatNo: String,
        val seatGradeName: String,
        val bookingUserName: String,
        val bookingUserBirthDay: String,
        val bookingUserPhone: String,
        @get:JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        val createdAt: LocalDateTime?,
    )

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): OrderDetailView {
        return service.getById(id) {
            OrderDetailView(
                id = it.id!!,
                email = it.email,
                cookie = it.cookie,
                productCode = it.productCode,
                productName = interparkPerformService.findByPerformCode(it.productCode) { p -> p.name },
                playDate = it.playDate,
                playSequence = it.playSequence,
                blockCode = it.blockCode,
                seatGrade = it.seatGrade,
                floor = it.floor,
                rowNo = it.rowNo,
                seatNo = it.seatNo,
                seatGradeName = it.seatGradeName,
                bookingUserName = it.bookingUserName,
                bookingUserBirthDay = it.bookingUserBirthDay,
                bookingUserPhone = it.bookingUserPhone,
                createdAt = it.createdAt,
            )
        }
    }

    data class PayInfo(
        val wechatQrCode: String,
    )

    @GetMapping("/{id}/pay-info")
    fun getWechatPayInfo(@PathVariable id: Long): PayInfo {
        val payInfo = service.getOrderPayInfo(id)
        val qrCodeUrl = service.getWechatPayQrCode(payInfo.payUrl)
        return PayInfo(qrCodeUrl)
    }
}