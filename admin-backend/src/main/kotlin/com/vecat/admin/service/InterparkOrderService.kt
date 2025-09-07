package com.vecat.admin.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.vecat.admin.api.InterparkApi
import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.InterparkOrder
import com.vecat.admin.http.FormItem
import com.vecat.admin.http.OkHttpHttpClient
import com.vecat.admin.repository.InterparkOrderRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class InterparkOrderService(
    val repository: InterparkOrderRepository,
    val objectMapper: ObjectMapper,
) {

    @Transactional
    fun addOrder(order: InterparkOrder) {
        repository.save(order)
    }

    @Transactional
    fun <T> getPagedList(page: Int, size: Int, transform: (InterparkOrder) -> T): PageView<T> {
        val pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        val pageData = repository.findAll(pageable)
        return PageView(pageData.content.map(transform), page, size, pageData.totalElements)
    }

    @Transactional
    fun <T> getById(id: Long, transform: (InterparkOrder) -> T): T {
        return repository.findById(id).map(transform).get()
    }

    data class WechatPayInfo(
        val payUrl: String,
    )

    @Transactional
    fun getOrderPayInfo(orderId: Long): InterparkApi.BookConfirmInfo {
        val order = repository.findById(orderId).get()
        val httpClient = OkHttpHttpClient()
        httpClient.cookieStorage.restore(order.cookie)
        val api = InterparkApi(httpClient)
        val encrypted = api.bookEncrypt(order.bookingUserBirthDay, "18502819032", order.email)
        val orderForm = objectMapper.readValue<List<FormItem>>(order.bookingForm).toMutableList()
        encrypted.forEach { (key, value) ->
            orderForm.firstOrNull { it.name == key }?.value = value
        }
        orderForm.firstOrNull { it.name == "MemberName" }?.value = order.bookingUserName
        orderForm.firstOrNull { it.name == "Delivery" }?.value = "24000"
        orderForm.firstOrNull { it.name == "SmsOrNot" }?.value = "Y"
        orderForm.firstOrNull { it.name == "DeliveryEnc" }?.value = "Y"
        val paymentData = api.bookPayment(orderForm)
        orderForm.firstOrNull { it.name == "HashPrice" }?.value = paymentData.hashPrice
        orderForm.firstOrNull { it.name == "SmsOrNot" }?.value = "Y"
        orderForm.firstOrNull { it.name == "DeliveryEnc" }?.value = "Y"
        orderForm.firstOrNull { it.name == "DeliveryOrNot" }?.value = "Y"
        orderForm.firstOrNull { it.name == "DeliveryGiftAmt" }?.value = "0"
        orderForm.firstOrNull { it.name == "ISPDiscountOrNot" }?.value = "N"
        orderForm.firstOrNull { it.name == "DiscountOrNot" }?.value = "N"
        orderForm.firstOrNull { it.name == "FirstKindOfPayment" }?.value = "22003"
        orderForm.firstOrNull { it.name == "SecondSettleAmt" }?.value = "0"
        orderForm.firstOrNull { it.name == "PaymentEnc" }?.value = "N"
        orderForm.firstOrNull { it.name == "useGSPoint" }?.value = "0"
        orderForm.firstOrNull { it.name == "GroupId" }?.value = "12133"
        orderForm.firstOrNull { it.name == "KindOfCard" }?.value = "12001"
        orderForm.firstOrNull { it.name == "DiscountCard" }?.value = "99"
        orderForm.firstOrNull { it.name == "HalbuMonth" }?.value = "0"
        orderForm.firstOrNull { it.name == "MCash_TotalAmt" }?.value = "0"

        val confirmInfo = api.bookConfirm(orderForm)
        order.cartId = confirmInfo.cartId
        order.cartIdSeq = confirmInfo.cartIdSeq
        return confirmInfo
    }

    fun getWechatPayQrCode(payUrl: String): String {
        val httpClient = OkHttpHttpClient()
        val api = InterparkApi(httpClient)
        val eximbayGlobalStep1Form = api.eximbayGlobalStep1(payUrl)
        val paramKey = payUrl.substringAfter("paramkey=")
        val eximbayCheckApprvForm = api.eximbayCheckApprv(paramKey, "", "C025")
        val eximbayCheckPayMethodForm = api.eximbayCheckPayMethod(eximbayCheckApprvForm)
        val wechatQrRequestForm = api.wechatQrRequest(eximbayCheckPayMethodForm)
        return api.wechatQrStep2(wechatQrRequestForm)
    }
}
