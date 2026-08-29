# Project Perfection Implementation Plan

Comprehensive update to the PickTip Android app to ensure parity with previous work, fix API integrations, and complete feature implementations.

## Proposed Changes

### [Data Layer]

#### [NEW] [SavedRecipe.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/data/models/SavedRecipe.kt)
Create a new entity for saving recipes from the Spoonacular API.

#### [MODIFY] [DAOs.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/data/local/DAOs.kt)
Add `SavedRecipeDao` to manage saved recipes.

#### [MODIFY] [AppDatabase.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/data/local/AppDatabase.kt)
Include `SavedRecipe` and `SavedRecipeDao`.

---

### [ViewModel Layer]

#### [MODIFY] [RecipeViewModel.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/viewmodel/RecipeViewModel.kt)
Add logic for saving/unsaving recipes and checking if a recipe is saved.

#### [MODIFY] [MealLogViewModel.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/viewmodel/MealLogViewModel.kt)
Add `clearAllData()` method.

#### [MODIFY] [WorkoutViewModel.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/viewmodel/WorkoutViewModel.kt)
Add `clearAllData()` method.

#### [MODIFY] [ViewModelFactory.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/viewmodel/ViewModelFactory.kt)
Pass the new DAOs to ViewModels.

---

### [UI Layer]

#### [MODIFY] [NutritionScreen.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/screens/NutritionScreen.kt)
Add "Save" button to `RecipeCard` and wire up saving logic.

#### [MODIFY] [RecipeDetailsScreen.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/screens/RecipeDetailsScreen.kt)
Implement "Log this Meal" button logic using `MealLogViewModel`.

#### [MODIFY] [SavedScreen.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/screens/SavedScreen.kt)
Implement full UI for viewing saved meals and workouts.

#### [MODIFY] [SettingsScreen.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/screens/SettingsScreen.kt)
Add "Clear All Demo Data" button to reset the showcase mode.

#### [MODIFY] [DashboardScreen.kt](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/java/com/picktip/ui/screens/DashboardScreen.kt)
Add navigation to the Shopping List and improve macro visualization.

---

### [Assets]

#### [NEW] [logo_picktip.xml](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/app/src/main/res/drawable/logo_picktip.xml)
Create a new vector drawable for the app logo.

## Verification Plan

### Automated Tests
- Run `./gradlew :app:assembleDebug` to ensure compilation.
- I will implement some basic unit tests for the ViewModels if possible.

### Manual Verification
- Deploy to device/emulator.
- Test "Load Showcase Data" and "Clear All Data".
- Verify "Save Recipe" toggles and persistence in "My Collection".
- Verify "Log this Meal" adds entry to the Dashboard.
