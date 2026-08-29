package com.picktip.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "shopping_list")
data class Ingredient(
    @PrimaryKey val id: String,
    val name: String,
    val amount: Double? = null,
    val unit: String? = null,
    val original: String,
    val checked: Boolean = false,
    val category: String,
    val aisle: String? = null
)
