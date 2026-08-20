import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getExercises, Exercise } from '../api/picktipApi';
import { useWorkoutLog } from '../context/WorkoutLogContext';
import { useSavedWorkout } from '../context/SavedWorkoutContext';

const categoryMuscles: Record<string, string[]> = {
    legs: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    arms: ['biceps', 'triceps', 'forearms'],
    core: ['abdominals', 'lower_back'],
    fullbody: ['chest', 'lats', 'biceps', 'triceps', 'quadriceps', 'hamstrings'],
};

export default function WorkoutScreen() {
    const { category } = useLocalSearchParams();
    const { logWorkout } = useWorkoutLog();
    const { saveWorkout, removeWorkout, isSaved } = useSavedWorkout();

    const [workout, setWorkout] = useState<Exercise | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const categoryParam = Array.isArray(category) ? category[0] : (category as string);

    const fetchWorkout = useCallback(async () => {
        if (!categoryParam || !categoryMuscles[categoryParam]) {
            setError('Invalid category selected.');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const muscles = categoryMuscles[categoryParam];
            const randomMuscle = muscles[Math.floor(Math.random() * muscles.length)];

            const exercises = await getExercises(randomMuscle);

            if (exercises.length === 0) {
                setError('No exercises found. Please try again.');
            } else {
                const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
                setWorkout(randomExercise);
                setSeconds(0);
                setTimerActive(false);
            }
        } catch (err) {
            setError('Failed to fetch workout. Please check your connection.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [categoryParam]);

    useEffect(() => {
        fetchWorkout();
    }, [fetchWorkout]);

    // Timer Effect
    useEffect(() => {
        if (timerActive) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [timerActive]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleFinishWorkout = async () => {
        if (workout) {
            const finalDuration = formatTime(seconds);
            const minsSpent = seconds / 60;

            // Scaled calories based on actual time spent
            const intensityMultiplier: Record<string, number> = { beginner: 5, intermediate: 8, expert: 12 };
            const perMinCals = intensityMultiplier[workout.difficulty.toLowerCase()] || 7;
            const finalCals = Math.round(minsSpent * perMinCals);

            await logWorkout({
                name: workout.name,
                duration: finalDuration,
                intensity: workout.difficulty,
                calories: finalCals > 0 ? finalCals : 10, // Min 10 cals
            });

            setTimerActive(false);
            Alert.alert(
                'Workout Complete!',
                `You crushed ${workout.name} for ${finalDuration}.\nBurned approx. ${finalCals} kcal!`,
                [{ text: 'Great!', onPress: () => router.push(`/nutrition?intensity=${encodeURIComponent(workout.difficulty)}&category=${encodeURIComponent(categoryParam)}`) }]
            );
        }
    };

    const toggleSave = () => {
        if (!workout) return;
        const workoutId = workout.name.replace(/\s+/g, '-').toLowerCase();
        if (isSaved(workoutId)) {
            removeWorkout(workoutId);
        } else {
            saveWorkout({
                id: workoutId,
                name: workout.name,
                type: workout.type,
                muscle: workout.muscle,
                equipment: workout.equipment,
                difficulty: workout.difficulty,
                instructions: workout.instructions,
                category: categoryParam
            });
        }
    };

    if (isLoading) {
        return (
            <LinearGradient colors={['#78B63C', '#4D7A20', '#355817']} style={styles.gradient}>
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Fetching your workout...</Text>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (error || !workout) {
        return (
            <LinearGradient colors={['#78B63C', '#4D7A20', '#355817']} style={styles.gradient}>
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.emptyCard}>
                        <Text style={styles.title}>{error || 'No workout found'}</Text>
                        <TouchableOpacity style={styles.rerollButton} onPress={fetchWorkout}>
                            <Text style={styles.rerollButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    const workoutId = workout.name.replace(/\s+/g, '-').toLowerCase();
    const saved = isSaved(workoutId);

    return (
        <LinearGradient colors={['#78B63C', '#4D7A20', '#355817']} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>{workout.name}</Text>
                        <TouchableOpacity onPress={toggleSave} style={styles.saveIconButton}>
                            <Text style={styles.saveIcon}>{saved ? '❤️' : '🤍'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.timerRow}>
                        <View style={styles.timerDisplay}>
                            <Text style={styles.timerLabel}>ACTIVE TIME</Text>
                            <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.timerButton, timerActive && styles.timerButtonActive]}
                            onPress={() => setTimerActive(!timerActive)}
                        >
                            <Text style={styles.timerButtonText}>{timerActive ? 'PAUSE' : 'START'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.detail}>Muscle: {workout.muscle}</Text>
                        <Text style={styles.detail}>Difficulty: {workout.difficulty}</Text>
                        <Text style={styles.detail}>Equipment: {workout.equipment}</Text>
                    </View>

                    <Text style={styles.description} numberOfLines={6}>
                        {workout.instructions}
                    </Text>
                </View>

                {!timerActive && seconds === 0 ? (
                    <TouchableOpacity style={styles.rerollButton} onPress={fetchWorkout}>
                        <Text style={styles.rerollButtonText}>Try Another Workout</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, seconds < 10 && { opacity: 0.5 }]}
                        onPress={handleFinishWorkout}
                        disabled={seconds < 10}
                    >
                        <Text style={styles.buttonText}>Finish Workout</Text>
                    </TouchableOpacity>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    loadingText: { color: '#FFFFFF', marginTop: 20, textAlign: 'center', fontSize: 18, fontWeight: '600' },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        backgroundColor: 'rgba(255,255,255,.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        zIndex: 10,
    },
    backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 26,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: .18,
        shadowRadius: 15,
        elevation: 8,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    title: { fontSize: 24, fontWeight: '800', color: '#355817', flex: 1 },
    saveIconButton: { padding: 8 },
    saveIcon: { fontSize: 24 },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    timerDisplay: { flex: 1 },
    timerLabel: { fontSize: 10, color: '#888', fontWeight: '800', letterSpacing: 1 },
    timerValue: { fontSize: 32, fontWeight: '900', color: '#333', fontFamily: 'monospace' },
    timerButton: {
        backgroundColor: '#4D7A20',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
    },
    timerButtonActive: {
        backgroundColor: '#FFA000',
    },
    timerButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
    emptyCard: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 25, alignItems: 'center' },
    infoBox: { backgroundColor: '#EEF7E8', padding: 16, borderRadius: 18, marginBottom: 16 },
    detail: { fontSize: 15, fontWeight: '700', color: '#4D7A20', marginBottom: 4, textTransform: 'capitalize' },
    description: { fontSize: 15, color: '#555', lineHeight: 22 },
    rerollButton: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 18, marginTop: 28 },
    rerollButtonText: { textAlign: 'center', color: '#4D7A20', fontWeight: '800', fontSize: 16 },
    button: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 18, marginTop: 14 },
    buttonText: { color: '#4D7A20', textAlign: 'center', fontWeight: '900', fontSize: 17 },
});
