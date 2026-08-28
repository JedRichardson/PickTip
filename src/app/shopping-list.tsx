import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useShoppingList, Ingredient } from '../context/ShoppingListContext';

export default function ShoppingListScreen() {
    const { ingredients, toggleIngredient, removeIngredient, clearList } = useShoppingList();

    const sections = useMemo(() => {
        const groups: Record<string, Ingredient[]> = {};
        ingredients.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });
        return Object.keys(groups).map(cat => ({
            title: cat,
            data: groups[cat]
        }));
    }, [ingredients]);

    const handleClear = () => {
        Alert.alert(
            'Clear List',
            'Are you sure you want to clear your entire shopping list?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearList },
            ]
        );
    };

    const renderItem = ({ item }: { item: Ingredient }) => (
        <View style={styles.itemCard}>
            <TouchableOpacity
                style={[styles.checkbox, item.checked && styles.checkboxChecked]}
                onPress={() => toggleIngredient(item.id)}
            >
                {item.checked && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <View style={styles.itemInfo}>
                <Text style={[styles.itemName, item.checked && styles.textChecked]}>
                    {item.name}
                </Text>
                <Text style={styles.itemOriginal}>{item.original}</Text>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeIngredient(item.id)}
            >
                <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={['#78B63C', '#4D7A20', '#355817']}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Shopping List</Text>
                    <TouchableOpacity onPress={handleClear} disabled={ingredients.length === 0}>
                        <Text style={[styles.clearButton, ingredients.length === 0 && { opacity: 0.5 }]}>Clear</Text>
                    </TouchableOpacity>
                </View>

                <SectionList
                    sections={sections}
                    renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{title}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Your shopping list is empty.</Text>
                            <Text style={styles.emptySubtext}>Add ingredients from recipes to get started!</Text>
                            <TouchableOpacity
                                style={styles.browseButton}
                                onPress={() => router.push('/category')}
                            >
                                <Text style={styles.browseButtonText}>Browse Recipes</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 25,
    },
    backButton: { color: '#fff', fontSize: 16, fontWeight: '700' },
    title: { color: '#fff', fontSize: 28, fontWeight: '800' },
    clearButton: { color: '#fff', fontSize: 16, fontWeight: '700' },
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionHeader: {
        marginTop: 10,
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    sectionHeaderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#4D7A20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxChecked: { backgroundColor: '#4D7A20' },
    checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: '700', color: '#333', textTransform: 'capitalize' },
    itemOriginal: { fontSize: 12, color: '#888', marginTop: 2 },
    textChecked: { textDecorationLine: 'line-through', opacity: 0.6 },
    removeButton: { padding: 8 },
    removeText: { color: '#ccc', fontSize: 18 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
    emptySubtext: { color: '#fff', opacity: 0.8, fontSize: 14, textAlign: 'center', marginBottom: 24 },
    browseButton: { backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
    browseButtonText: { color: '#4D7A20', fontWeight: '800' },
});
