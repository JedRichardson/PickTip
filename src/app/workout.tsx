import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { workouts } from '../data/workouts';

import { useWorkoutLog } from '../context/WorkoutLogContext';

export default function WorkoutScreen() {
    const { category } = useLocalSearchParams();
    const { logWorkout } = useWorkoutLog();
    const [workout, setWorkout] = useState<(typeof workouts)[number] | null>(null);

    const categoryParam = Array.isArray(category) ? category[0] : category;

    const filtered = workouts.filter(
        item => item.category === categoryParam
    );

    function pickRandomWorkout() {
        if (filtered.length === 0) {
            setWorkout(null);
            return;
        }

        const randomIndex = Math.floor(Math.random() * filtered.length);
        setWorkout(filtered[randomIndex]);
    }

    useEffect(() => {
        pickRandomWorkout();
    }, [categoryParam]);

    const handleFinishWorkout = async () => {
        if (workout) {
            await logWorkout({
                name: workout.name,
                duration: workout.duration,
                intensity: workout.intensity,
                calories: parseInt(workout.calories),
            });
            router.push(
                `/nutrition?intensity=${encodeURIComponent(workout.intensity)}&category=${encodeURIComponent(workout.category)}`
            );
        }
    };

    if (!workout) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>No workouts found.</Text>
                <Text style={styles.description}>
                    Please go back and choose another category.
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

            <View style={styles.card}>
                <Text style={styles.title}>
                    {workout.name}
                </Text>

                <Text style={styles.detail}>
                    Duration: {workout.duration}
                </Text>

                <Text style={styles.detail}>
                    Intensity: {workout.intensity}
                </Text>

                <Text style={styles.description}>
                    {workout.description}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.rerollButton}
                onPress={pickRandomWorkout}
            >
                <Text style={styles.rerollButtonText}>
                    Reroll Workout
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={handleFinishWorkout}
            >
                <Text style={styles.buttonText}>
                    Finish & View Nutrition Tips
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
});