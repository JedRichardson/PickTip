package com.picktip.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "workout_logs")
data class LoggedWorkout(
    @PrimaryKey val id: String,
    val name: String,
    val duration: String,
    val calories: Int,
    val intensity: String,
    val timestamp: Long
)
