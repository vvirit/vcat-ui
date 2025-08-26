package com.vecat.admin.controller

import com.vecat.admin.base.ResponseData
import com.vecat.admin.constant.StatusCode
import com.vecat.admin.service.NodeService
import com.vecat.admin.service.NodeService.NodeInfo
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/node")
class NodeController(
    val nodeService: NodeService,
) {

    @GetMapping("/list")
    fun getAllNode(): ResponseData<List<NodeInfo>> {
        return ResponseData(code = StatusCode.SUCCESS, nodeService.getAllNodes())
    }
}