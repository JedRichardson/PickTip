package com.picktip.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NutritionScreen(navController: NavController, intensity: String) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    val userProfile by app.userPrefs.userProfile.collectAsState(initial = null)
    
    val viewModel: RecipeViewModel = viewModel(
        factory = ViewModelFactory(app)
    )

    val suggestedRecipes by viewModel.suggestedRecipes.collectAsState()
    val breakfastRecipes by viewModel.breakfastSuggestions.collectAsState()
    val snackRecipes by viewModel.snackSuggestions.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    LaunchedEffect(userProfile) {
        userProfile?.let {
            viewModel.fetchSuggestions(
                diet = it.dietaryPreference,
                minProtein = if (intensity == "expert" || intensity == "high") 35 else 20,
                maxCalories = if (intensity == "expert" || intensity == "high") 1200 else 700,
                type = "main course"
            )
        }
    }

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
                    title = { Text("Recommended Fuel", color = Color.White, fontWeight = FontWeight.Black) },
                    navigationIcon = {
                        IconButton(onClick = { navController.popBackStack() }) {
                            Text("←", color = Color.White, fontSize = 20.sp)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
                )
            }
        ) { padding ->
            if (isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color.White)
                }
            } else if (error != null) {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("⚠️", fontSize = 48.sp)
                        Text(error!!, color = Color.White)
                        Button(onClick = { 
                             userProfile?.let {
                                viewModel.fetchSuggestions(
                                    diet = it.dietaryPreference,
                                    minProtein = 20,
                                    maxCalories = 800,
                                    type = "main course"
                                )
                            }
                        }) { Text("Retry") }
                    }
                }
            } else {
                Column(modifier = Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState())) {
                    Text(
                        "Customized for your ${intensity.uppercase()} session",
                        color = Color.White.copy(alpha = 0.9f),
                        modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )

                    MealSection("Post-Workout Mains", suggestedRecipes, navController, viewModel, isMain = true)
                    MealSection("Energy-Boosting Breakfast", breakfastRecipes, navController, viewModel)
                    MealSection("Quick Recovery Snacks", snackRecipes, navController, viewModel)
                    
                    Spacer(Modifier.height(40.dp))
                }
            }
        }
    }
}

@Composable
fun MealSection(title: String, recipes: List<com.picktip.data.models.Recipe>, navController: NavController, viewModel: RecipeViewModel, isMain: Boolean = false) {
    if (recipes.isNotEmpty()) {
        Column(modifier = Modifier.padding(vertical = 16.dp)) {
            Text(
                title,
                color = Color.White,
                fontWeight = FontWeight.Black,
                fontSize = 20.sp,
                modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp)
            )
            LazyRow(
                contentPadding = PaddingValues(horizontal = 24.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(recipes.size) { index ->
                    val recipe = recipes[index]
                    RecipeCard(
                        recipe = recipe,
                        isBestChoice = isMain && index == 0,
                        onClick = {
                            navController.navigate(Screen.RecipeDetails.createRoute(recipe.id))
                        },
                        onSaveClick = {
                            viewModel.toggleSaveRecipe(recipe)
                        }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RecipeCard(
    recipe: com.picktip.data.models.Recipe,
    isBestChoice: Boolean = false,
    onClick: () -> Unit,
    onSaveClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.width(220.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = if (isBestChoice) androidx.compose.foundation.BorderStroke(2.dp, PickTipGreen) else null
    ) {
        Column {
            Box {
                AsyncImage(
                    model = recipe.image,
                    contentDescription = null,
                    modifier = Modifier.fillMaxWidth().height(140.dp),
                    contentScale = ContentScale.Crop
                )
                if (isBestChoice) {
                    Badge(
                        containerColor = PickTipGreen,
                        modifier = Modifier.align(Alignment.TopStart).padding(8.dp)
                    ) {
                        Text("TOP PICK", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(4.dp))
                    }
                }
                IconButton(
                    onClick = { onSaveClick() },
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .size(36.dp)
                        .background(Color.Black.copy(alpha = 0.4f), RoundedCornerShape(18.dp))
                ) {
                    Text("♥", color = Color.White, fontSize = 18.sp)
                }
            }
            Column(modifier = Modifier.padding(16.dp)) {
                Text(recipe.title, fontWeight = FontWeight.Bold, maxLines = 2, lineHeight = 20.sp, fontSize = 15.sp, color = PickTipDarkGreen)
                Spacer(Modifier.height(8.dp))
                val protein = recipe.nutrition?.nutrients?.find { it.name == "Protein" }
                if (protein != null) {
                    Text("${protein.amount.toInt()}g Protein", color = PickTipGreen, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
