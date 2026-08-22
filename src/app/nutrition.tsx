import React, {
    useState,
    useMemo,
    useEffect,
    useRef
} from 'react';


import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    Alert,
    ScrollView,
    Animated,
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';


import {
    useLocalSearchParams,
    router
} from 'expo-router';


// ==========================================
// ADDED:
// PickTip gradient background.
// ==========================================
import { LinearGradient } from 'expo-linear-gradient';


// ==========================================
// ADDED:
// Lottie confetti celebration.
// ==========================================
import LottieView from 'lottie-react-native';



import { Food } from '../data/nutrition';

import { useFoodSuggestions } from '../hooks/useFoodSuggestions';

import { useSavedNutrition } from '../context/SavedNutritionContext';

import { useMealLog } from '../context/MealLogContext';

import { useUser } from '../context/UserContext';

import {
    fetchRecommendations,
    SpoonacularRecipe
} from '../services/spoonacular';


import { RecipeCard } from '../components/recipe-card';
import LoadingScreen from '../components/LoadingScreen';





export default function NutritionScreen() {


    const {
        intensity,
        category,
        workoutComplete,
        fromWorkout
    } = useLocalSearchParams();




    // ==========================================
    // ADDED:
    // WORKOUT ROUTE SOURCE
    // ==========================================
    // Nutrition should render immediately when
    // opened from either workout screen while the
    // Spoonacular recipes load in the background.
    const cameFromWorkout =
        Array.isArray(fromWorkout)
            ? fromWorkout[0] === 'true'
            : fromWorkout === 'true';



    const { profile } = useUser();



    const [
        selectedMealType,
        setSelectedMealType
    ] = useState<string | undefined>(undefined);




    const suggestions = useFoodSuggestions({

        intensity,

        category,

        mealType: selectedMealType

    });




    const {
        saveFood,
        isSaved,
        removeFood

    } = useSavedNutrition();




    const {
        logMeal

    } = useMealLog();





    const [
        searchQuery,
        setSearchQuery

    ] = useState('');




    const [
        globalRecipes,
        setGlobalRecipes

    ] = useState<SpoonacularRecipe[]>([]);




    const [
        isLoadingRecipes,
        setIsLoadingRecipes

    ] = useState(true);




    // ==========================================
    // ADDED:
    // Workout completion confetti state.
    // ==========================================
    // The celebration only appears when Nutrition
    // was opened from Complete Workout.
    const [
        showConfetti,
        setShowConfetti
    ] = useState(false);


    // Prevents the confetti from replaying if the
    // Nutrition screen reloads recipes or filters.
    const hasPlayedConfetti =
        useRef(false);


    // Controls the shared fade in / fade out.
    const confettiOpacity =
        useRef(new Animated.Value(0)).current;


    // Controls the left-side slide animation.
    const leftConfettiTranslate =
        useRef(new Animated.Value(-40)).current;


    // Controls the right-side slide animation.
    const rightConfettiTranslate =
        useRef(new Animated.Value(40)).current;





    const mealTypes = [

        'Breakfast',

        'Lunch',

        'Dinner',

        'Snack'

    ];





    useEffect(() => {

        loadGlobalRecipes();

    }, [
        intensity,
        selectedMealType,
        profile.dietaryPreference
    ]);




    // ==========================================
    // ADDED:
    // WORKOUT COMPLETION CONFETTI
    // ==========================================
    // Runs once as soon as Nutrition opens when
    // the user arrives by pressing Complete Workout.
    //
    // The animation fades and slides in from both
    // sides, stays visible during the celebration,
    // then fades back out near the end of the
    // workout completion audio.
    useEffect(() => {


        const workoutWasCompleted =
            Array.isArray(workoutComplete)
                ? workoutComplete[0] === 'true'
                : workoutComplete === 'true';


        if (
            !workoutWasCompleted ||
            hasPlayedConfetti.current
        ) {

            return;

        }


        hasPlayedConfetti.current = true;

        setShowConfetti(true);


        // Reset the animation values before playing.
        confettiOpacity.setValue(0);

        leftConfettiTranslate.setValue(-40);

        rightConfettiTranslate.setValue(40);


        const celebrationAnimation =
            Animated.sequence([


                // ==========================================
                // FADE / SLIDE IN
                // ==========================================
                Animated.parallel([

                    Animated.timing(
                        confettiOpacity,
                        {
                            toValue: 1,
                            duration: 350,
                            useNativeDriver: true,
                        }
                    ),

                    Animated.timing(
                        leftConfettiTranslate,
                        {
                            toValue: 0,
                            duration: 350,
                            useNativeDriver: true,
                        }
                    ),

                    Animated.timing(
                        rightConfettiTranslate,
                        {
                            toValue: 0,
                            duration: 350,
                            useNativeDriver: true,
                        }
                    ),

                ]),


                // Keep the celebration visible while the
                // completion sounds are playing.
                Animated.delay(2650),


                // ==========================================
                // FADE / SLIDE OUT
                // ==========================================
                Animated.parallel([

                    Animated.timing(
                        confettiOpacity,
                        {
                            toValue: 0,
                            duration: 700,
                            useNativeDriver: true,
                        }
                    ),

                    Animated.timing(
                        leftConfettiTranslate,
                        {
                            toValue: -24,
                            duration: 700,
                            useNativeDriver: true,
                        }
                    ),

                    Animated.timing(
                        rightConfettiTranslate,
                        {
                            toValue: 24,
                            duration: 700,
                            useNativeDriver: true,
                        }
                    ),

                ]),

            ]);


        celebrationAnimation.start(
            ({ finished }) => {

                if (finished) {

                    setShowConfetti(false);

                }

            }
        );


        return () => {

            celebrationAnimation.stop();

        };


    }, [
        workoutComplete,
        confettiOpacity,
        leftConfettiTranslate,
        rightConfettiTranslate
    ]);





    const loadGlobalRecipes = async () => {


        setIsLoadingRecipes(true);



        let minProtein = 10;

        let maxCalories = 800;



        if (intensity === 'High') {

            minProtein = 30;

            maxCalories = 1000;


        }

        else if (intensity === 'Low') {

            minProtein = 5;

            maxCalories = 400;

        }




        const recipes = await fetchRecommendations({

            diet: profile.dietaryPreference,

            minProtein,

            maxCalories,

            type: selectedMealType?.toLowerCase(),

            number: 10

        });




        setGlobalRecipes(recipes);



        setIsLoadingRecipes(false);


    };







    const filteredSuggestions = useMemo(() => {


        if (!searchQuery)

            return suggestions;




        return suggestions.filter(item =>


            item.name

                .toLowerCase()

                .includes(
                    searchQuery.toLowerCase()
                )



            ||

            item.description

                .toLowerCase()

                .includes(
                    searchQuery.toLowerCase()
                )



            ||

            item.dietaryLabels.some(label =>

                label

                    .toLowerCase()

                    .includes(
                        searchQuery.toLowerCase()
                    )

            )


        );


    }, [
        suggestions,
        searchQuery
    ]);







    const handleLogMeal = async (item: Food) => {


        await logMeal(item);



        Alert.alert(

            'Success',

            `${item.name} has been logged to your dashboard!`

        );


    };







    const renderFoodItem = ({
        item
    }: {
        item: Food
    }) => {


        const saved = isSaved(item.id);




        return (


            <View style={styles.card}>


                <View style={styles.cardHeader}>


                    <View style={styles.nameContainer}>


                        <Text style={styles.foodName}>

                            {item.name}

                        </Text>



                        <Text style={styles.servingSize}>

                            {item.servingSize}

                        </Text>


                    </View>





                    <TouchableOpacity


                        onPress={() =>

                            saved

                                ? removeFood(item.id)

                                : saveFood(item)

                        }


                        style={[
                            styles.saveButton,

                            saved &&
                            styles.savedButton

                        ]}


                    >

                        <Text style={styles.saveButtonText}>

                            {saved ? 'Saved' : 'Save'}

                        </Text>


                    </TouchableOpacity>


                </View>





                <Text style={styles.description}>

                    {item.description}

                </Text>







                <View style={styles.statsRow}>


                    <View style={styles.stat}>

                        <Text style={styles.statValue}>

                            {item.calories}

                        </Text>


                        <Text style={styles.statLabel}>

                            kcal

                        </Text>


                    </View>




                    <View style={styles.stat}>

                        <Text style={styles.statValue}>

                            {item.protein}g

                        </Text>


                        <Text style={styles.statLabel}>

                            Protein

                        </Text>


                    </View>




                    <View style={styles.stat}>

                        <Text style={styles.statValue}>

                            {item.carbs}g

                        </Text>


                        <Text style={styles.statLabel}>

                            Carbs

                        </Text>


                    </View>




                    <View style={styles.stat}>

                        <Text style={styles.statValue}>

                            {item.fat}g

                        </Text>


                        <Text style={styles.statLabel}>

                            Fat

                        </Text>


                    </View>


                </View>





                <View style={styles.footerRow}>


                    <View style={styles.labelContainer}>


                        {item.dietaryLabels.map(label => (


                            <View

                                key={label}

                                style={styles.label}

                            >

                                <Text style={styles.labelText}>

                                    {label}

                                </Text>


                            </View>


                        ))}


                    </View>





                    <TouchableOpacity


                        style={styles.logButton}


                        onPress={() =>
                            handleLogMeal(item)
                        }


                    >

                        <Text style={styles.logButtonText}>

                            Log Meal

                        </Text>


                    </TouchableOpacity>


                </View>



            </View>


        );


    };

    // ==========================================
    // NUTRITION LOADING BEHAVIOR
    // ==========================================
    // Keep the reusable loading screen when
    // Nutrition is opened independently.
    //
    // When Nutrition is opened from workout.tsx
    // or workoutsession.tsx, render Nutrition
    // immediately while Spoonacular continues
    // loading recipes in the background.
    // ==========================================
    if (
        isLoadingRecipes &&
        !cameFromWorkout
    ) {

        return (

            <LoadingScreen
                message="Picking your food recommendations..."
            />

        );

    }

    return (

        // ==========================================
        // CHANGED:
        // Added PickTip gradient theme.
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


            {/* ==========================================
                ADDED:
                WORKOUT COMPLETION CONFETTI
            ========================================== */}
            {/* Confetti appears only after Complete Workout.
                The overlay does not block Nutrition controls. */}
            {showConfetti && (

                <View
                    pointerEvents="none"
                    style={styles.confettiOverlay}
                >


                    {/* Left-side confetti burst */}
                    <Animated.View
                        style={[
                            styles.confettiSide,
                            styles.confettiLeft,
                            {
                                opacity:
                                    confettiOpacity,

                                transform: [
                                    {
                                        translateX:
                                            leftConfettiTranslate
                                    }
                                ]
                            }
                        ]}
                    >

                        <LottieView

                            source={
                                require('../../assets/animations/confetti.json')
                            }

                            autoPlay

                            loop={false}

                            style={
                                styles.confettiAnimation
                            }

                        />

                    </Animated.View>



                    {/* Right-side confetti burst */}
                    <Animated.View
                        style={[
                            styles.confettiSide,
                            styles.confettiRight,
                            {
                                opacity:
                                    confettiOpacity,

                                transform: [
                                    {
                                        translateX:
                                            rightConfettiTranslate
                                    }
                                ]
                            }
                        ]}
                    >

                        <LottieView

                            source={
                                require('../../assets/animations/confetti.json')
                            }

                            autoPlay

                            loop={false}

                            style={[
                                styles.confettiAnimation,
                                styles.confettiAnimationRight
                            ]}

                        />

                    </Animated.View>


                </View>

            )}


            <SafeAreaView style={styles.container}>


                {/* ==========================================
                    CHANGED:
                    Transparent header to blend with theme.
                ========================================== */}

                <View style={styles.header}>


                    <View style={styles.topBar}>


                        <TouchableOpacity

                            onPress={() => router.back()}

                        >

                            <Text style={styles.backButton}>
                                Back
                            </Text>


                        </TouchableOpacity>





                        <TouchableOpacity

                            onPress={() =>
                                router.push('/dashboard')
                            }

                        >

                            <Text style={styles.dashboardLink}>
                                Dashboard
                            </Text>


                        </TouchableOpacity>


                    </View>





                    <Text style={styles.title}>
                        Recommended Fuel
                    </Text>



                    <Text style={styles.subtitle}>
                        Based on {intensity} intensity workout
                    </Text>







                    <TextInput

                        style={styles.searchInput}

                        placeholder="Search foods, ingredients, or diet..."

                        placeholderTextColor="#888"

                        value={searchQuery}

                        onChangeText={setSearchQuery}

                    />







                    <View style={styles.filterContainer}>


                        <ScrollView

                            horizontal

                            showsHorizontalScrollIndicator={false}

                        >


                            <TouchableOpacity

                                style={[
                                    styles.filterChip,

                                    !selectedMealType &&
                                    styles.activeFilterChip

                                ]}


                                onPress={() =>
                                    setSelectedMealType(undefined)
                                }

                            >

                                <Text

                                    style={[
                                        styles.filterChipText,

                                        !selectedMealType &&
                                        styles.activeFilterChipText

                                    ]}

                                >

                                    All

                                </Text>


                            </TouchableOpacity>







                            {mealTypes.map(type => (


                                <TouchableOpacity


                                    key={type}


                                    style={[
                                        styles.filterChip,

                                        selectedMealType === type &&

                                        styles.activeFilterChip

                                    ]}



                                    onPress={() =>
                                        setSelectedMealType(type)
                                    }


                                >


                                    <Text

                                        style={[
                                            styles.filterChipText,

                                            selectedMealType === type &&

                                            styles.activeFilterChipText

                                        ]}

                                    >

                                        {type}

                                    </Text>


                                </TouchableOpacity>


                            ))}



                        </ScrollView>


                    </View>


                </View>







                <FlatList


                    data={filteredSuggestions}


                    renderItem={renderFoodItem}


                    keyExtractor={item => item.id}



                    contentContainerStyle={styles.listContent}







                    ListHeaderComponent={


                        globalRecipes.length > 0 ? (



                            <View style={styles.globalSection}>


                                <Text style={styles.sectionTitle}>
                                    Global Recipe Discoveries
                                </Text>



                                <Text style={styles.sectionSubtitle}>
                                    Powered by Spoonacular
                                </Text>






                                <FlatList


                                    horizontal


                                    data={globalRecipes}



                                    renderItem={({ item }) => (


                                        <RecipeCard

                                            recipe={item}

                                            onPress={() =>

                                                Alert.alert(

                                                    item.title,

                                                    'Recipe details integration coming soon!'

                                                )

                                            }

                                        />


                                    )}



                                    keyExtractor={item =>
                                        item.id.toString()
                                    }



                                    showsHorizontalScrollIndicator={false}


                                    contentContainerStyle={
                                        styles.horizontalList
                                    }


                                />





                                <View style={styles.divider} />





                                <Text style={styles.sectionTitle}>
                                    Hand-picked Suggestions
                                </Text>



                            </View>



                        ) : null


                    }







                    ListEmptyComponent={


                        <Text style={styles.emptyText}>


                            {
                                searchQuery

                                    ? 'No foods match your search.'

                                    : 'No specific recommendations found for this intensity.'
                            }


                        </Text>


                    }


                />








                <View style={styles.bottomButtons}>


                    <TouchableOpacity

                        style={styles.viewSavedButton}

                        onPress={() =>
                            router.push('/saved')
                        }

                    >

                        <Text style={styles.viewSavedText}>
                            Saved Items
                        </Text>


                    </TouchableOpacity>






                    <TouchableOpacity


                        style={[
                            styles.viewSavedButton,

                            styles.dashboardButton

                        ]}



                        onPress={() =>
                            router.push('/dashboard')
                        }


                    >

                        <Text style={styles.dashboardButtonText}>
                            My Dashboard
                        </Text>


                    </TouchableOpacity>



                </View>



            </SafeAreaView>


        </LinearGradient>

    );
}
const styles = StyleSheet.create({

    // ==========================================
    // ADDED:
    // Full PickTip gradient background.
    // ==========================================
    gradient: {
        flex: 1,
    },



    // ==========================================
    // ADDED:
    // Workout completion confetti overlay.
    // ==========================================
    confettiOverlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 100,
        elevation: 100,
    },


    // Shared positioning for both celebration
    // bursts along the sides of the screen.
    confettiSide: {
        position: 'absolute',
        top: 30,
        width: 260,
        height: 430,
    },


    // Keeps most of the left burst near the edge
    // so the center Nutrition content stays clear.
    confettiLeft: {
        left: -78,
    },


    // Mirrors the placement on the right side.
    confettiRight: {
        right: -78,
    },


    // Main Lottie sizing for the celebration.
    confettiAnimation: {
        width: '100%',
        height: '100%',
    },


    // Reuses the same JSON file while mirroring
    // the right-side burst toward the app content.
    confettiAnimationRight: {
        transform: [
            {
                scaleX: -1,
            }
        ],
    },


    container: {
        flex: 1,
    },



    header: {

        paddingHorizontal: 22,

        paddingTop: 15,

        paddingBottom: 20,

    },



    topBar: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginBottom: 15,

    },



    backButton: {

        color: '#FFFFFF',

        fontSize: 16,

        fontWeight: '700',

    },



    dashboardLink: {

        color: '#355817',

        backgroundColor: '#FFFFFF',

        paddingHorizontal: 14,

        paddingVertical: 8,

        borderRadius: 20,

        fontWeight: '800',

    },



    title: {

        color: '#FFFFFF',

        fontSize: 34,

        fontWeight: '800',

    },



    subtitle: {

        color: '#FFFFFF',

        opacity: .85,

        fontSize: 16,

        marginTop: 5,

        marginBottom: 18,

    },



    searchInput: {

        backgroundColor: '#FFFFFF',

        borderRadius: 18,

        padding: 14,

        fontSize: 15,

        color: '#333',

    },



    filterContainer: {

        marginTop: 16,

    },



    filterChip: {

        backgroundColor: 'rgba(255,255,255,.25)',

        paddingHorizontal: 18,

        paddingVertical: 9,

        borderRadius: 20,

        marginRight: 10,

    },



    activeFilterChip: {

        backgroundColor: '#FFFFFF',

    },



    filterChipText: {

        color: '#FFFFFF',

        fontWeight: '700',

    },



    activeFilterChipText: {

        color: '#355817',

    },



    listContent: {

        paddingHorizontal: 20,

        paddingBottom: 120,

    },



    card: {

        backgroundColor: '#FFFFFF',

        borderRadius: 24,

        padding: 18,

        marginBottom: 16,


        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 7,
        },

        shadowOpacity: .15,

        shadowRadius: 12,

        elevation: 7,

    },



    cardHeader: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'flex-start',

    },



    nameContainer: {

        flex: 1,

    },



    foodName: {

        fontSize: 20,

        fontWeight: '800',

        color: '#355817',

    },



    servingSize: {

        fontSize: 12,

        color: '#777',

        marginTop: 4,

    },



    saveButton: {

        backgroundColor: '#EEF7E8',

        paddingHorizontal: 12,

        paddingVertical: 8,

        borderRadius: 16,

    },



    savedButton: {

        backgroundColor: '#4D7A20',

    },



    saveButtonText: {

        color: '#4D7A20',

        fontWeight: '800',

        fontSize: 12,

    },



    description: {

        marginTop: 14,

        color: '#444',

        lineHeight: 21,

    },



    statsRow: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        marginTop: 16,

        paddingVertical: 12,

        borderTopWidth: 1,

        borderBottomWidth: 1,

        borderColor: '#EEEEEE',

    },



    stat: {

        alignItems: 'center',

    },



    statValue: {

        color: '#4D7A20',

        fontWeight: '800',

        fontSize: 17,

    },



    statLabel: {

        fontSize: 11,

        color: '#777',

    },



    footerRow: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginTop: 14,

    },



    labelContainer: {

        flexDirection: 'row',

        flexWrap: 'wrap',

        flex: 1,

    },



    label: {

        backgroundColor: '#EEF7E8',

        paddingHorizontal: 8,

        paddingVertical: 5,

        borderRadius: 12,

        marginRight: 6,

    },



    labelText: {

        color: '#355817',

        fontSize: 11,

        fontWeight: '700',

    },



    logButton: {

        backgroundColor: '#4D7A20',

        paddingHorizontal: 18,

        paddingVertical: 10,

        borderRadius: 16,

    },



    logButtonText: {

        color: '#FFFFFF',

        fontWeight: '800',

    },



    bottomButtons: {

        position: 'absolute',

        bottom: 0,

        left: 0,

        right: 0,

        flexDirection: 'row',

        padding: 16,

        backgroundColor: 'rgba(255,255,255,.95)',

    },



    viewSavedButton: {

        flex: 1,

        borderWidth: 1,

        borderColor: '#4D7A20',

        padding: 14,

        borderRadius: 16,

        alignItems: 'center',

        marginRight: 8,

    },



    dashboardButton: {

        backgroundColor: '#4D7A20',

        marginRight: 0,

        marginLeft: 8,

    },

    // ==========================================
    // ADDED:
    // Allows green button text and white button
    // text to exist separately.
    // ==========================================

    dashboardButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    viewSavedText: {

        color: '#4D7A20',
        fontSize: 16,
        fontWeight: '700',
    },



    emptyText: {

        textAlign: 'center',

        color: '#FFFFFF',

        marginTop: 40,

    },



    globalSection: {

        marginBottom: 20,

    },



    sectionTitle: {

        color: '#FFFFFF',

        fontSize: 22,

        fontWeight: '800',

        marginBottom: 6,

    },



    sectionSubtitle: {

        color: '#FFFFFF',

        opacity: .8,

        marginBottom: 12,

    },



    horizontalList: {

        paddingBottom: 10,

    },



    divider: {

        height: 1,

        backgroundColor: 'rgba(255,255,255,.3)',

        marginVertical: 20,

    },

});