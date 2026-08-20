# Walkthrough - PickTip Pro Features

I have significantly upgraded PickTip with a suite of professional features designed to increase user engagement and provide deeper health insights.

## New Pro Features

### 1. Active Workout Mode ⏱️
Your workouts are now interactive!
- **Interactive Timer**: Launch a real-time timer when you start an exercise.
- **Dynamic Burn Logic**: Calorie tracking is now smarter—it calculates your burn based on the actual minutes you spent exercising vs. a fixed number.
- **Session Control**: Pause and Resume your session anytime.

### 2. Visual Macro Analytics 📊
The Dashboard now features visual data representations for better insights.
- **Macro Balance Bar**: A sleek, custom chart showing the ratio of Protein, Carbs, and Fats in your current diet.
- **Dynamic Coloring**: Instantly see if your day is leaning too heavily into one macro category.

### 3. Consistency Streak Tracker 🔥
Gamified tracking to keep you motivated.
- **7-Day Heatmap**: A visual record of your activity over the last week right on your Health Hub.
- **Streak Counter**: Track how many days in a row you've used PickTip to log a meal or workout.

### 4. Smart Recipe Scaling ⚖️
Professional-grade cooking tools for any occasion.
- **Servings Selector**: Adjust recipes from 1 to 20+ servings.
- **Automatic Math**: Ingredients, calories, and macros scale instantly as you change the serving count.
- **Pro Logging**: When you log a scaled recipe, the correct multiplied values are added to your tracker.

## Technical Improvements
- **Context Logic**: Added a `Streak Engine` to [MealLogContext.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/context/MealLogContext.tsx) to calculate activity history.
- **UI Redesign**: Updated [dashboard.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/dashboard.tsx) with a more "Premium" aesthetic and high-density information cards.
- **Refined Workout Flow**: Overhauled [workout.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/workout.tsx) to handle interactive states.

## Verification
- **Scaling Test**: Scaled a recipe to 4 servings; verified ingredients and logged macros were 4x the original.
- **Timer Test**: Ran timer for 5 minutes; verified log showed "5:00" and approx. 60 extra calories burned.
- **Heatmap Test**: Verified that logging water for "Yesterday" and "Today" activated a 2-day streak.

> [!TIP]
> The Macro Balance bar is your best friend for weight management—try to keep the Blue (Protein) segment at at least 25% of the total bar for optimal muscle recovery!
