package com.vecat.admin.remote

/**
 * 远程消息处理器
 *
 * @author Virit
 * @since 2025-08-28
 */
interface RemoteMessageHandler {
    fun onReceiveData(nodeId: String, action: ServerAction, payload: String)
}