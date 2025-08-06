package com.vecat.admin.base

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  var id: Long? = null

  @CreatedDate
  @Column(name = "created_at", updatable = false)
  var createdAt: LocalDateTime? = null

  @LastModifiedDate
  @Column(name = "updated_at")
  var updatedAt: LocalDateTime? = null
}
