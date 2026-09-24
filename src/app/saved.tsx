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
import { PickTipGradient } from '@/constants/theme';

export default function SavedCollectionScreen() {
   const { savedFoods, removeFood } = useSavedNutrition();

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
        </View>
    );

    return (
        <LinearGradient
            colors={PickTipGradient}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButtonBadge}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>My Collection</Text>
                    <Text style={styles.subtitle}>Your favorite meals and workout sessions</Text>
                </View>
                <FlatList
                    data={savedFoods}
                    renderItem={renderFoodItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No saved meals yet.</Text>
                            <TouchableOpacity
                                style={styles.browseButton}
                                onPress={() => router.push('/nutrition')}
                            >
                                <Text style={styles.browseButtonText}>
                                    Explore Recipes 🥑
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
    backButtonBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    backButtonText: { color: '#355817', fontSize: 20, fontWeight: '900' },
    title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
    subtitle: { color: '#FFFFFF', opacity: .85, marginTop: 4, fontSize: 14 },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 20,
        marginHorizontal: 24,
        padding: 5,
        marginBottom: 18,
    },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 16 },
    tabText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
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
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    foodName: { fontSize: 19, fontWeight: '800', color: '#355817', flex: 1 },
    removeButton: { backgroundColor: '#FFEAEA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
    removeButtonText: { color: '#FF5252', fontSize: 12, fontWeight: '800' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEEEEE' },
    stat: { alignItems: 'center' },
    statValue: { fontSize: 16, fontWeight: '800', color: '#4D7A20' },
    statLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase', marginTop: 2 },
    workoutInfo: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
    intensityBadge: { backgroundColor: '#EEF7E8' },
    durationBadge: { backgroundColor: '#F5F5F5' },
    badgeText: { fontSize: 12, fontWeight: '700', color: '#4D7A20', textTransform: 'capitalize' },
    description: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 14 },
    startWorkoutBtn: { backgroundColor: '#EEF7E8', padding: 12, borderRadius: 14, alignItems: 'center' },
    startWorkoutBtnText: { color: '#355817', fontWeight: '800', fontSize: 14 },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: '#FFFFFF', fontSize: 17, marginBottom: 20, fontWeight: '600' },
    browseButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 18 },
    browseButtonText: { color: '#355817', fontWeight: '900', fontSize: 15 },
});
