package com.vecat.admin.remote

enum class RemoteAction {
    RUN_TASK,
    STOP_TASK,
}

/**
 * 远程调度服务
 *
 * @author Virit
 * @since 2025-08-28
 */
interface RemoteService {

    fun sendRemote(nodeId: String, action: RemoteAction, payload: String)

    fun sendRemote(nodeId: String, action: RemoteAction, payload: Any)
}