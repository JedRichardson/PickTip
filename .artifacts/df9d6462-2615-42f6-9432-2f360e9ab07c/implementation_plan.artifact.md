# Implementation Plan - Kotlin Native Migration 🚀

Migrate the entire PickTip feature set from React Native (TypeScript) to Native Android (Kotlin & Jetpack Compose). This will resolve environment-related testing issues by providing a standard Android project that runs directly in Android Studio.

## Proposed Changes

### 1. Project Infrastructure (Kotlin Setup)
- **Gradle Initialization**: Create `build.gradle`, `settings.gradle`, and `app/build.gradle`.
- **Dependencies**:
    - **UI**: Jetpack Compose, Material 3, Navigation Compose.
    - **Network**: Retrofit & Moshi (for API Ninjas and Spoonacular).
    - **Local Storage**: Room Persistence Library (replacing AsyncStorage).
    - **Media**: Coil (Images), Lottie (Animations), ExoPlayer (Audio).
    - **Architecture**: ViewModel & LiveData/StateFlow.

### 2. Data & Logic Layer (Unison)
#### [NEW] Data Models (`com.picktip.data.models`)
- Recreate `Exercise`, `Recipe`, `LoggedMeal`, `LoggedWorkout`, `Ingredient`, and `UserProfile` classes in Kotlin.
#### [NEW] API Services (`com.picktip.data.api`)
- Implement `WorkoutApiService` (API Ninjas) and `SpoonacularApiService` with the centralized keys.
#### [NEW] Local Database (`com.picktip.data.local`)
- Create Room entities and DAOs for Meals, Workouts, and the Shopping List.

### 3. UI Re-implementation (Jetpack Compose)
#### [NEW] Main Screens (`com.picktip.ui.screens`)
- **Dashboard**: Features the Streak Heatmap (custom canvas), Macro Balance Bar, and Smart Suggestions.
- **WorkoutSession**: Active timer, Lottie animation, and completion celebration.
- **RecipeDetails**: Dynamic scaling logic and "Add to Shopping List" functionality.
- **SavedCollection**: Tabbed view for favorite meals and workouts.
- **Settings**: Profile configuration and the "🚀 Load Showcase Data" button.

### 4. Audio & Animations
- Port the Lottie animations and layered celebration sounds (Tap, Victory, Crowd) to the native Android equivalents.

## Why this fixes testing issues
- **Native Execution**: No dependency on Expo Go or Node.js versions on your local machine.
- **Android Studio Native**: You can use the standard Android Studio "Run" button and debugger.
- **Single AVD Support**: Works natively with any standard Android Virtual Device.

## Verification Plan
1. **API Integration**: Verify workouts and recipes load correctly via Retrofit.
2. **Persistence**: Save a meal, restart the app, and ensure it's still in the history.
3. **Core Loop**: "Pick Workout" -> "Timer" -> "Confetti" -> "Nutrition" should flow seamlessly.
4. **Showcase Ready**: Tap "Load Showcase Data" and verify the dashboard is fully populated.
