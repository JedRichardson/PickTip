# Implementation Plan - Detailed Recipes and Macro Logging

Enhance the nutrition experience by adding a detailed recipe view and allowing users to log Spoonacular recipes directly to their daily nutrition tracker.

## User Review Required

> [!NOTE]
> This plan involves adding a new screen and updating the navigation structure. It also bridges the gap between the Spoonacular API data and your local meal logging system.

## Proposed Changes

### 1. Data & Context Layer

#### [MODIFY] [MealLogContext.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/context/MealLogContext.tsx)
- Add a new method `logSpoonacularRecipe(recipe: SpoonacularRecipe, quantity?: number)` to handle the macro format returned by Spoonacular.
- Ensure the macro strings (e.g., "30g") are correctly parsed into numbers for logging.

### 2. UI & Navigation

#### [NEW] [src/app/recipe/[id].tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/app/recipe/[id].tsx)
- Create a new dynamic route for recipe details.
- Use `getRecipeDetails` from `spoonacular.ts` to fetch and display:
    - Ingredients list.
    - Cooking instructions.
    - "Log this Meal" button.

#### [MODIFY] [RecipeCard.tsx](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/components/recipe-card.tsx)
- Update the `onPress` to navigate to `/recipe/[id]`.

### 3. Dashboard Integration

#### [MODIFY] [useSmartFoodSuggestions.ts](file:///C:/Users/neonw/AndroidStudioProjects/PickTip-Tristan/src/hooks/useSmartFoodSuggestions.ts)
- Update to fetch real-time suggestions from Spoonacular based on the time of day (Breakfast/Lunch/Dinner) instead of using local fallback data.

## Verification Plan

### Manual Verification
1.  **Recipe Navigation**: Tap a recipe in the `NutritionScreen` and verify it opens the detail view.
2.  **Detail View**: Verify ingredients and instructions are visible for various recipes.
3.  **Logging**: Tap "Log this Meal" in the detail view and check the `Dashboard` to see if the calories and protein have updated correctly.
4.  **Smart Suggestions**: Check the `Dashboard` to see if the "Smart Suggestions" now show diverse recipes from Spoonacular.
