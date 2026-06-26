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
import { FoodSuggestionCard } from '../components/food-suggestion-card';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

const GOALS = {
    calories: 2500,
    protein: 150,
    carbs: 250,
    fat: 80,
};

export default function NutritionDashboard() {
    const { mealLogs, dailyTotals, removeLog, logMeal } = useMealLog();
    const smartSuggestions = useSmartFoodSuggestions();

    const handleQuickLog = (food: any) => {
        logMeal(food);
        Alert.alert('Logged', `${food.name} added to your daily log.`);
    };

    const renderProgressBar = (label: string, value: number, goal: number, color: string) => {
        const percentage = Math.min((value / goal) * 100, 100);
        return (
            <View style={styles.progressItem}>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>{label}</Text>
                    <Text style={styles.progressValue}>{value} / {goal}</Text>
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
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Nutrition Tracker</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>Daily Progress</Text>
                    {renderProgressBar('Calories', Math.round(dailyTotals.calories), GOALS.calories, '#4D7A20')}
                    {renderProgressBar('Protein (g)', Math.round(dailyTotals.protein), GOALS.protein, '#2196F3')}
                    {renderProgressBar('Carbs (g)', Math.round(dailyTotals.carbs), GOALS.carbs, '#FF9800')}
                    {renderProgressBar('Fat (g)', Math.round(dailyTotals.fat), GOALS.fat, '#E91E63')}
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
    backButton: {
        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
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
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
