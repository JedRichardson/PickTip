import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMealLog } from '../context/MealLogContext';
import { useSmartFoodSuggestions } from '../hooks/useSmartFoodSuggestions';
import { useUser } from '../context/UserContext';
import { FoodSuggestionCard } from '../components/food-suggestion-card';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

export default function NutritionDashboard() {
    const { mealLogs, dailyTotals, removeLog, logMeal, logWater } = useMealLog();
    const { profile } = useUser();
    const smartSuggestions = useSmartFoodSuggestions();

    const WATER_GOAL = 2500; // ml

    const handleQuickLog = (food: any) => {
        logMeal(food);
        Alert.alert('Logged', `${food.name} added to your daily log.`);
    };

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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/settings')}>
                        <Text style={styles.settingsButton}>⚙️ Settings</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Nutrition Tracker</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>Daily Progress</Text>
                    {renderProgressBar('Calories', dailyTotals.calories, profile.goals.calories, '#4D7A20')}
                    {renderProgressBar('Protein (g)', dailyTotals.protein, profile.goals.protein, '#2196F3')}
                    {renderProgressBar('Carbs (g)', dailyTotals.carbs, profile.goals.carbs, '#FF9800')}
                    {renderProgressBar('Fat (g)', dailyTotals.fat, profile.goals.fat, '#E91E63')}
                </View>

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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                        {smartSuggestions.map(food => (
                            <View key={food.id} style={styles.suggestionWrapper}>
                                <FoodSuggestionCard
                                    food={food}
                                    onPress={() => router.push(`/nutrition?intensity=${food.pairingIntensity}`)}
                                    onLog={() => handleQuickLog(food)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.logsSection}>
                    <Text style={styles.sectionTitle}>Today's Meals</Text>
                    {mealLogs.length === 0 ? (
                        <View style={styles.emptyLogs}>
                            <Text style={styles.emptyText}>No meals logged yet.</Text>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => router.push('/category')}
                            >
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
                                    <TouchableOpacity
                                        onPress={() => removeLog(log.logId)}
                                        style={styles.deleteButton}
                                    >
                                        <Text style={styles.deleteButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    backButton: {
        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '600',
    },
    settingsButton: {
        fontSize: 16,
        color: '#444',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    scrollContent: {
        padding: 16,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    waterCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    waterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    waterValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2196F3',
    },
    waterProgressBg: {
        height: 12,
        backgroundColor: '#E3F2FD',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
    },
    waterProgressFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 6,
    },
    waterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    waterButton: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    waterButtonText: {
        color: '#1976D2',
        fontWeight: '700',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: '#333',
    },
    progressItem: {
        marginBottom: 16,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    progressValue: {
        fontSize: 12,
        color: '#888',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    suggestionsSection: {
        marginBottom: 24,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        paddingLeft: 4,
    },
    suggestionsScroll: {
        paddingLeft: 4,
        paddingRight: 16,
    },
    suggestionWrapper: {
        width: width * 0.75,
        marginRight: 16,
    },
    logsSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#333',
        paddingLeft: 4,
    },
    emptyLogs: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#4D7A20',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    logCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logInfo: {
        flex: 1,
    },
    logName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    logTime: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    logMacros: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    macroText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4D7A20',
        marginRight: 12,
    },
    deleteButton: {
        padding: 4,
    },
    deleteButtonText: {
        color: '#ccc',
        fontSize: 18,
    }
});
