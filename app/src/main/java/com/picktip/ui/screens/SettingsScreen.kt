package com.picktip.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.picktip.PickTipApplication
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.viewmodel.MealLogViewModel
import com.picktip.ui.viewmodel.ViewModelFactory
import com.picktip.ui.viewmodel.WorkoutViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(navController: NavController) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    val userProfile by app.userPrefs.userProfile.collectAsState(initial = null)
    val scope = rememberCoroutineScope()

    val mealViewModel: MealLogViewModel = viewModel(factory = ViewModelFactory(app))
    val workoutViewModel: WorkoutViewModel = viewModel(factory = ViewModelFactory(app))

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Text("←", fontSize = 20.sp)
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(30.dp)
        ) {
            Column {
                Text("PROFILE INFO", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                Spacer(Modifier.height(16.dp))
                // Simple display for now
                Text("Name: ${userProfile?.name ?: ""}", fontSize = 16.sp)
                Text("Diet: ${userProfile?.dietaryPreference ?: ""}", fontSize = 16.sp)
            }

            Column {
                Text("SHOWCASE TOOLS", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                Spacer(Modifier.height(8.dp))
                Text("Prepare for demo by loading 7 days of activity", fontSize = 14.sp, color = Color.Gray)
                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = {
                        scope.launch {
                            mealViewModel.loadDemoData()
                            workoutViewModel.loadDemoData()
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PickTipDarkGreen)
                ) {
                    Text("🚀 Load Showcase Data", fontWeight = FontWeight.Black, fontSize = 16.sp)
                }
                
                Spacer(Modifier.height(12.dp))
                
                OutlinedButton(
                    onClick = {
                        scope.launch {
                            mealViewModel.clearAllData()
                            workoutViewModel.clearAllData()
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.Red)
                ) {
                    Text("🗑️ Clear All Demo Data", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}
