package com.vecat.admin.entity

import com.vecat.admin.base.BaseEntity
import jakarta.persistence.*

enum class ProxyType {
  STANDARD,
  POOL,
  ITEM,
}

enum class ProxyProtocol {
    HTTP,
    SOCKS5,
}

@Entity
@Table(name = "t_proxy")
data class Proxy(

  @Column(nullable = true, length = 32, unique = true)
  var name: String? = null,

  @Enumerated(EnumType.STRING)
  var type: ProxyType? = null,

  @Column(nullable = true, length = 32, unique = false)
  var host: String? = null,

  @Column(nullable = true, length = 32, unique = false)
  var port: Int? = null,

  @Column(nullable = true, length = 128, unique = false)
  var username: String? = null,

  @Column(nullable = true, length = 128, unique = false)
  var password: String? = null,

  @ManyToOne
  @JoinColumn(name = "parent_proxy_id")
  var parent: Proxy? = null,

  @OneToMany(mappedBy = "parent", cascade = [CascadeType.ALL], orphanRemoval = true)
  var proxies: MutableList<Proxy> = mutableListOf(),
) : BaseEntity()
