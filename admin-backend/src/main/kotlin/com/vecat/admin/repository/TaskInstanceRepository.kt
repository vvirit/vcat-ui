package com.vecat.admin.repository

import com.vecat.admin.entity.TaskInstance
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface TaskInstanceRepository : JpaRepository<TaskInstance, Long>, JpaSpecificationExecutor<TaskInstance>