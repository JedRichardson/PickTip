import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from '../context/UserContext';


// ==========================================
// ADDED:
// Reusable PickTip App Gradient
// ==========================================
// Uses the same shared PickTip gradient that
// appears throughout the rest of the app.
// ==========================================
import { PickTipGradient } from '@/constants/theme';



export default function SettingsScreen() {


    const {
        profile,
        updateProfile,
        updateGoals
    } = useUser();


    const [
        name,
        setName
    ] = useState(profile.name);


    const [
        diet,
        setDiet
    ] = useState(profile.dietaryPreference);


    const [
        calories,
        setCalories
    ] = useState(
        profile.goals.calories.toString()
    );


    const [
        protein,
        setProtein
    ] = useState(
        profile.goals.protein.toString()
    );


    const [
        carbs,
        setCarbs
    ] = useState(
        profile.goals.carbs.toString()
    );


    const [
        fat,
        setFat
    ] = useState(
        profile.goals.fat.toString()
    );


    const diets = [
        'None',
        'Vegan',
        'Vegetarian',
        'Keto',
        'Gluten-Free'
    ];



    // ==========================================
    // SAVE SETTINGS
    // ==========================================
    // Keeps the existing profile and nutrition
    // goal update behavior unchanged.
    // ==========================================
    const handleSave = async () => {


        try {


            await updateProfile({

                name,

                dietaryPreference: diet

            });


            await updateGoals({

                calories:
                    parseInt(calories) || 0,

                protein:
                    parseInt(protein) || 0,

                carbs:
                    parseInt(carbs) || 0,

                fat:
                    parseInt(fat) || 0,

            });


            Alert.alert(
                'Success',
                'Profile updated successfully!'
            );


            router.back();


        }
        catch (e) {


            Alert.alert(
                'Error',
                'Failed to save settings.'
            );


        }


    };



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
                    SETTINGS HEADER
                ========================================== */}
                <View style={styles.header}>


                    <TouchableOpacity
                        onPress={() =>
                            router.back()
                        }
                        style={styles.headerButton}
                    >


                        <Text
                            style={styles.backButton}
                        >
                            Cancel
                        </Text>


                    </TouchableOpacity>



                    <Text style={styles.title}>
                        Settings
                    </Text>



                    <TouchableOpacity
                        onPress={handleSave}
                        style={styles.headerButton}
                    >


                        <Text
                            style={styles.saveButton}
                        >
                            Save
                        </Text>


                    </TouchableOpacity>


                </View>



                <ScrollView

                    style={styles.content}

                    contentContainerStyle={
                        styles.contentContainer
                    }

                    showsVerticalScrollIndicator={
                        false
                    }

                >


                    {/* ==========================================
                        PROFILE INFO
                    ========================================== */}
                    <View style={styles.section}>


                        <Text
                            style={styles.sectionTitle}
                        >
                            Profile Info
                        </Text>



                        <Text style={styles.label}>
                            Display Name
                        </Text>


                        <TextInput

                            style={styles.input}

                            value={name}

                            onChangeText={setName}

                            placeholder="Your name"

                            placeholderTextColor="#7A7A7A"

                        />



                        <Text style={styles.label}>
                            Dietary Preference
                        </Text>



                        <View
                            style={styles.dietContainer}
                        >


                            {diets.map(d => (


                                <TouchableOpacity

                                    key={d}

                                    style={[

                                        styles.dietChip,

                                        diet === d &&
                                        styles.activeDietChip

                                    ]}

                                    onPress={() =>
                                        setDiet(d)
                                    }

                                >


                                    <Text

                                        style={[

                                            styles.dietChipText,

                                            diet === d &&
                                            styles.activeDietChipText

                                        ]}

                                    >

                                        {d}

                                    </Text>


                                </TouchableOpacity>


                            ))}


                        </View>


                    </View>



                    {/* ==========================================
                        DAILY GOALS
                    ========================================== */}
                    <View style={styles.section}>


                        <Text
                            style={styles.sectionTitle}
                        >
                            Daily Goals
                        </Text>



                        <View style={styles.goalRow}>


                            <View
                                style={
                                    styles.goalInputContainer
                                }
                            >


                                <Text style={styles.label}>
                                    Calories
                                </Text>


                                <TextInput

                                    style={styles.input}

                                    value={calories}

                                    onChangeText={
                                        setCalories
                                    }

                                    keyboardType="numeric"

                                    placeholderTextColor="#7A7A7A"

                                />


                            </View>



                            <View
                                style={
                                    styles.goalInputContainer
                                }
                            >


                                <Text style={styles.label}>
                                    Protein (g)
                                </Text>


                                <TextInput

                                    style={styles.input}

                                    value={protein}

                                    onChangeText={
                                        setProtein
                                    }

                                    keyboardType="numeric"

                                    placeholderTextColor="#7A7A7A"

                                />


                            </View>


                        </View>



                        <View style={styles.goalRow}>


                            <View
                                style={
                                    styles.goalInputContainer
                                }
                            >


                                <Text style={styles.label}>
                                    Carbs (g)
                                </Text>


                                <TextInput

                                    style={styles.input}

                                    value={carbs}

                                    onChangeText={
                                        setCarbs
                                    }

                                    keyboardType="numeric"

                                    placeholderTextColor="#7A7A7A"

                                />


                            </View>



                            <View
                                style={
                                    styles.goalInputContainer
                                }
                            >


                                <Text style={styles.label}>
                                    Fat (g)
                                </Text>


                                <TextInput

                                    style={styles.input}

                                    value={fat}

                                    onChangeText={
                                        setFat
                                    }

                                    keyboardType="numeric"

                                    placeholderTextColor="#7A7A7A"

                                />


                            </View>


                        </View>


                    </View>


                </ScrollView>


            </SafeAreaView>


        </LinearGradient>


    );


}



const styles = StyleSheet.create({


    // ==========================================
    // MAIN SCREEN
    // ==========================================
    gradient: {
        flex: 1,
    },


    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },



    // ==========================================
    // HEADER
    // ==========================================
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 14,

        paddingHorizontal: 14,
        paddingVertical: 14,

        backgroundColor:
            'rgba(255,255,255,0.16)',

        borderRadius: 20,

        borderWidth: 1,

        borderColor:
            'rgba(255,255,255,0.20)',
    },


    headerButton: {
        minWidth: 58,
    },


    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },


    backButton: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },


    saveButton: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'right',
    },



    // ==========================================
    // SCROLL CONTENT
    // ==========================================
    content: {
        flex: 1,
    },


    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },



    // ==========================================
    // SETTINGS SECTION CARD
    // ==========================================
    section: {

        marginBottom: 20,

        padding: 18,

        backgroundColor:
            'rgba(255,255,255,0.93)',

        borderRadius: 22,

        borderWidth: 1,

        borderColor:
            'rgba(255,255,255,0.55)',

        shadowColor: '#000000',

        shadowOpacity: 0.12,

        shadowRadius: 10,

        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 4,

    },


    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#355817',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },



    // ==========================================
    // LABELS + INPUTS
    // ==========================================
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4C4C4C',
        marginBottom: 8,
    },


    input: {

        backgroundColor: '#FFFFFF',

        borderWidth: 1,

        borderColor: '#D9E4D0',

        borderRadius: 14,

        paddingHorizontal: 14,

        paddingVertical: 12,

        fontSize: 16,

        color: '#202020',

        marginBottom: 16,

    },



    // ==========================================
    // DIETARY PREFERENCE CHIPS
    // ==========================================
    dietContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },


    dietChip: {

        backgroundColor: '#F3F7EF',

        borderWidth: 1,

        borderColor: '#CFE0C2',

        paddingHorizontal: 13,

        paddingVertical: 9,

        borderRadius: 20,

        marginRight: 8,

        marginBottom: 8,

    },


    activeDietChip: {
        backgroundColor: '#4D7A20',
        borderColor: '#4D7A20',
    },


    dietChipText: {
        color: '#4D5B46',
        fontSize: 14,
        fontWeight: '600',
    },


    activeDietChipText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },



    // ==========================================
    // DAILY GOAL INPUT GRID
    // ==========================================
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


    goalInputContainer: {
        flex: 0.48,
    },


});
