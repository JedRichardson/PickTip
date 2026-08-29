package com.picktip.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.picktip.data.api.WorkoutApiService
import com.picktip.data.local.SavedWorkoutDao
import com.picktip.data.local.WorkoutDao
import com.picktip.data.models.Exercise
import com.picktip.data.models.LoggedWorkout
import com.picktip.data.models.SavedWorkout
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.*

class WorkoutViewModel(
    private val workoutDao: WorkoutDao,
    private val savedWorkoutDao: SavedWorkoutDao,
    private val workoutApi: WorkoutApiService,
    private val apiKey: String
) : ViewModel() {

    val workoutLogs: StateFlow<List<LoggedWorkout>> = workoutDao.getAllWorkouts()
        .distinctUntilChanged()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val savedWorkouts: StateFlow<List<SavedWorkout>> = savedWorkoutDao.getSavedWorkouts()
        .distinctUntilChanged()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _currentWorkout = MutableStateFlow<Exercise?>(null)
    val currentWorkout: StateFlow<Exercise?> = _currentWorkout

    private val _exercises = MutableStateFlow<List<Exercise>>(emptyList())
    val exercises: StateFlow<List<Exercise>> = _exercises

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun fetchExercises(muscle: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            _exercises.value = emptyList()
            try {
                val result = workoutApi.getExercises(muscle, apiKey)
                _exercises.value = result
                if (result.isEmpty()) {
                    _error.value = "No exercises found for $muscle."
                }
            } catch (e: Exception) {
                _error.value = "Failed to fetch: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun selectWorkout(exercise: Exercise) {
        _currentWorkout.value = exercise
    }

    fun fetchWorkout(muscle: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            _currentWorkout.value = null // Reset current workout
            try {
                android.util.Log.d("WorkoutViewModel", "Fetching workouts for muscle: $muscle")
                val exercises = workoutApi.getExercises(muscle, apiKey)
                android.util.Log.d("WorkoutViewModel", "Received ${exercises.size} exercises")
                if (exercises.isNotEmpty()) {
                    _currentWorkout.value = exercises.random()
                } else {
                    _error.value = "No exercises found for $muscle."
                }
            } catch (e: Exception) {
                android.util.Log.e("WorkoutViewModel", "Error fetching exercises", e)
                _error.value = "Failed to fetch exercises: ${e.localizedMessage ?: e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun logWorkout(workout: LoggedWorkout) {
        viewModelScope.launch {
            workoutDao.insertWorkout(workout)
        }
    }

    fun removeWorkout(workout: LoggedWorkout) {
        viewModelScope.launch {
            workoutDao.deleteWorkout(workout)
        }
    }

    fun loadDemoData() {
        viewModelScope.launch {
            val random = Random()
            val names = listOf("Morning Run", "Full Body Power", "Core Blast", "Leg Day")
            for (i in 0 until 7) {
                val calendar = Calendar.getInstance()
                calendar.add(Calendar.DAY_OF_YEAR, -i)
                val ts = calendar.timeInMillis

                val workout = LoggedWorkout(
                    id = UUID.randomUUID().toString(),
                    name = names[i % names.size],
                    duration = "30:00",
                    calories = 300 + random.nextInt(200),
                    intensity = "High",
                    timestamp = ts
                )
                workoutDao.insertWorkout(workout)
            }
        }
    }

    fun clearAllData() {
        viewModelScope.launch {
            workoutDao.deleteAll()
        }
    }
}
