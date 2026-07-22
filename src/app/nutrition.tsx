import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchRecommendations, SpoonacularRecipe } from '../services/spoonacular';
import { useUser } from '../context/UserContext';
import { RecipeCard } from '../components/recipe-card';
import { nutritionRecommendations } from '../data/nutrition';

export default function NutritionScreen() {
    const { intensity } = useLocalSearchParams();
    const { profile } = useUser();

    const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const intensityParam = Array.isArray(intensity) ? intensity[0] : (intensity || 'beginner');

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                setIsLoading(true);
                setError('');

                // Map intensity to nutrition targets
                let minProtein = 15;
                let maxCalories = 500;

                if (intensityParam.toLowerCase() === 'expert' || intensityParam === 'High') {
                    minProtein = 30;
                    maxCalories = 800;
                } else if (intensityParam.toLowerCase() === 'intermediate' || intensityParam === 'Medium') {
                    minProtein = 20;
                    maxCalories = 600;
                }

                const results = await fetchRecommendations({
                    diet: profile.dietaryPreference === 'None' ? undefined : profile.dietaryPreference,
                    minProtein,
                    maxCalories,
                    number: 5
                });

                setRecipes(results);
            } catch (err) {
                console.error(err);
                setError('Failed to load meal recommendations.');
            } finally {
                setIsLoading(false);
            }
        };

        loadRecipes();
    }, [intensityParam, profile.dietaryPreference]);

    // Mapping for fallback tips
    const mapping: Record<string, string> = {
        'beginner': 'Low',
        'intermediate': 'Medium',
        'expert': 'High'
    };

    const fallbackKey = mapping[intensityParam.toLowerCase()] || intensityParam;
    const nutrition = nutritionRecommendations[fallbackKey as keyof typeof nutritionRecommendations];

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Recommended Fuel</Text>
                <Text style={styles.subtitle}>Tailored for your {intensityParam} workout</Text>

                {nutrition && (
                    <View style={styles.tipsCard}>
                        <Text style={styles.sectionTitle}>General Guidelines</Text>
                        <View style={styles.tipRow}>
                            <Text style={styles.tipLabel}>Protein:</Text>
                            <Text style={styles.tipValue}>{nutrition.protein}</Text>
                        </View>
                        <View style={styles.tipRow}>
                            <Text style={styles.tipLabel}>Carbs:</Text>
                            <Text style={styles.tipValue}>{nutrition.carbs}</Text>
                        </View>
                        <View style={styles.tipRow}>
                            <Text style={styles.tipLabel}>Hydration:</Text>
                            <Text style={styles.tipValue}>{nutrition.hydration}</Text>
                        </View>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Suggested Meals</Text>
                <Text style={styles.description}>
                    Real-time suggestions based on your {profile.dietaryPreference !== 'None' ? profile.dietaryPreference : ''} preferences
                </Text>

                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Fetching recipes...</Text>
                    </View>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : recipes.length === 0 ? (
                    <Text style={styles.errorText}>No specific recipes found for your criteria. Try adjusting your preferences in settings.</Text>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeList}>
                        {recipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                            />
                        ))}
                    </ScrollView>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4D7A20',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 80,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        color: '#E8F5E9',
        marginBottom: 24,
        opacity: 0.9,
    },
    tipsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    tipRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
    },
    tipLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C8E6C9',
        width: 80,
    },
    tipValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        color: '#E8F5E9',
        marginBottom: 16,
        opacity: 0.8,
    },
    recipeList: {
        flexGrow: 0,
        marginBottom: 20,
    },
    loaderContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    errorText: {
        color: '#FFCDD2',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
