import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
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
        logWater,
        streak
    } = useMealLog();

    const tips = [
        "Protein helps repair muscle tissue after a tough workout.",
        "Drinking water before meals can aid in digestion.",
        "Consistency is key! Try to log at least one activity every day.",
        "Complex carbs like sweet potatoes provide long-lasting energy.",
        "Don't skip the cool-down; it helps prevent post-workout soreness.",
        "Sleep is just as important as the gym for recovery."
    ];
    const dailyTip = React.useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);

    const { profile } = useUser();
    const { workouts, dailyTotalCalories, removeWorkout } = useWorkoutLog();
    const { ingredients } = useShoppingList();
    const { suggestions: smartSuggestions, isLoading: suggestionsLoading } = useSmartFoodSuggestions();

    const WATER_GOAL = 2500; // ml
    const CALORIE_BUDGET = profile.goals.calories + dailyTotalCalories;
    const REMAINING = CALORIE_BUDGET - dailyTotals.calories;
    const PROJECTED_REMAINING = CALORIE_BUDGET - dailyTotals.projectedCalories;

    // Macro Balance Logic
    const totalMacros = dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat;
    const proteinPct = totalMacros > 0 ? (dailyTotals.protein / totalMacros) * 100 : 0;
    const carbsPct = totalMacros > 0 ? (dailyTotals.carbs / totalMacros) * 100 : 0;
    const fatPct = totalMacros > 0 ? (dailyTotals.fat / totalMacros) * 100 : 0;

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

    const renderHeatmap = () => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - i));
            return d;
        });

        return (
            <View style={styles.heatmapContainer}>
                {last7Days.map((date, i) => {
                    const hasActivity = streak.history.some(h => new Date(h).toDateString() === date.toDateString());
                    return (
                        <View key={i} style={styles.heatmapDay}>
                            <View style={[styles.heatmapCircle, hasActivity && styles.heatmapActive]} />
                            <Text style={styles.heatmapLabel}>{days[date.getDay()]}</Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <LinearGradient colors={['#78B63C', '#4D7A20', '#355817']} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.backButton}>Back</Text>
                        </TouchableOpacity>
                        <View style={styles.streakBadge}>
                            <Text style={styles.streakEmoji}>🔥</Text>
                            <Text style={styles.streakText}>{streak.current} Day Streak</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/settings')}>
                            <Text style={styles.settingsButton}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>Your Health Hub</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.tipCard}>
                        <View style={styles.tipIcon}>
                            <Text style={{fontSize: 20}}>💡</Text>
                        </View>
                        <View style={styles.tipContent}>
                            <Text style={styles.tipLabel}>TIP OF THE DAY</Text>
                            <Text style={styles.tipText}>{dailyTip}</Text>
                        </View>
                    </View>

                    <View style={styles.mainScoreCard}>
                        <View style={styles.scoreRow}>
                            <View style={styles.scoreItem}>
                                <Text style={styles.scoreValue}>{Math.round(REMAINING)}</Text>
                                <Text style={styles.scoreLabel}>REMAINING KCAL</Text>
                            </View>
                            <View style={styles.scoreDivider} />
                            <View style={styles.scoreItem}>
                                <Text style={styles.scoreValue}>{Math.round(dailyTotals.protein)}g</Text>
                                <Text style={styles.scoreLabel}>PROTEIN INTAKE</Text>
                            </View>
                        </View>
                        {renderHeatmap()}
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.cardTitle}>Macro Balance</Text>
                        <View style={styles.macroBar}>
                            <View style={[styles.macroSegment, { width: `${proteinPct}%`, backgroundColor: '#2196F3' }]} />
                            <View style={[styles.macroSegment, { width: `${carbsPct}%`, backgroundColor: '#FF9800' }]} />
                            <View style={[styles.macroSegment, { width: `${fatPct}%`, backgroundColor: '#E91E63' }]} />
                        </View>
                        <View style={styles.macroLegend}>
                            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#2196F3'}]} /><Text style={styles.legendText}>Prot {Math.round(proteinPct)}%</Text></View>
                            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#FF9800'}]} /><Text style={styles.legendText}>Carb {Math.round(carbsPct)}%</Text></View>
                            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#E91E63'}]} /><Text style={styles.legendText}>Fat {Math.round(fatPct)}%</Text></View>
                        </View>
                    </View>

                    <View style={styles.insightsCard}>
                        <Text style={styles.cardTitle}>Daily Insights</Text>
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
                                <Text style={styles.insightText}>You're doing great! Your macro balance is looking solid.</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/shopping-list')}>
                        <View style={styles.toolIcon}><Text style={{fontSize: 24}}>🛒</Text></View>
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
                            <TouchableOpacity style={styles.waterButton} onPress={() => handleAddWater(250)}><Text style={styles.waterButtonText}>+250ml</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.waterButton} onPress={() => handleAddWater(500)}><Text style={styles.waterButtonText}>+500ml</Text></TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.suggestionsSection}>
                        <Text style={styles.sectionTitle}>Smart Suggestions</Text>
                        {suggestionsLoading ? (
                            <View style={styles.loadingSuggestions}><ActivityIndicator color="#fff" /></View>
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                                {smartSuggestions.map(recipe => (
                                    <View key={recipe.id} style={styles.suggestionWrapper}><RecipeCard recipe={recipe} /></View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {plannedMeals.length > 0 && (
                        <View style={styles.logsSection}>
                            <Text style={styles.sectionTitle}>Upcoming Plan</Text>
                            {plannedMeals.map((log) => (
                                <View key={log.logId} style={[styles.logCard, { borderLeftWidth: 4, borderLeftColor: '#2196F3' }]}>
                                    <View style={styles.logInfo}><Text style={styles.logName}>{log.name} (Planned)</Text></View>
                                    <View style={styles.logMacros}>
                                        <Text style={styles.macroText}>{Math.round(log.calories)} kcal</Text>
                                        <TouchableOpacity onPress={() => removePlannedMeal(log.logId)} style={styles.deleteButton}><Text style={styles.deleteButtonText}>X</Text></TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
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
    streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    streakEmoji: { fontSize: 14, marginRight: 4 },
    streakText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
    title: { color: '#FFFFFF', fontSize: 32, fontWeight: '900' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
    tipCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 6,
        borderLeftColor: '#FFD700',
    },
    tipIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFBE6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    tipContent: {
        flex: 1,
    },
    tipLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#888',
        letterSpacing: 1,
        marginBottom: 2,
    },
    tipText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        lineHeight: 18,
    },
    mainScoreCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 22, marginBottom: 18, elevation: 8 },
    scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    scoreItem: { flex: 1, alignItems: 'center' },
    scoreValue: { fontSize: 28, fontWeight: '900', color: '#355817' },
    scoreLabel: { fontSize: 9, color: '#888', fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
    scoreDivider: { width: 1, height: 40, backgroundColor: '#EEE' },
    heatmapContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    heatmapDay: { alignItems: 'center' },
    heatmapCircle: { width: 14, height: 14, borderRadius: 4, backgroundColor: '#F0F0F0', marginBottom: 6 },
    heatmapActive: { backgroundColor: '#4D7A20' },
    heatmapLabel: { fontSize: 9, color: '#AAA', fontWeight: '700' },
    summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 18, elevation: 6 },
    macroBar: { height: 12, backgroundColor: '#F0F0F0', borderRadius: 6, overflow: 'hidden', flexDirection: 'row', marginBottom: 15 },
    macroSegment: { height: '100%' },
    macroLegend: { flexDirection: 'row', justifyContent: 'space-around' },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    legendText: { fontSize: 11, color: '#666', fontWeight: '600' },
    insightsCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 18, elevation: 6 },
    insightItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 15, borderRadius: 16 },
    insightEmoji: { fontSize: 24, marginRight: 12 },
    insightText: { flex: 1, fontSize: 13, color: '#444', lineHeight: 18, fontWeight: '500' },
    cardTitle: { fontSize: 18, fontWeight: '800', color: '#355817', marginBottom: 16 },
    toolCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 18, flexDirection: 'row', alignItems: 'center', elevation: 4 },
    toolIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF7E8', justifyContent: 'center', alignItems: 'center' },
    toolInfo: { flex: 1, marginLeft: 12 },
    toolTitle: { fontSize: 16, fontWeight: '800', color: '#333' },
    toolSubtitle: { fontSize: 12, color: '#777' },
    toolArrow: { fontSize: 20, color: '#CCC' },
    waterCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 22, elevation: 6 },
    waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    waterValue: { fontSize: 14, fontWeight: '700', color: '#2196F3' },
    waterProgressBg: { height: 10, backgroundColor: '#E3F2FD', borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
    waterProgressFill: { height: '100%', backgroundColor: '#2196F3', borderRadius: 10 },
    waterButtons: { flexDirection: 'row', justifyContent: 'space-around' },
    waterButton: { backgroundColor: '#E3F2FD', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 18 },
    waterButtonText: { color: '#1976D2', fontWeight: '800', fontSize: 12 },
    suggestionsSection: { marginBottom: 25 },
    sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginBottom: 12 },
    suggestionsScroll: { paddingRight: 20 },
    suggestionWrapper: { width: width * 0.7, marginRight: 16 },
    loadingSuggestions: { height: 150, justifyContent: 'center', alignItems: 'center' },
    logsSection: { marginTop: 8, marginBottom: 20 },
    logCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
    logInfo: { flex: 1 },
    logName: { fontSize: 15, fontWeight: '700', color: '#222' },
    macroText: { fontSize: 13, fontWeight: '800', color: '#4D7A20', marginRight: 12 },
    deleteButton: { padding: 5 },
    deleteButtonText: { color: '#BBB', fontSize: 16, fontWeight: '800' },
});
