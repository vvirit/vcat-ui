package com.vecat.admin.repository

import com.vecat.admin.entity.InterparkPerform
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface InterparkPerformRepository: JpaRepository<InterparkPerform, Long>, JpaSpecificationExecutor<InterparkPerform> {
}