package com.picktip.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.picktip.PickTipApplication
import com.picktip.ui.navigation.Screen
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.theme.PickTipLightGreen
import com.picktip.ui.viewmodel.RecipeViewModel
import com.picktip.ui.viewmodel.ViewModelFactory
import com.picktip.ui.viewmodel.WorkoutViewModel

import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavedScreen(navController: NavController) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    
    val recipeViewModel: RecipeViewModel = viewModel(factory = ViewModelFactory(app))
    val workoutViewModel: WorkoutViewModel = viewModel(factory = ViewModelFactory(app))

    val savedRecipes by recipeViewModel.savedRecipes.collectAsState()
    val savedWorkouts by workoutViewModel.savedWorkouts.collectAsState()

    var selectedTab by remember { mutableIntStateOf(0) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(PickTipLightGreen, PickTipGreen, PickTipDarkGreen)
                )
            )
    ) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                TopAppBar(
                    title = { Text("My Collection", color = Color.White, fontWeight = FontWeight.Black) },
                    navigationIcon = {
                        IconButton(onClick = { navController.popBackStack() }) {
                            Text("←", color = Color.White, fontSize = 20.sp)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
                )
            }
        ) { padding ->
            Column(modifier = Modifier.fillMaxSize().padding(padding)) {
                TabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = Color.Transparent,
                    contentColor = Color.White,
                    indicator = { tabPositions ->
                        TabRowDefaults.Indicator(
                            Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                            color = Color.White
                        )
                    }
                ) {
                    Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }) {
                        Text("Recipes", modifier = Modifier.padding(16.dp), fontWeight = FontWeight.Bold)
                    }
                    Tab(selected = selectedTab == 1, onClick = { selectedTab = 1 }) {
                        Text("Workouts", modifier = Modifier.padding(16.dp), fontWeight = FontWeight.Bold)
                    }
                }

                if (selectedTab == 0) {
                    if (savedRecipes.isEmpty()) {
                        EmptyState("No saved recipes yet")
                    } else {
                        LazyColumn(contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            items(savedRecipes) { recipe ->
                                SavedRecipeItem(recipe) {
                                    navController.navigate(Screen.RecipeDetails.createRoute(recipe.id))
                                }
                            }
                        }
                    }
                } else {
                    if (savedWorkouts.isEmpty()) {
                        EmptyState("No saved workouts yet")
                    } else {
                        LazyColumn(contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            items(savedWorkouts) { workout ->
                                SavedWorkoutItem(workout)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun EmptyState(message: String) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(message, color = Color.White.copy(alpha = 0.7f), fontSize = 18.sp)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavedRecipeItem(recipe: com.picktip.data.models.SavedRecipe, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            AsyncImage(
                model = recipe.image,
                contentDescription = null,
                modifier = Modifier.size(80.dp).background(Color(0xFFF8F9FA), RoundedCornerShape(12.dp))
            )
            Spacer(Modifier.width(16.dp))
            Column {
                Text(recipe.title, fontWeight = FontWeight.Bold, maxLines = 2, fontSize = 16.sp)
                Text("${recipe.calories?.toInt() ?: 0} kcal", color = PickTipGreen, fontSize = 14.sp)
            }
        }
    }
}

@Composable
fun SavedWorkoutItem(workout: com.picktip.data.models.SavedWorkout) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(workout.name, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Text("${workout.muscle} | ${workout.difficulty}", color = Color.Gray, fontSize = 14.sp)
        }
    }
}
