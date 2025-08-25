package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.InterparkAccountGroup
import com.vecat.admin.repository.InterparkAccountGroupRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class InterparkAccountGroupService(
  val repository: InterparkAccountGroupRepository
) {

  data class InterparkAccountGroupPageDTO(
    val id: Long,
    val name: String,
    val condition: String,
    val remarks: String,
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
      )
    }
    return PageView(list, page, size, pageData.totalElements)
  }

  data class AddAccountGroupDTO(
    val name: String,
    val condition: String,
    val remarks: String,
  )

  @Transactional
  fun addGroup(dto: AddAccountGroupDTO) {
    val account = InterparkAccountGroup(
      name = dto.name,
      condition = dto.condition,
      remarks = dto.remarks
    )
    repository.save(account)
  }

  data class UpdateAccountGroupDTO(
    val id: Long,
    val name: String,
    val condition: String,
    val remarks: String,
  )

  @Transactional
  fun updatePool(dto: UpdateAccountGroupDTO) {
    val group = repository.findById(dto.id).orElse(null)
    group.apply {
      name = dto.name
      condition = dto.condition
      remarks = dto.remarks
    }
    repository.save(group)
  }

  @Transactional
  fun deletePool(id: Long) {
    repository.deleteById(id)
  }
}