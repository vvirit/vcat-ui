package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.entity.InterparkAccount
import com.vecat.admin.service.InterparkAccountService
import com.vecat.admin.service.InterparkAccountService.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/interpark-account")
class InterparkAccountController(
    val service: InterparkAccountService,
) {

    @GetMapping
    fun list(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): PageView<InterparkAccountPageDTO> {
        val list = service.getPagedList(page, pageSize)
        return list
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseData<Unit> {
        service.deletePool(id)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PostMapping
    fun add(@RequestBody dto: AddAccountDTO): ResponseData<Unit> {
        service.addPool(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PutMapping
    fun update(@RequestBody dto: UpdateAccountDTO): ResponseData<Unit> {
        service.updatePool(dto)
        return ResponseData(code = StatusCode.SUCCESS)
    }

    @PostMapping("/import")
    fun upload(@RequestParam("file") file: MultipartFile): ResponseEntity<String?> {
        val text = String(file.bytes)
        val accounts = text.split("\n").filter { it.isNotBlank() }
            .map { it.split(",") }
            .map { Pair(it[0].trim(), it[1].trim()) }
            .map { InterparkAccount(email = it.first, password = it.second, verified = true, disabled = false) }
        val existsAccounts = service.findByEmailIn(accounts.map { it.email }) { it.email }
        service.add(accounts.filter { existsAccounts.none { e -> e == it.email } })
        return ResponseEntity.ok<String?>("上传成功")
    }
}