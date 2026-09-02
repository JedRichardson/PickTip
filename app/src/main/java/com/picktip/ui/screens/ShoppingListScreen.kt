package com.picktip.ui.screens

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.picktip.PickTipApplication
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.theme.PickTipLightGreen
import com.picktip.ui.viewmodel.ShoppingListViewModel
import com.picktip.ui.viewmodel.ViewModelFactory

import com.picktip.ui.navigation.Screen

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun ShoppingListScreen(navController: NavController) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    val viewModel: ShoppingListViewModel = viewModel(factory = ViewModelFactory(app))

    val ingredients by viewModel.ingredients.collectAsState()
    
    // Group by aisle
    val groupedIngredients = ingredients.groupBy { it.aisle ?: "General" }

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
                    title = { Text("Shopping List", color = Color.White, fontWeight = FontWeight.Black) },
                    navigationIcon = {
                        IconButton(
                            onClick = { navController.popBackStack() },
                            modifier = Modifier
                                .padding(start = 12.dp)
                                .size(40.dp)
                                .background(Color.White, CircleShape)
                        ) {
                            Text("←", color = PickTipDarkGreen, fontSize = 20.sp, fontWeight = FontWeight.Black)
                        }
                    },
                    actions = {
                        IconButton(
                            onClick = { viewModel.clearChecked() },
                            modifier = Modifier.size(40.dp).background(Color.White, CircleShape)
                        ) {
                            Text("🧹", fontSize = 18.sp)
                        }
                        Spacer(Modifier.width(8.dp))
                        IconButton(
                            onClick = { viewModel.clearList() },
                            modifier = Modifier.padding(end = 12.dp).size(40.dp).background(Color.White, CircleShape)
                        ) {
                            Text("🗑️", fontSize = 18.sp)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
                )
            }
        ) { padding ->
            if (ingredients.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text("Your shopping list is empty", color = Color.White.copy(alpha = 0.9f), fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text("Add ingredients from recipes or start a new workout session!", color = Color.White.copy(alpha = 0.7f), fontSize = 14.sp)
                    Spacer(Modifier.height(24.dp))
                    Button(
                        onClick = { navController.navigate(Screen.Category.route) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth(0.8f)
                    ) {
                        Text("Start Workout Session 💪", color = PickTipDarkGreen, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(12.dp))
                    OutlinedButton(
                        onClick = { navController.navigate(Screen.Nutrition.createRoute("Medium")) },
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.fillMaxWidth(0.8f)
                    ) {
                        Text("Explore Nutrition 🥑", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentPadding = PaddingValues(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    groupedIngredients.forEach { (aisle, items) ->
                        stickyHeader {
                            Box(modifier = Modifier.fillMaxWidth().background(Color.White.copy(alpha = 0.2f)).padding(horizontal = 16.dp, vertical = 8.dp)) {
                                Text(aisle.uppercase(), color = Color.White, fontWeight = FontWeight.Black, fontSize = 14.sp)
                            }
                        }
                        
                        items(items) { ingredient ->
                            IngredientItem(
                                ingredient = ingredient,
                                onToggle = { viewModel.toggleIngredient(ingredient) },
                                onDelete = { viewModel.removeIngredient(ingredient) }
                            )
                        }
                    }
                    
                    item { Spacer(Modifier.height(40.dp)) }
                }
            }
        }
    }
}

@Composable
fun IngredientItem(
    ingredient: com.picktip.data.models.Ingredient,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = ingredient.checked,
                onCheckedChange = { onToggle() },
                colors = CheckboxDefaults.colors(checkedColor = PickTipGreen)
            )
            Spacer(Modifier.width(8.dp))
            Text(
                text = ingredient.original,
                modifier = Modifier.weight(1.0f),
                style = if (ingredient.checked) {
                    MaterialTheme.typography.bodyLarge.copy(
                        textDecoration = TextDecoration.LineThrough,
                        color = Color.Gray
                    )
                } else {
                    MaterialTheme.typography.bodyLarge
                },
                color = if (ingredient.checked) Color.Gray else PickTipDarkGreen
            )
            IconButton(onClick = onDelete) {
                Text("✕", color = Color.LightGray)
            }
        }
    }
}
