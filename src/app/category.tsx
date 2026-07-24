import { router } from 'expo-router';

import {
   // SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';


// ==========================================
// ADDED:
// Gradient background to match HomeScreen
// and LearnMoreScreen.
// Install:
// npx expo install expo-linear-gradient
// ==========================================
import { LinearGradient } from 'expo-linear-gradient';


import { categories } from '../data/categories';


export default function CategoryScreen() {
    return (

        // ==========================================
        // CHANGED:
        // Replaced flat background with PickTip
        // gradient theme.
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
                    ScrollView keeps categories responsive
                    on smaller devices.
                ========================================== */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >



                    {/* ==========================================
                        CHANGED:
                        Added stronger title hierarchy.
                    ========================================== */}
                    <Text style={styles.heading}>
                        Choose Your Focus
                    </Text>



                    <Text style={styles.subheading}>
                        Select a workout category to get started
                    </Text>





                    {categories.map(category => (

                        <TouchableOpacity

                            key={category.id}

                            // ==========================================
                            // CHANGED:
                            // Updated card styling for a more modern UI.
                            // ==========================================
                            style={styles.card}

                            onPress={() =>
                                router.push(`/workout?category=${category.id}`)
                            }

                            activeOpacity={0.85}

                        >

                            <Text style={styles.cardTitle}>
                                {category.name}
                            </Text>



                            <Text style={styles.cardDescription}>
                                {category.description}
                            </Text>


                        </TouchableOpacity>

                    ))}





                    <TouchableOpacity

                        style={styles.nutritionLink}

                        onPress={() => router.push('/nutrition')}

                        activeOpacity={0.8}

                    >

                        <Text style={styles.nutritionLinkText}>
                            Skip to Nutrition Suggestions
                        </Text>


                    </TouchableOpacity>



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
    // ==========================================
    scrollContent: {

        paddingHorizontal: 24,

        paddingVertical: 30,

    },



    heading: {

        // ==========================================
        // CHANGED:
        // Added stronger visual hierarchy.
        // ==========================================
        color: '#FFFFFF',

        marginTop: 20,

        fontSize: 38,

        fontWeight: '800',

        letterSpacing: 0.5,

    },



    subheading: {

        // ==========================================
        // CHANGED:
        // Improved readability on gradient.
        // ==========================================
        color: '#FFFFFF',

        fontSize: 17,

        marginTop: 12,

        marginBottom: 30,

        opacity: 0.9,

    },



    card: {


        backgroundColor: '#FFFFFF',


        borderRadius: 24,


        padding: 24,


        marginBottom: 18,



        // ==========================================
        // ADDED:
        // Floating card effect.
        // ==========================================
        shadowColor: '#000',

        shadowOffset: {

            width: 0,

            height: 8,

        },


        shadowOpacity: 0.18,


        shadowRadius: 12,


        elevation: 8,

    },



    cardTitle: {


        // ==========================================
        // CHANGED:
        // Stronger category titles.
        // ==========================================
        color: '#355817',

        fontSize: 22,

        fontWeight: '800',

    },



    cardDescription: {


        marginTop: 10,


        color: '#555555',


        fontSize: 15,


        lineHeight: 22,


    },



    nutritionLink: {


        // ==========================================
        // CHANGED:
        // Better spacing from cards.
        // ==========================================
        marginTop: 10,


        marginBottom: 30,


        padding: 18,


        alignItems: 'center',


    },



    nutritionLinkText: {


        // ==========================================
        // CHANGED:
        // White text works better with gradient.
        // ==========================================
        color: '#FFFFFF',


        fontWeight: '700',


        fontSize: 16,


        textDecorationLine: 'underline',


    },


});