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

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();
    const { logSpoonacularRecipe } = useMealLog();
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

    const handleLog = () => {
        if (!recipe) return;

        // Map back to SpoonacularRecipe interface for logging
        const recipeToLog: SpoonacularRecipe = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount,
            protein: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount + 'g',
            fat: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount + 'g',
            carbs: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount + 'g',
        };

        logSpoonacularRecipe(recipeToLog);
        Alert.alert('Success', 'Meal logged to your daily tracker!');
        router.back();
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

                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <Text style={styles.instructions}>
                        {recipe.instructions?.replace(/<[^>]*>?/gm, '') || 'No instructions provided.'}
                    </Text>

                    <TouchableOpacity style={styles.logButton} onPress={handleLog}>
                        <Text style={styles.logButtonText}>Log this Meal</Text>
                    </TouchableOpacity>
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
    instructions: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 30,
    },
    logButton: {
        backgroundColor: '#4D7A20',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    logButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
