package com.vecat.admin.controller

import com.vecat.admin.remote.NodeService
import com.vecat.admin.remote.NodeService.DispatchTaskDTO
import com.vecat.admin.remote.NodeService.NodeInfo
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/node")
class NodeController(
    val nodeService: NodeService,
) {

    @GetMapping("/list")
    fun getAllNode(): List<NodeInfo> {
        return nodeService.getAllNodes()
    }

    @PostMapping("/run-task")
    fun runTask(@RequestBody dto: DispatchTaskDTO) {
        nodeService.dispatchTask(dto)
    }
}