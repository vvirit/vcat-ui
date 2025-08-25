package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "t_interpark_account")
data class InterparkAccount(

  @Column(nullable = false, length = 32, unique = true)
  var email: String,

  @Column(nullable = false, length = 16)
  var password: String,

  @Column
  var verified: Boolean,

  @Column
  var disabled: Boolean,

  @Column(nullable = true, length = 64)
  var remarks: String,
) : BaseEntity()