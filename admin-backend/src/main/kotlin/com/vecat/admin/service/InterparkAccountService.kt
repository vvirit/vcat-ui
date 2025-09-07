package com.vecat.admin.service

import com.vecat.admin.controller.PageView
import com.vecat.admin.entity.InterparkAccount
import com.vecat.admin.repository.InterparkAccountRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class InterparkAccountService(
    val repository: InterparkAccountRepository,
) {

    data class InterparkAccountPageDTO(
        val id: Long,
        val email: String,
        val password: String,
        val verified: Boolean,
        val disabled: Boolean,
    )

    @Transactional
    fun getPagedList(page: Int, size: Int): PageView<InterparkAccountPageDTO> {
        val pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        val pageData = repository.findAll(pageable)
        val list = pageData.content.map {
            InterparkAccountPageDTO(
                id = it.id!!,
                email = it.email,
                password = it.password,
                verified = it.verified,
                disabled = it.disabled,
            )
        }
        return PageView(list, page, size, pageData.totalElements)
    }

    data class AddAccountDTO(
        val email: String,
        val password: String,
        val verified: Boolean,
        val disabled: Boolean,
        val remarks: String,
    )

    @Transactional
    fun addPool(dto: AddAccountDTO) {
        val account = InterparkAccount(
            email = dto.email,
            password = dto.password,
            verified = dto.verified,
            disabled = dto.disabled,
            remarks = dto.remarks,
        )
        repository.save(account)
    }

    data class UpdateAccountDTO(
        val id: Long,
        val email: String,
        val password: String,
        val verified: Boolean,
        val disabled: Boolean,
        val remarks: String,
    )

    @Transactional
    fun updatePool(dto: UpdateAccountDTO) {
        val account = repository.findById(dto.id).orElse(null)
        account.apply {
            email = dto.email
            password = dto.password
            verified = dto.verified
            disabled = dto.disabled
            remarks = dto.remarks
        }
        repository.save(account)
    }

    @Transactional
    fun update(id: Long, modifier: InterparkAccount.() -> Unit) {
        val account = repository.findById(id).orElse(null)
        account.modifier()
        repository.save(account)
    }

    fun updateByEmail(email: String, modifier: InterparkAccount.() -> Unit) {
        val account = repository.findFirstByEmail(email)
        account?.modifier()
        account?.let { repository.save(it) }
    }

    @Transactional
    fun deletePool(id: Long) {
        repository.deleteById(id)
    }
}