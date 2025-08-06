package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "t_user")
data class User(

  @Column(nullable = false, length = 32, unique = true)
  val username: String,

  @Column(nullable = false, length = 128)
  val password: String,
) : BaseEntity()