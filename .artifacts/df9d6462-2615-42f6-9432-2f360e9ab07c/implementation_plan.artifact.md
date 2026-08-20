# Implementation Plan - PickTip Pro Suite

Complete overhaul of the user experience by adding interactivity, visual analytics, and scaling tools.

## Proposed Changes

### 1. Active Workout Mode (Interactivity)
#### [MODIFY] [workout.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/workout.tsx)
- Add timer state (`seconds`, `isActive`).
- Implement `useEffect` for the countdown/count-up logic.
- Add "Start Workout" overlay/buttons.
- Calculate final calories based on actual time spent vs. target time.

### 2. Visual Nutrition Analytics (Insights)
#### [MODIFY] [dashboard.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/dashboard.tsx)
- Implement a custom "Macro Balance Bar" showing the percentage ratio of Protein, Carbs, and Fat.
- Add a "Streak Heatmap" section showing consistency over the last 7 days.

### 3. Recipe Scaling & Smart Shopping (Utility)
#### [MODIFY] [recipe/[id].tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/recipe/[id].tsx)
- Add a `targetServings` state with +/- buttons.
- Dynamically scale ingredient quantities and macro totals.
- Update "Add to Shopping List" to export the scaled quantities.

### 4. Consistency Engine (Logic)
#### [MODIFY] [MealLogContext.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/context/MealLogContext.tsx)
- Add logic to calculate current daily streak.
- Track "Success Days" (days where at least one meal/workout was logged).

## Verification Plan
1. **Timer**: Start a workout, wait 10 seconds, pause, and finish. Verify the log shows the duration.
2. **Scaling**: Change servings from 2 to 4. Verify ingredients double. Add to shopping list and check the list.
3. **Analytics**: Log a high-fat meal and verify the Macro Balance bar shifts visually.
4. **Streak**: Log a meal today and verify the streak count is active on the dashboard.
