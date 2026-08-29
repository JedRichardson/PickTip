package com.picktip.ui.screens

import androidx.compose.foundation.ExperimentalFoundationApi
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
                        IconButton(onClick = { navController.popBackStack() }) {
                            Text("←", color = Color.White, fontSize = 20.sp)
                        }
                    },
                    actions = {
                        IconButton(onClick = { viewModel.clearChecked() }) {
                            Text("🧹", fontSize = 20.sp)
                        }
                        IconButton(onClick = { viewModel.clearList() }) {
                            Text("🗑️", fontSize = 20.sp)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
                )
            }
        ) { padding ->
            if (ingredients.isEmpty()) {
                Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                    Text("Your shopping list is empty", color = Color.White.copy(alpha = 0.7f), fontSize = 18.sp)
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
