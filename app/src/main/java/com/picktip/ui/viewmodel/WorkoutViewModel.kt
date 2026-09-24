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

@Suppress("unused")
class WorkoutViewModel(
    private val workoutDao: WorkoutDao,
    private val savedWorkoutDao: SavedWorkoutDao,
    private val workoutApi: WorkoutApiService,
    private val apiKey: String,
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

    private val _isLoading = MutableStateFlow(value = false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun fetchExercises(muscle: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            _exercises.value = emptyList()
            val local = getFallbackExercises(muscle)
            try {
                val result = workoutApi.getExercises(muscle, apiKey)
                if (result.isNotEmpty()) {
                    val combined = (local + result).distinctBy { it.name.lowercase(Locale.getDefault()) }
                    _exercises.value = combined
                } else {
                    _exercises.value = local
                }
            } catch (_: Exception) {
                _exercises.value = local
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
            val local = getFallbackExercises(muscle)
            try {
                val exercisesList = workoutApi.getExercises(muscle, apiKey)
                val combined = (local + exercisesList).distinctBy { it.name.lowercase(Locale.getDefault()) }
                _currentWorkout.value = combined.random()
            } catch (_: Exception) {
                _currentWorkout.value = local.random()
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun toggleSaveWorkout(workout: SavedWorkout) {
        viewModelScope.launch {
            val exists = savedWorkouts.value.any { it.id == workout.id }
            if (exists) {
                savedWorkoutDao.removeWorkout(workout)
            } else {
                savedWorkoutDao.saveWorkout(workout)
            }
        }
    }

    fun isWorkoutSaved(id: String): Flow<Boolean> {
        return savedWorkouts.map { list -> list.any { it.id == id } }
    }

    private fun getFallbackExercises(muscle: String): List<Exercise> {
        val list = listOf(
            // LOWER BODY ("quadriceps")
            Exercise(
                name = "Heavy Barbell Squats (5x5)",
                type = "strength",
                muscle = "quadriceps",
                equipment = "Barbell",
                difficulty = "expert",
                instructions = "Perform 5 sets of 5 reps with heavy barbell weight, breaking parallel at bottom.",
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
            ),

            // UPPER BODY / ARMS ("biceps" / "triceps")
            Exercise(
                name = "Weighted Parallel Bar Dips",
                type = "strength",
                muscle = "biceps",
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
                name = "Diamond Push-Ups to Failure",
                type = "strength",
                muscle = "biceps",
                equipment = "Bodyweight",
                difficulty = "intermediate",
                instructions = "Place hands together in a diamond shape under chest and press to lockout."
            ),
            Exercise(
                name = "Standing Dumbbell Bicep Curls",
                type = "strength",
                muscle = "biceps",
                equipment = "Dumbbells",
                difficulty = "beginner",
                instructions = "Stand tall with dumbbells at sides. Supinate wrists as you curl up toward shoulders."
            ),

            // CHEST DAY ("chest")
            Exercise(
                name = "Heavy Barbell Bench Press",
                type = "strength",
                muscle = "chest",
                equipment = "Barbell",
                difficulty = "expert",
                instructions = "Unrack heavy barbell, lower smoothly to sternum, and press vertically to lockout."
            ),
            Exercise(
                name = "Heavy Incline Dumbbell Press",
                type = "strength",
                muscle = "chest",
                equipment = "Dumbbells",
                difficulty = "expert",
                instructions = "Set bench to 30 degrees incline. Press dumbbells vertically, squeezing upper chest."
            ),
            Exercise(
                name = "Cable Chest Flyes",
                type = "strength",
                muscle = "chest",
                equipment = "Cable Machine",
                difficulty = "intermediate",
                instructions = "Bring cable handles together in a hugging arc across chest, holding peak contraction."
            ),
            Exercise(
                name = "Push-Ups & Pec Stretch",
                type = "strength",
                muscle = "chest",
                equipment = "Bodyweight",
                difficulty = "beginner",
                instructions = "Controlled bodyweight push-ups maintaining rigid plank form, followed by chest stretches."
            ),

            // BACK & PULL ("lats")
            Exercise(
                name = "Heavy Barbell Bent-Over Rows",
                type = "strength",
                muscle = "lats",
                equipment = "Barbell",
                difficulty = "expert",
                instructions = "Hinge forward at hips with flat back and pull barbell to lower abdomen, squeezing lats."
            ),
            Exercise(
                name = "Weighted Pull-Ups",
                type = "strength",
                muscle = "lats",
                equipment = "Dip Belt",
                difficulty = "expert",
                instructions = "Attach plate to dip belt, grab pull-up bar overhead, and pull chest to bar."
            ),
            Exercise(
                name = "Lat Pulldowns & Cable Rows",
                type = "strength",
                muscle = "lats",
                equipment = "Cable Machine",
                difficulty = "intermediate",
                instructions = "Pull wide bar down to upper chest keeping torso upright and engaging lats."
            ),
            Exercise(
                name = "Inverted Rows & Back Extensions",
                type = "strength",
                muscle = "lats",
                equipment = "Bodyweight",
                difficulty = "beginner",
                instructions = "Hang beneath low bar and pull chest to bar with straight body alignment."
            ),

            // SHOULDERS ("traps")
            Exercise(
                name = "Overhead Barbell Military Press",
                type = "strength",
                muscle = "traps",
                equipment = "Barbell",
                difficulty = "expert",
                instructions = "Press heavy barbell vertically from clavicles to full lockout overhead."
            ),
            Exercise(
                name = "Heavy Dumbbell Shoulder Press",
                type = "strength",
                muscle = "traps",
                equipment = "Dumbbells",
                difficulty = "expert",
                instructions = "Press heavy dumbbells overhead from ear level, squeezing shoulders at top."
            ),
            Exercise(
                name = "Dumbbell Lateral & Front Raises",
                type = "strength",
                muscle = "traps",
                equipment = "Dumbbells",
                difficulty = "intermediate",
                instructions = "Raise dumbbells out to sides until parallel with shoulders, controlling eccentric movement."
            ),
            Exercise(
                name = "Light Shoulder Press & Arm Circles",
                type = "strength",
                muscle = "traps",
                equipment = "Bodyweight / Light Weights",
                difficulty = "beginner",
                instructions = "Controlled light pressing overhead followed by warm-up arm circles for shoulder mobility."
            ),

            // CORE & ABS ("abdominals")
            Exercise(
                name = "Standing Ab Wheel Rollouts",
                type = "strength",
                muscle = "abdominals",
                equipment = "Ab Wheel",
                difficulty = "expert",
                instructions = "Roll ab wheel forward from standing position until parallel with floor and retract."
            ),
            Exercise(
                name = "Hanging Toes-to-Bar Raises",
                type = "strength",
                muscle = "abdominals",
                equipment = "Pull-Up Bar",
                difficulty = "expert",
                instructions = "Hang from bar. Without swinging, drive toes straight up to touch the bar, then lower."
            ),
            Exercise(
                name = "Plank to Elbow Push-Ups",
                type = "strength",
                muscle = "abdominals",
                equipment = "Bodyweight",
                difficulty = "intermediate",
                instructions = "Transition from forearm plank to high plank alternating leading hands while keeping core tight."
            ),
            Exercise(
                name = "Gentle Crunches & Bicycle Kicks",
                type = "strength",
                muscle = "abdominals",
                equipment = "Bodyweight",
                difficulty = "beginner",
                instructions = "Perform controlled crunches followed by slow bicycle kicks driving opposite elbow toward knee."
            ),

            // FULL BODY ("fullbody")
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
                name = "Kettlebell Swings & Thrusters",
                type = "strength",
                muscle = "fullbody",
                equipment = "Kettlebell",
                difficulty = "intermediate",
                instructions = "Hinge hips for explosive swings, followed by deep front squats pressing overhead."
            ),
            Exercise(
                name = "Jumping Jacks & Bodyweight Circuit",
                type = "strength",
                muscle = "fullbody",
                equipment = "Bodyweight",
                difficulty = "beginner",
                instructions = "Alternate between jumping jacks, high knees, and light bodyweight squats."
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
                    timestamp = ts,
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
