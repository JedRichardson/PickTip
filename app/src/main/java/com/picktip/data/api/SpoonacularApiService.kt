package com.picktip.data.api

import com.picktip.data.models.Recipe
import com.squareup.moshi.JsonClass
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

@JsonClass(generateAdapter = true)
data class RecipeSearchResponse(
    val results: List<Recipe>
)

interface SpoonacularApiService {
    @GET("complexSearch")
    suspend fun searchRecipes(
        @Query("apiKey") apiKey: String,
        @Query("diet") diet: String?,
        @Query("maxCalories") maxCalories: Int?,
        @Query("minProtein") minProtein: Int?,
        @Query("type") type: String?,
        @Query("number") number: Int = 5,
        @Query("addRecipeInformation") addInfo: Boolean = true,
        @Query("addRecipeNutrition") addNutrition: Boolean = true
    ): RecipeSearchResponse

    @GET("{id}/information")
    suspend fun getRecipeInformation(
        @Path("id") id: Int,
        @Query("apiKey") apiKey: String,
        @Query("includeNutrition") includeNutrition: Boolean = true
    ): Recipe
}
