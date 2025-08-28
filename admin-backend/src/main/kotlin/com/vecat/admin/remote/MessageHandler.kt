package com.vecat.admin.remote

import kotlin.reflect.KClass

/**
 * 消息处理器
 *
 * @author Virit
 * @since 2025-08-28
 */
interface MessageHandler<T: Any> {

    val action: ServerAction

    val messageType: KClass<T>

    fun handleMessage(nodeId: String, payload: T)
}