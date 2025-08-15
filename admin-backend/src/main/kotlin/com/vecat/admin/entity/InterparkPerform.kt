package com.vecat.admin.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.vecat.admin.base.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "t_interpark_perform_round")
data class InterparkPerformRound(
  @Column(nullable = false, length = 8)
  var sequence: String,

  @Column(nullable = false, length = 8)
  var date: String,

  @Column(nullable = false, length = 8)
  var time: String,

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "perform_id", nullable = false)
  var perform: InterparkPerform? = null,
) : BaseEntity()

@Entity
@Table(name = "t_interpark_perform_block")
data class InterparkPerformBlock(

  @Column(nullable = false, length = 16)
  var name: String,

  @Column(nullable = false, length = 16)
  var code: String,

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "perform_id", nullable = false)
  var perform: InterparkPerform? = null,
) : BaseEntity()

@Entity
@Table(name = "t_interpark_perform")
data class InterparkPerform(

  @Column(nullable = false, length = 32, unique = true)
  var name: String,

  @Column(nullable = false, length = 16)
  var performCode: String,

  @Column(nullable = false, length = 16)
  var placeCode: String,

  @Column(nullable = false, length = 16)
  var bizCode: String = "10965",

  @Column(nullable = false, length = 16)
  var goodsBizCode: String = "57971",

  @Column(nullable = false, length = 8)
  var tmgCode: String = "D2003",

  @OneToMany(
    mappedBy = "perform",
    cascade = [CascadeType.ALL],
    orphanRemoval = true,
    fetch = FetchType.LAZY,
  )
  @OrderBy("id")
  var rounds: MutableList<InterparkPerformRound> = mutableListOf(),

  @OneToMany(
    mappedBy = "perform",
    cascade = [CascadeType.ALL],
    orphanRemoval = true,
    fetch = FetchType.LAZY,
  )
  @OrderBy("id")
  var blocks: MutableList<InterparkPerformBlock> = mutableListOf()
) : BaseEntity()