package com.vecat.admin.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.vecat.admin.base.BaseEntity
import jakarta.persistence.*

enum class TaskInstanceStatus {
    CREATED,
    DISPATCHED,
    RUNNING,
    FINISHED,
    FAILED,
}

@Entity
@Table(name = "t_task_instance")
data class TaskInstance(

    @Column(length = 64)
    var nodeId: String,

    @Column(nullable = false, length = 32)
    var name: String,

    @Column(nullable = false, length = 32)
    var taskName: String,

    @Column(nullable = true, length = 64)
    var remarks: String,

    @Enumerated(EnumType.STRING)
    var status: TaskInstanceStatus,

    @Column(columnDefinition = "TEXT")
    var argument: String,

    @Column(columnDefinition = "TEXT")
    var information: String? = null,

    @Column(nullable = true, length = 512)
    var errorMessage: String? = null,

    @OneToMany(
        mappedBy = "instance",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @OrderBy("id")
    var items: MutableList<TaskInstanceItem> = mutableListOf(),

    @OneToMany(
        mappedBy = "instance",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @OrderBy("id")
    var resultItems: MutableList<TaskInstanceResultItem> = mutableListOf(),
) : BaseEntity()

@Entity
@Table(name = "t_task_instance_item")
data class TaskInstanceItem(

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instance_id", nullable = false)
    var instance: TaskInstance? = null,

    @Column(nullable = true, length = 64)
    var remarks: String,

    @Enumerated(EnumType.STRING)
    var status: TaskInstanceStatus,

    @Column(columnDefinition = "TEXT")
    var information: String,

    @Column(nullable = true, length = 512)
    var errorMessage: String? = null,
) : BaseEntity()

@Entity
@Table(name = "t_task_instance_result_item")
data class TaskInstanceResultItem(

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instance_id", nullable = false)
    var instance: TaskInstance? = null,

    @Column(columnDefinition = "TEXT")
    var data: String,

    @Column(nullable = true, length = 512)
    var errorMessage: String? = null,
) : BaseEntity()