import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';
import { useMealLog } from '../context/MealLogContext';
import { useWorkoutLog } from '../context/WorkoutLogContext';

export default function SettingsScreen() {
    const { profile, updateProfile, updateGoals } = useUser();
    const { loadDemoData: loadMealDemo } = useMealLog();
    const { loadDemoData: loadWorkoutDemo } = useWorkoutLog();

    const [name, setName] = useState(profile.name);
    const [diet, setDiet] = useState(profile.dietaryPreference);
    const [calories, setCalories] = useState(profile.goals.calories.toString());
    const [protein, setProtein] = useState(profile.goals.protein.toString());
    const [carbs, setCarbs] = useState(profile.goals.carbs.toString());
    const [fat, setFat] = useState(profile.goals.fat.toString());

    const diets = ['None', 'Vegan', 'Vegetarian', 'Keto', 'Gluten-Free'];

    const handleSave = async () => {
        try {
            await updateProfile({
                name,
                dietaryPreference: diet
            });
            await updateGoals({
                calories: parseInt(calories) || 0,
                protein: parseInt(protein) || 0,
                carbs: parseInt(carbs) || 0,
                fat: parseInt(fat) || 0,
            });
            Alert.alert('Success', 'Profile updated successfully!');
            router.back();
        } catch (e) {
            Alert.alert('Error', 'Failed to save settings.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Info</Text>
                    <Text style={styles.label}>Display Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                    />

                    <Text style={styles.label}>Dietary Preference</Text>
                    <View style={styles.dietContainer}>
                        {diets.map(d => (
                            <TouchableOpacity
                                key={d}
                                style={[styles.dietChip, diet === d && styles.activeDietChip]}
                                onPress={() => setDiet(d)}
                            >
                                <Text style={[styles.dietChipText, diet === d && styles.activeDietChipText]}>{d}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Daily Goals</Text>
                    <View style={styles.goalRow}>
                        <View style={styles.goalInputContainer}>
                            <Text style={styles.label}>Calories</Text>
                            <TextInput
                                style={styles.input}
                                value={calories}
                                onChangeText={setCalories}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.goalInputContainer}>
                            <Text style={styles.label}>Protein (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={protein}
                                onChangeText={setProtein}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View style={styles.goalRow}>
                        <View style={styles.goalInputContainer}>
                            <Text style={styles.label}>Carbs (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={carbs}
                                onChangeText={setCarbs}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.goalInputContainer}>
                            <Text style={styles.label}>Fat (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={fat}
                                onChangeText={setFat}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Showcase Tools</Text>
                    <Text style={styles.label}>Prepare for demo by loading 7 days of activity</Text>
                    <TouchableOpacity
                        style={styles.demoButton}
                        onPress={async () => {
                            await loadMealDemo();
                            await loadWorkoutDemo();
                            Alert.alert('Demo Ready', '7 days of activity data loaded. Check your Dashboard!');
                        }}
                    >
                        <Text style={styles.demoButtonText}>🚀 Load Showcase Data</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    backButton: {
        color: '#666',
        fontSize: 16,
    },
    saveButton: {
        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    dietContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dietChip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    activeDietChip: {
        backgroundColor: '#4D7A20',
        borderColor: '#4D7A20',
    },
    dietChipText: {
        color: '#666',
        fontSize: 14,
    },
    activeDietChipText: {
        color: '#fff',
        fontWeight: '600',
    },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    goalInputContainer: {
        flex: 0.48,
    },
    demoButton: {
        backgroundColor: '#355817',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    demoButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    }
});
