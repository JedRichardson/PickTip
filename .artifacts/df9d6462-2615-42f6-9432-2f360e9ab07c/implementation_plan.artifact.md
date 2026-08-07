# Implementation Plan - Advanced Productivity Features

Implement Saved Workout Library, Smart Meal Planner, and Shopping List Generator to enhance user productivity and health tracking.

## User Review Required

> [!IMPORTANT]
> These changes will introduce new data contexts and a new "Saved & Tools" section. I will be adding a third tab to the bottom navigation to make these features easily accessible.

## Proposed Changes

### 1. Data Contexts & Storage

#### [NEW] [SavedWorkoutContext.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/context/SavedWorkoutContext.tsx)
- Manage saved workouts using `AsyncStorage`.
- Provide `saveWorkout`, `removeWorkout`, and `isSaved` methods.

#### [NEW] [ShoppingListContext.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/context/ShoppingListContext.tsx)
- Manage a list of ingredients with "checked" states.
- Provide methods to add ingredients from recipes and clear the list.

#### [MODIFY] [MealLogContext.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/context/MealLogContext.tsx)
- Add `plannedMeals` state to track meals planned for the future.
- Update `dailyTotals` to include `projectedCalories`.

### 2. UI & Navigation

#### [NEW] [recipe/[id].tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/recipe/[id].tsx)
- Create a detailed recipe view with ingredients and instructions.
- Add "Save", "Add to Plan", and "Add to Shopping List" buttons.

#### [NEW] [shopping-list.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/shopping-list.tsx)
- Screen to view and manage the shopping list.

#### [MODIFY] [saved.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/saved.tsx)
- Add tabs to switch between "Saved Meals" and "Saved Workouts".

#### [MODIFY] [workout.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/workout.tsx)
- Add a "Save Workout" button to the workout detail card.

#### [MODIFY] [bottom_nav.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/components/navigation/bottom_nav.tsx)
- Add a third tab "Saved" (linking to `saved.tsx`) or "Tools" (linking to a new menu).
- I'll add "Saved" as the third tab.

#### [MODIFY] [dashboard.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/dashboard.tsx)
- Display "Projected Calories" (Current + Planned).
- Add a shortcut to the Shopping List.

### 3. Integration

#### [MODIFY] [_layout.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/_layout.tsx)
- Wrap the app in the new `SavedWorkoutProvider` and `ShoppingListProvider`.

## Verification Plan

### Manual Verification
1. **Saved Workouts**: Save a workout, navigate to the "Saved" tab, and verify it appears in the Workouts list.
2. **Meal Planning**: Find a recipe, tap "Add to Plan", and verify the Dashboard shows updated projected calories.
3. **Shopping List**: In the recipe view, tap "Add to Shopping List", navigate to the shopping list screen, and verify ingredients are listed.
4. **General Flow**: Ensure the new "Saved" tab in the bottom navigation works correctly from all screens.
