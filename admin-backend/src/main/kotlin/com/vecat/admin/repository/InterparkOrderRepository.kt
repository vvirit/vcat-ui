package com.vecat.admin.repository

import com.vecat.admin.entity.InterparkOrder
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface InterparkOrderRepository: JpaRepository<InterparkOrder, Long>, JpaSpecificationExecutor<InterparkOrder> {
}