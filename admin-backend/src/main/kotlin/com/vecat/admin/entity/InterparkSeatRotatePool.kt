package com.vecat.admin.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.vecat.admin.base.BaseEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.Table

/**
 * Interpark座位轮换池
 * 指定一组座位，挂载了轮换池的任务会自动轮换锁定座位，保证每个位置都能被公平的锁定
 *
 * @author Virit
 * @since 2025-08-17
 */
@Entity
@Table(name = "t_interpark_seat_rotate_pool")
data class InterparkSeatRotatePool(

    @Column(nullable = false, unique = true)
    var name: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "perform_id", nullable = false)
    var perform: InterparkPerform,

    @OneToMany(
        mappedBy = "pool",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @OrderBy("id")
    var items: MutableList<InterparkSeatRotatePoolItem> = mutableListOf()
) : BaseEntity()

/**
 * Interpark座位轮换池项
 * 配置轮换池的轮换座位项目
 *
 * @author Virit
 * @since 2025-08-17
 */
@Entity
@Table(name = "t_interpark_seat_rotate_pool_item")
data class InterparkSeatRotatePoolItem(

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "round_id", nullable = false)
    var round: InterparkPerformRound,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "block_id", nullable = false)
    var block: InterparkPerformBlock,

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pool_id", nullable = false)
    var pool: InterparkSeatRotatePool? = null,

    @Column(nullable = false, length = 32, unique = false)
    var seatGrade: String,

    @Column(nullable = false, length = 32, unique = false)
    var seatGradeName: String,

    @Column(nullable = false, length = 32, unique = false)
    var floor: String,

    @Column(nullable = false, length = 32, unique = false)
    var rowNo: String,

    @Column(nullable = false, length = 32, unique = false)
    var seatNo: String,
) : BaseEntity()