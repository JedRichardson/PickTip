package com.picktip.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.picktip.ui.screens.*

sealed class Screen(val route: String) {
    object Dashboard : Screen("dashboard")
    object Category : Screen("category")
    object WorkoutSelection : Screen("workout_selection/{category}") {
        fun createRoute(category: String) = "workout_selection/$category"
    }
    object WorkoutSession : Screen("workout_session")
    object Nutrition : Screen("nutrition?intensity={intensity}") {
        fun createRoute(intensity: String) = "nutrition?intensity=$intensity"
    }
    object RecipeDetails : Screen("recipe_details/{id}") {
        fun createRoute(id: Int) = "recipe_details/$id"
    }
    object Saved : Screen("saved")
    object ShoppingList : Screen("shopping_list")
    object Settings : Screen("settings")
}

@Composable
fun PickTipNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.Dashboard.route
    ) {
        composable(Screen.Dashboard.route) {
            DashboardScreen(navController)
        }
        composable(Screen.Category.route) {
            CategoryScreen(navController)
        }
        composable(Screen.WorkoutSelection.route) { backStackEntry ->
            val category = backStackEntry.arguments?.getString("category") ?: "fullbody"
            WorkoutSelectionScreen(navController, category)
        }
        composable(Screen.WorkoutSession.route) {
            WorkoutSessionScreen(navController)
        }
        composable(Screen.Nutrition.route) { backStackEntry ->
            val intensity = backStackEntry.arguments?.getString("intensity") ?: "Medium"
            NutritionScreen(navController, intensity)
        }
        composable(Screen.RecipeDetails.route) { backStackEntry ->
            val id = backStackEntry.arguments?.getString("id")?.toInt() ?: 0
            RecipeDetailsScreen(navController, id)
        }
        composable(Screen.Saved.route) {
            SavedScreen(navController)
        }
        composable(Screen.ShoppingList.route) {
            ShoppingListScreen(navController)
        }
        composable(Screen.Settings.route) {
            SettingsScreen(navController)
        }
    }
}
