package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.entity.InterparkPerform
import com.vecat.admin.entity.InterparkPerformBlock
import com.vecat.admin.entity.InterparkPerformRound
import com.vecat.admin.service.InterparkPerformService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/interpark-perform")
class InterparkPerformController(
    val service: InterparkPerformService,
) {

    @GetMapping("/all")
    fun allList(): List<InterparkPerform> {
        return service.allPerforms()
    }

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<InterparkPerform> {
        val list = service.getPagedList(page, pageSize)
        return list
    }

    data class AddRequestRound(
        val date: String,
        val time: String,
        val sequence: String,
    )

    data class AddRequestBlock(
        val name: String,
        val code: String,
    )

    data class AddRequest(
        val name: String,
        val performCode: String,
        val placeCode: String,
        val tmgCode: String,
        val rounds: List<AddRequestRound> = listOf(),
        val blocks: List<AddRequestBlock> = listOf(),
    )

    @PostMapping
    fun add(@RequestBody request: AddRequest): ResponseData<Long> {
        val perform = InterparkPerform(
            name = request.name,
            performCode = request.performCode,
            placeCode = request.placeCode,
            tmgCode = request.tmgCode,
        )
        val rounds = request.rounds.map {
            InterparkPerformRound(
                sequence = it.sequence,
                date = it.date,
                time = it.time,
                perform = perform,
            )
        }.toMutableList()
        val blocks = request.blocks.map {
            InterparkPerformBlock(
                name = it.name,
                code = it.code,
                perform = perform,
            )
        }.toMutableList()
        perform.rounds = rounds
        perform.blocks = blocks
        service.add(perform)
        return ResponseData(code = StatusCode.SUCCESS, data = perform.id)
    }

    @PutMapping
    fun update(@RequestBody request: InterparkPerformService.UpdateDTO): ResponseData<Long> {
        service.updateByDTO(request)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseData<Unit> {
        service.deleteById(id)
        return ResponseData(code = StatusCode.SUCCESS)
    }
}