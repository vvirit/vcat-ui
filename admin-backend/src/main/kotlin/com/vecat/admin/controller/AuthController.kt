package com.vecat.admin.controller

import cn.dev33.satoken.exception.NotLoginException
import cn.dev33.satoken.stp.StpUtil
import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
  val userService: UserService,
) {

  data class LoginData(
    val username: String,
    val password: String,
  )

  @PostMapping("/login")
  fun login(@RequestBody loginData: LoginData): ResponseData<CurrentUserView> {
    val user = userService.checkUserAuth(loginData.username, loginData.password)
    if (user != null) {
      StpUtil.login(user.id)
      return ResponseData(
        code = StatusCode.SUCCESS,
        data = CurrentUserView(user.id!!, user.username),
      )
    } else {
      return ResponseData(
        code = StatusCode.USERNAME_OR_PASSWORD_ERROR,
      )
    }
  }

  @PostMapping("/logout")
  fun logout(): ResponseEntity<Any> {
    StpUtil.logout()
    return ResponseEntity.ok().build()
  }

  data class CurrentUserView(
    val id: Long,
    val username: String,
  )

  @GetMapping("/current-user")
  fun getCurrentUser(): ResponseEntity<CurrentUserView> {
    val userId = try {
      StpUtil.getLoginId()?.toString()?.toLong()
    } catch (e: NotLoginException) {
      null
    }
    if (userId == null) {
      return ResponseEntity.status(401).build()
    }
    val user = userService.getUserById(userId)
    if (user == null) {
      return ResponseEntity.status(401).build()
    }
    return ResponseEntity.ok(CurrentUserView(user.id!!, user.username))
  }
}