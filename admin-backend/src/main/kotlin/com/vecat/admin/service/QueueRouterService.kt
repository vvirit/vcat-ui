package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.QueueRouter
import com.vecat.admin.entity.QueueRouterType
import com.vecat.admin.repository.QueueRouterRepository
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class QueueRouterService(
  val repository: QueueRouterRepository,
) {

  data class AddRouterDTO(
    val type: QueueRouterType,
    val name: String,
    val key: String,
  )

  @Transactional
  fun addRouter(dto: AddRouterDTO) {
    val router = QueueRouter(
      type = dto.type,
      name = dto.name,
      key = dto.key,
    )
    repository.save(router)
  }

  data class UpdateRouterDTO(
    val id: Long,
    val type: QueueRouterType,
    val name: String,
    val key: String,
  )

  @Transactional
  fun updateRouter(dto: UpdateRouterDTO) {
    val router = repository.findById(dto.id).orElseThrow()
    router.apply {
      type = dto.type
      name = dto.name
      key = dto.key
    }
    repository.save(router)
  }

  @Transactional
  fun deleteById(id: Long) {
    repository.deleteById(id)
  }

  data class QueueRouterPageDTO(
    val id: Long,
    val type: QueueRouterType,
    val name: String,
    val key: String,
  )

  @Transactional
  fun getPagedList(page: Int, size: Int): PageView<QueueRouterPageDTO> {
    val pageable = PageRequest.of(page, size)
    val entityPage = repository.findAll(pageable)
    val list = entityPage.content.map { pool ->
      QueueRouterPageDTO(
        id = pool.id!!,
        type = pool.type!!,
        name = pool.name,
        key = pool.key,
      )
    }
    return PageView(list, page, size, entityPage.totalElements)
  }

  @Transactional
  fun getListByType(type: QueueRouterType): List<QueueRouterPageDTO> {
    val entityPage = repository.findByType(type)
    val list = entityPage.map { pool ->
      QueueRouterPageDTO(
        id = pool.id!!,
        type = pool.type!!,
        name = pool.name,
        key = pool.key,
      )
    }
    return list
  }
}