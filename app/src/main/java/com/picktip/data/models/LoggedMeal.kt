package com.picktip.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "meal_logs")
data class LoggedMeal(
    @PrimaryKey val logId: String,
    val foodId: String,
    val name: String,
    val calories: Double,
    val protein: Double,
    val carbs: Double,
    val fat: Double,
    val timestamp: Long,
    val quantity: Int,
    val isPlanned: Boolean = false
)
