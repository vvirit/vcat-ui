package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Table

enum class SystemSettingName {
    CAP_SOLVER_KEY
 }

/**
 * 系统参数设置
 *
 * @author Virit
 * @since 2025-08-29
 */
@Entity
@Table(name = "t_system_setting")
data class SystemSetting(

    @Enumerated(EnumType.STRING)
    var name: SystemSettingName,

    @Column(nullable = false, length = 64)
    var description: String,

    @Column(length = 128)
    var value: String,
): BaseEntity()
