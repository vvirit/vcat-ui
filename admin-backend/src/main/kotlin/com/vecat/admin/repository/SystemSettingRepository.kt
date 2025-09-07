package com.vecat.admin.repository

import com.vecat.admin.entity.SystemSetting
import com.vecat.admin.entity.SystemSettingName
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface SystemSettingRepository : JpaRepository<SystemSetting, Long>, JpaSpecificationExecutor<SystemSetting> {

    fun findSystemSettingsByNameIn(names: List<SystemSettingName>): List<SystemSetting>

    fun findFirstByName(name: SystemSettingName): SystemSetting?
}