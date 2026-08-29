package com.picktip.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.picktip.data.local.ShoppingListDao
import com.picktip.data.models.Ingredient
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ShoppingListViewModel(private val shoppingListDao: ShoppingListDao) : ViewModel() {

    val ingredients: StateFlow<List<Ingredient>> = shoppingListDao.getIngredients()
        .distinctUntilChanged()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addIngredients(newIngredients: List<Ingredient>) {
        viewModelScope.launch {
            shoppingListDao.insertIngredients(newIngredients)
        }
    }

    fun toggleIngredient(ingredient: Ingredient) {
        viewModelScope.launch {
            shoppingListDao.updateIngredient(ingredient.copy(checked = !ingredient.checked))
        }
    }

    fun removeIngredient(ingredient: Ingredient) {
        viewModelScope.launch {
            shoppingListDao.deleteIngredient(ingredient)
        }
    }

    fun clearList() {
        viewModelScope.launch {
            shoppingListDao.clearAll()
        }
    }

    fun clearChecked() {
        viewModelScope.launch {
            shoppingListDao.deleteChecked()
        }
    }
}
