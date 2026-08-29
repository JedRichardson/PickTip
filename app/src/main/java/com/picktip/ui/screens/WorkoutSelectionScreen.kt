package com.picktip.ui.screens

import androidx.activity.ComponentActivity
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
import com.picktip.PickTipApplication
import com.picktip.ui.navigation.Screen
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.theme.PickTipLightGreen
import com.picktip.ui.viewmodel.ViewModelFactory
import com.picktip.ui.viewmodel.WorkoutViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkoutSelectionScreen(navController: NavController, category: String) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    val viewModel: WorkoutViewModel = viewModel(
        viewModelStoreOwner = context as ComponentActivity,
        factory = ViewModelFactory(app)
    )

    val exercises by viewModel.exercises.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    LaunchedEffect(category) {
        val muscle = when(category) {
            "legs" -> "quadriceps"
            "arms" -> "biceps"
            "back" -> "lats"
            "chest" -> "chest"
            "shoulders" -> "traps"
            "core" -> "abdominals"
            else -> "chest"
        }
        viewModel.fetchExercises(muscle)
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
                    title = { Text(category.uppercase(), color = Color.White, fontWeight = FontWeight.Black) },
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
                             val muscle = when(category) {
                                "legs" -> "quadriceps"
                                "arms" -> "biceps"
                                "core" -> "abdominals"
                                else -> "chest"
                            }
                            viewModel.fetchExercises(muscle) 
                        }) {
                            Text("Retry")
                        }
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(padding),
                    contentPadding = PaddingValues(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    item {
                        Text("Pick a workout to begin", color = Color.White, fontSize = 16.sp)
                    }

                    items(exercises) { exercise ->
                        ExerciseSelectionCard(exercise) {
                            viewModel.selectWorkout(exercise)
                            navController.navigate(Screen.WorkoutSession.route)
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExerciseSelectionCard(exercise: com.picktip.data.models.Exercise, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(exercise.name, fontWeight = FontWeight.Black, fontSize = 18.sp, color = PickTipDarkGreen, modifier = Modifier.weight(1f))
                Badge(containerColor = PickTipLightGreen) {
                    Text(exercise.difficulty.uppercase(), color = PickTipDarkGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(8.dp))
            Text("Equipment: ${exercise.equipment ?: "None"}", color = Color.Gray, fontSize = 13.sp)
        }
    }
}
