import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getRecipeDetails, SpoonacularRecipe } from '../../services/spoonacular';
import { useMealLog } from '../../context/MealLogContext';
import { useShoppingList } from '../../context/ShoppingListContext';
import { useSavedNutrition } from '../../context/SavedNutritionContext';

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();
    const { logSpoonacularRecipe, planMeal } = useMealLog();
    const { addIngredients } = useShoppingList();
    const { saveFood, removeFood, isSaved } = useSavedNutrition();

    const [recipe, setRecipe] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            if (!id) return;
            setIsLoading(true);
            const data = await getRecipeDetails(Number(id));
            setRecipe(data);
            setIsLoading(false);
        };
        loadDetails();
    }, [id]);

    const recipeToSpoonacular = (r: any): SpoonacularRecipe => {
        const nutrients = r.nutrition?.nutrients ?? [];
        return {
            id: r.id,
            title: r.title,
            image: r.image,
            summary: r.summary,
            calories: nutrients.find((n: any) => n.name === 'Calories')?.amount,
            protein: nutrients.find((n: any) => n.name === 'Protein')?.amount + 'g',
            fat: nutrients.find((n: any) => n.name === 'Fat')?.amount + 'g',
            carbs: nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount + 'g',
        };
    };

    const handleLog = () => {
        if (!recipe) return;
        logSpoonacularRecipe(recipeToSpoonacular(recipe));
        Alert.alert('Success', 'Meal logged to your daily tracker!');
        router.back();
    };

    const handlePlan = () => {
        if (!recipe) return;
        planMeal(recipeToSpoonacular(recipe));
        Alert.alert('Success', 'Meal added to your daily plan!');
        router.push('/dashboard');
    };

    const handleAddShoppingList = () => {
        if (!recipe || !recipe.extendedIngredients) return;
        const ingredients = recipe.extendedIngredients.map((ing: any) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            original: ing.original,
        }));
        addIngredients(ingredients);
        Alert.alert('Success', 'Ingredients added to your shopping list!');
    };

    const toggleSave = () => {
        if (!recipe) return;
        const r = recipeToSpoonacular(recipe);
        // Map SpoonacularRecipe to Food for SavedNutritionContext compatibility
        const foodItem = {
            id: String(r.id),
            name: r.title,
            description: r.summary?.replace(/<[^>]*>?/gm, '') || '',
            calories: r.calories || 0,
            protein: parseFloat(r.protein?.replace('g', '') || '0'),
            carbs: parseFloat(r.carbs?.replace('g', '') || '0'),
            fat: parseFloat(r.fat?.replace('g', '') || '0'),
            dietaryLabels: [], // Not provided by detail API in this format easily
            mealType: 'Any',
            pairingCategories: [],
            pairingIntensity: 'Any',
            servingSize: recipe.servings + ' servings'
        };

        if (isSaved(foodItem.id)) {
            removeFood(foodItem.id);
        } else {
            saveFood(foodItem);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4D7A20" />
                <Text style={styles.loadingText}>Fetching delicious details...</Text>
            </SafeAreaView>
        );
    }

    if (!recipe) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Could not load recipe details.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const saved = isSaved(String(recipe.id));

    return (
        <View style={styles.container}>
            <ScrollView bounces={false}>
                <Image source={{ uri: recipe.image }} style={styles.image} />

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.saveButton, saved && styles.savedButton]}
                    onPress={toggleSave}
                >
                    <Text style={styles.saveButtonText}>{saved ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.title}>{recipe.title}</Text>

                    {recipe.summary && (
                        <Text style={styles.summary} numberOfLines={3}>
                            {recipe.summary.replace(/<[^>]*>?/gm, '')}
                        </Text>
                    )}

                    <View style={styles.infoRow}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{recipe.readyInMinutes}</Text>
                            <Text style={styles.infoLabel}>Mins</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{recipe.servings}</Text>
                            <Text style={styles.infoLabel}>Servings</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{Math.round(recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0)}</Text>
                            <Text style={styles.infoLabel}>Kcal</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {recipe.extendedIngredients?.map((ing: any, idx: number) => (
                        <Text key={idx} style={styles.ingredient}>• {ing.original}</Text>
                    ))}

                    <TouchableOpacity style={styles.addShoppingButton} onPress={handleAddShoppingList}>
                        <Text style={styles.addShoppingText}>🛒 Add all to Shopping List</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <Text style={styles.instructions}>
                        {recipe.instructions?.replace(/<[^>]*>?/gm, '') || 'No instructions provided.'}
                    </Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.planButton]} onPress={handlePlan}>
                            <Text style={styles.actionButtonText}>📅 Add to Plan</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionButton, styles.logButton]} onPress={handleLog}>
                            <Text style={styles.actionButtonText}>🍴 Log Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    image: {
        width: '100%',
        height: 300,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    saveButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    savedButton: {
        backgroundColor: '#4D7A20',
    },
    saveButtonText: {
        fontSize: 20,
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    summary: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 20,
    },
    infoBox: {
        alignItems: 'center',
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4D7A20',
    },
    infoLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginTop: 10,
        marginBottom: 15,
    },
    ingredient: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        lineHeight: 22,
    },
    addShoppingButton: {
        backgroundColor: '#EEF7E8',
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    addShoppingText: {
        color: '#4D7A20',
        fontWeight: '700',
    },
    instructions: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 30,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
    },
    actionButton: {
        flex: 1,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    planButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#4D7A20',
    },
    logButton: {
        backgroundColor: '#4D7A20',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
