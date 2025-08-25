package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "t_interpark_account_group")
data class InterparkAccountGroup(

  @Column(nullable = false, length = 32, unique = true)
  var name: String,

  @Column(nullable = false, length = 512, unique = false)
  var condition: String,

  @Column(nullable = true, length = 64)
  var remarks: String,
) : BaseEntity()