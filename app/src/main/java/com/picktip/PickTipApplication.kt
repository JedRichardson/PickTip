package com.picktip

import android.app.Application
import androidx.room.Room
import com.picktip.data.api.SpoonacularApiService
import com.picktip.data.api.WorkoutApiService
import com.picktip.data.local.AppDatabase
import com.picktip.data.repository.UserPreferencesRepository
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

class PickTipApplication : Application() {
    
    lateinit var database: AppDatabase
    lateinit var workoutApi: WorkoutApiService
    lateinit var spoonacularApi: SpoonacularApiService
    lateinit var userPrefs: UserPreferencesRepository

    override fun onCreate() {
        super.onCreate()
        
        userPrefs = UserPreferencesRepository(this)
        
        database = Room.databaseBuilder(
            this,
            AppDatabase::class.java,
            "picktip-db"
        )
            .fallbackToDestructiveMigration()
            .build()

        val moshi = Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()

        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.HEADERS
        }
        val client = OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()

        val retrofitWorkout = Retrofit.Builder()
            .baseUrl("https://api.api-ninjas.com/v1/")
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
        
        workoutApi = retrofitWorkout.create(WorkoutApiService::class.java)

        val retrofitSpoon = Retrofit.Builder()
            .baseUrl("https://api.spoonacular.com/recipes/")
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
        
        spoonacularApi = retrofitSpoon.create(SpoonacularApiService::class.java)
    }
}
