package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.InterparkAccount
import com.vecat.admin.entity.InterparkAccountGroup
import com.vecat.admin.repository.InterparkAccountGroupRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class InterparkAccountGroupService(
    val repository: InterparkAccountGroupRepository,
    @PersistenceContext
    val entityManager: EntityManager,
) {

    @Transactional
    fun <T> allGroups(transform: (InterparkAccountGroup) -> T): List<T> {
        return repository.findAll().map(transform)
    }

    data class InterparkAccountGroupPageDTO(
        val id: Long,
        val name: String,
        val condition: String,
        val remarks: String,
        val pageNumber: Int?,
        val pageSize: Int?,
    )

    @Transactional
    fun getPagedList(page: Int, size: Int): PageView<InterparkAccountGroupPageDTO> {
        val pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        val pageData = repository.findAll(pageable)
        val list = pageData.content.map {
            InterparkAccountGroupPageDTO(
                id = it.id!!,
                name = it.name,
                condition = it.condition,
                remarks = it.remarks,
                pageNumber = it.pageNumber,
                pageSize = it.pageSize,
            )
        }
        return PageView(list, page, size, pageData.totalElements)
    }

    data class AddAccountGroupDTO(
        val name: String,
        val condition: String,
        val remarks: String,
        val pageNumber: Int?,
        val pageSize: Int?,
    )

    @Transactional
    fun addGroup(dto: AddAccountGroupDTO) {
        val account = InterparkAccountGroup(
            name = dto.name,
            condition = dto.condition,
            remarks = dto.remarks,
            pageNumber = dto.pageNumber,
            pageSize = dto.pageSize,
        )
        repository.save(account)
    }

    data class UpdateAccountGroupDTO(
        val id: Long,
        val name: String,
        val condition: String,
        val remarks: String,
        val pageNumber: Int?,
        val pageSize: Int?,
    )

    @Transactional
    fun updatePool(dto: UpdateAccountGroupDTO) {
        val group = repository.findById(dto.id).orElse(null)
        group.apply {
            name = dto.name
            condition = dto.condition
            remarks = dto.remarks
            pageNumber = dto.pageNumber
            pageSize = dto.pageSize
        }
        repository.save(group)
    }

    @Transactional
    fun deletePool(id: Long) {
        repository.deleteById(id)
    }

    @Transactional
    fun <T> getPoolAccountsById(id: Long, transform: (InterparkAccount) -> T): List<T> {
        val group = repository.findById(id).get()
        val jpql = buildString {
            append("SELECT a FROM ${InterparkAccount::class.simpleName} a ")
            append("WHERE ${group.condition} ")
            append("ORDER BY a.id")
        }
        var query = entityManager.createQuery(jpql, InterparkAccount::class.java)
        if (group.pageSize != null && group.pageNumber != null) {
            query = query.setFirstResult((group.pageNumber!! - 1) * group.pageSize!!)
            query = query.setMaxResults(group.pageSize!!)
        }
        val accounts = query.resultList
        return accounts.map(transform)
    }
}