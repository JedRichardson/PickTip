package com.picktip.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "saved_recipes")
data class SavedRecipe(
    @PrimaryKey val id: Int,
    val title: String,
    val image: String,
    val summary: String?,
    val readyInMinutes: Int?,
    val servings: Int?,
    val calories: Double?,
    val protein: Double?,
    val carbs: Double?,
    val fat: Double?,
    val timestamp: Long = System.currentTimeMillis()
)
