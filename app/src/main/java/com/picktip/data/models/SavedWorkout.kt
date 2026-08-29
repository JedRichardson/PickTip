package com.picktip.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "saved_workouts")
data class SavedWorkout(
    @PrimaryKey val id: String,
    val name: String,
    val type: String,
    val muscle: String,
    val equipment: String,
    val difficulty: String,
    val instructions: String,
    val category: String
)
