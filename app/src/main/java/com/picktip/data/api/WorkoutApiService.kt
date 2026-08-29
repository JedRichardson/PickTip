package com.picktip.data.api

import com.picktip.data.models.Exercise
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Query

interface WorkoutApiService {
    @GET("exercises")
    suspend fun getExercises(
        @Query("muscle") muscle: String,
        @Header("X-Api-Key") apiKey: String
    ): List<Exercise>
}
