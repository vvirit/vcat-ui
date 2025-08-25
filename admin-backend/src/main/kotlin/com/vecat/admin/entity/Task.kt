package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

enum class TaskCategory {
    INTERPARK,
}

enum class TaskType {
    BOOKING,
}

@Entity
@Table(name = "t_task")
data class Task(

    @Column(nullable = false, length = 32, unique = true)
    var name: String,

    @Enumerated(EnumType.STRING)
    var category: TaskCategory,

    @Enumerated(EnumType.STRING)
    var taskType: TaskType,

    @Column(nullable = true, length = 64)
    var remarks: String,

    @OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "interpark_booking_task_id", nullable = true)
    var interparkBookingTask: InterparkBookingTask? = null,
) : BaseEntity()