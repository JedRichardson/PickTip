import {
    // ==========================================
    // ADDED:
    // ScrollView allows the Learn More page
    // to work properly on smaller screens.
    // ==========================================
    ScrollView,

    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// ==========================================
// ADDED:
// Gradient background to match HomeScreen.
// Install if not already installed:
// npx expo install expo-linear-gradient
// ==========================================
import { LinearGradient } from 'expo-linear-gradient';


export default function LearnMoreScreen() {
    return (

        // ==========================================
        // CHANGED:
        // Added gradient PickTip theme.
        // ==========================================
        <LinearGradient
            colors={['#78B63C', '#4D7A20', '#355817']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >

            <SafeAreaView style={styles.container}>

                {/* ==========================================
                    ADDED:
                    ScrollView prevents content cutoff on
                    smaller phone screens.
                ========================================== */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >

                    {/* ==========================================
                        ADDED:
                        Main information card.
                    ========================================== */}
                    <View style={styles.card}>


                        <Text style={styles.title}>
                            Welcome to PickTip!
                        </Text>


                        <Text style={styles.intro}>
                            PickTip helps you make smarter fitness and
                            nutrition choices, one simple step at a time.
                        </Text>



                        <Text style={styles.sectionTitle}>
                            How PickTip Works
                        </Text>



                        <View style={styles.featureCard}>

                            <Text style={styles.featureTitle}>
                                Choose Your Workout Type
                            </Text>

                            <Text style={styles.featureText}>
                                Select the kind of workout you want to do,
                                like strength training, cardio, flexibility,
                                or HIIT.
                            </Text>

                        </View>




                        <View style={styles.featureCard}>

                            <Text style={styles.featureTitle}>
                                Pick a Specific Workout
                            </Text>

                            <Text style={styles.featureText}>
                                Once you have chosen the type, PickTip
                                presents a workout that fits your goal,
                                whether it is deadlifting, running, or yoga.
                            </Text>

                        </View>





                        <View style={styles.featureCard}>

                            <Text style={styles.featureTitle}>
                                Personalized Meal Recommendations
                            </Text>

                            <Text style={styles.featureText}>
                                After your workout, PickTip suggests the
                                best meal to fuel recovery and energy needs.

                                {'\n\n'}

                                For example, if you choose deadlifting,
                                PickTip might recommend chicken breast and
                                oatmeal to support muscle growth and
                                replenish energy.
                            </Text>

                        </View>





                        <View style={styles.featureCard}>

                            <Text style={styles.featureTitle}>
                                Repeat Anytime
                            </Text>

                            <Text style={styles.featureText}>
                                Mix and match workouts and meals to keep
                                your routine balanced and exciting.
                            </Text>

                        </View>




                        <Text style={styles.sectionTitle}>
                            Why Use PickTip?
                        </Text>




                        <Text style={styles.intro}>
                            No more guessing what workout to do or what to
                            eat afterward.

                            {'\n\n'}

                            PickTip guides you through workouts tailored to
                            your preference and pairs them with nutrition
                            advice designed to help you get the most from
                            every session.
                        </Text>




                        <Text style={styles.finalText}>
                            Make fitness simple, effective, and delicious
                            with PickTip!
                        </Text>


                    </View>


                </ScrollView>


            </SafeAreaView>


        </LinearGradient>

    );
}



const styles = StyleSheet.create({

    // ==========================================
    // ADDED:
    // Full screen gradient wrapper.
    // ==========================================
    gradient: {
        flex: 1,
    },


    container: {
        flex: 1,
    },


    // ==========================================
    // ADDED:
    // Controls ScrollView spacing.
    // Keeps card centered and comfortable.
    // ==========================================
    scrollContent: {

        flexGrow: 1,

        justifyContent: 'center',

        paddingHorizontal: 20,

        paddingVertical: 25,

    },


    // ==========================================
    // ADDED:
    // White content card.
    // ==========================================
    card: {

        width: '100%',

        backgroundColor: '#FFFFFF',

        borderRadius: 30,

        padding: 24,


        // ==========================================
        // ADDED:
        // Floating card shadow.
        // ==========================================
        shadowColor: '#000',

        shadowOffset: {

            width: 0,

            height: 10,

        },

        shadowOpacity: 0.18,

        shadowRadius: 18,

        elevation: 12,

    },


    title: {

        color: '#355817',

        fontSize: 30,

        fontWeight: '800',

        textAlign: 'center',

        marginBottom: 14,

    },


    intro: {

        color: '#333333',

        fontSize: 16,

        lineHeight: 25,

        textAlign: 'center',

        marginBottom: 20,

    },


    sectionTitle: {

        color: '#4D7A20',

        fontSize: 22,

        fontWeight: '800',

        marginTop: 12,

        marginBottom: 12,

    },


    // ==========================================
    // ADDED:
    // Individual information blocks.
    // ==========================================
    featureCard: {

        backgroundColor: '#EEF7E8',

        borderRadius: 18,

        padding: 16,

        marginBottom: 12,

    },


    featureTitle: {

        color: '#355817',

        fontSize: 16,

        fontWeight: '800',

        marginBottom: 6,

    },


    featureText: {

        color: '#333333',

        fontSize: 14,

        lineHeight: 21,

    },


    finalText: {

        color: '#4D7A20',

        fontSize: 17,

        fontWeight: '700',

        textAlign: 'center',

        marginTop: 12,

    },

});