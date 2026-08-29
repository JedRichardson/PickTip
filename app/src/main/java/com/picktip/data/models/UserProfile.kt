package com.picktip.data.models

data class UserProfile(
    val name: String = "User",
    val dietaryPreference: String = "None",
    val goals: UserGoals = UserGoals()
)

data class UserGoals(
    val calories: Int = 2000,
    val protein: Int = 150,
    val carbs: Int = 200,
    val fat: Int = 70
)
