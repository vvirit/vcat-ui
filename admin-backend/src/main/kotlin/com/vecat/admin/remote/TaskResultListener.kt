package com.vecat.admin.remote

import kotlin.reflect.KClass

/**
 * 任务结果监听器
 * 在接收到任务结果消息时，任务结果会写入任务详情，同时触发任务消息监听，实现自定义业务逻辑
 * 例如需要将购票结果写入业务列表，进行操作
 *
 * @author Virit
 * @since 2025-08-28
 */
interface TaskResultListener<T : Any> {

    val taskName: String

    val dataType: KClass<T>

    fun onReceivedTaskResult(nodeId: String, taskId: String, result: T)
}