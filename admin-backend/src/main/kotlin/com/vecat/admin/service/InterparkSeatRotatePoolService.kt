package com.vecat.admin.service

import com.vecat.admin.entity.InterparkSeatRotatePool
import com.vecat.admin.entity.InterparkSeatRotatePoolItem
import com.vecat.admin.repository.InterparkPerformRepository
import com.vecat.admin.repository.InterparkSeatRotatePoolRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Interpark轮换池Service
 *
 * @author Virit
 * @since 2025-08-17
 */
@Service
class InterparkSeatRotatePoolService(
    val performRepository: InterparkPerformRepository,
    val poolRepository: InterparkSeatRotatePoolRepository,
) {

    data class AddPoolDTOItem(
        val roundId: Long,
        val blockId: Long,
        var seatGrade: String,
        var seatGradeName: String,
        var floor: String,
        var rowNo: String,
        var seatNo: String,
    )

    data class AddPoolDTO(
        val performId: Long,
        val name: String,
        val items: List<AddPoolDTOItem>
    )

    @Transactional
    fun addPool(dto: AddPoolDTO) {
        val perform = performRepository.findById(dto.performId).orElseThrow()
        val pool = InterparkSeatRotatePool(
            name = dto.name,
            perform = perform,
        )
        pool.items = dto.items.map {
            InterparkSeatRotatePoolItem(
                round = perform.rounds.first { r -> it.roundId == r.id },
                block = perform.blocks.first { r -> it.blockId == r.id },
                pool = pool,
                seatGrade = it.seatGrade,
                floor = it.floor,
                rowNo = it.rowNo,
                seatNo = it.seatNo,
                seatGradeName = it.seatGradeName,
            )
        }.toMutableList()
        poolRepository.save(pool)
    }

    data class UpdatePoolDTOItem(
        val id: Long,
        val roundId: Long,
        val blockId: Long,
        var seatGrade: String,
        var seatGradeName: String,
        var floor: String,
        var rowNo: String,
        var seatNo: String,
    )

    data class UpdatePoolDTO(
        val performId: Long,
        val name: String,
        val items: List<AddPoolDTOItem>
    )

    @Transactional
    fun updatePool(dto: UpdatePoolDTO) {
        val perform = performRepository.findById(dto.performId).orElseThrow()
        val pool = poolRepository.findById(dto.performId).orElseThrow()
        pool.apply {
            items.clear()
            name = dto.name
        }
        dto.items.forEach {
            pool.items.add(
                InterparkSeatRotatePoolItem(
                    round = perform.rounds.first { r -> it.roundId == r.id },
                    block = perform.blocks.first { r -> it.blockId == r.id },
                    pool = pool,
                    seatGrade = it.seatGrade,
                    floor = it.floor,
                    rowNo = it.rowNo,
                    seatNo = it.seatNo,
                    seatGradeName = it.seatGradeName,
                )
            )
        }
        poolRepository.save(pool)
    }

    @Transactional
    fun deletePool(id: Long) {
        poolRepository.deleteById(id)
    }

    @Transactional
    fun getPagedList(page: Int, size: Int): Page<InterparkSeatRotatePool> {
        val pageable = PageRequest.of(page, size)
        return poolRepository.findAll(pageable)
    }
}