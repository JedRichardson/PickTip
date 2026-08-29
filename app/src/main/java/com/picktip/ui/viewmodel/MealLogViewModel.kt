package com.picktip.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.picktip.data.local.MealDao
import com.picktip.data.models.LoggedMeal
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.*

class MealLogViewModel(private val mealDao: MealDao) : ViewModel() {

    val mealLogs: StateFlow<List<LoggedMeal>> = mealDao.getAllMeals()
        .distinctUntilChanged()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val dailyTotals: StateFlow<DailyTotals> = mealLogs.map { logs ->
        val today = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis

        val todayLogs = logs.filter { it.timestamp >= today && !it.isPlanned }
        val plannedLogs = logs.filter { it.timestamp >= today && it.isPlanned }

        var calories = 0.0
        var protein = 0.0
        var carbs = 0.0
        var fat = 0.0
        todayLogs.forEach {
            calories += it.calories
            protein += it.protein
            carbs += it.carbs
            fat += it.fat
        }

        var plannedCalories = 0.0
        plannedLogs.forEach { plannedCalories += it.calories }

        DailyTotals(
            calories = calories,
            protein = protein,
            carbs = carbs,
            fat = fat,
            projectedCalories = calories + plannedCalories
        )
    }.flowOn(Dispatchers.Default)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DailyTotals())

    fun logMeal(meal: LoggedMeal) {
        viewModelScope.launch {
            mealDao.insertMeal(meal)
        }
    }

    fun removeMeal(meal: LoggedMeal) {
        viewModelScope.launch {
            mealDao.deleteMeal(meal)
        }
    }

    fun loadDemoData() {
        viewModelScope.launch {
            val random = Random()
            for (i in 0 until 7) {
                val calendar = Calendar.getInstance()
                calendar.add(Calendar.DAY_OF_YEAR, -i)
                val ts = calendar.timeInMillis

                val meal = LoggedMeal(
                    logId = UUID.randomUUID().toString(),
                    foodId = "demo",
                    name = "Showcase Balanced Meal",
                    calories = 600.0 + random.nextDouble() * 200,
                    protein = 30.0 + random.nextDouble() * 10,
                    carbs = 50.0 + random.nextDouble() * 20,
                    fat = 20.0 + random.nextDouble() * 5,
                    timestamp = ts,
                    quantity = 1,
                    isPlanned = false
                )
                mealDao.insertMeal(meal)
            }
        }
    }

    fun clearAllData() {
        viewModelScope.launch {
            mealDao.deleteAll()
        }
    }
}

data class DailyTotals(
    val calories: Double = 0.0,
    val protein: Double = 0.0,
    val carbs: Double = 0.0,
    val fat: Double = 0.0,
    val projectedCalories: Double = 0.0
)
