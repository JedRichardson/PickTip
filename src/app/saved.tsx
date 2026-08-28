import { router } from 'expo-router';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';


// ==========================================
// ADDED:
// PickTip gradient background.
// ==========================================
import { LinearGradient } from 'expo-linear-gradient';



import { Food } from '../data/nutrition';

import { useSavedNutrition } from '../context/SavedNutritionContext';





export default function SavedFoodsScreen() {


    const {
        savedFoods,
        removeFood

    } = useSavedNutrition();





    const renderFoodItem = ({ item }: { item: Food }) => (

        <View style={styles.card}>


            <View style={styles.cardHeader}>


                <Text style={styles.foodName}>

                    {item.name}

                </Text>





                <TouchableOpacity


                    onPress={() => removeFood(item.id)}


                    style={styles.removeButton}


                >

                    <Text style={styles.removeButtonText}>

                        Remove

                    </Text>


                </TouchableOpacity>


            </View>






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



        </View>

    );







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



            <SafeAreaView style={styles.container}>





                <View style={styles.header}>



                    <TouchableOpacity

                        onPress={() => router.back()}

                    >

                        <Text style={styles.backButton}>

                            Back

                        </Text>


                    </TouchableOpacity>






                    <Text style={styles.title}>

                        My Saved Meals

                    </Text>



                    <Text style={styles.subtitle}>

                        Your favorite nutrition choices

                    </Text>



                </View>







                <FlatList


                    data={savedFoods}


                    renderItem={renderFoodItem}


                    keyExtractor={item => item.id}


                    contentContainerStyle={styles.listContent}






                    ListEmptyComponent={


                        <View style={styles.emptyContainer}>


                            <Text style={styles.emptyText}>

                                No meals saved yet.

                            </Text>





                            <TouchableOpacity


                                style={styles.browseButton}


                                onPress={() =>

                                    router.push('/category')

                                }


                            >

                                <Text style={styles.browseButtonText}>

                                    Browse Workouts

                                </Text>


                            </TouchableOpacity>



                        </View>


                    }


                />



            </SafeAreaView>



        </LinearGradient>


    );

}




const styles = StyleSheet.create({



    // ==========================================
    // ADDED:
    // Full screen PickTip background.
    // ==========================================

    gradient: {

        flex: 1,

    },



    container: {

        flex: 1,

    },





    // ==========================================
    // CHANGED:
    // Header now matches Home,
    // Dashboard, and Nutrition screens.
    // ==========================================

    header: {


        paddingHorizontal: 24,

        paddingTop: 20,

        paddingBottom: 25,


    },





    backButton: {


        color: '#FFFFFF',

        fontSize: 16,

        fontWeight: '700',

        marginBottom: 12,


    },





    title: {


        color: '#FFFFFF',

        fontSize: 34,

        fontWeight: '800',


    },





    subtitle: {


        color: '#FFFFFF',

        opacity: .85,

        marginTop: 6,

        fontSize: 15,


    },






    listContent: {


        paddingHorizontal: 20,

        paddingBottom: 30,


    },







    // ==========================================
    // CHANGED:
    // Premium nutrition card styling.
    // ==========================================

    card: {


        backgroundColor: '#FFFFFF',

        borderRadius: 24,

        padding: 20,

        marginBottom: 16,



        shadowColor: '#000',

        shadowOffset: {

            width: 0,

            height: 6,

        },


        shadowOpacity: .15,


        shadowRadius: 12,


        elevation: 6,


    },






    cardHeader: {


        flexDirection: 'row',


        justifyContent: 'space-between',


        alignItems: 'center',


        marginBottom: 16,


    },





    foodName: {


        fontSize: 20,


        fontWeight: '800',


        color: '#355817',


        flex: 1,


    },






    removeButton: {


        backgroundColor: '#FFEAEA',


        paddingHorizontal: 14,


        paddingVertical: 7,


        borderRadius: 16,


    },





    removeButtonText: {


        color: '#FF5252',


        fontSize: 12,


        fontWeight: '800',


    },






    statsRow: {


        flexDirection: 'row',


        justifyContent: 'space-between',


        paddingTop: 14,


        borderTopWidth: 1,


        borderTopColor: '#EEEEEE',


    },





    stat: {


        alignItems: 'center',


    },





    statValue: {


        fontSize: 16,


        fontWeight: '800',


        color: '#4D7A20',


    },





    statLabel: {


        fontSize: 10,


        color: '#888',


        textTransform: 'uppercase',


        marginTop: 3,


    },






    emptyContainer: {


        alignItems: 'center',


        marginTop: 80,


    },





    emptyText: {


        color: '#FFFFFF',


        fontSize: 17,


        marginBottom: 22,


        fontWeight: '600',


    },






    browseButton: {


        backgroundColor: '#FFFFFF',


        paddingHorizontal: 28,


        paddingVertical: 14,


        borderRadius: 18,


    },






    browseButtonText: {


        color: '#4D7A20',


        fontWeight: '800',


    },


});