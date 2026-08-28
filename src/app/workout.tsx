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

// ==========================================
// ADDED: Reusable PickTip Loading Screen
// ==========================================
import LoadingScreen from '@/components/LoadingScreen';

// ==========================================
// ADDED: Reusable PickTip App Gradient
// ==========================================
import { PickTipGradient } from '@/constants/theme';

// ==========================================
// CHANGED:
// API Ninjas workout service now comes from
// the services folder instead of the api folder.
// ==========================================
import {
    Exercise,
    getExercises,
} from '../services/Ninjas';


// ==========================================
// WORKOUT CATEGORY MUSCLE GROUPS
// ==========================================
// Each workout category maps to the muscle
// groups that API Ninjas can search for.
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

    fullbody: [
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


// ==========================================
// WORKOUT CATEGORY TYPE
// ==========================================
// Restricts valid category values to the keys
// defined inside categoryMuscles.
type WorkoutCategory = keyof typeof categoryMuscles;


// ==========================================
// WORKOUT SCREEN
// ==========================================
export default function WorkoutScreen() {

    // ==========================================
    // GET CATEGORY FROM ROUTE PARAMETERS
    // ==========================================
    const { category } = useLocalSearchParams<{
        category?: string | string[];
    }>();


    // ==========================================
    // WORKOUT SCREEN STATE
    // ==========================================

    // Stores the workout selected from API Ninjas.
    const [workout, setWorkout] =
        useState<Exercise | null>(null);

    // Controls when the reusable loading screen
    // is displayed.
    const [isLoading, setIsLoading] =
        useState(true);

    // Stores an error message if the workout
    // request fails.
    const [error, setError] =
        useState('');


    // ==========================================
    // NORMALIZE CATEGORY PARAMETER
    // ==========================================
    // Expo Router parameters can sometimes be
    // returned as an array, so we make sure we
    // only work with one category value.
    const categoryParam = Array.isArray(category)
        ? category[0]
        : category;


    // ==========================================
    // PICK RANDOM WORKOUT
    // ==========================================
    // Requests exercises from API Ninjas and
    // randomly chooses one exercise for the user.
    const pickRandomWorkout = useCallback(async () => {

        // ==========================================
        // VALIDATE WORKOUT CATEGORY
        // ==========================================
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

            // ==========================================
            // START LOADING
            // ==========================================
            // Displays the reusable LoadingScreen
            // while the API request is running.
            setIsLoading(true);

            // Clear any previous error message.
            setError('');


            // Convert the route parameter into one
            // of our valid WorkoutCategory values.
            const selectedCategory =
                categoryParam as WorkoutCategory;


            // Get all muscles associated with
            // the selected workout category.
            const muscles =
                categoryMuscles[selectedCategory];


            // ==========================================
            // RANDOM MUSCLE SELECTION
            // ==========================================
            // Randomly select one muscle from
            // the selected workout category.
            const randomMuscle =
                muscles[
                Math.floor(
                    Math.random() * muscles.length
                )
                ];


            // ==========================================
            // API NINJAS REQUEST
            // ==========================================
            // Sends the selected muscle to the
            // reusable Ninjas service.
            const exercises =
                await getExercises(randomMuscle);


            // ==========================================
            // HANDLE EMPTY API RESPONSE
            // ==========================================
            if (exercises.length === 0) {
                setWorkout(null);

                setError(
                    'No exercises were found. Please try again.'
                );

                return;
            }


            // ==========================================
            // RANDOM EXERCISE SELECTION
            // ==========================================
            // Pick one exercise from the results
            // returned by API Ninjas.
            const randomIndex = Math.floor(
                Math.random() * exercises.length
            );


            // Save the randomly selected workout
            // into component state.
            setWorkout(exercises[randomIndex]);

        } catch (requestError) {

            // ==========================================
            // API ERROR HANDLING
            // ==========================================
            console.error(requestError);

            setWorkout(null);

            setError(
                'Could not load a workout.'
            );

        } finally {

            // ==========================================
            // END LOADING
            // ==========================================
            // Runs whether the request succeeds
            // or fails.
            setIsLoading(false);
        }

    }, [categoryParam]);


    // ==========================================
    // LOAD WORKOUT WHEN SCREEN OPENS
    // ==========================================
    // Runs the workout request when the screen
    // first loads or when the category changes.
    useEffect(() => {
        pickRandomWorkout();
    }, [pickRandomWorkout]);


    // ==========================================
    // REUSABLE LOADING SCREEN
    // ==========================================
    // Instead of maintaining a separate loading
    // design on this page, we reuse the PickTip
    // LoadingScreen component.
    if (isLoading) {
        return (
            <LoadingScreen
                message="Picking a workout..."
            />
        );
    }


    // ==========================================
    // NO WORKOUT / ERROR SCREEN
    // ==========================================
    // Displays when the API request fails or
    // no workout is returned.
    if (!workout) {
        return (
            <LinearGradient
                colors={PickTipGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <SafeAreaView
                    style={styles.container}
                >

                    {/* Back navigation button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text
                            style={styles.backButtonText}
                        >
                            ← Back
                        </Text>
                    </TouchableOpacity>


                    {/* Center the error card */}
                    <View
                        style={styles.centeredContent}
                    >
                        <View style={styles.card}>

                            <Text style={styles.title}>
                                No workout found
                            </Text>

                            <Text
                                style={styles.description}
                            >
                                {error ||
                                    'Please go back and choose another category.'}
                            </Text>


                            {/* Retry the API request */}
                            <TouchableOpacity
                                style={styles.rerollButton}
                                onPress={pickRandomWorkout}
                            >
                                <Text
                                    style={
                                        styles.rerollButtonText
                                    }
                                >
                                    Try Again
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </SafeAreaView>
            </LinearGradient>
        );
    }


    // ==========================================
    // SUCCESSFUL WORKOUT SCREEN
    // ==========================================
    return (
        <LinearGradient
            colors={PickTipGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView
                style={styles.container}
            >

                {/* Back navigation button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text
                        style={styles.backButtonText}
                    >
                        ← Back
                    </Text>
                </TouchableOpacity>


                {/* ==========================================
                    WORKOUT DETAILS
                ========================================== */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    showsVerticalScrollIndicator
                >
                    <View style={styles.card}>

                        {/* Workout name */}
                        <Text style={styles.title}>
                            {workout.name}
                        </Text>


                        {/* Workout information */}
                        <View style={styles.infoBox}>

                            <Text style={styles.detail}>
                                Muscle: {workout.muscle}
                            </Text>

                            <Text style={styles.detail}>
                                Type: {workout.type}
                            </Text>

                            <Text style={styles.detail}>
                                Equipment: {workout.equipments}
                            </Text>

                            <Text style={styles.detail}>
                                Difficulty: {workout.difficulty}
                            </Text>

                        </View>


                        {/* Exercise instructions */}
                        <Text
                            style={styles.description}
                        >
                            {workout.instructions}
                        </Text>

                    </View>
                </ScrollView>


                {/* ==========================================
                    WORKOUT ACTION BUTTONS
                ========================================== */}
                <View style={styles.actions}>

                    {/* Request another random workout */}
                    <TouchableOpacity
                        style={styles.rerollButton}
                        onPress={pickRandomWorkout}
                        disabled={isLoading}
                    >
                        <Text
                            style={styles.rerollButtonText}
                        >
                            Try Another Workout
                        </Text>
                    </TouchableOpacity>


                    {/* ==========================================
                        START WORKOUT
                    ========================================== */}
                    {/* Navigate to the active workout session
                        and pass the selected API Ninjas workout
                        information to WorkoutSession. */}
                    <TouchableOpacity
                        style={styles.startWorkoutButton}
                        onPress={() =>
                            router.push({
                                pathname: '/workoutsession',
                                params: {
                                    name: workout.name,
                                    muscle: workout.muscle,
                                    type: workout.type,
                                    equipment: workout.equipments,
                                    difficulty: workout.difficulty,
                                    instructions: workout.instructions,
                                    category: categoryParam ?? '',
                                },
                            })
                        }
                    >
                        <Text
                            style={styles.startWorkoutButtonText}
                        >
                            Start Workout
                        </Text>
                    </TouchableOpacity>


                    {/* Navigate to nutrition recommendations */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            router.push(
                                `/nutrition?intensity=${encodeURIComponent(
                                    workout.difficulty
                                )}&category=${encodeURIComponent(
                                    categoryParam ?? ''
                                )}&fromWorkout=true`
                            )
                        }
                    >
                        <Text style={styles.buttonText}>
                            View Nutrition Tips
                        </Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        </LinearGradient>
    );
}


// ==========================================
// WORKOUT SCREEN STYLES
// ==========================================
const styles = StyleSheet.create({

    // ==========================================
    // SCREEN BACKGROUND
    // ==========================================

    // Allows the LinearGradient to fill
    // the entire screen.
    gradient: {
        flex: 1,
    },


    // ==========================================
    // MAIN SCREEN CONTAINER
    // ==========================================

    // Controls the overall page layout.
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },


    // ==========================================
    // BACK BUTTON
    // ==========================================

    // Container for the top-left back button.
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor:
            'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 8,
        marginBottom: 8,
    },

    // Text displayed inside the back button.
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },


    // ==========================================
    // CENTERED CONTENT
    // ==========================================

    // Centers the error card vertically.
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
    },


    // ==========================================
    // SCROLL VIEW
    // ==========================================

    // Allows workout content to scroll
    // on smaller device screens.
    scrollView: {
        flex: 1,
    },

    // Centers workout content vertically
    // when enough screen space is available.
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 12,
    },


    // ==========================================
    // WORKOUT CARD
    // ==========================================

    // Main white card containing the
    // workout information.
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 26,

        // iOS shadow
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 15,

        // Android shadow
        elevation: 8,
    },


    // ==========================================
    // WORKOUT TITLE
    // ==========================================

    // Displays the workout name or error title.
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#355817',
        marginBottom: 18,
    },


    // ==========================================
    // WORKOUT INFORMATION BOX
    // ==========================================

    // Light-green container for workout
    // muscle, type, equipment, and difficulty.
    infoBox: {
        backgroundColor: '#EEF7E8',
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
    },

    // Individual workout detail text.
    detail: {
        fontSize: 17,
        fontWeight: '700',
        color: '#4D7A20',
        marginBottom: 8,
        textTransform: 'capitalize',
    },


    // ==========================================
    // WORKOUT DESCRIPTION
    // ==========================================

    // Exercise instructions or error message.
    description: {
        fontSize: 16,
        color: '#555555',
        lineHeight: 24,
    },


    // ==========================================
    // TRY ANOTHER WORKOUT BUTTON
    // ==========================================

    // Button used to request another
    // random workout.
    rerollButton: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 18,
        marginTop: 14,
    },

    // Text inside the reroll button.
    rerollButtonText: {
        textAlign: 'center',
        color: '#4D7A20',
        fontWeight: '800',
        fontSize: 16,
    },


    // ==========================================
    // START WORKOUT BUTTON
    // ==========================================

    // Primary button that opens the active
    // WorkoutSession screen.
    startWorkoutButton: {
        backgroundColor: '#355817',
        padding: 18,
        borderRadius: 18,
        marginTop: 14,

        // iOS shadow
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.18,
        shadowRadius: 10,

        // Android shadow
        elevation: 6,
    },

    // Text inside the Start Workout button.
    startWorkoutButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 18,
    },


    // ==========================================
    // NUTRITION BUTTON
    // ==========================================

    // Button that navigates to the
    // nutrition recommendation screen.
    button: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 18,
        marginTop: 14,
    },

    // Text inside the nutrition button.
    buttonText: {
        color: '#4D7A20',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 17,
    },


    // ==========================================
    // BOTTOM ACTION AREA
    // ==========================================

    // Holds the workout action buttons
    // at the bottom of the screen.
    actions: {
        paddingTop: 10,
        paddingBottom: 12,
    },
});

    

   
