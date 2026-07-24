import { useCallback, useEffect, useState } from 'react';

import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import {
    Exercise,
    getExercises,
} from '../api/picktipApi';

import { useWorkoutLog } from '../context/WorkoutLogContext';

const categoryMuscles = {
    legs: [
        'quadriceps',
        'hamstrings',
        'glutes',
        'calves',
    ],

    arms: [
        'biceps',
        'triceps',
        'forearms',
    ],

    core: [
        'abdominals',
        'lower_back',
    ],

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

    const { logWorkout } = useWorkoutLog();

    const [workout, setWorkout] =
        useState<Exercise | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const categoryParam = Array.isArray(category)
        ? category[0]
        : category;

    const pickRandomWorkout = useCallback(async () => {
        if (
            !categoryParam ||
            !(categoryParam in categoryMuscles)
        ) {
            setWorkout(null);
            setError(
                'That workout category was not found.'
            );
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const selectedCategory =
                categoryParam as WorkoutCategory;

            const muscles =
                categoryMuscles[selectedCategory];

            const randomMuscle =
                muscles[
                    Math.floor(
                        Math.random() * muscles.length
                    )
                ];

            const exercises =
                await getExercises(randomMuscle);

            if (exercises.length === 0) {
                setWorkout(null);
                setError(
                    'No exercises were found. Please try again.'
                );
                return;
            }

            const randomIndex = Math.floor(
                Math.random() * exercises.length
            );

            setWorkout(exercises[randomIndex]);
        } catch (requestError) {
            console.error(
                'Failed to load workout:',
                requestError
            );

            setWorkout(null);
            setError(
                'Could not load a workout. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    }, [categoryParam]);

    useEffect(() => {
        pickRandomWorkout();
    }, [pickRandomWorkout]);

    const handleFinishWorkout = async () => {
        if (!workout) {
            return;
        }

        const difficulty =
            workout.difficulty?.toLowerCase() ??
            'beginner';

        let estimatedCalories = 180;

        if (
            difficulty === 'intermediate' ||
            difficulty === 'medium'
        ) {
            estimatedCalories = 250;
        }

        if (
            difficulty === 'expert' ||
            difficulty === 'advanced' ||
            difficulty === 'high'
        ) {
            estimatedCalories = 350;
        }

        try {
            await logWorkout({
                name: workout.name,
                duration: '30 minutes',
                intensity: workout.difficulty,
                calories: estimatedCalories,
            });
        } catch (logError) {
            console.error(
                'Failed to log workout:',
                logError
            );
        }

        router.push(
            `/nutrition?intensity=${encodeURIComponent(
                workout.difficulty
            )}&category=${encodeURIComponent(
                categoryParam ?? ''
            )}`
        );
    };

    if (isLoading) {
        return (
            <LinearGradient
                colors={[
                    '#78B63C',
                    '#4D7A20',
                    '#355817',
                ]}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>
                            Back
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color="#FFFFFF"
                        />

                        <Text style={styles.loadingText}>
                            Picking a workout...
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (!workout) {
        return (
            <LinearGradient
                colors={[
                    '#78B63C',
                    '#4D7A20',
                    '#355817',
                ]}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>
                            Back
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.emptyCard}>
                        <Text style={styles.title}>
                            No workout found
                        </Text>

                        <Text style={styles.description}>
                            {error ||
                                'Please go back and choose another category.'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.rerollButton}
                        onPress={pickRandomWorkout}
                    >
                        <Text style={styles.rerollButtonText}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    const workoutInstructions =
        Array.isArray(workout.instructions)
            ? workout.instructions.join('\n\n')
            : workout.instructions;

    return (
        <LinearGradient
            colors={[
                '#78B63C',
                '#4D7A20',
                '#355817',
            ]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>
                        Back
                    </Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.title}>
                        {workout.name}
                    </Text>

                    <View style={styles.infoBox}>
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
                    </View>

                    <Text style={styles.description}>
                        {workoutInstructions}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.rerollButton}
                    onPress={pickRandomWorkout}
                    disabled={isLoading}
                >
                    <Text style={styles.rerollButtonText}>
                        Try Another Workout
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFinishWorkout}
                >
                    <Text style={styles.buttonText}>
                        Finish Workout
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },

    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },

    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },

    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 16,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 26,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 15,
        elevation: 8,
    },

    emptyCard: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        borderRadius: 25,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 15,
        elevation: 8,
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#355817',
        marginBottom: 18,
    },

    infoBox: {
        backgroundColor: '#EEF7E8',
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
    },

    detail: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4D7A20',
        marginBottom: 8,
        textTransform: 'capitalize',
    },

    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },

    rerollButton: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 18,
        marginTop: 28,
    },

    rerollButtonText: {
        textAlign: 'center',
        color: '#4D7A20',
        fontWeight: '800',
        fontSize: 16,
    },

    button: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 18,
        marginTop: 14,
    },

    buttonText: {
        color: '#4D7A20',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 17,
    },
});