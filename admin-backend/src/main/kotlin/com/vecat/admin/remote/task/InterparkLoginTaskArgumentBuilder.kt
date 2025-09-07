package com.vecat.admin.remote.task

import com.vecat.admin.entity.SystemSettingName
import com.vecat.admin.entity.TaskCategory
import com.vecat.admin.entity.TaskName
import com.vecat.admin.remote.TaskArgumentBuilder
import com.vecat.admin.remote.task.InterparkLoginTaskArgumentBuilder.Argument
import com.vecat.admin.remote.task.InterparkLoginTaskArgumentBuilder.Config
import com.vecat.admin.service.InterparkAccountGroupService
import com.vecat.admin.service.ProxyConfig
import com.vecat.admin.service.ProxyService
import com.vecat.admin.service.SystemSettingService
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Component
class InterparkLoginTaskArgumentBuilder(
    val proxyService: ProxyService,
    val interparkAccountGroupService: InterparkAccountGroupService,
    val systemSettingService: SystemSettingService
): TaskArgumentBuilder<Config, Argument> {
    override val taskCategory: TaskCategory = TaskCategory.INTERPARK
    override val taskName: TaskName = TaskName.LOGIN
    override val configType: KClass<Config> = Config::class

    data class Config(
        val accountGroupId: Long,
        val concurrency: Int,
        val proxyId: Long,
        val captchaHandler: String,
        val forceLoginAll: Boolean,
    )

    data class Argument(
        val proxy: ProxyConfig,
        val concurrency: Int,
        val captchaHandler: String,
        val capSolverApiKey: String,
        val accounts: List<LoginAccount>,
    )

    data class LoginAccount(
        val email: String,
        val password: String,
    )

    override fun build(config: Config): Argument {
        val accounts = interparkAccountGroupService.getPoolAccountsById(config.accountGroupId) {
            LoginAccount(it.email, it.password)
        }
        return Argument(
            proxy = proxyService.getProxyAsProxyConfig(config.proxyId),
            concurrency = config.concurrency,
            accounts = accounts,
            captchaHandler = config.captchaHandler,
            capSolverApiKey = systemSettingService.getSettingByName(SystemSettingName.CAP_SOLVER_KEY) {
                it.value
            },
        )
    }
}