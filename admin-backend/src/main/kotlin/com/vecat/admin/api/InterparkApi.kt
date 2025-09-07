package com.vecat.admin.api

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.vecat.admin.http.FormItem
import com.vecat.admin.http.HttpClient
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import kotlin.text.get

class InterparkApi(
    val httpClient: HttpClient,
) {

    companion object {
        val objectMapper = jacksonObjectMapper()
    }

    fun bookEncrypt(birthDay: String, phoneNumber: String, email: String): Map<String, String> {
        val response = httpClient.get("https://gpoticket.globalinterpark.com/Global/Play/Book/Lib/BookEncrypt.asp") {
            url {
                parameters.append("SSN", birthDay.substring(2) + "0000000")
                parameters.append("PhoneNo", phoneNumber)
                parameters.append("HpNo", "")
                parameters.append("RPhoneNo", "")
                parameters.append("RHpNo", "")
                parameters.append("Email", email)
                parameters.append("BookPwd", "")
                parameters.append("Callback", "fnDeliveryEncryptCallback")
            }
            headers {
                append("authority", "gpoticket.globalinterpark.com")
                append("origin", "https://gpoticket.globalinterpark.com")
                append("referer", "https://gpoticket.globalinterpark.com/Global/Play/Book/BookDelivery.asp")
            }
        }
        if (!response.success) {
            throw RuntimeException("bookEncrypt failed, status is ${response.status}")
        }
        val jsonString = response.stringBody().substringAfter("(").substringBefore(")")
        val json: Map<String, String> = objectMapper.readValue(jsonString)
        return json
    }


    data class PaymentData(
        val hashPrice: String
    )

    fun bookPayment(bookingForm: List<FormItem>): PaymentData {
        val response = httpClient.post("https://gpoticket.globalinterpark.com/Global/Play/Book/BookPayment.asp") {
            headers {
                append("authority", "gpoticket.globalinterpark.com")
                append("origin", "https://gpoticket.globalinterpark.com")
                append("referer", "https://gpoticket.globalinterpark.com/Global/Play/Book/BookMain.asp")
            }
            setFormBody {
                for (item in bookingForm) {
                    append(item.name, item.value)
                }
            }
        }
        if (!response.success) {
            throw RuntimeException("book payment failed, status is ${response.status}")
        }
        val hashPrice = response.stringBody()
            .substringAfter("parent.fnSetValPayment(")
            .substringBefore("\n")
            .split(",")
            .map { it.trim().replace("\"", "") }[14]
        return PaymentData(hashPrice)
    }

    data class BookConfirmInfo(
        val cartId: String,
        val cartIdSeq: String,
        val payUrl: String,
    )

    fun bookConfirm(bookingForm: List<FormItem>): BookConfirmInfo {
        val response = httpClient.post("https://gpoticket.globalinterpark.com/Global/Play/Book/BookConfirm.asp") {
            headers {
                append("authority", "gpoticket.globalinterpark.com")
                append("origin", "https://gpoticket.globalinterpark.com")
                append("referer", "https://gpoticket.globalinterpark.com/Global/Play/Book/BookMain.asp")
            }
            setFormBody {
                for (item in bookingForm) {
                    append(item.name, item.value)
                }
            }
        }
        if (!response.success) {
            throw RuntimeException("book confirm failed, status is ${response.status}")
        }

        if (response.stringBody().contains("ErrMsg")) {
            val errorMsg = URLDecoder.decode(
                response.stringBody().substringAfter("ErrMsg=").substringBefore("&"),
                StandardCharsets.UTF_8
            )
            throw RuntimeException(errorMsg)
        }
        if (response.stringBody().contains("Please restart your booking process")) {
            throw RuntimeException("Book session is expired.")
        }
        val cartInfo = response.stringBody()
            .substringAfter("parent.fnSetCartInfo(")
            .substringBefore(");")
            .split(",")
            .map { it.replace("\"", "").trim() }
        val cartId = cartInfo[0]
        val cartIdSeq = cartInfo[1]
        val jb = objectMapper.readValue<JsonNode>(
            response.stringBody().substringAfter("EXIMBAY.request_pay(").substringBefore(");")
        )
        val paymentsResponse = httpClient.post("https://api.eximbay.com/v1/payments") {
            headers {
                append("referer", "https://gpoticket.globalinterpark.com/")
            }
            setJsonBody(jb)
        }
        val paymentsForm = paymentsResponse.jsonBody<Map<String, String>>().toMutableMap()
        paymentsForm.remove("url")
        paymentsForm.remove("display_type")
        val basicProcessor = httpClient.post("https://secureapi.ext.eximbay.com/Gateway/BasicProcessor.krp") {
            headers {
                append("referer", "https://gpoticket.globalinterpark.com/")
            }
            setFormBody {
                paymentsForm.forEach { (name, value) ->
                    append(name, value)
                }
                append("param3", "OPENAPI")
            }
        }
        val doc = basicProcessor.xmlBody()
        val form = doc.select("form")
        val url = form.attr("action")
        val input = form.select("input")
        val name = input.attr("name")
        val value = input.attr("value")
        val fullUrl = "https://secureapi.ext.eximbay.com${url}?${name}=${value}"
        return BookConfirmInfo(
            cartId = cartId,
            cartIdSeq = cartIdSeq,
            payUrl = fullUrl,
        )
    }

    fun eximbayGlobalStep1(url: String): List<Pair<String, String>> {
        val response = httpClient.get(url)
        if (!response.success) {
            throw RuntimeException("api [eximbayGlobalStep1] status code is ${response.status}")
        }
        val document = response.xmlBody()
        val formInputs = document.select("form input")
        val formData = formInputs.map { Pair(it.attr("name"), it.attr("value")) }
        return formData
    }

    fun eximbayCheckApprv(
        paramKey: String,
        cardNo: String = "",
        cardCode: String = "C023"
    ): List<Pair<String, String>> {
        val response =
            httpClient.post("https://secureapi.ext.eximbay.com/Gateway/BasicProcessor/230/controll/checkApprv.jsp") {
                setFormBody {
                    append("paramkey", paramKey)
                    append("cardcode", cardCode)
                    append("channelCode", "")
                    append("issuerCountry", "")
                    append("cardno1", "")
                    append("cardno2", "")
                    append("cardno3", "")
                    append("cardno4", "")
                    append("cardNum", "")
                    append("month", "")
                    append("year", "")
                    append("tel", "")
                    append("unioncardno", cardNo)
                    append("unionoffcardno", "")
                    append("month_unionpay", "")
                    append("year_unionpay", "")
                    append("paymethod", cardCode)
                    append("cvc", "")
                    append("firstname", "")
                    append("lastname", "")
                    append("cvc_unionpay", "")
                    append("firstname_unionpay", "")
                    append("lastname_unionpay", "")
                    append("tel", "")
                    append("tel", "")
                    append("email", "")
                    append("shipTo_country", "")
                    append("shipTo_postalCode", "")
                    append("shipTo_city", "")
                    append("shipTo_street1", "")
                    append("agree", "Y")
                }
            }
        if (!response.success) {
            throw RuntimeException("api [eximbayCheckApprv] status code is ${response.status}")
        }
        val document = response.xmlBody()
        val formInputs = document.select("form input")
        val formData = formInputs.map { Pair(it.attr("name"), it.attr("value")) }
        return formData
    }

    fun eximbayCheckPayMethod(formData: List<Pair<String, String>>): List<Pair<String, String>> {
        val response =
            httpClient.post("https://secureapi.ext.eximbay.com/Gateway/BasicProcessor/230/controll/checkPaymethod.jsp") {
                setFormBody {
                    formData.forEach {
                        append(it.first, it.second)
                    }
                }
            }
        if (!response.success) {
            throw RuntimeException("api [eximbayCheckPayMethod] status code is ${response.status}")
        }
        val document = response.xmlBody()
        val formInputs = document.select("form input")
        val formData = formInputs.map { Pair(it.attr("name"), it.attr("value")) }
        return formData
    }

    fun webchatPayCheck(paramKey: String): Boolean {
        val response =
            httpClient.post("https://secureapi.ext.eximbay.com/Gateway/BasicProcessor/230/paymethod/wechat/wechatPayCheck.do") {
                setFormBody {
                    append("paramkey", paramKey)
                }
            }
        if (!response.success) {
            throw RuntimeException("api [webchatPayCheck] status code is ${response.status}")
        }
        val rescode = response.stringBody().substringAfter("rescode=").substringBefore("&")
        return rescode == "0000"
    }

    fun wechatQrRequest(formData: List<Pair<String, String>>): List<Pair<String, String>> {
        val response =
            httpClient.post("https://secureapi.ext.eximbay.com/Gateway/BasicProcessor/230/paymethod/wechat/wechatQRRequest.jsp") {
                setFormBody {
                    formData.forEach {
                        append(it.first, it.second)
                    }
                }
            }
        if (!response.success) {
            throw RuntimeException("api [wechatQrRequest] status code is ${response.status}")
        }
        val document = response.xmlBody()
        val formInputs = document.select("form input")
        val formData = formInputs.map { Pair(it.attr("name"), it.attr("value")) }
        return formData
    }

    fun wechatQrStep2(formData: List<Pair<String, String>>): String {
        val response =
            httpClient.post("https://secureapi.ext.eximbay.com/Gateway/BasicProcessor/230/paymethod/wechat/NewWechatQRStep2.jsp") {
                setFormBody {
                    formData.forEach {
                        append(it.first, it.second)
                    }
                }
            }
        if (!response.success) {
            throw RuntimeException("api [wechatQrStep2] status code is ${response.status}")
        }
        val document = response.xmlBody()
        val imageUrl = document.select(".qr_cont img").attr("src")
        return "https://secureapi.ext.eximbay.com/${imageUrl}"
    }
}