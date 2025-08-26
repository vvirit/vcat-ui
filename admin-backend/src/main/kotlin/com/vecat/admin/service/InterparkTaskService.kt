package com.vecat.admin.service

import com.vecat.admin.repository.InterparkPerformRepository
import com.vecat.admin.repository.InterparkSeatRotatePoolRepository
import com.vecat.admin.repository.ProxyRepository
import com.vecat.admin.repository.QueueRouterRepository
import org.springframework.stereotype.Service


@Service
class InterparkTaskService(
    val proxyRepository: ProxyRepository,
    val interparkPerformRepository: InterparkPerformRepository,
    val queueRouterRepository: QueueRouterRepository,
    val interparkSeatRotatePoolRepository: InterparkSeatRotatePoolRepository
) {

    data class InterparkBookingTaskDTO(
        val proxyId: Long,
        val performId: Long,
        val routerId: Long,
        val concurrency: Int,
        val requestInterval: Int,
        val rotatePoolId: Long,
    )
}