package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Table

enum class QueueRouterType {
  INTERPARK
}

@Entity
@Table(name = "t_queue_router")
data class QueueRouter(

  @Enumerated(EnumType.STRING)
  var type: QueueRouterType? = null,

  @Column(nullable = false, length = 32, unique = true)
  var name: String,

  @Column(nullable = false, length = 16)
  var key: String,
) : BaseEntity()