package com.picktip.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.picktip.PickTipApplication
import com.picktip.R
import com.picktip.data.models.LoggedMeal
import com.picktip.ui.navigation.Screen
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.theme.PickTipLightGreen
import com.picktip.ui.viewmodel.DailyTotals
import com.picktip.ui.viewmodel.MealLogViewModel
import com.picktip.ui.viewmodel.ViewModelFactory

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
    var showMacroDialog by remember { mutableStateOf(false) }

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
                            Text("PickTip", color = Color.White, fontWeight = FontWeight.Black, fontSize = 22.sp)
                        }
                    },
                    navigationIcon = {
                        IconButton(
                            onClick = { navController.navigate(Screen.ShoppingList.route) },
                            modifier = Modifier
                                .padding(start = 12.dp)
                                .size(42.dp)
                                .background(Color.White, CircleShape)
                        ) {
                            Text("🛒", fontSize = 20.sp)
                        }
                    },
                    actions = {
                        IconButton(
                            onClick = { navController.navigate(Screen.Settings.route) },
                            modifier = Modifier
                                .padding(end = 12.dp)
                                .size(42.dp)
                                .background(Color.White, CircleShape)
                        ) {
                            Text("⚙️", fontSize = 20.sp)
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = Color.Transparent,
                        scrolledContainerColor = Color.Transparent
                    )
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
                    MacroBalanceCard(
                        totals = dailyTotals,
                        onClick = { showMacroDialog = true }
                    )
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

        if (showMacroDialog) {
            MacroAnalyticsDialog(
                totals = dailyTotals,
                onDismiss = { showMacroDialog = false }
            )
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
fun MacroBalanceCard(
    totals: DailyTotals,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Macro Balance", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = PickTipDarkGreen)
                Text("Tap for chart 📊", fontSize = 12.sp, color = PickTipGreen, fontWeight = FontWeight.Bold)
            }
            
            Spacer(modifier = Modifier.height(16.dp))

            Row(modifier = Modifier.fillMaxWidth().height(14.dp).background(Color(0xFFEEEEEE), RoundedCornerShape(7.dp))) {
                val total = totals.protein + totals.carbs + totals.fat
                if (total > 0) {
                    val pWeight = (totals.protein / total).toFloat().coerceAtLeast(0.001f)
                    val cWeight = (totals.carbs / total).toFloat().coerceAtLeast(0.001f)
                    val fWeight = (totals.fat / total).toFloat().coerceAtLeast(0.001f)

                    Box(modifier = Modifier.fillMaxHeight().weight(pWeight).background(Color(0xFF4CAF50), RoundedCornerShape(topStart = 7.dp, bottomStart = 7.dp)))
                    Box(modifier = Modifier.fillMaxHeight().weight(cWeight).background(Color(0xFFFFC107)))
                    Box(modifier = Modifier.fillMaxHeight().weight(fWeight).background(Color(0xFF2196F3), RoundedCornerShape(topEnd = 7.dp, bottomEnd = 7.dp)))
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
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
        Box(Modifier.size(10.dp).background(color, RoundedCornerShape(5.dp)))
        Spacer(Modifier.width(6.dp))
        Text("$label: $value", fontSize = 13.sp, color = Color.DarkGray, fontWeight = FontWeight.Medium)
    }
}

@Composable
fun MealItem(meal: LoggedMeal) {
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

@Composable
fun MacroAnalyticsDialog(
    totals: DailyTotals,
    onDismiss: () -> Unit
) {
    val totalGrams = totals.protein + totals.carbs + totals.fat
    val proteinCals = totals.protein * 4
    val carbsCals = totals.carbs * 4
    val fatCals = totals.fat * 9
    val totalCals = proteinCals + carbsCals + fatCals

    val pPct = if (totalGrams > 0) (totals.protein / totalGrams * 100).toInt() else 0
    val cPct = if (totalGrams > 0) (totals.carbs / totalGrams * 100).toInt() else 0
    val fPct = if (totalGrams > 0) (totals.fat / totalGrams * 100).toInt() else 0

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = PickTipDarkGreen),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Close Analytics", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        shape = RoundedCornerShape(28.dp),
        containerColor = Color.White,
        title = {
            Column {
                Text(
                    text = "Macro Gains & Analytics 📊",
                    fontWeight = FontWeight.Black,
                    fontSize = 20.sp,
                    color = PickTipDarkGreen
                )
                Text(
                    text = "Detailed nutritional breakdown and gain share",
                    fontSize = 12.sp,
                    color = Color.Gray,
                    fontWeight = FontWeight.Medium
                )
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                // Visual Chart Bar
                Column {
                    Text("Macro Distribution Chart", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.Black)
                    Spacer(Modifier.height(8.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(20.dp)
                            .background(Color(0xFFEEEEEE), RoundedCornerShape(10.dp))
                    ) {
                        if (totalGrams > 0) {
                            val pWeight = (totals.protein / totalGrams).toFloat().coerceAtLeast(0.001f)
                            val cWeight = (totals.carbs / totalGrams).toFloat().coerceAtLeast(0.001f)
                            val fWeight = (totals.fat / totalGrams).toFloat().coerceAtLeast(0.001f)

                            Box(modifier = Modifier.fillMaxHeight().weight(pWeight).background(Color(0xFF4CAF50), RoundedCornerShape(topStart = 10.dp, bottomStart = 10.dp)))
                            Box(modifier = Modifier.fillMaxHeight().weight(cWeight).background(Color(0xFFFFC107)))
                            Box(modifier = Modifier.fillMaxHeight().weight(fWeight).background(Color(0xFF2196F3), RoundedCornerShape(topEnd = 10.dp, bottomEnd = 10.dp)))
                        }
                    }
                }

                HorizontalDivider(color = Color(0xFFEEEEEE))

                // Macro Gains Table
                Column {
                    Text("Gains Breakdown Table", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.Black)
                    Spacer(Modifier.height(8.dp))

                    // Table Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFF5F5F5), RoundedCornerShape(8.dp))
                            .padding(vertical = 8.dp, horizontal = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Macro", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1.2f))
                        Text("Amount", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                        Text("Energy", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                        Text("Share", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                    }

                    Spacer(Modifier.height(4.dp))

                    // Row 1: Protein
                    TableRow(label = "🥩 Protein", amount = "${totals.protein.toInt()}g", energy = "${proteinCals.toInt()} kcal", share = "$pPct%", color = Color(0xFF4CAF50))
                    // Row 2: Carbs
                    TableRow(label = "🍞 Carbs", amount = "${totals.carbs.toInt()}g", energy = "${carbsCals.toInt()} kcal", share = "$cPct%", color = Color(0xFFFFC107))
                    // Row 3: Fat
                    TableRow(label = "🥑 Fat", amount = "${totals.fat.toInt()}g", energy = "${fatCals.toInt()} kcal", share = "$fPct%", color = Color(0xFF2196F3))

                    HorizontalDivider(color = Color(0xFFEEEEEE), modifier = Modifier.padding(vertical = 6.dp))

                    // Summary Row
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Total Energy", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1.2f), color = PickTipDarkGreen)
                        Text("${totalGrams.toInt()}g", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.End, color = PickTipDarkGreen)
                        Text("${totalCals.toInt()} kcal", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.End, color = PickTipDarkGreen)
                        Text("100%", fontWeight = FontWeight.Black, fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.End, color = PickTipDarkGreen)
                    }
                }
            }
        }
    )
}

@Composable
fun TableRow(
    label: String,
    amount: String,
    energy: String,
    share: String,
    color: Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp, horizontal = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(modifier = Modifier.weight(1.2f), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(8.dp).background(color, RoundedCornerShape(4.dp)))
            Spacer(Modifier.width(6.dp))
            Text(label, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
        }
        Text(amount, fontSize = 12.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f), textAlign = TextAlign.End, color = Color.Gray)
        Text(energy, fontSize = 12.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f), textAlign = TextAlign.End, color = Color.Gray)
        Text(share, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f), textAlign = TextAlign.End, color = PickTipDarkGreen)
    }
}
