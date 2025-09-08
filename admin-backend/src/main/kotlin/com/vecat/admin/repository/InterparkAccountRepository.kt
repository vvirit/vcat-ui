package com.vecat.admin.repository

import com.vecat.admin.entity.InterparkAccount
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface InterparkAccountRepository: JpaRepository<InterparkAccount, Long>, JpaSpecificationExecutor<InterparkAccount> {
    fun findFirstByEmail(email: String): InterparkAccount?
    fun findByEmailIn(emails: List<String>): List<InterparkAccount>
}