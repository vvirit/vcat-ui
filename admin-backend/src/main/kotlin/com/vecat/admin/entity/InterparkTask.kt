package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "t_interpark_booking_task")
class InterparkBookingTask(
    @ManyToOne
    @JoinColumn(name = "proxy_id")
    var proxy: Proxy,

    @ManyToOne
    @JoinColumn(name = "perform_id")
    var perform: InterparkPerform,

    @ManyToOne
    @JoinColumn(name = "router_id")
    var router: QueueRouter,

    @Column
    var concurrency: Int,

    @Column
    var requestInterval: Int,

    @ManyToOne
    @JoinColumn(name = "rotate_pool_id")
    var rotatePool: InterparkSeatRotatePool,
) : BaseEntity()