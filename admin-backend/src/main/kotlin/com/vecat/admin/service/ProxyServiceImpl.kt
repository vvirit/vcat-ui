package com.vecat.admin.service

import com.vecat.admin.entity.Proxy
import com.vecat.admin.repository.ProxyRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class ProxyServiceImpl(
  val repository: ProxyRepository,
) : ProxyService {
  override fun getPagedProxies(page: Int, size: Int): Page<Proxy> {
    val pageable = PageRequest.of(page, size)
    return repository.findAll(pageable)
  }

  @Transactional
  override fun add(proxy: Proxy) {
    repository.save(proxy)
  }
}