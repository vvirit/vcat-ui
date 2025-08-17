package com.vecat.admin.repository

import com.vecat.admin.entity.InterparkSeatRotatePool
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface InterparkSeatRotatePoolRepository : JpaRepository<InterparkSeatRotatePool, Long>,
    JpaSpecificationExecutor<InterparkSeatRotatePool> {
}