import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useMealLog } from '../context/MealLogContext';
import { useSmartFoodSuggestions } from '../hooks/useSmartFoodSuggestions';
import { useUser } from '../context/UserContext';
import { useWorkoutLog } from '../context/WorkoutLogContext';
import { useShoppingList } from '../context/ShoppingListContext';
import { RecipeCard } from '../components/recipe-card';

const { width } = Dimensions.get('window');

export default function NutritionDashboard() {
    const {
        mealLogs,
        plannedMeals,
        dailyTotals,
        removeLog,
        removePlannedMeal,
        logWater
    } = useMealLog();
    const { profile } = useUser();
    const { workouts, dailyTotalCalories, removeWorkout } = useWorkoutLog();
    const { ingredients } = useShoppingList();
    const { suggestions: smartSuggestions, isLoading: suggestionsLoading } = useSmartFoodSuggestions();

    const WATER_GOAL = 2500; // ml
    const CALORIE_BUDGET = profile.goals.calories + dailyTotalCalories;
    const REMAINING = CALORIE_BUDGET - dailyTotals.calories;
    const PROJECTED_REMAINING = CALORIE_BUDGET - dailyTotals.projectedCalories;

    const handleAddWater = (amount: number) => {
        logWater(amount);
    };

    const renderProgressBar = (label: string, value: number, goal: number, color: string) => {
        const percentage = Math.min((value / goal) * 100, 100);
        return (
            <View style={styles.progressItem}>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>{label}</Text>
                    <Text style={styles.progressValue}>{Math.round(value)} / {goal}</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
                </View>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#78B63C', '#4D7A20', '#355817']}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.backButton}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/settings')}>
                            <Text style={styles.settingsButton}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>Nutrition Tracker</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.netCalorieCard}>
                        <View style={styles.netCalorieRow}>
                            <View style={styles.netCalorieItem}>
                                <Text style={styles.netCalorieValue}>{profile.goals.calories}</Text>
                                <Text style={styles.netCalorieLabel}>Goal</Text>
                            </View>
                            <Text style={styles.netCalorieOp}>+</Text>
                            <View style={styles.netCalorieItem}>
                                <Text style={styles.netCalorieValue}>{dailyTotalCalories}</Text>
                                <Text style={styles.netCalorieLabel}>Exercise</Text>
                            </View>
                            <Text style={styles.netCalorieOp}>-</Text>
                            <View style={styles.netCalorieItem}>
                                <Text style={styles.netCalorieValue}>{Math.round(dailyTotals.calories)}</Text>
                                <Text style={styles.netCalorieLabel}>Food</Text>
                            </View>
                            <Text style={styles.netCalorieOp}>=</Text>
                            <View style={styles.netCalorieItem}>
                                <Text style={[styles.netCalorieValue, styles.remainingValue]}>
                                    {Math.round(REMAINING)}
                                </Text>
                                <Text style={styles.netCalorieLabel}>Remaining</Text>
                            </View>
                        </View>

                        {plannedMeals.length > 0 && (
                            <View style={styles.projectedRow}>
                                <Text style={styles.projectedLabel}>Projected after planned meals:</Text>
                                <Text style={[styles.projectedValue, PROJECTED_REMAINING < 0 && { color: '#FF5252' }]}>
                                    {Math.round(PROJECTED_REMAINING)} kcal
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.cardTitle}>Daily Progress</Text>
                        {renderProgressBar('Calories', dailyTotals.calories, CALORIE_BUDGET, '#4D7A20')}
                        {renderProgressBar('Protein (g)', dailyTotals.protein, profile.goals.protein, '#2196F3')}
                        {renderProgressBar('Carbs (g)', dailyTotals.carbs, profile.goals.carbs, '#FF9800')}
                        {renderProgressBar('Fat (g)', dailyTotals.fat, profile.goals.fat, '#E91E63')}
                    </View>

                    <View style={styles.insightsCard}>
                        <Text style={styles.cardTitle}>Nutrition Insights</Text>
                        {dailyTotals.protein < profile.goals.protein * 0.5 ? (
                            <View style={styles.insightItem}>
                                <Text style={styles.insightEmoji}>🥩</Text>
                                <Text style={styles.insightText}>Your protein intake is low today. Consider a high-protein meal next!</Text>
                            </View>
                        ) : dailyTotals.water < WATER_GOAL * 0.5 ? (
                            <View style={styles.insightItem}>
                                <Text style={styles.insightEmoji}>💧</Text>
                                <Text style={styles.insightText}>Don't forget to hydrate! You're less than halfway to your water goal.</Text>
                            </View>
                        ) : (
                            <View style={styles.insightItem}>
                                <Text style={styles.insightEmoji}>🌟</Text>
                                <Text style={styles.insightText}>You're doing great! Keep following your balanced plan.</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.toolCard}
                        onPress={() => router.push('/shopping-list')}
                    >
                        <View style={styles.toolIcon}>
                            <Text style={{fontSize: 24}}>🛒</Text>
                        </View>
                        <View style={styles.toolInfo}>
                            <Text style={styles.toolTitle}>Shopping List</Text>
                            <Text style={styles.toolSubtitle}>{ingredients.length} items in your list</Text>
                        </View>
                        <Text style={styles.toolArrow}>→</Text>
                    </TouchableOpacity>

                    <View style={styles.waterCard}>
                        <View style={styles.waterHeader}>
                            <Text style={styles.cardTitle}>Hydration</Text>
                            <Text style={styles.waterValue}>{dailyTotals.water} / {WATER_GOAL} ml</Text>
                        </View>
                        <View style={styles.waterProgressBg}>
                            <View style={[styles.waterProgressFill, { width: `${Math.min((dailyTotals.water / WATER_GOAL) * 100, 100)}%` }]} />
                        </View>
                        <View style={styles.waterButtons}>
                            <TouchableOpacity style={styles.waterButton} onPress={() => handleAddWater(250)}>
                                <Text style={styles.waterButtonText}>+250ml</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.waterButton} onPress={() => handleAddWater(500)}>
                                <Text style={styles.waterButtonText}>+500ml</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.suggestionsSection}>
                        <Text style={styles.sectionTitle}>Smart Suggestions</Text>
                        <Text style={styles.sectionSubtitle}>Recommended for your next meal</Text>
                        {suggestionsLoading ? (
                            <View style={styles.loadingSuggestions}>
                                <ActivityIndicator color="#fff" />
                            </View>
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                                {smartSuggestions.map(recipe => (
                                    <View key={recipe.id} style={styles.suggestionWrapper}>
                                        <RecipeCard recipe={recipe} />
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {plannedMeals.length > 0 && (
                        <View style={styles.logsSection}>
                            <Text style={styles.sectionTitle}>Planned Meals</Text>
                            {plannedMeals.map((log) => (
                                <View key={log.logId} style={[styles.logCard, { borderLeftWidth: 4, borderLeftColor: '#2196F3' }]}>
                                    <View style={styles.logInfo}>
                                        <Text style={styles.logName}>{log.name} (Planned)</Text>
                                    </View>
                                    <View style={styles.logMacros}>
                                        <Text style={styles.macroText}>{Math.round(log.calories)} kcal</Text>
                                        <TouchableOpacity onPress={() => removePlannedMeal(log.logId)} style={styles.deleteButton}>
                                            <Text style={styles.deleteButtonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={styles.logsSection}>
                        <Text style={styles.sectionTitle}>Today's Meals</Text>
                        {mealLogs.length === 0 ? (
                            <View style={styles.emptyLogs}>
                                <Text style={styles.emptyText}>No meals logged yet.</Text>
                                <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/category')}>
                                    <Text style={styles.actionButtonText}>Browse Suggestions</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            mealLogs.map((log) => (
                                <View key={log.logId} style={styles.logCard}>
                                    <View style={styles.logInfo}>
                                        <Text style={styles.logName}>{log.name}</Text>
                                        <Text style={styles.logTime}>
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    <View style={styles.logMacros}>
                                        <Text style={styles.macroText}>{Math.round(log.calories)} kcal</Text>
                                        <TouchableOpacity onPress={() => removeLog(log.logId)} style={styles.deleteButton}>
                                            <Text style={styles.deleteButtonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    header: { paddingHorizontal: 22, paddingTop: 15, paddingBottom: 20 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    backButton: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    settingsButton: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    title: { color: '#FFFFFF', fontSize: 34, fontWeight: '800' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
    netCalorieCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 22, marginBottom: 18, elevation: 8 },
    netCalorieRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    netCalorieItem: { alignItems: 'center', flex: 1 },
    netCalorieValue: { fontSize: 18, fontWeight: '800', color: '#355817' },
    remainingValue: { color: '#4D7A20' },
    netCalorieLabel: { fontSize: 10, color: '#777', textTransform: 'uppercase', marginTop: 5, fontWeight: '600' },
    netCalorieOp: { fontSize: 18, color: '#AAA', paddingHorizontal: 3 },
    projectedRow: { marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between' },
    projectedLabel: { fontSize: 12, color: '#666', fontWeight: '600' },
    projectedValue: { fontSize: 12, color: '#2196F3', fontWeight: '800' },
    summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 18, elevation: 6 },
    insightsCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 18, elevation: 6 },
    insightItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 15, borderRadius: 16 },
    insightEmoji: { fontSize: 24, marginRight: 12 },
    insightText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 20, fontWeight: '500' },
    cardTitle: { fontSize: 20, fontWeight: '800', color: '#355817', marginBottom: 16 },
    toolCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 18, flexDirection: 'row', alignItems: 'center', elevation: 4 },
    toolIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF7E8', justifyContent: 'center', alignItems: 'center' },
    toolInfo: { flex: 1, marginLeft: 12 },
    toolTitle: { fontSize: 16, fontWeight: '800', color: '#333' },
    toolSubtitle: { fontSize: 12, color: '#777' },
    toolArrow: { fontSize: 20, color: '#CCC' },
    waterCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 22, elevation: 6 },
    waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    waterValue: { fontSize: 14, fontWeight: '700', color: '#2196F3' },
    waterProgressBg: { height: 12, backgroundColor: '#E3F2FD', borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
    waterProgressFill: { height: '100%', backgroundColor: '#2196F3', borderRadius: 10 },
    waterButtons: { flexDirection: 'row', justifyContent: 'space-around' },
    waterButton: { backgroundColor: '#E3F2FD', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 18 },
    waterButtonText: { color: '#1976D2', fontWeight: '800' },
    progressItem: { marginBottom: 18 },
    progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progressLabel: { fontSize: 14, color: '#555', fontWeight: '700' },
    progressValue: { fontSize: 12, color: '#888' },
    progressBarBg: { height: 10, backgroundColor: '#EEEEEE', borderRadius: 10, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 10 },
    suggestionsSection: { marginBottom: 25 },
    sectionTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 6 },
    sectionSubtitle: { color: '#FFFFFF', opacity: 0.85, fontSize: 14, marginBottom: 14 },
    suggestionsScroll: { paddingRight: 20 },
    suggestionWrapper: { width: width * 0.75, marginRight: 16 },
    loadingSuggestions: { height: 150, justifyContent: 'center', alignItems: 'center' },
    logsSection: { marginTop: 8, marginBottom: 20 },
    emptyLogs: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 35, alignItems: 'center' },
    emptyText: { color: '#777', fontSize: 16, marginBottom: 20 },
    actionButton: { backgroundColor: '#4D7A20', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 18 },
    actionButtonText: { color: '#FFFFFF', fontWeight: '800' },
    logCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
    logInfo: { flex: 1 },
    logName: { fontSize: 16, fontWeight: '700', color: '#222' },
    logTime: { fontSize: 12, color: '#777', marginTop: 4 },
    logMacros: { flexDirection: 'row', alignItems: 'center' },
    macroText: { fontSize: 14, fontWeight: '800', color: '#4D7A20', marginRight: 12 },
    deleteButton: { padding: 5 },
    deleteButtonText: { color: '#BBB', fontSize: 16, fontWeight: '800' },
});
