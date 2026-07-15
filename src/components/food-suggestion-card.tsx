import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Food } from '../data/nutrition';

interface FoodSuggestionCardProps {
    food: Food;
    onPress: () => void;
    onLog: () => void;
}

export const FoodSuggestionCard = ({ food, onPress, onLog }: FoodSuggestionCardProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{food.name}</Text>
                    <View style={styles.intensityBadge}>
                        <Text style={styles.intensityText}>{food.pairingIntensity}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {food.description}
                </Text>

                <View style={styles.stats}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{food.calories}</Text>
                        <Text style={styles.statLabel}>kcal</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{food.protein}g</Text>
                        <Text style={styles.statLabel}>Prot</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{food.carbs}g</Text>
                        <Text style={styles.statLabel}>Carbs</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.logButton} onPress={onLog}>
                    <Text style={styles.logButtonText}>Quick Log</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        flex: 1,
    },
    intensityBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    intensityText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4D7A20',
        textTransform: 'uppercase',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    stats: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 12,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4D7A20',
    },
    statLabel: {
        fontSize: 10,
        color: '#888',
        textTransform: 'uppercase',
    },
    logButton: {
        backgroundColor: '#4D7A20',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    logButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});
