package com.vecat.admin.remote

import com.vecat.admin.entity.TaskCategory
import com.vecat.admin.entity.TaskName
import kotlin.reflect.KClass


interface TaskArgumentBuilder<C : Any, A> {

    val taskCategory: TaskCategory
    val taskName: TaskName
    val configType: KClass<C>

    fun build(config: C): A
}