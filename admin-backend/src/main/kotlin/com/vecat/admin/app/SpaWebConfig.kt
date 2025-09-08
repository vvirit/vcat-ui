package com.vecat.admin.app

import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver
import java.util.*

@Configuration
class SpaWebConfig : WebMvcConfigurer {

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            .resourceChain(true)
            .addResolver(object : PathResourceResolver() {
                override fun getResource(resourcePath: String, location: org.springframework.core.io.Resource): org.springframework.core.io.Resource? {
                    // 1) 先按正常静态资源查找
                    val requested = super.getResource(resourcePath, location)
                    if (requested != null && requested.exists()) return requested

                    // 2) 过滤 API、Actuator 等后端路由，不回退到 index.html
                    val path = resourcePath.lowercase(Locale.getDefault())
                    val isApi = path.startsWith("api/") || path.startsWith("actuator/")
                    val looksLikeFile = path.contains(".") // 有扩展名就当成文件，返回 404
                    if (isApi || looksLikeFile) return null

                    // 3) 其他前端路由一律回退到 index.html
                    return ClassPathResource("/static/index.html")
                }
            })
    }
}
