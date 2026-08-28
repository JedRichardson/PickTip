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
    const [targetServings, setTargetServings] = useState(1);
    const [originalServings, setOriginalServings] = useState(1);

    useEffect(() => {
        const loadDetails = async () => {
            if (!id) return;
            setIsLoading(true);
            const data = await getRecipeDetails(Number(id));
            setRecipe(data);
            if (data?.servings) {
                setTargetServings(data.servings);
                setOriginalServings(data.servings);
            }
            setIsLoading(false);
        };
        loadDetails();
    }, [id]);

    const getScaleFactor = () => targetServings / originalServings;

    const recipeToSpoonacular = (r: any): SpoonacularRecipe => {
        const nutrients = r.nutrition?.nutrients ?? [];
        const factor = getScaleFactor();

        const getVal = (name: string) => nutrients.find((n: any) => n.name === name)?.amount;

        return {
            id: r.id,
            title: r.title,
            image: r.image,
            summary: r.summary,
            calories: (getVal('Calories') || 0) * factor,
            protein: ((getVal('Protein') || 0) * factor).toFixed(1) + 'g',
            fat: ((getVal('Fat') || 0) * factor).toFixed(1) + 'g',
            carbs: ((getVal('Carbohydrates') || 0) * factor).toFixed(1) + 'g',
        };
    };

    const handleLog = () => {
        if (!recipe) return;
        logSpoonacularRecipe(recipeToSpoonacular(recipe));
        Alert.alert('Success', `Logged ${targetServings} servings to your daily tracker!`);
        router.back();
    };

    const handlePlan = () => {
        if (!recipe) return;
        planMeal(recipeToSpoonacular(recipe));
        Alert.alert('Success', `Added ${targetServings} servings to your daily plan!`);
        router.push('/dashboard');
    };

    const handleAddShoppingList = () => {
        if (!recipe || !recipe.extendedIngredients) return;
        const factor = getScaleFactor();
        const ingredients = recipe.extendedIngredients.map((ing: any) => ({
            name: ing.name,
            amount: ing.amount * factor,
            unit: ing.unit,
            original: `${(ing.amount * factor).toFixed(1)} ${ing.unit} ${ing.name}`,
        }));
        addIngredients(ingredients);
        Alert.alert('Success', `Ingredients for ${targetServings} servings added to shopping list!`);
    };

    const toggleSave = () => {
        if (!recipe) return;
        const r = recipeToSpoonacular(recipe);
        const foodItem = {
            id: String(r.id),
            name: r.title,
            description: r.summary?.replace(/<[^>]*>?/gm, '') || '',
            calories: r.calories || 0,
            protein: parseFloat(r.protein?.replace('g', '') || '0'),
            carbs: parseFloat(r.carbs?.replace('g', '') || '0'),
            fat: parseFloat(r.fat?.replace('g', '') || '0'),
            dietaryLabels: [],
            mealType: 'Any',
            pairingCategories: [],
            pairingIntensity: 'Any',
            servingSize: targetServings + ' servings'
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
    const factor = getScaleFactor();

    return (
        <View style={styles.container}>
            <ScrollView bounces={false}>
                <Image source={{ uri: recipe.image }} style={styles.image} />

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.saveButton, saved && styles.savedButton]} onPress={toggleSave}>
                    <Text style={styles.saveButtonText}>{saved ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>

                <View style={styles.content}>
                    <Text style={styles.title}>{recipe.title}</Text>

                    <View style={styles.servingsControl}>
                        <Text style={styles.servingsLabel}>ADJUST SERVINGS</Text>
                        <View style={styles.servingsPicker}>
                            <TouchableOpacity
                                style={styles.servingsBtn}
                                onPress={() => setTargetServings(Math.max(1, targetServings - 1))}
                            >
                                <Text style={styles.servingsBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.servingsValue}>{targetServings}</Text>
                            <TouchableOpacity
                                style={styles.servingsBtn}
                                onPress={() => setTargetServings(targetServings + 1)}
                            >
                                <Text style={styles.servingsBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{recipe.readyInMinutes}</Text>
                            <Text style={styles.infoLabel}>Mins</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{Math.round((recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0) * factor)}</Text>
                            <Text style={styles.infoLabel}>Kcal</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoValue}>{Math.round((recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0) * factor)}g</Text>
                            <Text style={styles.infoLabel}>Prot</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {recipe.extendedIngredients?.map((ing: any, idx: number) => (
                        <Text key={idx} style={styles.ingredient}>
                            • {ing.measures?.us?.amount ? (ing.measures.us.amount * factor).toFixed(1) : (ing.amount * factor).toFixed(1)} {ing.measures?.us?.unitShort || ing.unit} {ing.name}
                        </Text>
                    ))}

                    <TouchableOpacity style={styles.addShoppingButton} onPress={handleAddShoppingList}>
                        <Text style={styles.addShoppingText}>🛒 Export to Shopping List</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <Text style={styles.instructions}>
                        {recipe.instructions?.replace(/<[^>]*>?/gm, '') || 'No instructions provided.'}
                    </Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.planButton]} onPress={handlePlan}>
                            <Text style={styles.actionButtonText}>📅 Plan</Text>
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
    container: { flex: 1, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#666' },
    image: { width: '100%', height: 300 },
    backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    backButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    saveButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    savedButton: { backgroundColor: '#4D7A20' },
    saveButtonText: { fontSize: 20 },
    content: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
    title: { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 },
    servingsControl: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    servingsLabel: { fontSize: 10, fontWeight: '800', color: '#888', letterSpacing: 1 },
    servingsPicker: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    servingsBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
    servingsBtnText: { fontSize: 18, fontWeight: '700', color: '#4D7A20' },
    servingsValue: { fontSize: 18, fontWeight: '800', color: '#333' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30, backgroundColor: '#EEF7E8', padding: 15, borderRadius: 20 },
    infoBox: { alignItems: 'center' },
    infoValue: { fontSize: 18, fontWeight: '700', color: '#4D7A20' },
    infoLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginTop: 4 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 10, marginBottom: 15 },
    ingredient: { fontSize: 15, color: '#444', marginBottom: 8, lineHeight: 22 },
    addShoppingButton: { backgroundColor: '#F0F4E8', padding: 12, borderRadius: 12, marginTop: 10, alignItems: 'center' },
    addShoppingText: { color: '#4D7A20', fontWeight: '700' },
    instructions: { fontSize: 15, color: '#444', lineHeight: 24, marginBottom: 30 },
    actionRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
    actionButton: { flex: 1, padding: 18, borderRadius: 16, alignItems: 'center' },
    planButton: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#4D7A20' },
    logButton: { backgroundColor: '#4D7A20' },
    actionButtonText: { fontSize: 16, fontWeight: '700', color: '#333' },
});
