package com.picktip.ui.screens

import androidx.activity.ComponentActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import com.airbnb.lottie.compose.*
import com.picktip.PickTipApplication
import com.picktip.ui.navigation.Screen
import com.picktip.ui.theme.PickTipDarkGreen
import com.picktip.ui.theme.PickTipGreen
import com.picktip.ui.theme.PickTipLightGreen
import com.picktip.ui.viewmodel.ViewModelFactory
import com.picktip.ui.viewmodel.WorkoutViewModel
import kotlinx.coroutines.delay
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkoutSessionScreen(navController: NavController) {
    val context = LocalContext.current
    val app = context.applicationContext as PickTipApplication
    // Shared ViewModel via Activity owner
    val viewModel: WorkoutViewModel = viewModel(
        viewModelStoreOwner = context as ComponentActivity,
        factory = ViewModelFactory(app)
    )

    val workout by viewModel.currentWorkout.collectAsState()
    
    var seconds by remember { mutableIntStateOf(0) }
    var timerActive by remember { mutableStateOf(false) }

    LaunchedEffect(timerActive) {
        while(timerActive) {
            delay(1000)
            seconds++
        }
    }

    var showConfetti by remember { mutableStateOf(false) }
    val composition by rememberLottieComposition(LottieCompositionSpec.Asset("animations/workout.json"))
    val progress by animateLottieCompositionAsState(composition, isPlaying = timerActive)
    val confettiComp by rememberLottieComposition(LottieCompositionSpec.Asset("animations/confetti.json"))

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
                    title = { Text("ACTIVE SESSION", color = Color.White, fontWeight = FontWeight.Black, fontSize = 13.sp) },
                    navigationIcon = {
                        IconButton(onClick = { navController.popBackStack() }) {
                            Text("←", color = Color.White, fontSize = 20.sp)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
                )
            }
        ) { padding ->
            if (workout != null) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(horizontal = 24.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(18.dp)
                ) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(28.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White)
                    ) {
                        Column(modifier = Modifier.padding(26.dp)) {
                            Text(workout!!.name, fontSize = 28.sp, fontWeight = FontWeight.Black, color = PickTipDarkGreen)
                            
                            Spacer(Modifier.height(18.dp))
                            
                            Box(modifier = Modifier.fillMaxWidth().height(200.dp).background(Color(0xFFF8F9FA), RoundedCornerShape(22.dp))) {
                                LottieAnimation(composition, { progress })
                            }

                            Spacer(Modifier.height(18.dp))

                            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth().background(Color(0xFFF0F4E8), RoundedCornerShape(24.dp)).padding(20.dp)) {
                                Text("SESSION TIME", fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                                Text(formatTime(seconds), fontSize = 48.sp, fontWeight = FontWeight.Black, color = PickTipDarkGreen)
                                
                                Button(
                                    onClick = { timerActive = !timerActive },
                                    modifier = Modifier.fillMaxWidth(),
                                    colors = ButtonDefaults.buttonColors(containerColor = if (timerActive) Color(0xFFFFA000) else PickTipGreen)
                                ) {
                                    Text(if (timerActive) "PAUSE SESSION" else "START SESSION", fontWeight = FontWeight.Black)
                                }
                            }
                            
                            Spacer(Modifier.height(18.dp))
                            Text("Instructions", fontWeight = FontWeight.Black, fontSize = 18.sp, color = PickTipDarkGreen)
                            Text(workout!!.instructions, color = Color.DarkGray, fontSize = 15.sp, lineHeight = 22.sp)
                        }
                    }

                    Button(
                        onClick = { 
                            showConfetti = true
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        shape = RoundedCornerShape(18.dp),
                        enabled = seconds > 5 && !showConfetti
                    ) {
                        Text("Complete Workout", color = PickTipDarkGreen, fontWeight = FontWeight.Black)
                    }
                }
            } else {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No workout selected", color = Color.White)
                }
            }

            if (showConfetti) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    LottieAnimation(
                        composition = confettiComp,
                        iterations = 1
                    )
                }
                LaunchedEffect(Unit) {
                    delay(3000)
                    navController.navigate(Screen.Nutrition.createRoute(workout!!.difficulty))
                }
            }
        }
    }
}

private fun formatTime(totalSeconds: Int): String {
    val mins = totalSeconds / 60
    val secs = totalSeconds % 60
    return String.format(Locale.getDefault(), "%02d:%02d", mins, secs)
}
