package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Table

enum class TaskCategory(val category: String) {
    INTERPARK("interpark"),
}

enum class TaskName(val taskName: String) {
    BOOKING("booking"),
    LOGIN("login"),
}

@Entity
@Table(name = "t_task")
data class Task(

    @Column(nullable = false, length = 32, unique = true)
    var name: String,

    @Enumerated(EnumType.STRING)
    var category: TaskCategory,

    @Enumerated(EnumType.STRING)
    var taskName: TaskName,

    @Column(nullable = true, length = 64)
    var remarks: String,

    @Column(columnDefinition = "TEXT")
    var argument: String,
) : BaseEntity()