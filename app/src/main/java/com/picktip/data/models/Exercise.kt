package com.picktip.data.models

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Exercise(
    val name: String = "Exercise",
    val type: String? = null,
    val muscle: String? = null,
    val equipment: String? = null,
    val difficulty: String = "Medium",
    val instructions: String = "No instructions provided."
)
