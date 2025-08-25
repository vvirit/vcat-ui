package com.vecat.admin.repository

import com.vecat.admin.entity.InterparkAccountGroup
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface InterparkAccountGroupRepository : JpaRepository<InterparkAccountGroup, Long>,
  JpaSpecificationExecutor<InterparkAccountGroup> {
}