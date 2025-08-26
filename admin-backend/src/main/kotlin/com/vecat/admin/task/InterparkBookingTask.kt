package com.vecat.admin.task

data class InterparkBookingTaskArgument(
    val proxyId: Long,
    val productId: Long,
    val seatRotatePoolId: Long,
    val ranges: List<InterparkBookingTaskArgumentRange>,
)

data class InterparkBookingTaskArgumentRange(
    val roundId: Long,
)