package com.vecat.admin.controller

import com.fasterxml.jackson.annotation.JsonFormat
import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/node")
class NodeController {

  enum class NodeStatus {
    ONLINE,
    OFFLINE,
  }

  data class NodeView(
    val id: String,
    val name: String,
    val host: String,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    val onlineTime: LocalDateTime,
    val status: NodeStatus,
  )

  @GetMapping
  fun getAllNode(): ResponseData<List<NodeView>> {
    val list = listOf(
      NodeView(
        "111",
        "test1",
        "192.168.0.111",
        LocalDateTime.now(),
        NodeStatus.ONLINE,
      ),
      NodeView(
        "111",
        "test2",
        "192.168.0.111",
        LocalDateTime.now(),
        NodeStatus.ONLINE,
      ),
      NodeView(
        "111",
        "test3",
        "192.168.0.111",
        LocalDateTime.now(),
        NodeStatus.ONLINE,
      ),
      NodeView(
        "111",
        "test4",
        "192.168.0.111",
        LocalDateTime.now(),
        NodeStatus.OFFLINE,
      )
    )
    return ResponseData(code = StatusCode.SUCCESS, list)
  }
}