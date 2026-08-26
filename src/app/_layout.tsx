import { Stack } from 'expo-router';

import {
    StyleSheet,
    View
} from 'react-native';


import { SavedNutritionProvider } from '../context/SavedNutritionContext';

import { MealLogProvider } from '../context/MealLogContext';

import { UserProvider } from '../context/UserContext';

import { WorkoutLogProvider } from '../context/WorkoutLogContext';

import { SavedWorkoutProvider } from '../context/SavedWorkoutContext';


// ==========================================
// ADDED:
// Global PickTip App Sounds Provider.
//
// Keeps the audio players mounted while the
// user moves between Expo Router screens.
//
// This allows sounds such as the workout
// completion celebration to continue playing
// after navigating to the Nutrition screen.
// ==========================================
import { AppSoundsProvider } from '../context/AppSoundsContext';


import BottomNav from '../components/navigation/bottom_nav';



// ==========================================
// ROOT APP LAYOUT
// ==========================================
export default function RootLayout() {


    return (

        <UserProvider>

            <SavedWorkoutProvider>


                <WorkoutLogProvider>


                    <MealLogProvider>


                        <SavedNutritionProvider>


                            {/* ==========================================
                                ADDED:
                                GLOBAL APP SOUNDS
                            ========================================== */}
                            {/* Keeps PickTip sound players alive across
                                screen navigation instead of creating
                                and destroying them on each page. */}
                            <AppSoundsProvider>


                                <View style={styles.container}>


                                    {/* ==========================================
                                        MAIN SCREEN CONTENT
                                    ========================================== */}
                                    <View style={styles.content}>


                                        <Stack

                                            screenOptions={{
                                                headerShown: false,
                                            }}

                                        />


                                    </View>



                                    {/* ==========================================
                                        BOTTOM NAVIGATION
                                    ========================================== */}
                                    <BottomNav />


                                </View>


                            </AppSoundsProvider>


                        </SavedNutritionProvider>


                    </MealLogProvider>


                </WorkoutLogProvider>

            </SavedWorkoutProvider>


        </UserProvider>

    );

}



// ==========================================
// ROOT LAYOUT STYLES
// ==========================================
const styles = StyleSheet.create({


    // ==========================================
    // MAIN APP CONTAINER
    // ==========================================
    container: {
        flex: 1,
    },



    // ==========================================
    // SCREEN CONTENT AREA
    // ==========================================
    content: {
        flex: 1,
    },


});