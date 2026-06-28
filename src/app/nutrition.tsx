import { useLocalSearchParams, router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { nutritionRecommendations } from '../data/nutrition';

export default function NutritionScreen() {
    const { intensity } = useLocalSearchParams();

    const intensityParam = Array.isArray(intensity) ? intensity[0] : intensity;

    const nutrition =
        nutritionRecommendations[
            intensityParam as keyof typeof nutritionRecommendations
        ];

    if (!nutrition) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>No nutrition tips found.</Text>
                <Text style={styles.item}>
                    Please go back and choose another workout.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>
                Recommended Fuel
            </Text>

            <Text style={styles.item}>
                Protein: {nutrition.protein}
            </Text>

            <Text style={styles.item}>
                Carbs: {nutrition.carbs}
            </Text>

            <Text style={styles.item}>
                Hydration: {nutrition.hydration}
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#4D7A20',
    },

    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        paddingVertical: 10,
        paddingHorizontal: 14,

    },

    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 24,
    },

    item: {
        fontSize: 18,
        marginBottom: 12,
    },
});