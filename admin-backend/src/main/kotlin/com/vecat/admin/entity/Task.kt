package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Lob
import jakarta.persistence.Table

enum class DataType {
  JSON,
  YAML,
  TOML,
}

@Entity
@Table(name = "t_task")
data class Task(

  @Column(nullable = false, length = 32, unique = true)
  val name: String,

  @Enumerated(EnumType.STRING)
  val type: DataType,

  @Column(nullable = false, length = 16)
  val dataType: String,

  @Lob
  val argument: String,
) : BaseEntity()