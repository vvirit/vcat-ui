package com.vecat.admin.service

import com.vecat.admin.entity.Proxy
import org.springframework.data.domain.Page

interface ProxyService {
  fun getPagedProxies(page: Int, size: Int): Page<Proxy>
  fun add(proxy: Proxy)
}