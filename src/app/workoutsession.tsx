import {
    useEffect,
    useRef,
    useState
} from 'react';

import {
    router,
    useLocalSearchParams
} from 'expo-router';

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';

import LottieView from 'lottie-react-native';


// ==========================================
// ADDED: Reusable PickTip App Gradient
// ==========================================
import { PickTipGradient } from '@/constants/theme';


// ==========================================
// ADDED: Reusable PickTip App Sounds
// ==========================================
import { useAppSounds } from '../hooks/useAppSounds';


// ==========================================
// WORKOUT SESSION SCREEN
// ==========================================
export default function WorkoutSession() {


    // ==========================================
    // WORKOUT ANIMATION REFERENCE
    // ==========================================
    // Allows the Pause / Resume controls to also
    // control the workout character animation.
    const animationRef =
        useRef<LottieView>(null);


    // ==========================================
    // PICKTIP APP SOUNDS
    // ==========================================
    // tap:
    // Used for Pause / Resume.
    //
    // complete:
    // Plays the layered workout completion
    // celebration created in useAppSounds.
    const {
        playTapSound,
        playCompleteSound
    } = useAppSounds();


    // ==========================================
    // GET WORKOUT INFORMATION FROM ROUTE
    // ==========================================
    // The workout screen will pass the selected
    // exercise information into this screen.
    const {
        name,
        muscle,
        type,
        equipment,
        difficulty,
        instructions,
        category
    } = useLocalSearchParams<{
        name?: string | string[];
        muscle?: string | string[];
        type?: string | string[];
        equipment?: string | string[];
        difficulty?: string | string[];
        instructions?: string | string[];
        category?: string | string[];
    }>();



    // ==========================================
    // NORMALIZE ROUTE PARAMETERS
    // ==========================================
    // Expo Router parameters may occasionally
    // return as arrays, so each value is converted
    // into a single string before being displayed.
    const getParamValue = (
        value?: string | string[]
    ) => {

        return Array.isArray(value)
            ? value[0]
            : value ?? '';

    };


    const workoutName =
        getParamValue(name);

    const workoutMuscle =
        getParamValue(muscle);

    const workoutType =
        getParamValue(type);

    const workoutEquipment =
        getParamValue(equipment);

    const workoutDifficulty =
        getParamValue(difficulty);

    const workoutInstructions =
        getParamValue(instructions);

    const workoutCategory =
        getParamValue(category);



    // ==========================================
    // WORKOUT SESSION STATE
    // ==========================================

    // Tracks how many seconds have passed since
    // the workout session started.
    const [
        elapsedSeconds,
        setElapsedSeconds
    ] = useState(0);


    // Controls whether the workout timer is
    // currently running.
    const [
        isRunning,
        setIsRunning
    ] = useState(true);


    // Controls the short completion celebration
    // before navigating to nutrition.
    const [
        isCompleting,
        setIsCompleting
    ] = useState(false);



    // ==========================================
    // WORKOUT TIMER
    // ==========================================
    // Adds one second to the workout timer while
    // the workout session is running.
    useEffect(() => {


        if (!isRunning) {

            return;

        }


        const timer = setInterval(() => {

            setElapsedSeconds(
                previousSeconds =>
                    previousSeconds + 1
            );

        }, 1000);


        // ==========================================
        // CLEAN UP TIMER
        // ==========================================
        // Prevents the interval from continuing
        // after the screen has been removed.
        return () => {

            clearInterval(timer);

        };


    }, [isRunning]);



    // ==========================================
    // FORMAT WORKOUT TIMER
    // ==========================================
    // Converts the number of elapsed seconds into
    // a readable MM:SS format.
    const formatTime = (
        totalSeconds: number
    ) => {


        const minutes = Math.floor(
            totalSeconds / 60
        );


        const seconds =
            totalSeconds % 60;


        return (
            `${minutes
                .toString()
                .padStart(2, '0')}:` +
            `${seconds
                .toString()
                .padStart(2, '0')}`
        );

    };



    // ==========================================
    // PAUSE / RESUME WORKOUT
    // ==========================================
    const toggleWorkout = () => {


        // Play the subtle PickTip interaction sound.
        void playTapSound();


        setIsRunning(previousValue => {

            const nextValue =
                !previousValue;


            // ==========================================
            // CONTROL WORKOUT ANIMATION
            // ==========================================
            // Keeps the character animation synchronized
            // with the workout timer.
            if (nextValue) {

                animationRef.current?.resume();

            }
            else {

                animationRef.current?.pause();

            }


            return nextValue;

        });

    };



    // ==========================================
    // COMPLETE WORKOUT
    // ==========================================
    // Stops the current workout and sends the
    // user to their nutrition recommendations.
    //
    // Workout logging and completion sounds will
    // be connected after the session screen and
    // navigation flow are working correctly.
    const completeWorkout = async () => {


        // Prevent repeated completion presses.
        if (isCompleting) {

            return;

        }


        setIsCompleting(true);

        setIsRunning(false);

        animationRef.current?.pause();


        // ==========================================
        // PLAY WORKOUT COMPLETION CELEBRATION
        // ==========================================
        // Start the completion sounds without
        // delaying navigation to nutrition.
        void playCompleteSound();


        // ==========================================
        // NAVIGATE TO NUTRITION
        // ==========================================
        // Move immediately to nutrition while the
        // completion audio continues playing.
        //
        // workoutComplete=true tells the Nutrition
        // screen to display the completion confetti
        // animation only after a finished workout.
        router.replace(
            `/nutrition?intensity=${encodeURIComponent(
                workoutDifficulty
            )}&category=${encodeURIComponent(
                workoutCategory
            )}&workoutComplete=true&fromWorkout=true`
        );

    };



    // ==========================================
    // WORKOUT SESSION SCREEN
    // ==========================================
    return (

        <LinearGradient

            colors={PickTipGradient}

            start={{
                x: 0,
                y: 0
            }}

            end={{
                x: 1,
                y: 1
            }}

            style={styles.gradient}

        >


            <SafeAreaView
                style={styles.container}
            >


                {/* ==========================================
                    WORKOUT SESSION HEADER
                ========================================== */}
                <View style={styles.header}>


                    {/* Back navigation button */}
                    <TouchableOpacity

                        style={styles.backButton}

                        onPress={() =>
                            router.back()
                        }

                    >

                        <Text
                            style={
                                styles.backButtonText
                            }
                        >
                            ← Back
                        </Text>

                    </TouchableOpacity>



                    <Text style={styles.headerLabel}>
                        WORKOUT SESSION
                    </Text>


                </View>



                <ScrollView

                    style={styles.scrollView}

                    contentContainerStyle={
                        styles.scrollContent
                    }

                    showsVerticalScrollIndicator={false}

                >


                    {/* ==========================================
                        WORKOUT TITLE
                    ========================================== */}
                    <Text style={styles.title}>

                        {workoutName ||
                            'Your Workout'}

                    </Text>


                    <Text style={styles.subtitle}>

                        {workoutDifficulty
                            ? `${workoutDifficulty} Difficulty`
                            : 'Workout in Progress'}

                    </Text>



                    {/* ==========================================
                        CHARACTER ANIMATION AREA
                    ========================================== */}
                    {/* Displays the reusable Lottie workout
                        animation inside the PickTip workout
                        session card. */}
                    <View
                        style={
                            styles.animationContainer
                        }
                    >


                        <View
                            style={
                                styles.characterPlaceholder
                            }
                        >


                            <LottieView

                                ref={animationRef}

                                source={
                                    require('../../assets/animations/workout.json')
                                }

                                autoPlay

                                loop

                                style={
                                    styles.workoutAnimation
                                }

                            />


                        </View>


                    </View>



                    {/* ==========================================
                        SESSION TIMER
                    ========================================== */}
                    <View style={styles.timerCard}>


                        <Text
                            style={
                                styles.timerLabel
                            }
                        >
                            SESSION TIME
                        </Text>


                        <Text
                            style={
                                styles.timerValue
                            }
                        >

                            {formatTime(
                                elapsedSeconds
                            )}

                        </Text>


                        <Text
                            style={
                                styles.timerStatus
                            }
                        >

                            {isRunning
                                ? 'Workout in progress'
                                : 'Workout paused'}

                        </Text>


                    </View>



                    {/* ==========================================
                        WORKOUT INFORMATION
                    ========================================== */}
                    <View style={styles.infoCard}>


                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Exercise Details
                        </Text>



                        {workoutMuscle ? (

                            <View
                                style={
                                    styles.detailRow
                                }
                            >

                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Muscle
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {workoutMuscle}
                                </Text>

                            </View>

                        ) : null}



                        {workoutType ? (

                            <View
                                style={
                                    styles.detailRow
                                }
                            >

                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Type
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {workoutType}
                                </Text>

                            </View>

                        ) : null}



                        {workoutEquipment ? (

                            <View
                                style={
                                    styles.detailRow
                                }
                            >

                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Equipment
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {workoutEquipment}
                                </Text>

                            </View>

                        ) : null}



                        {workoutDifficulty ? (

                            <View
                                style={[
                                    styles.detailRow,
                                    styles.lastDetailRow
                                ]}
                            >

                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Difficulty
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {workoutDifficulty}
                                </Text>

                            </View>

                        ) : null}


                    </View>



                    {/* ==========================================
                        EXERCISE INSTRUCTIONS
                    ========================================== */}
                    {workoutInstructions ? (

                        <View
                            style={
                                styles.instructionsCard
                            }
                        >

                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Instructions
                            </Text>


                            <Text
                                style={
                                    styles.instructions
                                }
                            >

                                {workoutInstructions}

                            </Text>

                        </View>

                    ) : null}



                    {/* ==========================================
                        WORKOUT CONTROLS
                    ========================================== */}
                    <View
                        style={
                            styles.controls
                        }
                    >


                        {/* Pause or resume the workout */}
                        <TouchableOpacity

                            style={
                                styles.pauseButton
                            }

                            onPress={
                                toggleWorkout
                            }

                        >

                            <Text
                                style={
                                    styles.pauseButtonText
                                }
                            >

                                {isRunning
                                    ? 'Pause Workout'
                                    : 'Resume Workout'}

                            </Text>

                        </TouchableOpacity>



                        {/* Complete the workout session */}
                        <TouchableOpacity

                            style={[
                                styles.completeButton,
                                isCompleting &&
                                styles.completeButtonDisabled
                            ]}

                            onPress={
                                completeWorkout
                            }

                            disabled={
                                isCompleting
                            }

                        >

                            <Text
                                style={
                                    styles.completeButtonText
                                }
                            >
                                {isCompleting
                                    ? 'Workout Complete!'
                                    : 'Complete Workout'}
                            </Text>

                        </TouchableOpacity>


                    </View>


                </ScrollView>


            </SafeAreaView>


        </LinearGradient>

    );

}



// ==========================================
// WORKOUT SESSION STYLES
// ==========================================
const styles = StyleSheet.create({


    // ==========================================
    // SCREEN BACKGROUND
    // ==========================================
    gradient: {
        flex: 1,
    },



    // ==========================================
    // MAIN SCREEN CONTAINER
    // ==========================================
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },



    // ==========================================
    // HEADER
    // ==========================================
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 8,
    },


    headerLabel: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 1.5,
    },



    // ==========================================
    // BACK BUTTON
    // ==========================================
    backButton: {
        backgroundColor:
            'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },


    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },



    // ==========================================
    // SCROLL VIEW
    // ==========================================
    scrollView: {
        flex: 1,
    },


    scrollContent: {
        paddingTop: 12,
        paddingBottom: 120,
    },



    // ==========================================
    // WORKOUT TITLE
    // ==========================================
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
        textTransform: 'capitalize',
    },


    subtitle: {
        color: '#FFFFFF',
        opacity: 0.85,
        fontSize: 16,
        fontWeight: '600',
        marginTop: 6,
        marginBottom: 20,
        textTransform: 'capitalize',
    },



    // ==========================================
    // CHARACTER ANIMATION AREA
    // ==========================================
    animationContainer: {
        backgroundColor:
            'rgba(255, 255, 255, 0.18)',
        borderRadius: 28,
        padding: 12,
        marginBottom: 18,
    },


    characterPlaceholder: {
        minHeight: 260,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },


    // ==========================================
    // WORKOUT CHARACTER ANIMATION
    // ==========================================
    workoutAnimation: {
        width: '100%',
        height: 240,
    },



    // ==========================================
    // SESSION TIMER
    // ==========================================
    timerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 22,
        alignItems: 'center',
        marginBottom: 18,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,

        elevation: 6,
    },


    timerLabel: {
        color: '#777777',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
    },


    timerValue: {
        color: '#355817',
        fontSize: 48,
        fontWeight: '900',
        marginVertical: 4,
    },


    timerStatus: {
        color: '#4D7A20',
        fontSize: 14,
        fontWeight: '700',
    },



    // ==========================================
    // WORKOUT INFORMATION
    // ==========================================
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
    },


    sectionTitle: {
        color: '#355817',
        fontSize: 21,
        fontWeight: '900',
        marginBottom: 14,
    },


    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },


    lastDetailRow: {
        borderBottomWidth: 0,
    },


    detailLabel: {
        color: '#777777',
        fontSize: 14,
        fontWeight: '700',
    },


    detailValue: {
        color: '#4D7A20',
        fontSize: 15,
        fontWeight: '800',
        textTransform: 'capitalize',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 20,
    },



    // ==========================================
    // EXERCISE INSTRUCTIONS
    // ==========================================
    instructionsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
    },


    instructions: {
        color: '#555555',
        fontSize: 16,
        lineHeight: 24,
    },



    // ==========================================
    // WORKOUT CONTROLS
    // ==========================================
    controls: {
        paddingBottom: 20,
    },



    // ==========================================
    // PAUSE / RESUME BUTTON
    // ==========================================
    pauseButton: {
        backgroundColor:
            'rgba(255, 255, 255, 0.22)',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        padding: 17,
        borderRadius: 18,
        alignItems: 'center',
        marginBottom: 12,
    },


    pauseButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },



    // ==========================================
    // COMPLETE WORKOUT BUTTON
    // ==========================================
    completeButton: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,

        elevation: 5,
    },


    // Slightly fades the completion button while
    // the celebration audio is playing.
    completeButtonDisabled: {
        opacity: 0.8,
    },


    completeButtonText: {
        color: '#355817',
        fontSize: 17,
        fontWeight: '900',
    },

});