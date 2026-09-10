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

@Suppress("unused", "CanBeParameter")
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
                if (result.isNotEmpty()) {
                    _exercises.value = result
                } else {
                    _exercises.value = getFallbackExercises(muscle)
                }
            } catch (_: Exception) {
                _exercises.value = getFallbackExercises(muscle)
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
            _currentWorkout.value = null
            try {
                val exercisesList = workoutApi.getExercises(muscle, apiKey)
                if (exercisesList.isNotEmpty()) {
                    _currentWorkout.value = exercisesList.random()
                } else {
                    _currentWorkout.value = getFallbackExercises(muscle).random()
                }
            } catch (_: Exception) {
                _currentWorkout.value = getFallbackExercises(muscle).random()
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun getFallbackExercises(muscle: String): List<Exercise> {
        val list = listOf(
            Exercise(
                name = "Heavy Barbell Squats (5x5)",
                type = "strength",
                muscle = "quadriceps",
                equipment = "Barbell",
                difficulty = "expert",
                instructions = "Perform 5 sets of 5 reps with heavy barbell weight, breaking parallel at bottom."
            ),
            Exercise(
                name = "Single-Leg Pistol Squats",
                type = "strength",
                muscle = "quadriceps",
                equipment = "Bodyweight",
                difficulty = "expert",
                instructions = "Unilateral squat on standing leg with opposite leg extended parallel to floor."
            ),
            Exercise(
                name = "Weighted Parallel Bar Dips",
                type = "strength",
                muscle = "triceps",
                equipment = "Dip Belt",
                difficulty = "expert",
                instructions = "Lower body on parallel bars with weighted belt to 90 degrees and press forcefully to lockout."
            ),
            Exercise(
                name = "Heavy Preacher Barbell Curls",
                type = "strength",
                muscle = "biceps",
                equipment = "EZ-Bar",
                difficulty = "expert",
                instructions = "Rest upper arms flat on preacher pad and curl heavy EZ-Bar with strict form."
            ),
            Exercise(
                name = "Standing Ab Wheel Rollouts",
                type = "strength",
                muscle = "abdominals",
                equipment = "Ab Wheel",
                difficulty = "expert",
                instructions = "Roll ab wheel forward from standing position until parallel with floor and retract."
            ),
            Exercise(
                name = "Barbell Clean & Overhead Press",
                type = "strength",
                muscle = "fullbody",
                equipment = "Barbell",
                difficulty = "expert",
                instructions = "Explosively clean barbell to shoulders and press overhead with hip drive."
            ),
            Exercise(
                name = "Dumbbell Devil Presses",
                type = "strength",
                muscle = "fullbody",
                equipment = "Dumbbells",
                difficulty = "expert",
                instructions = "Perform burpee on dumbbells, jump up, and snatch dumbbells overhead in one continuous motion."
            ),
            Exercise(
                name = "Walking Dumbbell Lunges",
                type = "strength",
                muscle = "quadriceps",
                equipment = "Dumbbells",
                difficulty = "intermediate",
                instructions = "Step forward into a deep lunge keeping front knee over ankle."
            ),
            Exercise(
                name = "Bodyweight Squats & Calf Raises",
                type = "strength",
                muscle = "quadriceps",
                equipment = "Bodyweight",
                difficulty = "beginner",
                instructions = "Perform controlled bodyweight squats followed by rising onto toes at the top."
            )
        )
        val filtered = list.filter { it.muscle.equals(muscle, ignoreCase = true) }
        return filtered.ifEmpty { list }
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
