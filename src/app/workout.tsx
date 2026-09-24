import { useCallback, useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Reusable PickTip components
import LoadingScreen from '@/components/LoadingScreen';
import { PickTipGradient } from '@/constants/theme';

// API Ninjas and Curated Workouts Data
import { Exercise, getExercises } from '../services/Ninjas';
import { workouts as curatedWorkouts } from '../data/workouts';

const categoryMuscles = {
    legs: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    arms: ['biceps', 'triceps', 'forearms'],
    chest: ['chest'],
    back: ['lats', 'middle_back', 'lower_back', 'traps'],
    shoulders: ['traps'],
    core: ['abdominals', 'lower_back'],
    fullbody: ['quadriceps', 'hamstrings', 'glutes', 'chest', 'lats', 'biceps', 'triceps', 'abdominals'],
} as const;

type WorkoutCategory = keyof typeof categoryMuscles;

export default function WorkoutScreen() {
    const { category } = useLocalSearchParams<{
        category?: string | string[];
    }>();

    const [workoutList, setWorkoutList] = useState<Exercise[]>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<Exercise | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const categoryParam = Array.isArray(category) ? category[0] : category;

    const loadWorkouts = useCallback(async () => {
        if (!categoryParam || !(categoryParam in categoryMuscles)) {
            setWorkoutList([]);
            setSelectedWorkout(null);
            setError('That workout category was not found.');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const selectedCat = categoryParam as WorkoutCategory;

            // 1. Filter local curated workouts for this category
            const localMatches: Exercise[] = curatedWorkouts
                .filter(w => w.category.toLowerCase() === selectedCat.toLowerCase())
                .map(w => ({
                    name: w.name,
                    type: 'Strength',
                    muscle: w.muscle,
                    equipments: w.equipment,
                    difficulty: w.intensity,
                    instructions: w.instructions,
                }));

            // 2. Fetch live exercises from API Ninjas as additional choices
            let apiMatches: Exercise[] = [];
            try {
                const muscles = categoryMuscles[selectedCat];
                const randomMuscle = muscles[Math.floor(Math.random() * muscles.length)];
                apiMatches = await getExercises(randomMuscle);
            } catch (apiErr) {
                console.log('API Ninjas request skipped/fallback used:', apiErr);
            }

            // 3. Combine local curated exercises (including Expert difficulty) with API exercises
            const combinedMap = new Map<string, Exercise>();

            // Prioritize curated local exercises first so Expert workouts are always available
            localMatches.forEach(item => {
                combinedMap.set(item.name.toLowerCase(), item);
            });
            apiMatches.forEach(item => {
                if (!combinedMap.has(item.name.toLowerCase())) {
                    combinedMap.set(item.name.toLowerCase(), item);
                }
            });

            const combinedList = Array.from(combinedMap.values());

            if (combinedList.length === 0) {
                setWorkoutList([]);
                setSelectedWorkout(null);
                setError('No exercises found for this category.');
                return;
            }

            setWorkoutList(combinedList);
            setSelectedWorkout(combinedList[0]);
        } catch (err) {
            console.error(err);
            setError('Could not load workouts.');
        } finally {
            setIsLoading(false);
        }
    }, [categoryParam]);

    useEffect(() => {
        loadWorkouts();
    }, [loadWorkouts]);

    const selectNextWorkout = () => {
        if (workoutList.length === 0) return;
        const currentIndex = workoutList.findIndex(
            w => w.name === selectedWorkout?.name
        );
        const nextIndex = (currentIndex + 1) % workoutList.length;
        setSelectedWorkout(workoutList[nextIndex]);
    };

    if (isLoading) {
        return <LoadingScreen message="Loading workout choices..." />;
    }

    if (!selectedWorkout || workoutList.length === 0) {
        return (
            <LinearGradient
                colors={PickTipGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.centeredContent}>
                        <View style={styles.card}>
                            <Text style={styles.title}>No workout found</Text>
                            <Text style={styles.description}>
                                {error || 'Please go back and choose another category.'}
                            </Text>
                            <TouchableOpacity style={styles.rerollButton} onPress={loadWorkouts}>
                                <Text style={styles.rerollButtonText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={PickTipGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.topHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.categoryTitle}>
                        {(categoryParam ?? 'WORKOUTS').toUpperCase()}
                    </Text>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* WORKOUT CHOICES SELECTOR LIST */}
                    <Text style={styles.sectionHeader}>Workout Choices in this Category:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.choiceSelector}>
                        {workoutList.map((item, idx) => {
                            const isSelected = item.name === selectedWorkout.name;
                            const isExpert = item.difficulty.toLowerCase() === 'expert';
                            return (
                                <TouchableOpacity
                                    key={`${item.name}-${idx}`}
                                    style={[
                                        styles.choiceChip,
                                        isSelected && styles.choiceChipSelected,
                                        isExpert && styles.choiceChipExpert,
                                    ]}
                                    onPress={() => setSelectedWorkout(item)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.chipRow}>
                                        <Text
                                            style={[
                                                styles.choiceChipText,
                                                isSelected && styles.choiceChipTextSelected,
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                        <View
                                            style={[
                                                styles.badge,
                                                isExpert ? styles.badgeExpert : styles.badgeNormal,
                                            ]}
                                        >
                                            <Text style={styles.badgeText}>
                                                {item.difficulty.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* SELECTED WORKOUT DETAILS CARD */}
                    <View style={styles.card}>
                        <View style={styles.cardTitleRow}>
                            <Text style={styles.title}>{selectedWorkout.name}</Text>
                            <View
                                style={[
                                    styles.badge,
                                    selectedWorkout.difficulty.toLowerCase() === 'expert'
                                        ? styles.badgeExpert
                                        : styles.badgeNormal,
                                ]}
                            >
                                <Text style={styles.badgeText}>
                                    {selectedWorkout.difficulty.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.detail}>Muscle: {selectedWorkout.muscle}</Text>
                            <Text style={styles.detail}>Type: {selectedWorkout.type}</Text>
                            <Text style={styles.detail}>Equipment: {selectedWorkout.equipments}</Text>
                            <Text style={styles.detail}>Difficulty: {selectedWorkout.difficulty}</Text>
                        </View>

                        <Text style={styles.description}>{selectedWorkout.instructions}</Text>
                    </View>

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.rerollButton} onPress={selectNextWorkout}>
                            <Text style={styles.rerollButtonText}>Next Workout Choice 🔄</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.startWorkoutButton}
                            onPress={() =>
                                router.push({
                                    pathname: '/workoutsession',
                                    params: {
                                        name: selectedWorkout.name,
                                        muscle: selectedWorkout.muscle,
                                        type: selectedWorkout.type,
                                        equipment: selectedWorkout.equipments,
                                        difficulty: selectedWorkout.difficulty,
                                        instructions: selectedWorkout.instructions,
                                        category: categoryParam ?? '',
                                    },
                                })
                            }
                        >
                            <Text style={styles.startWorkoutButtonText}>Start Workout 🏋️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                router.push(
                                    `/nutrition?intensity=${encodeURIComponent(
                                        selectedWorkout.difficulty
                                    )}&category=${encodeURIComponent(
                                        categoryParam ?? ''
                                    )}&fromWorkout=true`
                                )
                            }
                        >
                            <Text style={styles.buttonText}>View Nutrition Tips 🥑</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        paddingHorizontal: 20,
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    categoryTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    sectionHeader: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 10,
        opacity: 0.95,
    },
    choiceSelector: {
        marginBottom: 18,
    },
    choiceChip: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    choiceChipSelected: {
        borderColor: '#355817',
        backgroundColor: '#F0F7EB',
    },
    choiceChipExpert: {
        borderWidth: 2,
        borderColor: '#2E5014',
    },
    chipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    choiceChipText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333333',
    },
    choiceChipTextSelected: {
        color: '#355817',
        fontWeight: '900',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeExpert: {
        backgroundColor: '#355817',
    },
    badgeNormal: {
        backgroundColor: '#78B63C',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 15,
        elevation: 8,
    },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#355817',
        flex: 1,
        marginRight: 10,
    },
    infoBox: {
        backgroundColor: '#EEF7E8',
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
    },
    detail: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4D7A20',
        marginBottom: 6,
        textTransform: 'capitalize',
    },
    description: {
        fontSize: 15,
        color: '#555555',
        lineHeight: 22,
    },
    rerollButton: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 18,
        marginTop: 12,
    },
    rerollButtonText: {
        textAlign: 'center',
        color: '#4D7A20',
        fontWeight: '800',
        fontSize: 16,
    },
    startWorkoutButton: {
        backgroundColor: '#355817',
        padding: 18,
        borderRadius: 18,
        marginTop: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 6,
    },
    startWorkoutButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 18,
        marginTop: 12,
        marginBottom: 24,
    },
    buttonText: {
        color: '#4D7A20',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 16,
    },
    actions: {
        paddingTop: 10,
        paddingBottom: 20,
    },
});