package com.picktip.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
import com.picktip.data.models.LoggedMeal
import com.picktip.data.models.Ingredient
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.viewmodel.MealLogViewModel
import com.picktip.ui.viewmodel.RecipeViewModel
import com.picktip.ui.viewmodel.ShoppingListViewModel
import com.picktip.ui.viewmodel.ViewModelFactory
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RecipeDetailsScreen(navController: NavController, recipeId: Int) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    val recipeViewModel: RecipeViewModel = viewModel(factory = ViewModelFactory(app))
    val mealViewModel: MealLogViewModel = viewModel(factory = ViewModelFactory(app))
    val shoppingViewModel: ShoppingListViewModel = viewModel(factory = ViewModelFactory(app))

    val recipe by recipeViewModel.recipeDetails.collectAsState()
    val isLoading by recipeViewModel.isLoading.collectAsState()
    val error by recipeViewModel.error.collectAsState()

    var servings by remember { mutableIntStateOf(1) }

    LaunchedEffect(recipeId) {
        recipeViewModel.fetchRecipeDetails(recipeId)
    }

    LaunchedEffect(recipe) {
        recipe?.servings?.let { servings = it }
    }

    if (isLoading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = PickTipGreen)
        }
    } else if (error != null) {
        Box(Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("⚠️", fontSize = 48.sp)
                Text(error!!, textAlign = androidx.compose.ui.text.style.TextAlign.Center, modifier = Modifier.padding(16.dp))
                Button(onClick = { recipeViewModel.fetchRecipeDetails(recipeId) }, colors = ButtonDefaults.buttonColors(containerColor = PickTipGreen)) {
                    Text("Retry")
                }
            }
        }
    } else if (recipe != null) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
            Box {
                AsyncImage(
                    model = recipe!!.image,
                    contentDescription = null,
                    modifier = Modifier.fillMaxWidth().height(300.dp),
                    contentScale = ContentScale.Crop
                )
                IconButton(
                    onClick = { navController.popBackStack() },
                    modifier = Modifier.padding(top = 50.dp, start = 20.dp).background(Color.Black.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                ) {
                    Text("←", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }

                IconButton(
                    onClick = { recipe?.let { recipeViewModel.toggleSaveRecipe(it) } },
                    modifier = Modifier.align(Alignment.TopEnd).padding(top = 50.dp, end = 20.dp).background(Color.Black.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                ) {
                    Text("♥", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
            }

            Column(modifier = Modifier
                .offset(y = (-30).dp)
                .background(Color.White, RoundedCornerShape(topStart = 30.dp, topEnd = 30.dp))
                .padding(20.dp)
            ) {
                Text(recipe!!.title, fontSize = 26.sp, fontWeight = FontWeight.Black, color = Color.Black)
                
                Spacer(Modifier.height(20.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth().background(Color(0xFFF8F9FA), RoundedCornerShape(20.dp)).padding(15.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    InfoBox(recipe!!.readyInMinutes?.toString() ?: "--", "Mins")
                    InfoBox(servings.toString(), "Servings")
                    InfoBox(Math.round((recipe!!.nutrition?.nutrients?.find { it.name == "Calories" }?.amount ?: 0.0) * (servings.toDouble() / (recipe!!.servings ?: 1))).toString(), "Kcal")
                }

                Spacer(Modifier.height(24.dp))
                Text("Ingredients", fontWeight = FontWeight.Black, fontSize = 20.sp)
                recipe!!.extendedIngredients?.forEach { ing ->
                    Text("• ${ing.original}", modifier = Modifier.padding(vertical = 4.dp), color = Color.DarkGray)
                }

                Spacer(Modifier.height(24.dp))
                Text("Instructions", fontWeight = FontWeight.Black, fontSize = 20.sp)
                Text(
                    recipe!!.summary?.replace(Regex("<[^>]*>"), "") ?: "No instructions provided.",
                    modifier = Modifier.padding(top = 10.dp),
                    fontSize = 16.sp,
                    lineHeight = 24.sp,
                    color = Color.DarkGray
                )
                
                Spacer(Modifier.height(30.dp))
                
                Button(
                    onClick = { 
                        val ingredients = recipe!!.extendedIngredients?.map {
                            Ingredient(
                                id = UUID.randomUUID().toString(),
                                name = it.name,
                                amount = it.amount,
                                unit = it.unit,
                                original = it.original,
                                category = it.aisle ?: "General",
                                aisle = it.aisle
                            )
                        } ?: emptyList()
                        shoppingViewModel.addIngredients(ingredients)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PickTipDarkGreen)
                ) {
                    Text("🛒 Add to Shopping List", fontWeight = FontWeight.Bold)
                }

                Spacer(Modifier.height(12.dp))

                Button(
                    onClick = { 
                        val nutrition = recipe!!.nutrition
                        val cal = nutrition?.nutrients?.find { it.name == "Calories" }?.amount ?: 0.0
                        val pro = nutrition?.nutrients?.find { it.name == "Protein" }?.amount ?: 0.0
                        val carb = nutrition?.nutrients?.find { it.name == "Carbohydrates" }?.amount ?: 0.0
                        val fat = nutrition?.nutrients?.find { it.name == "Fat" }?.amount ?: 0.0

                        mealViewModel.logMeal(
                            LoggedMeal(
                                logId = UUID.randomUUID().toString(),
                                foodId = recipe!!.id.toString(),
                                name = recipe!!.title,
                                calories = cal,
                                protein = pro,
                                carbs = carb,
                                fat = fat,
                                timestamp = System.currentTimeMillis(),
                                quantity = 1
                            )
                        )
                        navController.popBackStack()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PickTipGreen)
                ) {
                    Text("🍽️ Log this Meal", fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(40.dp))
            }
        }
    }
}

@Composable
fun InfoBox(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = PickTipGreen)
        Text(label, fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
    }
}
