import React, { useState, useMemo, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    Alert,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Food } from '../data/nutrition';
import { useFoodSuggestions } from '../hooks/useFoodSuggestions';
import { useSavedNutrition } from '../context/SavedNutritionContext';
import { useMealLog } from '../context/MealLogContext';
import { useUser } from '../context/UserContext';
import { fetchRecommendations, SpoonacularRecipe } from '../services/spoonacular';
import { RecipeCard } from '../components/recipe-card';

export default function NutritionScreen() {
    const { intensity, category } = useLocalSearchParams();
    const { profile } = useUser();
    const [selectedMealType, setSelectedMealType] = useState<string | undefined>(undefined);
    const suggestions = useFoodSuggestions({ intensity, category, mealType: selectedMealType });
    const { saveFood, isSaved, removeFood } = useSavedNutrition();
    const { logMeal } = useMealLog();

    const [searchQuery, setSearchQuery] = useState('');
    const [globalRecipes, setGlobalRecipes] = useState<SpoonacularRecipe[]>([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    useEffect(() => {
        loadGlobalRecipes();
    }, [intensity, selectedMealType, profile.dietaryPreference]);

    const loadGlobalRecipes = async () => {
        setIsLoadingRecipes(true);
        // Map intensity to macros
        let minProtein = 10;
        let maxCalories = 800;

        if (intensity === 'High') {
            minProtein = 30;
            maxCalories = 1000;
        } else if (intensity === 'Low') {
            minProtein = 5;
            maxCalories = 400;
        }

        const recipes = await fetchRecommendations({
            diet: profile.dietaryPreference,
            minProtein,
            maxCalories,
            type: selectedMealType?.toLowerCase(),
            number: 10
        });
        setGlobalRecipes(recipes);
        setIsLoadingRecipes(false);
    };

    const filteredSuggestions = useMemo(() => {
        if (!searchQuery) return suggestions;
        return suggestions.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.dietaryLabels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [suggestions, searchQuery]);

    const handleLogMeal = async (item: Food) => {
        await logMeal(item);
        Alert.alert('Success', `${item.name} has been logged to your dashboard!`);
    };

    const renderFoodItem = ({ item }: { item: Food }) => {
        const saved = isSaved(item.id);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.foodName}>{item.name}</Text>
                        <Text style={styles.servingSize}>{item.servingSize}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => saved ? removeFood(item.id) : saveFood(item)}
                        style={[styles.saveButton, saved && styles.savedButton]}
                    >
                        <Text style={styles.saveButtonText}>{saved ? '✓' : 'Save'}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{item.calories}</Text>
                        <Text style={styles.statLabel}>kcal</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{item.protein}g</Text>
                        <Text style={styles.statLabel}>Prot</Text>
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

                <View style={styles.footerRow}>
                    <View style={styles.labelContainer}>
                        {item.dietaryLabels.map(label => (
                            <View key={label} style={styles.label}>
                                <Text style={styles.labelText}>{label}</Text>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={styles.logButton}
                        onPress={() => handleLogMeal(item)}
                    >
                        <Text style={styles.logButtonText}>Log Meal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/dashboard')}>
                        <Text style={styles.dashboardLink}>Dashboard</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Recommended Fuel</Text>
                <Text style={styles.subtitle}>Based on {intensity} intensity workout</Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search foods, ingredients, or diet..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[styles.filterChip, !selectedMealType && styles.activeFilterChip]}
                            onPress={() => setSelectedMealType(undefined)}
                        >
                            <Text style={[styles.filterChipText, !selectedMealType && styles.activeFilterChipText]}>All</Text>
                        </TouchableOpacity>
                        {mealTypes.map(type => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.filterChip, selectedMealType === type && styles.activeFilterChip]}
                                onPress={() => setSelectedMealType(type)}
                            >
                                <Text style={[styles.filterChipText, selectedMealType === type && styles.activeFilterChipText]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <FlatList
                data={filteredSuggestions}
                renderItem={renderFoodItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    globalRecipes.length > 0 ? (
                        <View style={styles.globalSection}>
                            <Text style={styles.sectionTitle}>Global Recipe Discoveries</Text>
                            <Text style={styles.sectionSubtitle}>Powered by Spoonacular</Text>
                            <FlatList
                                horizontal
                                data={globalRecipes}
                                renderItem={({ item }) => (
                                    <RecipeCard
                                        recipe={item}
                                        onPress={() => Alert.alert(item.title, 'Recipe details integration coming soon!')}
                                    />
                                )}
                                keyExtractor={item => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            />
                            <View style={styles.divider} />
                            <Text style={styles.sectionTitle}>Hand-picked Suggestions</Text>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        {searchQuery ? 'No foods match your search.' : 'No specific recommendations found for this intensity.'}
                    </Text>
                }
            />

            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.viewSavedButton}
                    onPress={() => router.push('/saved')}
                >
                    <Text style={styles.viewSavedText}>Saved Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewSavedButton, styles.dashboardButton]}
                    onPress={() => router.push('/dashboard')}
                >
                    <Text style={styles.viewSavedText}>My Dashboard</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    topBar: {
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
    dashboardLink: {
        color: '#4D7A20',
        fontSize: 14,
        fontWeight: '700',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#f1f3f5',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    filterContainer: {
        marginTop: 16,
        flexDirection: 'row',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f3f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    activeFilterChip: {
        backgroundColor: '#4D7A20',
        borderColor: '#4D7A20',
    },
    filterChipText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    activeFilterChipText: {
        color: '#fff',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    nameContainer: {
        flex: 1,
    },
    foodName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    servingSize: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    saveButton: {
        backgroundColor: '#f1f3f5',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    savedButton: {
        backgroundColor: '#4D7A20',
    },
    saveButtonText: {
        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '700',
    },
    description: {
        fontSize: 14,
        color: '#444',
        marginBottom: 16,
        lineHeight: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
        marginBottom: 12,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4D7A20',
    },
    statLabel: {
        fontSize: 10,
        color: '#888',
        textTransform: 'uppercase',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        marginRight: 8,
    },
    label: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    labelText: {
        fontSize: 10,
        color: '#2E7D32',
        fontWeight: '600',
    },
    logButton: {
        backgroundColor: '#4D7A20',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    bottomButtons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    viewSavedButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4D7A20',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    dashboardButton: {
        backgroundColor: '#4D7A20',
        marginRight: 0,
        marginLeft: 8,
    },
    viewSavedText: {
        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
        fontSize: 16,
    },
    globalSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#888',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    horizontalList: {
        paddingBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 20,
    }
});
