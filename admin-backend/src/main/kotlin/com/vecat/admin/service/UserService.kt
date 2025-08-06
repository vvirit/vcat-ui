package com.vecat.admin.service

import com.vecat.admin.entity.User
import com.vecat.admin.repository.UserRepository
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
  val userRepository: UserRepository,
  val passwordEncoder: PasswordEncoder,
) {

  private val logger = LoggerFactory.getLogger(javaClass)
  private val adminUserName = "admin"
  private val adminUserPassword = "nyann456123"

  @Transactional
  fun initAdminUser() {
    val users = userRepository.findAll()
    if (users.isNotEmpty()) {
      return
    }
    logger.info("初始化用户...")
    val adminUser = User(
      username = adminUserName,
      password = passwordEncoder.encode(adminUserPassword),
    )
    userRepository.save(adminUser)
    logger.info("初始化用户完成, 用户名: $adminUserName, 密码: $adminUserPassword")
  }

  fun checkUserAuth(username: String, password: String): User? {
    val user = userRepository.findUserByUsername(username) ?: return null
    return if (passwordEncoder.matches(password, user.password)) {
      user
    } else {
      null
    }
  }

  fun getUserById(id: Long): User? {
    return userRepository.findById(id).orElse(null)
  }
}