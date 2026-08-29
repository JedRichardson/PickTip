package com.picktip.data.local

import androidx.room.*
import com.picktip.data.models.*
import kotlinx.coroutines.flow.Flow

@Dao
interface MealDao {
    @Query("SELECT * FROM meal_logs ORDER BY timestamp DESC")
    fun getAllMeals(): Flow<List<LoggedMeal>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeal(meal: LoggedMeal)

    @Delete
    suspend fun deleteMeal(meal: LoggedMeal)

    @Query("DELETE FROM meal_logs")
    suspend fun deleteAll()
}

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM workout_logs ORDER BY timestamp DESC")
    fun getAllWorkouts(): Flow<List<LoggedWorkout>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkout(workout: LoggedWorkout)

    @Delete
    suspend fun deleteWorkout(workout: LoggedWorkout)

    @Query("DELETE FROM workout_logs")
    suspend fun deleteAll()
}

@Dao
interface SavedWorkoutDao {
    @Query("SELECT * FROM saved_workouts")
    fun getSavedWorkouts(): Flow<List<SavedWorkout>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveWorkout(workout: SavedWorkout)

    @Delete
    suspend fun removeWorkout(workout: SavedWorkout)

    @Query("SELECT EXISTS(SELECT 1 FROM saved_workouts WHERE id = :id)")
    suspend fun isSaved(id: String): Boolean
}

@Dao
interface ShoppingListDao {
    @Query("SELECT * FROM shopping_list")
    fun getIngredients(): Flow<List<Ingredient>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIngredients(ingredients: List<Ingredient>)

    @Update
    suspend fun updateIngredient(ingredient: Ingredient)

    @Delete
    suspend fun deleteIngredient(ingredient: Ingredient)

    @Query("DELETE FROM shopping_list")
    suspend fun clearAll()

    @Query("DELETE FROM shopping_list WHERE checked = 1")
    suspend fun deleteChecked()
}

@Dao
interface SavedRecipeDao {
    @Query("SELECT * FROM saved_recipes ORDER BY timestamp DESC")
    fun getSavedRecipes(): Flow<List<SavedRecipe>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveRecipe(recipe: SavedRecipe)

    @Delete
    suspend fun removeRecipe(recipe: SavedRecipe)

    @Query("SELECT EXISTS(SELECT 1 FROM saved_recipes WHERE id = :id)")
    suspend fun isSaved(id: Int): Boolean
}
