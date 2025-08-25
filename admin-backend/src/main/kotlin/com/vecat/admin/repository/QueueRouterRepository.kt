package com.vecat.admin.repository

import com.vecat.admin.entity.QueueRouter
import com.vecat.admin.entity.QueueRouterType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface QueueRouterRepository: JpaRepository<QueueRouter, Long>, JpaSpecificationExecutor<QueueRouter> {
  fun findByType(type: QueueRouterType): List<QueueRouter>
}