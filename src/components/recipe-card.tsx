import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { SpoonacularRecipe } from '../services/spoonacular';

interface RecipeCardProps {
    recipe: SpoonacularRecipe;
    onPress: () => void;
}

export const RecipeCard = ({ recipe, onPress }: RecipeCardProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>

                <View style={styles.macroRow}>
                    <View style={styles.macro}>
                        <Text style={styles.macroValue}>{Math.round(recipe.calories || 0)}</Text>
                        <Text style={styles.macroLabel}>kcal</Text>
                    </View>
                    <View style={styles.macro}>
                        <Text style={styles.macroValue}>{recipe.protein}</Text>
                        <Text style={styles.macroLabel}>Prot</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        height: 40,
        marginBottom: 8,
    },
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macro: {
        alignItems: 'center',
    },
    macroValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4D7A20',
    },
    macroLabel: {
        fontSize: 9,
        color: '#888',
        textTransform: 'uppercase',
    },
});
