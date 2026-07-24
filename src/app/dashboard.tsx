import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { LinearGradient } from 'expo-linear-gradient';
// ==========================================
// ADDED:
// Gradient background to match PickTip theme.
// ==========================================


import { useMealLog } from '../context/MealLogContext';
import { useSmartFoodSuggestions } from '../hooks/useSmartFoodSuggestions';
import { useUser } from '../context/UserContext';
import { useWorkoutLog, LoggedWorkout } from '../context/WorkoutLogContext';
import { RecipeCard } from '../components/recipe-card';
import { Alert } from 'react-native';


export default function NutritionDashboard() {
    const { mealLogs, dailyTotals, removeLog, logMeal, logWater } = useMealLog();
    const { profile } = useUser();
    const { workouts, dailyTotalCalories, removeWorkout } = useWorkoutLog();
    const { suggestions: smartSuggestions, isLoading: suggestionsLoading } = useSmartFoodSuggestions();

const { width } = Dimensions.get('window');



export default function NutritionDashboard() {


    const {
        mealLogs,
        dailyTotals,
        removeLog,
        logMeal,
        logWater
    } = useMealLog();


    const { profile } = useUser();


    const {
        workouts,
        dailyTotalCalories,
        removeWorkout
    } = useWorkoutLog();


    const smartSuggestions = useSmartFoodSuggestions();



    const WATER_GOAL = 2500; // ml

    const CALORIE_BUDGET = profile.goals.calories + dailyTotalCalories;

    const REMAINING = CALORIE_BUDGET - dailyTotals.calories;




    const handleQuickLog = (food: any) => {

        logMeal(food);

        Alert.alert(
            'Logged',
            `${food.name} added to your daily log.`
        );

    };




    const handleAddWater = (amount: number) => {

        logWater(amount);

    };





    const renderProgressBar = (
        label: string,
        value: number,
        goal: number,
        color: string
    ) => {


        const percentage = Math.min(
            (value / goal) * 100,
            100
        );


        return (

            <View style={styles.progressItem}>


                <View style={styles.progressLabels}>


                    <Text style={styles.progressLabel}>
                        {label}
                    </Text>



                    <Text style={styles.progressValue}>
                        {Math.round(value)} / {goal}
                    </Text>


                </View>



                <View style={styles.progressBarBg}>


                    <View

                        style={[
                            styles.progressBarFill,

                            {
                                width: `${percentage}%`,
                                backgroundColor: color,
                            },

                        ]}

                    />


                </View>


            </View>

        );

    };





    return (

        // ==========================================
        // CHANGED:
        // Added gradient background to match
        // Home, Learn More, and Category screens.
        // ==========================================
        <LinearGradient

            colors={[
                '#78B63C',
                '#4D7A20',
                '#355817'
            ]}

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



            <SafeAreaView style={styles.container}>



                {/* ==========================================
                    CHANGED:
                    Header is now transparent and blends
                    with the PickTip theme.
                ========================================== */}

                <View style={styles.header}>


                    <View style={styles.headerTop}>


                        <TouchableOpacity
                            onPress={() => router.back()}
                        >

                            <Text style={styles.backButton}>
                                Back
                            </Text>


                        </TouchableOpacity>



                        <TouchableOpacity

                            onPress={() => router.push('/settings')}

                        >

                            <Text style={styles.settingsButton}>
                                Settings
                            </Text>


                        </TouchableOpacity>


                    </View>




                    <Text style={styles.title}>
                        Nutrition Tracker
                    </Text>



                </View>






                <ScrollView

                    showsVerticalScrollIndicator={false}

                    contentContainerStyle={styles.scrollContent}

                >



                    {/* ==========================================
                        CHANGED:
                        Main calorie card now acts as a
                        dashboard highlight card.
                    ========================================== */}

                    <View style={styles.netCalorieCard}>


                        <View style={styles.netCalorieRow}>


                            <View style={styles.netCalorieItem}>

                                <Text style={styles.netCalorieValue}>
                                    {profile.goals.calories}
                                </Text>

                                <Text style={styles.netCalorieLabel}>
                                    Goal
                                </Text>

                            </View>




                            <Text style={styles.netCalorieOp}>
                                +
                            </Text>




                            <View style={styles.netCalorieItem}>


                                <Text style={styles.netCalorieValue}>
                                    {dailyTotalCalories}
                                </Text>


                                <Text style={styles.netCalorieLabel}>
                                    Exercise
                                </Text>


                            </View>





                            <Text style={styles.netCalorieOp}>
                                -
                            </Text>





                            <View style={styles.netCalorieItem}>


                                <Text style={styles.netCalorieValue}>
                                    {Math.round(dailyTotals.calories)}
                                </Text>


                                <Text style={styles.netCalorieLabel}>
                                    Food
                                </Text>


                            </View>





                            <Text style={styles.netCalorieOp}>
                                =
                            </Text>





                            <View style={styles.netCalorieItem}>


                                <Text
                                    style={[
                                        styles.netCalorieValue,
                                        styles.remainingValue
                                    ]}
                                >

                                    {Math.round(REMAINING)}

                                </Text>


                                <Text style={styles.netCalorieLabel}>
                                    Remaining
                                </Text>


                            </View>



                        </View>



                    </View>



                    <View style={styles.summaryCard}>

                        <Text style={styles.cardTitle}>
                            Daily Progress
                        </Text>


                        {renderProgressBar(
                            'Calories',
                            dailyTotals.calories,
                            CALORIE_BUDGET,
                            '#4D7A20'
                        )}


                        {renderProgressBar(
                            'Protein (g)',
                            dailyTotals.protein,
                            profile.goals.protein,
                            '#2196F3'
                        )}


                        {renderProgressBar(
                            'Carbs (g)',
                            dailyTotals.carbs,
                            profile.goals.carbs,
                            '#FF9800'
                        )}


                        {renderProgressBar(
                            'Fat (g)',
                            dailyTotals.fat,
                            profile.goals.fat,
                            '#E91E63'
                        )}


                    </View>





                    <View style={styles.waterCard}>


                        <View style={styles.waterHeader}>


                            <Text style={styles.cardTitle}>
                                Hydration
                            </Text>


                            <Text style={styles.waterValue}>
                                {dailyTotals.water} / {WATER_GOAL} ml
                            </Text>


                        </View>





                        <View style={styles.waterProgressBg}>


                            <View

                                style={[
                                    styles.waterProgressFill,
                                    {
                                        width:
                                            `${Math.min(
                                                (dailyTotals.water / WATER_GOAL) * 100,
                                                100
                                            )}%`
                                    }
                                ]}

                            />


                        </View>





                        <View style={styles.waterButtons}>


                            <TouchableOpacity

                                style={styles.waterButton}

                                onPress={() => handleAddWater(250)}

                            >

                                <Text style={styles.waterButtonText}>
                                    +250ml
                                </Text>

                            </TouchableOpacity>





                            <TouchableOpacity

                                style={styles.waterButton}

                                onPress={() => handleAddWater(500)}

                            >

                                <Text style={styles.waterButtonText}>
                                    +500ml
                                </Text>


                            </TouchableOpacity>


                        </View>



                    </View>







                    <View style={styles.suggestionsSection}>


                        <Text style={styles.sectionTitle}>
                            Smart Suggestions
                        </Text>


                        <Text style={styles.sectionSubtitle}>
                            Recommended for your next meal
                        </Text>





                        <ScrollView

                            horizontal

                            showsHorizontalScrollIndicator={false}

                            contentContainerStyle={styles.suggestionsScroll}

                        >


                            {smartSuggestions.map(food => (


                                <View

                                    key={food.id}

                                    style={styles.suggestionWrapper}

                                >


                                    <FoodSuggestionCard

                                        food={food}

                                        onPress={() =>
                                            router.push(
                                                `/nutrition?intensity=${food.pairingIntensity}`
                                            )
                                        }


                                        onLog={() =>
                                            handleQuickLog(food)
                                        }

                                    />


                                </View>


                            ))}


                        </ScrollView>


                    </View>







                    <View style={styles.logsSection}>


                        <Text style={styles.sectionTitle}>
                            Today's Workouts
                        </Text>




                        {
                            workouts.filter(
                                w =>
                                    new Date(w.timestamp)
                                        .setHours(0, 0, 0, 0)
                                    ===
                                    new Date()
                                        .setHours(0, 0, 0, 0)
                            ).length === 0 ? (


                                <View style={styles.emptyLogs}>

                                    <Text style={styles.emptyText}>
                                        No workouts logged today.
                                    </Text>

                                </View>


                            ) : (


                                workouts
                                    .filter(
                                        w =>
                                            new Date(w.timestamp)
                                                .setHours(0, 0, 0, 0)
                                            ===
                                            new Date()
                                                .setHours(0, 0, 0, 0)
                                    )
                                    .map((w) => (


                                        <View

                                            key={w.id}

                                            style={styles.logCard}

                                        >


                                            <View style={styles.logInfo}>


                                                <Text style={styles.logName}>
                                                    {w.name}
                                                </Text>


                                                <Text style={styles.logTime}>
                                                    {w.duration} • {w.intensity}
                                                </Text>


                                            </View>





                                            <View style={styles.logMacros}>


                                                <Text

                                                    style={[
                                                        styles.macroText,
                                                        {
                                                            color: '#E91E63'
                                                        }
                                                    ]}

                                                >

                                                    -{w.calories} kcal

                                                </Text>




                                                <TouchableOpacity

                                                    onPress={() =>
                                                        removeWorkout(w.id)
                                                    }

                                                    style={styles.deleteButton}

                                                >

                                                    <Text style={styles.deleteButtonText}>
                                                        X
                                                    </Text>


                                                </TouchableOpacity>



                                            </View>



                                        </View>


                                    ))


                            )

                        }


                    </View>







                    <View style={styles.logsSection}>


                        <Text style={styles.sectionTitle}>
                            Today's Meals
                        </Text>




                        {
                            mealLogs.length === 0 ? (


                                <View style={styles.emptyLogs}>


                                    <Text style={styles.emptyText}>
                                        No meals logged yet.
                                    </Text>




                                    <TouchableOpacity

                                        style={styles.actionButton}

                                        onPress={() =>
                                            router.push('/category')
                                        }

                                    >

                                        <Text style={styles.actionButtonText}>
                                            Browse Suggestions
                                        </Text>


                                    </TouchableOpacity>



                                </View>


                            ) : (


                                mealLogs.map((log) => (


                                    <View

                                        key={log.logId}

                                        style={styles.logCard}

                                    >


                                        <View style={styles.logInfo}>


                                            <Text style={styles.logName}>
                                                {log.name}
                                            </Text>


                                            <Text style={styles.logTime}>

                                                {new Date(log.timestamp)
                                                    .toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }
                                                    )}

                                            </Text>


                                        </View>





                                        <View style={styles.logMacros}>


                                            <Text style={styles.macroText}>
                                                {Math.round(log.calories)} kcal
                                            </Text>



                                            <TouchableOpacity

                                                onPress={() =>
                                                    removeLog(log.logId)
                                                }

                                                style={styles.deleteButton}

                                            >

                                                <Text style={styles.deleteButtonText}>
                                                    X
                                                </Text>


                                            </TouchableOpacity>



                                        </View>



                                    </View>


                                ))


                            )

                        }



                    </View>

                <View style={styles.suggestionsSection}>
                    <Text style={styles.sectionTitle}>Smart Suggestions</Text>
                    <Text style={styles.sectionSubtitle}>Recommended for your next meal</Text>
                    {suggestionsLoading ? (
                        <View style={styles.loadingSuggestions}>
                            <ActivityIndicator color="#4D7A20" />
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                            {smartSuggestions.map(recipe => (
                                <View key={recipe.id} style={styles.suggestionWrapper}>
                                    <RecipeCard
                                        recipe={recipe}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    )}
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
    // CHANGED:
    // Header now blends into PickTip theme.
    // ==========================================
    header: {

        paddingHorizontal: 22,

        paddingTop: 15,

        paddingBottom: 20,

    },



    headerTop: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginBottom: 14,

    },



    backButton: {

        color: '#FFFFFF',

        fontSize: 16,

        fontWeight: '700',

    },



    settingsButton: {

        color: '#FFFFFF',

        fontSize: 16,

        fontWeight: '700',

    },



    title: {

        color: '#FFFFFF',

        fontSize: 34,

        fontWeight: '800',

        letterSpacing: 0.5,

    },



    scrollContent: {

        paddingHorizontal: 20,

        paddingBottom: 30,

    },



    // ==========================================
    // CHANGED:
    // Dashboard cards now match Learn More
    // and Category styling.
    // ==========================================
    netCalorieCard: {

        backgroundColor: '#FFFFFF',

        borderRadius: 28,

        padding: 22,

        marginBottom: 18,


        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.15,

        shadowRadius: 15,

        elevation: 8,

    },



    netCalorieRow: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

    },



    netCalorieItem: {

        alignItems: 'center',

        flex: 1,

    },



    netCalorieValue: {

        fontSize: 18,

        fontWeight: '800',

        color: '#355817',

    },


    remainingValue: {

        color: '#4D7A20',

    },



    netCalorieLabel: {

        fontSize: 10,

        color: '#777',

        textTransform: 'uppercase',

        marginTop: 5,

        fontWeight: '600',

    },



    netCalorieOp: {

        fontSize: 18,

        color: '#AAAAAA',

        paddingHorizontal: 3,

    },





    summaryCard: {

        backgroundColor: '#FFFFFF',

        borderRadius: 24,

        padding: 20,

        marginBottom: 18,


        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 6,
        },

        shadowOpacity: 0.12,

        shadowRadius: 12,

        elevation: 6,

    },





    waterCard: {

        backgroundColor: '#FFFFFF',

        borderRadius: 24,

        padding: 20,

        marginBottom: 22,


        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 6,
        },

        shadowOpacity: 0.12,

        shadowRadius: 12,

        elevation: 6,

    },





    cardTitle: {

        fontSize: 20,

        fontWeight: '800',

        color: '#355817',

        marginBottom: 16,

    },





    waterHeader: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

    },



    waterValue: {

        fontSize: 14,

        fontWeight: '700',

        color: '#2196F3',

    },



    waterProgressBg: {

        height: 12,

        backgroundColor: '#E3F2FD',

        borderRadius: 10,

        overflow: 'hidden',

        marginBottom: 16,

    },



    waterProgressFill: {

        height: '100%',

        backgroundColor: '#2196F3',

        borderRadius: 10,

    },



    waterButtons: {

        flexDirection: 'row',

        justifyContent: 'space-around',

    },



    waterButton: {

        backgroundColor: '#E3F2FD',

        paddingHorizontal: 20,

        paddingVertical: 10,

        borderRadius: 18,

    },



    waterButtonText: {

        color: '#1976D2',

        fontWeight: '800',

    },





    progressItem: {

        marginBottom: 18,

    },



    progressLabels: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        marginBottom: 6,

    },



    progressLabel: {

        fontSize: 14,

        color: '#555',

        fontWeight: '700',

    },



    progressValue: {

        fontSize: 12,

        color: '#888',

    },



    progressBarBg: {

        height: 10,

        backgroundColor: '#EEEEEE',

        borderRadius: 10,

        overflow: 'hidden',

    },



    progressBarFill: {

        height: '100%',

        borderRadius: 10,

    },





    suggestionsSection: {

        marginBottom: 25,

    },



    sectionTitle: {

        color: '#FFFFFF',

        fontSize: 22,

        fontWeight: '800',

        marginBottom: 6,

    },



    sectionSubtitle: {

        color: '#FFFFFF',

        opacity: 0.85,

        fontSize: 14,

        marginBottom: 14,

    },



    suggestionsScroll: {

        paddingRight: 20,

    },
    loadingSuggestions: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionWrapper: {

        width: width * 0.75,

        marginRight: 16,

    },





    logsSection: {

        marginTop: 8,

        marginBottom: 20,

    },





    emptyLogs: {

        backgroundColor: '#FFFFFF',

        borderRadius: 20,

        padding: 35,

        alignItems: 'center',

    },



    emptyText: {

        color: '#777',

        fontSize: 16,

        marginBottom: 20,

    },





    actionButton: {

        backgroundColor: '#4D7A20',

        paddingHorizontal: 24,

        paddingVertical: 12,

        borderRadius: 18,

    },



    actionButtonText: {

        color: '#FFFFFF',

        fontWeight: '800',

    },





    logCard: {

        backgroundColor: '#FFFFFF',

        borderRadius: 18,

        padding: 16,

        marginBottom: 12,


        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',


        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.08,

        shadowRadius: 8,

        elevation: 3,

    },



    logInfo: {

        flex: 1,

    },



    logName: {

        fontSize: 16,

        fontWeight: '700',

        color: '#222',

    },



    logTime: {

        fontSize: 12,

        color: '#777',

        marginTop: 4,

    },



    logMacros: {

        flexDirection: 'row',

        alignItems: 'center',

    },



    macroText: {

        fontSize: 14,

        fontWeight: '800',

        color: '#4D7A20',

        marginRight: 12,

    },



    deleteButton: {

        padding: 5,

    },



    deleteButtonText: {

        color: '#BBBBBB',

        fontSize: 16,

        fontWeight: '800',

    },


});