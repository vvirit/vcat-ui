package com.vecat.admin.repository

import com.vecat.admin.entity.WebHook
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface WebHookRepository : JpaRepository<WebHook, Long>, JpaSpecificationExecutor<WebHook>