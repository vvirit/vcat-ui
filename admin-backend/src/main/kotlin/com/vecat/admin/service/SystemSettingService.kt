package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.SystemSetting
import com.vecat.admin.entity.SystemSettingName
import com.vecat.admin.repository.SystemSettingRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SystemSettingService(
    val repository: SystemSettingRepository,
) {

    private val initSystemSettings = listOf(
        SystemSetting(name = SystemSettingName.CAP_SOLVER_KEY, description = "Config ths CapSolver api key", value = ""),
    )

    @Transactional
    fun initSettings() {
        val records = repository.findSystemSettingsByNameIn(initSystemSettings.map { it.name })
        val newRecords = initSystemSettings.filter { s -> records.none { it.name == s.name } }
        repository.saveAll(newRecords)
    }

    @Transactional
    fun <T> getPagedList(page: Int, size: Int, mapper: (SystemSetting) -> T): PageView<T> {
        val sort = Sort.by(SystemSetting::id.name).descending()
        val pageable = PageRequest.of(page, size, sort)
        val entityPage = repository.findAll(pageable)
        val list = entityPage.content.map(mapper)
        return PageView(list, page, size, entityPage.totalElements)
    }

    @Transactional
    fun update(id: Long, modifier: SystemSetting.() -> Unit) {
        val setting = repository.findById(id).get()
        setting.modifier()
        repository.save(setting)
    }

    @Transactional
    fun <T> getSettingByName(name: SystemSettingName, transform: (SystemSetting) -> T): T {
        return repository.findFirstByName(name).let { transform(it!!) }
    }
}