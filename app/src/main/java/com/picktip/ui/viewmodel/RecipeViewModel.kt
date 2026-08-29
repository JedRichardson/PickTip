package com.picktip.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.picktip.data.api.SpoonacularApiService
import com.picktip.data.local.SavedRecipeDao
import com.picktip.data.models.Recipe
import com.picktip.data.models.SavedRecipe
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class RecipeViewModel(
    private val spoonacularApi: SpoonacularApiService,
    private val savedRecipeDao: SavedRecipeDao,
    private val apiKey: String
) : ViewModel() {

    private val _suggestedRecipes = MutableStateFlow<List<Recipe>>(emptyList())
    val suggestedRecipes: StateFlow<List<Recipe>> = _suggestedRecipes

    private val _breakfastSuggestions = MutableStateFlow<List<Recipe>>(emptyList())
    val breakfastSuggestions: StateFlow<List<Recipe>> = _breakfastSuggestions

    private val _snackSuggestions = MutableStateFlow<List<Recipe>>(emptyList())
    val snackSuggestions: StateFlow<List<Recipe>> = _snackSuggestions

    private val _recipeDetails = MutableStateFlow<Recipe?>(null)
    val recipeDetails: StateFlow<Recipe?> = _recipeDetails

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    val savedRecipes: StateFlow<List<SavedRecipe>> = savedRecipeDao.getSavedRecipes()
        .distinctUntilChanged()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun fetchSuggestions(diet: String?, minProtein: Int?, maxCalories: Int?, type: String?) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                // Fetch Main Courses
                val mainResponse = spoonacularApi.searchRecipes(
                    apiKey = apiKey,
                    diet = if (diet == "None") null else diet,
                    minProtein = minProtein,
                    maxCalories = maxCalories,
                    type = "main course"
                )
                _suggestedRecipes.value = mainResponse.results

                // Fetch Breakfast
                val breakfastResponse = spoonacularApi.searchRecipes(
                    apiKey = apiKey,
                    diet = if (diet == "None") null else diet,
                    type = "breakfast",
                    maxCalories = null,
                    minProtein = null,
                    number = 3
                )
                _breakfastSuggestions.value = breakfastResponse.results

                // Fetch Snacks
                val snackResponse = spoonacularApi.searchRecipes(
                    apiKey = apiKey,
                    diet = if (diet == "None") null else diet,
                    type = "snack",
                    maxCalories = null,
                    minProtein = null,
                    number = 3
                )
                _snackSuggestions.value = snackResponse.results

                if (mainResponse.results.isEmpty() && breakfastResponse.results.isEmpty()) {
                    _error.value = "No recipes found matching your preferences."
                }
            } catch (e: Exception) {
                _error.value = "Failed to fetch recipes: ${e.localizedMessage ?: e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun fetchRecipeDetails(id: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val recipe = spoonacularApi.getRecipeInformation(id, apiKey)
                _recipeDetails.value = recipe
            } catch (e: Exception) {
                _error.value = "Failed to fetch recipe details: ${e.localizedMessage ?: e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun toggleSaveRecipe(recipe: Recipe) {
        viewModelScope.launch {
            val isCurrentlySaved = savedRecipeDao.isSaved(recipe.id)
            if (isCurrentlySaved) {
                savedRecipeDao.removeRecipe(recipe.toSavedRecipe())
            } else {
                savedRecipeDao.saveRecipe(recipe.toSavedRecipe())
            }
        }
    }

    private fun Recipe.toSavedRecipe(): SavedRecipe {
        return SavedRecipe(
            id = id,
            title = title,
            image = image,
            summary = summary,
            readyInMinutes = readyInMinutes,
            servings = servings,
            calories = nutrition?.nutrients?.find { it.name == "Calories" }?.amount,
            protein = nutrition?.nutrients?.find { it.name == "Protein" }?.amount,
            carbs = nutrition?.nutrients?.find { it.name == "Carbohydrates" }?.amount,
            fat = nutrition?.nutrients?.find { it.name == "Fat" }?.amount
        )
    }

    suspend fun isRecipeSaved(id: Int): Boolean = savedRecipeDao.isSaved(id)
}
