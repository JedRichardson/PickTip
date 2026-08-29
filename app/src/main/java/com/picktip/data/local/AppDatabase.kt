package com.picktip.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.picktip.data.models.*

@Database(
    entities = [
        LoggedMeal::class,
        LoggedWorkout::class,
        SavedWorkout::class,
        Ingredient::class,
        SavedRecipe::class
    ],
    version = 3
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun mealDao(): MealDao
    abstract fun workoutDao(): WorkoutDao
    abstract fun savedWorkoutDao(): SavedWorkoutDao
    abstract fun shoppingListDao(): ShoppingListDao
    abstract fun savedRecipeDao(): SavedRecipeDao
}
