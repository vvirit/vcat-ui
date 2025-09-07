package com.vecat.admin.app

import com.vecat.admin.service.SystemSettingService
import com.vecat.admin.service.UserService
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    val userService: UserService,
    val systemSettingService: SystemSettingService,
) : ApplicationRunner {

    override fun run(args: ApplicationArguments) {
        userService.initAdminUser()
        systemSettingService.initSettings()
    }
}