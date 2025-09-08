package com.vecat.admin.remote.task

import com.vecat.admin.entity.SystemSettingName
import com.vecat.admin.entity.TaskCategory
import com.vecat.admin.entity.TaskName
import com.vecat.admin.remote.TaskArgumentBuilder
import com.vecat.admin.remote.task.InterparkBookingTaskArgumentBuilder.Argument
import com.vecat.admin.remote.task.InterparkBookingTaskArgumentBuilder.Config
import com.vecat.admin.service.InterparkAccountGroupService
import com.vecat.admin.service.InterparkPerformService
import com.vecat.admin.service.InterparkSeatRotatePoolService
import com.vecat.admin.service.ProxyConfig
import com.vecat.admin.service.ProxyService
import com.vecat.admin.service.SystemSettingService
import com.vecat.admin.service.WebHookService
import com.vecat.admin.service.WebhookDTO
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Component
class InterparkBookingTaskArgumentBuilder(
    val proxyService: ProxyService,
    val interparkPerformService: InterparkPerformService,
    val interparkAccountGroupService: InterparkAccountGroupService,
    val systemSettingService: SystemSettingService,
    val seatRotatePoolService: InterparkSeatRotatePoolService,
    val webHookService: WebHookService,
) : TaskArgumentBuilder<Config, Argument> {

    override val taskCategory: TaskCategory = TaskCategory.INTERPARK
    override val taskName: TaskName = TaskName.BOOKING
    override val configType: KClass<Config> = Config::class

    data class Config(
        val performId: Long,
        val presale: Boolean,
        val proxyId: Long,
        val captchaHandler: String,
        val accountGroupId: Long,
        val queueConcurrency: Long,
        val queueRequestInterval: Long,
        val bookingMode: String,
        val bookingConcurrency: Long,
        val bookingRequestInterval: Long,
        val seatRotatePoolId: Long?,
        val bookingRanges: List<BookingRange>,
    )

    data class Argument(
        val proxy: ProxyConfig,
        val presale: Boolean,
        val capSolverApiKey: String,
        val product: Product,
        val queueConfig: QueueConfig,
        val bookingConfig: BookingConfig,
        val accounts: List<BookingAccount>,
        val webhooks: List<WebhookDTO>,
    )

    data class Product(
        val code: String,
        val placeCode: String,
        val bizCode: String,
        val goodsBizCode: String,
        val languageType: String,
        val tmgsOrNot: String,
        val globalSportsYN: String,
        val rounds: List<ProductRound>,
        val blocks: List<ProductBlock>,
    )

    data class ProductRound(
        val playSequence: String,
        val playDate: String,
        val playTime: String,
    )

    data class ProductBlock(
        val code: String,
        val name: String,
    )

    data class QueueConfig(
        val concurrency: Long,
        val requestInterval: Long,
        val mode: String,
        val continueInterval: Long,
    )

    data class BookingConfig(
        val bookingMode: String,
        val concurrency: Long,
        val requestInterval: Long,
        val lockConcurrency: Long,
        val rotateSeats: List<SeatInfo>,
        val bookingRanges: List<BookingRange>,
    )

    data class BookingRange(
        val playSequence: String,
        val blocks: List<String>,
    )

    data class BookingAccount(
        val email: String,
        val cookie: String,
        val mc: String,
        val memberCode: String,
        val enterEncryptVal: String,
    )

    data class SeatInfo(
        val seatTitle: String,
        val seatJs: String,
        val playDate: String,
        val playSequence: String,
        val blockCode: String,
        val seatGrade: String,
        val floor: String,
        val rowNo: String,
        val seatNo: String,
        val seatGradeName: String,
    )

    override fun build(config: Config): Argument {
        val product = interparkPerformService.getById(config.performId) {
            Product(
                code = it.performCode,
                placeCode = it.placeCode,
                bizCode = it.bizCode,
                goodsBizCode = it.goodsBizCode,
                languageType = "G2001",
                tmgsOrNot = "D2003",
                globalSportsYN = "N",
                rounds = it.rounds.map { round ->
                    ProductRound(
                        playSequence = round.sequence,
                        playDate = round.date,
                        playTime = round.time,
                    )
                },
                blocks = it.blocks.map { block ->
                    ProductBlock(
                        code = block.code,
                        name = block.name,
                    )
                },
            )
        }

        val rotateSeats = if (config.seatRotatePoolId != null) {
            seatRotatePoolService.getById(config.seatRotatePoolId) {
                it.items.map { item ->
                    SeatInfo(
                        seatTitle = "",
                        seatJs = "",
                        playDate = item.round.date,
                        playSequence = item.round.sequence,
                        blockCode = item.block.code,
                        seatGrade = item.seatGrade,
                        floor = item.floor,
                        rowNo = item.rowNo,
                        seatNo = item.seatNo,
                        seatGradeName = item.seatGradeName,
                    )
                }
            }
        } else {
            listOf()
        }

        return Argument(
            proxy = proxyService.getProxyAsProxyConfig(config.proxyId),
            presale = config.presale,
            capSolverApiKey = systemSettingService.getSettingByName(SystemSettingName.CAP_SOLVER_KEY) {
                it.value
            },
            product = product,
            queueConfig = QueueConfig(
                concurrency = config.queueConcurrency,
                requestInterval = config.queueRequestInterval,
                mode = "STANDARD",
                continueInterval = 100,
            ),
            bookingConfig = BookingConfig(
                bookingMode = config.bookingMode,
                concurrency = config.bookingConcurrency,
                requestInterval = config.bookingRequestInterval,
                lockConcurrency = 2,
                rotateSeats = rotateSeats,
                bookingRanges = config.bookingRanges.map {
                    BookingRange(
                        playSequence = it.playSequence,
                        blocks = it.blocks,
                    )
                },
            ),
            accounts = interparkAccountGroupService.getPoolAccountsById(config.accountGroupId) {
                BookingAccount(
                    email = it.email,
                    cookie = it.cookie ?: "",
                    mc = it.mc ?: "",
                    memberCode = it.memberCode ?: "",
                    enterEncryptVal = it.enterEncryptVal ?: "",
                )
            },
            webhooks = webHookService.getAll {
                WebhookDTO(
                    name = this.name,
                    type = this.type,
                    url = this.url,
                    method = this.method,
                    body = this.body,
                )
            }
        )
    }
}