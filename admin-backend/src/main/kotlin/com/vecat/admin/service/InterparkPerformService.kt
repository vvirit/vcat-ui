package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.InterparkPerform
import com.vecat.admin.entity.InterparkPerformBlock
import com.vecat.admin.entity.InterparkPerformRound
import com.vecat.admin.repository.InterparkPerformRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class InterparkPerformService(val repository: InterparkPerformRepository) {

    @Transactional
    fun allPerforms(): List<InterparkPerform> {
        return repository.findAll()
    }

    @Transactional
    fun getPagedList(page: Int, size: Int): PageView<InterparkPerform> {
        val pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        val pageData = repository.findAll(pageable)
        return PageView(pageData.content, page, size, pageData.totalElements)
    }

    @Transactional
    fun add(perform: InterparkPerform) {
        repository.save(perform)
    }

    data class UpdateRoundDTO(
        val sequence: String,
        val date: String,
        val time: String,
    )

    data class UpdateBlockDTO(
        val name: String,
        val code: String,
    )

    data class UpdateDTO(
        val id: Long,
        val name: String,
        val performCode: String,
        val placeCode: String,
        val tmgCode: String,
        val rounds: List<UpdateRoundDTO> = listOf(),
        val blocks: List<UpdateBlockDTO> = listOf(),
    )

    @Transactional
    fun updateByDTO(dto: UpdateDTO) {
        val perform = repository.findById(dto.id).orElseThrow()
        perform.apply {
            name = dto.name
            performCode = dto.performCode
            placeCode = dto.placeCode
            tmgCode = dto.tmgCode
            perform.rounds.clear()
            perform.blocks.clear()
            for (round in dto.rounds) {
                perform.rounds.add(
                    InterparkPerformRound(
                        round.sequence,
                        round.date,
                        round.time,
                        perform = this,
                    )
                )
            }
            for (block in dto.blocks) {
                perform.blocks.add(
                    InterparkPerformBlock(
                        block.name,
                        block.code,
                        perform = this,
                    )
                )
            }
        }
        repository.save(perform)
    }

    @Transactional
    fun deleteById(id: Long) {
        repository.deleteById(id)
    }
}