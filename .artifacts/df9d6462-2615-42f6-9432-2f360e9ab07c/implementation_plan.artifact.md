# Implementation Plan - Showcase Essentials 🚀

High-impact, low-risk additions to make PickTip shine during the testing showcase.

## Proposed Changes

### 1. Showcase "Demo Mode" (Settings)
#### [MODIFY] [settings.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/settings.tsx)
- Add a "Load Showcase Data" button.
- **Functionality**: Instantly populates the last 7 days with fake meal logs, water intake, and workouts.
- **Benefit**: Ensures the Dashboard heatmap, macro charts, and streaks are fully visible and impressive for judges/testers.

### 2. Daily Motivation Hub (Dashboard)
#### [MODIFY] [dashboard.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/dashboard.tsx)
- Add a "Tip of the Day" card at the top.
- **Functionality**: Displays a random piece of expert advice (e.g., "Protein helps muscle repair!").
- **Benefit**: Adds immediate visual interest and shows off the app's "educational" side.

### 3. Live Calorie Burner (Workout)
#### [MODIFY] [workoutsession.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/workoutsession.tsx)
- Add a real-time calorie counter next to the timer.
- **Functionality**: The calorie number will tick up every second based on workout intensity.
- **Benefit**: Makes the "Active Session" feel alive and technologically advanced during the demo.

## Verification Plan
1. **Demo Data**: Go to Settings, tap "Load Showcase Data," return to Dashboard. Verify the heatmap has 7 circles and the charts are full.
2. **Motivation**: Refresh Dashboard or navigate away/back and see a new tip.
3. **Live Burn**: Start a workout and watch the calorie number increase alongside the timer.
