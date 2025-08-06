package com.vecat.admin.app

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Configuration
@Component
class AppConfiguration {

  @Bean
  fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}