import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

import { getExercises, Exercise } from '../api/picktipApi';
import { useWorkoutLog } from '../context/WorkoutLogContext';
import { useSavedWorkout } from '../context/SavedWorkoutContext';
import { useAppSounds } from '../hooks/useAppSounds';
import LoadingScreen from '../components/LoadingScreen';
import { PickTipGradient } from '@/constants/theme';

const categoryMuscles: Record<string, string[]> = {
    legs: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    arms: ['biceps', 'triceps', 'forearms'],
    core: ['abdominals', 'lower_back'],
    fullbody: ['chest', 'lats', 'biceps', 'triceps', 'quadriceps', 'hamstrings'],
};

export default function WorkoutSessionScreen() {
    const { category } = useLocalSearchParams();
    const { logWorkout } = useWorkoutLog();
    const { saveWorkout, removeWorkout, isSaved } = useSavedWorkout();
    const { playTapSound, playCompleteSound } = useAppSounds();
    const animationRef = useRef<LottieView>(null);

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
                animationRef.current?.pause();
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

    // Timer Logic
    useEffect(() => {
        if (timerActive) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
            animationRef.current?.resume();
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            animationRef.current?.pause();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [timerActive]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        void playTapSound();
        setTimerActive(!timerActive);
    };

    const getLiveCalories = () => {
        if (!workout) return 0;
        const minsSpent = seconds / 60;
        const intensityMultiplier: Record<string, number> = { beginner: 5, intermediate: 8, expert: 12 };
        const perMinCals = intensityMultiplier[workout.difficulty.toLowerCase()] || 7;
        return Math.round(minsSpent * perMinCals);
    };

    const handleFinishWorkout = async () => {
        if (workout) {
            const finalDuration = formatTime(seconds);
            const minsSpent = seconds / 60;

            const intensityMultiplier: Record<string, number> = { beginner: 5, intermediate: 8, expert: 12 };
            const perMinCals = intensityMultiplier[workout.difficulty.toLowerCase()] || 7;
            const finalCals = Math.round(minsSpent * perMinCals);

            await logWorkout({
                name: workout.name,
                duration: finalDuration,
                intensity: workout.difficulty,
                calories: finalCals > 0 ? finalCals : 10,
            });

            setTimerActive(false);
            void playCompleteSound();

            Alert.alert(
                'Workout Complete! 🎊',
                `You crushed ${workout.name} for ${finalDuration}.\nBurned approx. ${finalCals} kcal!`,
                [{
                    text: 'Show Nutrition',
                    onPress: () => router.push(`/nutrition?intensity=${encodeURIComponent(workout.difficulty)}&category=${encodeURIComponent(categoryParam)}&workoutComplete=true&fromWorkout=true`)
                }]
            );
        }
    };

    const toggleSave = () => {
        if (!workout) return;
        const workoutId = workout.name.replace(/\s+/g, '-').toLowerCase();
        void playTapSound();
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
        return <LoadingScreen message="Picking a workout..." />;
    }

    if (error || !workout) {
        return (
            <LinearGradient colors={PickTipGradient} style={styles.gradient}>
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>← Back</Text>
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
        <LinearGradient colors={PickTipGradient} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerLabel}>ACTIVE SESSION</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>{workout.name}</Text>
                            <TouchableOpacity onPress={toggleSave} style={styles.saveIconButton}>
                                <Text style={styles.saveIcon}>{saved ? '❤️' : '🤍'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.animationWrapper}>
                            <LottieView
                                ref={animationRef}
                                source={require('../../assets/animations/workout.json')}
                                autoPlay={false}
                                loop
                                style={styles.lottie}
                            />
                        </View>

                        <View style={styles.timerCard}>
                            <View style={styles.timerStatsRow}>
                                <View style={styles.timerStatItem}>
                                    <Text style={styles.timerLabel}>SESSION TIME</Text>
                                    <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
                                </View>
                                <View style={styles.timerDivider} />
                                <View style={styles.timerStatItem}>
                                    <Text style={styles.timerLabel}>EST. BURN</Text>
                                    <Text style={styles.timerValue}>{getLiveCalories()}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.timerButton, timerActive && styles.timerButtonActive]}
                                onPress={toggleTimer}
                            >
                                <Text style={styles.timerButtonText}>{timerActive ? 'PAUSE SESSION' : 'START SESSION'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.detail}>Muscle: {workout.muscle}</Text>
                            <Text style={styles.detail}>Difficulty: {workout.difficulty}</Text>
                            <Text style={styles.detail}>Equipment: {workout.equipment}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <Text style={styles.description}>{workout.instructions}</Text>
                    </View>

                    {seconds === 0 && !timerActive ? (
                        <TouchableOpacity style={styles.rerollButton} onPress={fetchWorkout}>
                            <Text style={styles.rerollButtonText}>Try Another Workout</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.finishButton, seconds < 5 && { opacity: 0.5 }]}
                            onPress={handleFinishWorkout}
                            disabled={seconds < 5}
                        >
                            <Text style={styles.finishButtonText}>Complete Workout</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 24 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 },
    headerLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
    backButton: {
        backgroundColor: 'rgba(255,255,255,.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    scrollContent: { paddingTop: 12, paddingBottom: 120 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 26,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 15,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    title: { fontSize: 28, fontWeight: '900', color: '#355817', flex: 1, textTransform: 'capitalize' },
    saveIconButton: { padding: 8 },
    saveIcon: { fontSize: 24 },
    animationWrapper: { height: 200, backgroundColor: '#F8F9FA', borderRadius: 22, marginBottom: 18, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    lottie: { width: '100%', height: '100%' },
    timerCard: { alignItems: 'center', backgroundColor: '#F0F4E8', padding: 20, borderRadius: 24, marginBottom: 18 },
    timerStatsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom: 12 },
    timerStatItem: { alignItems: 'center', flex: 1 },
    timerDivider: { width: 1, height: 40, backgroundColor: '#DDD' },
    timerLabel: { fontSize: 12, color: '#777', fontWeight: '800', letterSpacing: 1.5 },
    timerValue: { fontSize: 32, fontWeight: '900', color: '#355817', marginVertical: 4, fontFamily: 'monospace' },
    timerButton: { backgroundColor: '#4D7A20', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, width: '100%', alignItems: 'center' },
    timerButtonActive: { backgroundColor: '#FFA000' },
    timerButtonText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
    infoBox: { backgroundColor: '#EEF7E8', padding: 16, borderRadius: 18, marginBottom: 16 },
    detail: { fontSize: 15, fontWeight: '700', color: '#4D7A20', marginBottom: 4, textTransform: 'capitalize' },
    sectionTitle: { color: '#355817', fontSize: 18, fontWeight: '900', marginBottom: 10 },
    description: { fontSize: 15, color: '#555', lineHeight: 22 },
    rerollButton: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 18, marginTop: 24, alignItems: 'center' },
    rerollButtonText: { color: '#4D7A20', fontWeight: '800', fontSize: 16 },
    finishButton: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 18, marginTop: 24, alignItems: 'center', elevation: 4 },
    finishButtonText: { color: '#355817', fontWeight: '900', fontSize: 17 },
    emptyCard: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 25, alignItems: 'center' },
});
