package com.picktip.data.models

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Recipe(
    val id: Int,
    val title: String,
    val image: String,
    val summary: String? = null,
    val readyInMinutes: Int? = null,
    val servings: Int? = null,
    val nutrition: Nutrition? = null,
    val extendedIngredients: List<RecipeIngredient>? = null
)

@JsonClass(generateAdapter = true)
data class RecipeIngredient(
    val id: Int?,
    val name: String,
    val amount: Double,
    val unit: String,
    val original: String,
    val aisle: String? = null
)

@JsonClass(generateAdapter = true)
data class Nutrition(
    val nutrients: List<Nutrient>
)

@JsonClass(generateAdapter = true)
data class Nutrient(
    val name: String,
    val amount: Double,
    val unit: String
)
