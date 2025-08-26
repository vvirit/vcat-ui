package com.vecat.admin.task.definition


data class TaskDefinition(
    val id: String,
    val name: String,
    val description: String,
    val fields: List<TaskDefinitionField>,
    val subList: List<TaskDefinitionSubList>,
)

enum class TaskDefinitionFieldType {
    BOOLEAN,
    INT,
    FLOAT,
    STRING,
}

data class TaskDefinitionField(
    val name: String,
    val label: String,
    val description: String,
)

data class TaskDefinitionSubList(
    val name: String,
    val label: String,
    val description: String,
    val fields: List<TaskDefinitionField>,
)