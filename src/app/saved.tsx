import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Food } from '../data/nutrition';
import { useSavedNutrition } from '../context/SavedNutritionContext';
import { useSavedWorkout, Workout } from '../context/SavedWorkoutContext';

export default function SavedScreen() {
    const [activeTab, setActiveTab] = useState<'meals' | 'workouts'>('meals');
    const { savedFoods, removeFood } = useSavedNutrition();
    const { savedWorkouts, removeWorkout } = useSavedWorkout();

    const renderFoodItem = ({ item }: { item: Food }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.foodName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeFood(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{item.calories}</Text>
                    <Text style={styles.statLabel}>kcal</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{item.protein}g</Text>
                    <Text style={styles.statLabel}>Protein</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{item.carbs}g</Text>
                    <Text style={styles.statLabel}>Carbs</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{item.fat}g</Text>
                    <Text style={styles.statLabel}>Fat</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => router.push(`/recipe/${item.id}`)}
            >
                <Text style={styles.viewDetailsText}>View Recipe</Text>
            </TouchableOpacity>
        </View>
    );

    const renderWorkoutItem = ({ item }: { item: Workout }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.foodName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeWorkout(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.workoutInfo}>
                <View style={[styles.badge, styles.intensityBadge]}>
                    <Text style={styles.badgeText}>{item.intensity}</Text>
                </View>
                <View style={[styles.badge, styles.durationBadge]}>
                    <Text style={styles.badgeText}>{item.duration}</Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

            <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => router.push(`/workout?category=${item.category}`)}
            >
                <Text style={styles.viewDetailsText}>Start Workout</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={['#78B63C', '#4D7A20', '#355817']}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>My Collection</Text>
                    <Text style={styles.subtitle}>Your favorite picks in one place</Text>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'meals' && styles.activeTab]}
                        onPress={() => setActiveTab('meals')}
                    >
                        <Text style={[styles.tabText, activeTab === 'meals' && styles.activeTabText]}>Meals</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'workouts' && styles.activeTab]}
                        onPress={() => setActiveTab('workouts')}
                    >
                        <Text style={[styles.tabText, activeTab === 'workouts' && styles.activeTabText]}>Workouts</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={activeTab === 'meals' ? savedFoods : savedWorkouts}
                    renderItem={activeTab === 'meals' ? renderFoodItem : (renderWorkoutItem as any)}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No {activeTab} saved yet.</Text>
                            <TouchableOpacity
                                style={styles.browseButton}
                                onPress={() => router.push('/category')}
                            >
                                <Text style={styles.browseButtonText}>Explore Recommendations</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 25,
    },
    backButton: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: '800',
    },
    subtitle: {
        color: '#FFFFFF',
        opacity: .85,
        marginTop: 6,
        fontSize: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        marginHorizontal: 24,
        padding: 5,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
    },
    tabText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    activeTabText: {
        color: '#355817',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: .15,
        shadowRadius: 12,
        elevation: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    foodName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#355817',
        flex: 1,
    },
    removeButton: {
        backgroundColor: '#FFEAEA',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 16,
    },
    removeButtonText: {
        color: '#FF5252',
        fontSize: 12,
        fontWeight: '800',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#4D7A20',
    },
    statLabel: {
        fontSize: 10,
        color: '#888',
        textTransform: 'uppercase',
        marginTop: 3,
    },
    workoutInfo: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    intensityBadge: {
        backgroundColor: '#EEF7E8',
    },
    durationBadge: {
        backgroundColor: '#F5F5F5',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4D7A20',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    viewDetailsButton: {
        backgroundColor: '#EEF7E8',
        padding: 12,
        borderRadius: 14,
        alignItems: 'center',
    },
    viewDetailsText: {
        color: '#4D7A20',
        fontWeight: '800',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 17,
        marginBottom: 22,
        fontWeight: '600',
    },
    browseButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 18,
    },
    browseButtonText: {
        color: '#4D7A20',
        fontWeight: '800',
    },
});
