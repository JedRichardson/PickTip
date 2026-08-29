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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.picktip.PickTipApplication
import com.picktip.ui.navigation.Screen
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.theme.PickTipLightGreen
import com.picktip.ui.viewmodel.MealLogViewModel
import com.picktip.ui.viewmodel.ViewModelFactory
import androidx.compose.ui.platform.LocalContext
import androidx.compose.foundation.Image
import androidx.compose.ui.res.painterResource
import com.picktip.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    val viewModel: MealLogViewModel = viewModel(
        factory = ViewModelFactory(app)
    )

    val dailyTotals by viewModel.dailyTotals.collectAsState()
    val mealLogs by viewModel.mealLogs.collectAsState()

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
                CenterAlignedTopAppBar(
                    title = { 
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Image(
                                painter = painterResource(id = R.drawable.logo_picktip),
                                contentDescription = null,
                                modifier = Modifier.size(32.dp)
                            )
                            Spacer(Modifier.width(8.dp))
                            Text("PickTip", color = Color.White, fontWeight = FontWeight.Black) 
                        }
                    },
                    navigationIcon = {
                        IconButton(onClick = { navController.navigate(Screen.ShoppingList.route) }) {
                            Text("🛒", fontSize = 20.sp)
                        }
                    },
                    actions = {
                        IconButton(onClick = { navController.navigate(Screen.Settings.route) }) {
                            Text("⚙️", fontSize = 20.sp)
                        }
                    }
                )
            }
        ) { padding ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    ScoreCard(dailyTotals.projectedCalories.toInt())
                }

                item {
                    MacroBalanceCard(dailyTotals)
                }

                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Button(
                            onClick = { navController.navigate(Screen.Category.route) },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Text("Workout 💪", color = PickTipGreen, fontWeight = FontWeight.Bold)
                        }
                        Button(
                            onClick = { navController.navigate(Screen.Saved.route) },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Text("Collection ♥", color = PickTipGreen, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                item {
                    Text("Today's Meals", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                }

                if (mealLogs.none { !it.isPlanned }) {
                    item {
                        Text("No meals logged yet today.", color = Color.White.copy(alpha = 0.7f), fontSize = 14.sp)
                    }
                }

                items(mealLogs.filter { !it.isPlanned }) { meal ->
                    MealItem(meal)
                }
            }
        }
    }
}

@Composable
fun ScoreCard(calories: Int) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("REMAINING KCAL", fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
            Text("$calories", fontSize = 48.sp, fontWeight = FontWeight.Black, color = PickTipDarkGreen)
        }
    }
}

@Composable
fun MacroBalanceCard(totals: com.picktip.ui.viewmodel.DailyTotals) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text("Macro Balance", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = PickTipDarkGreen)
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(modifier = Modifier.fillMaxWidth().height(12.dp).background(Color(0xFFEEEEEE), RoundedCornerShape(6.dp))) {
                val total = totals.protein + totals.carbs + totals.fat
                if (total > 0) {
                    val pWeight = (totals.protein / total).toFloat().coerceAtLeast(0.001f)
                    val cWeight = (totals.carbs / total).toFloat().coerceAtLeast(0.001f)
                    val fWeight = (totals.fat / total).toFloat().coerceAtLeast(0.001f)
                    
                    Box(modifier = Modifier.fillMaxHeight().weight(pWeight).background(Color(0xFF4CAF50), RoundedCornerShape(topStart = 6.dp, bottomStart = 6.dp)))
                    Box(modifier = Modifier.fillMaxHeight().weight(cWeight).background(Color(0xFFFFC107)))
                    Box(modifier = Modifier.fillMaxHeight().weight(fWeight).background(Color(0xFF2196F3), RoundedCornerShape(topEnd = 6.dp, bottomEnd = 6.dp)))
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                MacroLabel("Protein", "${totals.protein.toInt()}g", Color(0xFF4CAF50))
                MacroLabel("Carbs", "${totals.carbs.toInt()}g", Color(0xFFFFC107))
                MacroLabel("Fat", "${totals.fat.toInt()}g", Color(0xFF2196F3))
            }
        }
    }
}

@Composable
fun MacroLabel(label: String, value: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(8.dp).background(color, RoundedCornerShape(4.dp)))
        Spacer(Modifier.width(4.dp))
        Text("$label: $value", fontSize = 12.sp, color = Color.Gray)
    }
}

@Composable
fun MealItem(meal: com.picktip.data.models.LoggedMeal) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Row(modifier = Modifier.padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Column {
                Text(meal.name, fontWeight = FontWeight.Bold)
                Text("${meal.calories.toInt()} kcal", color = PickTipGreen)
            }
        }
    }
}
