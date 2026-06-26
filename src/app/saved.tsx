import { router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Food } from '../data/nutrition';
import { useSavedNutrition } from '../context/SavedNutritionContext';

export default function SavedFoodsScreen() {
    const { savedFoods, removeFood } = useSavedNutrition();

    const renderFoodItem = ({ item }: { item: Food }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.foodName}>{item.name}</Text>
                <TouchableOpacity
                    onPress={() => removeFood(item.id)}
                    style={styles.removeButton}
                >
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
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>My Saved Meals</Text>
            </View>

            <FlatList
                data={savedFoods}
                renderItem={renderFoodItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No meals saved yet.</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/category')}
                        >
                            <Text style={styles.browseButtonText}>Browse Workouts</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        flex: 1,
    },
    removeButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    removeButtonText: {
        color: '#FF5252',
        fontSize: 12,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4D7A20',
    },
    statLabel: {
        fontSize: 9,
        color: '#888',
        textTransform: 'uppercase',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
        marginBottom: 20,
    },
    browseButton: {
        backgroundColor: '#4D7A20',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    browseButtonText: {
        color: '#fff',
        fontWeight: '700',
    }
});
