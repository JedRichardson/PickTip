package com.picktip.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.picktip.PickTipApplication

class ViewModelFactory(
    private val application: PickTipApplication
) : ViewModelProvider.Factory {
    
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(MealLogViewModel::class.java) -> {
                MealLogViewModel(application.database.mealDao()) as T
            }
            modelClass.isAssignableFrom(WorkoutViewModel::class.java) -> {
                WorkoutViewModel(
                    application.database.workoutDao(),
                    application.database.savedWorkoutDao(),
                    application.workoutApi,
                    "SkBU3mf8WLH2z6ClFSuH9T4qURvqgFYcFpf5ch2a" // Fixed key for now
                ) as T
            }
            modelClass.isAssignableFrom(ShoppingListViewModel::class.java) -> {
                ShoppingListViewModel(application.database.shoppingListDao()) as T
            }
            modelClass.isAssignableFrom(RecipeViewModel::class.java) -> {
                RecipeViewModel(
                    application.spoonacularApi,
                    application.database.savedRecipeDao(),
                    "2a32d4012603465f97c73a407c55ccef" // Fixed key
                ) as T
            }
            else -> throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}
