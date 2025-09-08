package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Table

enum class WebHookType {
    NOTICE
}

enum class WebHookMethod {
    GET, POST, PUT
}

@Entity
@Table(name = "t_web_hook")
data class WebHook(

    @Column(length = 32, nullable = false, unique = true)
    var name: String,

    @Enumerated(EnumType.STRING)
    var type: WebHookType,

    @Column(length = 256)
    var url: String,

    @Enumerated(EnumType.STRING)
    var method: WebHookMethod,

    @Column(columnDefinition = "TEXT")
    var body: String,
): BaseEntity()