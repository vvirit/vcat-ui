package com.vecat.admin.repository

import com.vecat.admin.entity.Proxy
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface ProxyRepository: JpaRepository<Proxy, Long>, JpaSpecificationExecutor<Proxy> {
}