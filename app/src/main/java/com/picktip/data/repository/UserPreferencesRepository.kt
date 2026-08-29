package com.picktip.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.picktip.data.models.UserGoals
import com.picktip.data.models.UserProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_prefs")

class UserPreferencesRepository(private val context: Context) {

    private object PreferencesKeys {
        val NAME = stringPreferencesKey("user_name")
        val DIETARY_PREFERENCE = stringPreferencesKey("dietary_preference")
        val GOAL_CALORIES = intPreferencesKey("goal_calories")
        val GOAL_PROTEIN = intPreferencesKey("goal_protein")
        val GOAL_CARBS = intPreferencesKey("goal_carbs")
        val GOAL_FAT = intPreferencesKey("goal_fat")
    }

    val userProfile: Flow<UserProfile> = context.dataStore.data.map { preferences ->
        UserProfile(
            name = preferences[PreferencesKeys.NAME] ?: "User",
            dietaryPreference = preferences[PreferencesKeys.DIETARY_PREFERENCE] ?: "None",
            goals = UserGoals(
                calories = preferences[PreferencesKeys.GOAL_CALORIES] ?: 2000,
                protein = preferences[PreferencesKeys.GOAL_PROTEIN] ?: 150,
                carbs = preferences[PreferencesKeys.GOAL_CARBS] ?: 200,
                fat = preferences[PreferencesKeys.GOAL_FAT] ?: 70
            )
        )
    }.distinctUntilChanged()

    suspend fun updateProfile(name: String, diet: String) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.NAME] = name
            preferences[PreferencesKeys.DIETARY_PREFERENCE] = diet
        }
    }

    suspend fun updateGoals(goals: UserGoals) {
        context.dataStore.edit { preferences ->
            preferences[PreferencesKeys.GOAL_CALORIES] = goals.calories
            preferences[PreferencesKeys.GOAL_PROTEIN] = goals.protein
            preferences[PreferencesKeys.GOAL_CARBS] = goals.carbs
            preferences[PreferencesKeys.GOAL_FAT] = goals.fat
        }
    }
}
