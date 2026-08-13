# Implementation Plan - Unison and Project Expansion

Address inconsistencies from the recent merge, fix broken components, and expand project features to ensure a cohesive experience.

## User Review Required

> [!IMPORTANT]
> I have detected that `SavedWorkoutContext.tsx` was corrupted during the merge (it's missing most of its code). I will restore it to full functionality.
>
> I also found two competing workout API services. I propose unifying them into `picktipApi.ts` for consistency.

## Proposed Changes

### 1. Cohesion & Fixes ("Unison")

#### [MODIFY] [picktipApi.ts](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/api/picktipApi.ts)
- Integrate improved error handling and logging from the merged `Ninjas.ts`.
- Ensure the API key management is consistent (using `process.env` with a safe fallback).
- Update the `Exercise` type to include both `equipment` and `equipments` (or pick one consistently) to match API responses.

#### [MODIFY] [SavedWorkoutContext.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/context/SavedWorkoutContext.tsx)
- Restore the full implementation for saving, removing, and persisting workouts.

#### [DELETE] [Ninjas.ts](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/services/Ninjas.ts)
- Remove this file after migrating its logic to the unified API layer.

### 2. Project Expansion

#### [MODIFY] [workout.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/workout.tsx)
- **Live Data**: Switch from the static `workouts.ts` list to fetching real-time exercises from the API based on the selected category.
- **Reroll logic**: Ensure "Try Another Workout" fetches a new random exercise from the API results.

#### [MODIFY] [dashboard.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/dashboard.tsx)
- **Weekly Planner**: Add a "This Week" preview showing planned meals for upcoming days.
- **Nutrition Summary**: Add a small "Insights" section that suggests if you should focus more on Protein or Carbs based on recent logs.

#### [MODIFY] [shopping-list.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/shopping-list.tsx)
- **Smart Grouping**: Group ingredients by category (e.g., Produce, Dairy, Meat) to make shopping easier.

## Verification Plan

### Manual Verification
1.  **API Check**: Verify that workouts load from the API and show detailed instructions.
2.  **Save Check**: Save a workout and ensure it appears in the "Saved" tab correctly.
3.  **Planner Check**: Add a meal to the plan and see it reflected in the Dashboard's projected totals.
4.  **Shopping List**: Add ingredients from a recipe and verify they are toggleable and removable.
