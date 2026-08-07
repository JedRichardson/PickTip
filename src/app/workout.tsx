import { useEffect, useState } from 'react';

import {
    useLocalSearchParams,
    router
} from 'expo-router';


import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';


// ==========================================
// ADDED:
// PickTip gradient background.
// ==========================================
import { LinearGradient } from 'expo-linear-gradient';



import { workouts } from '../data/workouts';
import { useWorkoutLog } from '../context/WorkoutLogContext';
import { useSavedWorkout } from '../context/SavedWorkoutContext';

export default function WorkoutScreen() {
    const { category } = useLocalSearchParams();
    const { logWorkout } = useWorkoutLog();
    const { saveWorkout, removeWorkout, isSaved } = useSavedWorkout();

    const [
        workout,
        setWorkout
    ] = useState<(typeof workouts)[number] | null>(null);





    const categoryParam = Array.isArray(category)

        ? category[0]

        : category;






    const filtered = workouts.filter(

        item => item.category === categoryParam

    );






    function pickRandomWorkout() {


        if (filtered.length === 0) {

            setWorkout(null);

            return;

        }



        const randomIndex = Math.floor(

            Math.random() * filtered.length

        );



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


            <LinearGradient

                colors={[
                    '#78B63C',
                    '#4D7A20',
                    '#355817'
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

                            No workouts found.

                        </Text>



                        <Text style={styles.description}>

                            Please go back and choose another category.

                        </Text>


                    </View>



                </SafeAreaView>


            </LinearGradient>


        );


    }









    return (


        // ==========================================
        // CHANGED:
        // Added consistent PickTip gradient.
        // ==========================================

        <LinearGradient


            colors={[
                '#78B63C',
                '#4D7A20',
                '#355817'
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
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>
                            {workout.name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => isSaved(workout.id) ? removeWorkout(workout.id) : saveWorkout(workout)}
                            style={styles.saveIconButton}
                        >
                            <Text style={styles.saveIcon}>{isSaved(workout.id) ? '❤️' : '🤍'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoBox}>


                        <Text style={styles.detail}>

                            Duration: {workout.duration}

                        </Text>




                        <Text style={styles.detail}>

                            Intensity: {workout.intensity}

                        </Text>


                    </View>






                    <Text style={styles.description}>

                        {workout.description}

                    </Text>



                </View>








                <TouchableOpacity


                    style={styles.rerollButton}


                    onPress={pickRandomWorkout}


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


    // ==========================================
    // ADDED:
    // Full PickTip background.
    // ==========================================

    gradient: {

        flex: 1,

    },





    container: {


        flex: 1,


        justifyContent: 'center',


        padding: 24,


    },







    // ==========================================
    // CHANGED:
    // Floating back button.
    // ==========================================

    backButton: {


        position: 'absolute',


        top: 60,


        left: 24,


        backgroundColor: 'rgba(255,255,255,.2)',


        paddingHorizontal: 16,


        paddingVertical: 10,


        borderRadius: 20,


    },





    backButtonText: {


        color: '#FFFFFF',


        fontSize: 16,


        fontWeight: '800',


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


        shadowOpacity: .18,


        shadowRadius: 15,


        elevation: 8,


    },







    emptyCard: {


        backgroundColor: '#FFFFFF',


        padding: 25,


        borderRadius: 25,


    },







    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#355817',
        flex: 1,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },

    saveIconButton: {
        padding: 8,
    },

    saveIcon: {
        fontSize: 24,
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