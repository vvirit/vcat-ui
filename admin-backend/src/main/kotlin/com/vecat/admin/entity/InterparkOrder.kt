package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Table

@Entity
@Table(name = "t_interpark_order")
data class InterparkOrder(
    @Column(length = 64)
    var email: String,

    @Column(columnDefinition = "TEXT")
    var cookie: String,

    @Column(length = 16)
    var productCode: String,

    @Column(length = 16)
    var playDate: String,

    @Column(length = 8)
    var playSequence: String,

    @Column(length = 8)
    var blockCode: String,

    @Column(length = 16)
    var seatGrade: String,

    @Column(length = 8)
    var floor: String,

    @Column(length = 32)
    var rowNo: String,

    @Column(length = 16)
    var seatNo: String,

    @Column(length = 32)
    var seatGradeName: String,

    @Column(length = 32)
    var bookingUserName: String,

    @Column(length = 16)
    var bookingUserBirthDay: String,

    @Column(length = 32)
    var bookingUserPhone: String,

    @Column(columnDefinition = "TEXT")
    var seatInfo: String,

    @Column(columnDefinition = "TEXT")
    var bookingForm: String,

    @Column
    var sessionTime: Long? = null,

    @Column(length = 16)
    var cartId: String? = null,

    @Column(length = 16)
    var cartIdSeq: String? = null,

    @Column(length = 256)
    var payUrl: String? = null,

    @Enumerated(EnumType.STRING)
    var orderStatus: OrderStatus = OrderStatus.CREATED,
) : BaseEntity()