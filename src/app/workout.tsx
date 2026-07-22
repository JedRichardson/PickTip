import { useCallback, useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    Exercise,
    getExercises,
} from '../api/picktipApi';

const categoryMuscles = {
    legs: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    arms: ['biceps', 'triceps', 'forearms'],
    core: ['abdominals', 'lower_back'],
    fullBody: [
        'quadriceps',
        'hamstrings',
        'glutes',
        'chest',
        'lats',
        'biceps',
        'triceps',
        'abdominals',
    ],
} as const;

type WorkoutCategory = keyof typeof categoryMuscles;

export default function WorkoutScreen() {
    const { category } = useLocalSearchParams<{
        category?: string | string[];
    }>();

    const [workout, setWorkout] = useState<Exercise | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const categoryParam = Array.isArray(category)
        ? category[0]
        : category;

    const pickRandomWorkout = useCallback(async () => {
        if (
            !categoryParam ||
            !(categoryParam in categoryMuscles)
        ) {
            setWorkout(null);
            setError('That workout category was not found.');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const selectedCategory =
                categoryParam as WorkoutCategory;

            const muscles = categoryMuscles[selectedCategory];

            const randomMuscle =
                muscles[
                    Math.floor(Math.random() * muscles.length)
                ];

            const exercises = await getExercises(randomMuscle);

            if (exercises.length === 0) {
                setWorkout(null);
                setError('No exercises were found. Please try again.');
                return;
            }

            const randomIndex = Math.floor(
                Math.random() * exercises.length
            );

            setWorkout(exercises[randomIndex]);
        } catch (requestError) {
            console.error(requestError);
            setWorkout(null);
            setError('Could not load a workout.');
        } finally {
            setIsLoading(false);
        }
    }, [categoryParam]);

    useEffect(() => {
        pickRandomWorkout();
    }, [pickRandomWorkout]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>
                        ← Back
                    </Text>
                </TouchableOpacity>

                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Picking a workout...
                </Text>
            </SafeAreaView>
        );
    }

    if (!workout) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>
                        ← Back
                    </Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    No workout found
                </Text>

                <Text style={styles.description}>
                    {error ||
                        'Please go back and choose another category.'}
                </Text>

                <TouchableOpacity
                    style={styles.rerollButton}
                    onPress={pickRandomWorkout}
                >
                    <Text style={styles.rerollButtonText}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>
                    ← Back
                </Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.title}>
                    {workout.name}
                </Text>

                <Text style={styles.detail}>
                    Muscle: {workout.muscle}
                </Text>

                <Text style={styles.detail}>
                    Type: {workout.type}
                </Text>

                <Text style={styles.detail}>
                    Equipment: {workout.equipment}
                </Text>

                <Text style={styles.detail}>
                    Difficulty: {workout.difficulty}
                </Text>

                <Text style={styles.description}>
                    {workout.instructions}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.rerollButton}
                onPress={pickRandomWorkout}
                disabled={isLoading}
            >
                <Text style={styles.rerollButtonText}>
                    Reroll Workout
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    router.push(
                        `/nutrition?intensity=${encodeURIComponent(
                            workout.difficulty
                        )}`
                    )
                }
            >
                <Text style={styles.buttonText}>
                    View Nutrition Tips
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },

    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },

    backButtonText: {
        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '700',
    },

    card: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 24,
    },

    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 16,
    },

    detail: {
        fontSize: 18,
        marginBottom: 8,
    },

    description: {
        fontSize: 16,
        lineHeight: 22,
        marginTop: 12,
    },

    rerollButton: {
        borderColor: '#4D7A20',
        borderWidth: 2,
        padding: 18,
        borderRadius: 16,
        marginTop: 30,
    },

    rerollButtonText: {
        color: '#4D7A20',
        textAlign: 'center',
        fontWeight: '700',
    },

    button: {
        backgroundColor: '#4D7A20',
        padding: 18,
        borderRadius: 16,
        marginTop: 14,
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
    },

    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
    },
});