# Implementation Plan - Post-Merge Synchronization & Cleanup

Reconcile the changes from the classmate's branch with the existing Pro features to ensure a cohesive and functional main branch.

## User Review Required

> [!IMPORTANT]
> The merge introduced a separate `workoutsession.tsx` and updated `workout.tsx` with its own timer logic. I will unify these into a single, high-quality "Active Workout" experience that includes the classmate's new **Celebration Sounds** and **Confetti Animations**.
>
> I also noticed that the `getExercises` API was duplicated in `src/services/Ninjas.ts`. I will unify this back into `src/api/picktipApi.ts` while keeping the improved error handling.

## Proposed Changes

### 1. Audio & Visual Enhancements (Unison)

#### [MODIFY] [workout.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/workout.tsx)
- Integrate `useAppSounds` to play "Tap" sounds on timer start/pause.
- Update the completion flow to use `playCompleteSound()` for the celebratory audio.
- Ensure navigation to `nutrition.tsx` passes the `workoutComplete=true` flag to trigger the confetti.

#### [MODIFY] [nutrition.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/nutrition.tsx)
- The classmate's version already has confetti logic. I will ensure it works seamlessly with the existing real-time recipe loading.

### 2. Code Cleanup & De-duplication

#### [MODIFY] [picktipApi.ts](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/api/picktipApi.ts)
- Combine the logic from the classmate's `Ninjas.ts` (detailed error logging) with our existing key management.

#### [DELETE] [Ninjas.ts](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/services/Ninjas.ts)
- Remove the redundant service file.

#### [DELETE] [workoutsession.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/workoutsession.tsx)
- Since our `workout.tsx` now handles the timer and active state in a more integrated way, this duplicate file is no longer needed.

### 3. Polish

#### [MODIFY] [bottom_nav.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/components/navigation/bottom_nav.tsx)
- Ensure the "Saved" tab is correctly labeled and using the heart icon consistent with the rest of the app.

## Verification Plan

### Manual Verification
1.  **Audio**: Start a workout and verify the "Tap" sound plays. Finish and verify the "Victory/Crowd" celebration plays.
2.  **Visuals**: Verify confetti appears on the Nutrition screen after finishing a workout.
3.  **Data**: Save a workout using the heart icon and verify it appears in the "Saved" tab.
4.  **API**: Ensure recipes and exercises still load correctly using the unified API layer.
