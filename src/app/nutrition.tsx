import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import React, {
    useState,
    useMemo,
    useEffect
} from 'react';


import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    View,
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';


import {
    useLocalSearchParams,
    router
} from 'expo-router';


// ==========================================
// ADDED:
// PickTip gradient background.
// ==========================================
import { LinearGradient } from 'expo-linear-gradient';



import { Food } from '../data/nutrition';

import { useFoodSuggestions } from '../hooks/useFoodSuggestions';

import { useSavedNutrition } from '../context/SavedNutritionContext';

import { useMealLog } from '../context/MealLogContext';

import { useUser } from '../context/UserContext';

import {
    fetchRecommendations,
    SpoonacularRecipe
} from '../services/spoonacular';


import { RecipeCard } from '../components/recipe-card';
import { nutritionRecommendations } from '../data/nutrition';





export default function NutritionScreen() {
export default function NutritionScreen() {
    const {
        intensity,
        category,
    } = useLocalSearchParams();

    const { profile } = useUser();

    const [
        selectedMealType,
        setSelectedMealType,
    ] = useState<string | undefined>(undefined);

    const suggestions = useFoodSuggestions({
        intensity,
        category,
        mealType: selectedMealType,
    });

    const {
        saveFood,
        isSaved,
        removeFood,
    } = useSavedNutrition();

    const {
        logMeal,
    } = useMealLog();

    const [
        searchQuery,
        setSearchQuery,
    ] = useState('');

    const [
        globalRecipes,
        setGlobalRecipes,
    ] = useState<SpoonacularRecipe[]>([]);

    const [
        isLoadingRecipes,
        setIsLoadingRecipes,
    ] = useState(false);

    const mealTypes = [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snack',
    ];

    // Keep main's intensity mapping so both old and new routes work.
    const intensityParam = Array.isArray(intensity)
        ? intensity[0]
        : (intensity || 'beginner');

    const mapping: Record<string, string> = {
        beginner: 'Low',
        intermediate: 'Medium',
        expert: 'High',
    };

    const fallbackKey =
        mapping[intensityParam.toLowerCase()] || intensityParam;

    const nutrition =
        nutritionRecommendations[
            fallbackKey as keyof typeof nutritionRecommendations
        ];

    useEffect(() => {
        loadGlobalRecipes();
    }, [
        intensity,
        selectedMealType,
        profile.dietaryPreference,
    ]);


    };
    return (
      
      
return (
    <LinearGradient
        colors={[
            '#78B63C',
            '#4D7A20',
            '#355817',
        ]}
        start={{
            x: 0,
            y: 0,
        }}
        end={{
            x: 1,
            y: 1,
        }}
        style={styles.gradient}
    >
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButton}>
                            Back
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            router.push('/dashboard')
                        }
                    >
                        <Text style={styles.dashboardLink}>
                            Dashboard
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>
                    Recommended Fuel
                </Text>

                <Text style={styles.subtitle}>
                    Based on {intensityParam} intensity workout
                </Text>

                {nutrition && (
                    <View style={styles.tipsCard}>
                        <Text style={styles.tipsTitle}>
                            General Guidelines
                        </Text>

                        <View style={styles.tipRow}>
                            <Text style={styles.tipLabel}>
                                Protein:
                            </Text>

                            <Text style={styles.tipValue}>
                                {nutrition.protein}
                            </Text>
                        </View>

                        <View style={styles.tipRow}>
                            <Text style={styles.tipLabel}>
                                Carbs:
                            </Text>

                            <Text style={styles.tipValue}>
                                {nutrition.carbs}
                            </Text>
                        </View>

                        <View style={styles.tipRow}>
                            <Text style={styles.tipLabel}>
                                Hydration:
                            </Text>

                            <Text style={styles.tipValue}>
                                {nutrition.hydration}
                            </Text>
                        </View>
                    </View>
                )}

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search foods, ingredients, or diet..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <View style={styles.filterContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                !selectedMealType &&
                                    styles.activeFilterChip,
                            ]}
                            onPress={() =>
                                setSelectedMealType(undefined)
                            }
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    !selectedMealType &&
                                        styles.activeFilterChipText,
                                ]}
                            >
                                All
                            </Text>
                        </TouchableOpacity>

                        {mealTypes.map(type => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.filterChip,
                                    selectedMealType === type &&
                                        styles.activeFilterChip,
                                ]}
                                onPress={() =>
                                    setSelectedMealType(type)
                                }
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        selectedMealType === type &&
                                            styles.activeFilterChipText,
                                    ]}
                                >
                                    {type}
                                </Text>
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
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.globalSection}>
                        <Text style={styles.sectionTitle}>
                            Global Recipe Discoveries
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Powered by Spoonacular
                        </Text>

                        {isLoadingRecipes ? (
                            <View style={styles.loadingSuggestions}>
                                <ActivityIndicator
                                    size="large"
                                    color="#FFFFFF"
                                />

                                <Text style={styles.loadingText}>
                                    Fetching recipes...
                                </Text>
                            </View>
                        ) : globalRecipes.length === 0 ? (
                            <Text style={styles.recipeErrorText}>
                                No global recipes were found for your
                                current preferences.
                            </Text>
                        ) : (
                            <FlatList
                                horizontal
                                data={globalRecipes}
                                renderItem={({ item }) => (
                                    <RecipeCard
                                        recipe={item}
                                        onPress={() =>
                                            Alert.alert(
                                                item.title,
                                                'Recipe details integration coming soon!'
                                            )
                                        }
                                    />
                                )}
                                keyExtractor={item =>
                                    item.id.toString()
                                }
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={
                                    styles.horizontalList
                                }
                            />
                        )}

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>
                            Hand-picked Suggestions
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        {searchQuery
                            ? 'No foods match your search.'
                            : 'No specific recommendations found for this intensity.'}
                    </Text>
                }
            />

            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.viewSavedButton}
                    onPress={() =>
                        router.push('/saved')
                    }
                >
                    <Text style={styles.viewSavedText}>
                        Saved Items
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.viewSavedButton,
                        styles.dashboardButton,
                    ]}
                    onPress={() =>
                        router.push('/dashboard')
                    }
                >
                    <Text style={styles.dashboardButtonText}>
                        My Dashboard
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    </LinearGradient>
);
  
}
const styles = StyleSheet.create({

    // ==========================================
    // ADDED:
    // Full PickTip gradient background.
    // ==========================================
    gradient: {
        flex: 1,
    },


    container: {
        flex: 1,
    },



    header: {

        paddingHorizontal: 22,

        paddingTop: 15,

        paddingBottom: 20,

    },



    topBar: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginBottom: 15,

    },



    backButton: {

        color: '#FFFFFF',

        fontSize: 16,

        fontWeight: '700',

    },



    dashboardLink: {

        color: '#355817',

        backgroundColor: '#FFFFFF',

        paddingHorizontal: 14,

        paddingVertical: 8,

        borderRadius: 20,

        fontWeight: '800',

    },



    title: {

        color: '#FFFFFF',

        fontSize: 34,

        fontWeight: '800',

    },



    subtitle: {
subtitle: {
    color: '#FFFFFF',
    opacity: 0.85,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 18,
},

// General Guidelines card
tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
},

tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
},

tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
},

tipLabel: {
    width: 90,
    fontSize: 16,
    fontWeight: '600',
    color: '#C8E6C9',
},

tipValue: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
},

searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    fontSize: 15,
    color: '#333',
},

filterContainer: {
    marginTop: 16,
},

filterChip: {
    backgroundColor: 'rgba(255,255,255,.25)',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 10,
},

activeFilterChip: {
    backgroundColor: '#FFFFFF',
},

filterChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
},

activeFilterChipText: {
    color: '#355817',
},

listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
},

card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 7,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 7,
},

cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
},

nameContainer: {
    flex: 1,
},

foodName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#355817',
},

servingSize: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
},

saveButton: {
    backgroundColor: '#EEF7E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
},

savedButton: {
    backgroundColor: '#4D7A20',
},

saveButtonText: {
    color: '#4D7A20',
    fontWeight: '800',
    fontSize: 12,
},



    description: {
description: {
    marginTop: 14,
    color: '#444',
    lineHeight: 21,
},

statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
},

stat: {
    alignItems: 'center',
},

statValue: {
    color: '#4D7A20',
    fontWeight: '800',
    fontSize: 17,
},

statLabel: {
    fontSize: 11,
    color: '#777',
},

footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
},

// Loading state for Spoonacular recipes
loadingSuggestions: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
},

loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
},

recipeErrorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 24,
    opacity: 0.9,
},
labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
},

label: {
    backgroundColor: '#EEF7E8',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
},

labelText: {
    color: '#355817',
    fontSize: 11,
    fontWeight: '700',
},

logButton: {
    backgroundColor: '#4D7A20',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
},

logButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
},

bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,.95)',
},

viewSavedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4D7A20',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 8,
},

dashboardButton: {
    backgroundColor: '#4D7A20',
    marginRight: 0,
    marginLeft: 8,
},

dashboardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
},

viewSavedText: {
    color: '#4D7A20',
    fontSize: 16,
    fontWeight: '700',
},
emptyText: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 40,
},

globalSection: {
    marginBottom: 20,
},

sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
},

sectionSubtitle: {
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 12,
},

horizontalList: {
    paddingBottom: 10,
},

divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,.3)',
    marginVertical: 20,
},

});