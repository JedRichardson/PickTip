import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';


import { Food } from '../data/nutrition';





interface FoodSuggestionCardProps {

    food: Food;

    onPress: () => void;

    onLog: () => void;

}







export const FoodSuggestionCard = ({

    food,

    onPress,

    onLog

}: FoodSuggestionCardProps) => {


    return (


        <TouchableOpacity


            style={styles.container}


            onPress={onPress}


            activeOpacity={0.85}


        >



            <View style={styles.content}>


                {/* ==========================================
                    CHANGED:
                    Improved header hierarchy.
                ========================================== */}

                <View style={styles.header}>


                    <Text style={styles.name}>

                        {food.name}

                    </Text>





                    <View style={styles.intensityBadge}>


                        <Text style={styles.intensityText}>

                            {food.pairingIntensity}

                        </Text>


                    </View>


                </View>








                <Text

                    style={styles.description}

                    numberOfLines={2}

                >

                    {food.description}

                </Text>









                {/* ==========================================
                    CHANGED:
                    Nutrition stats redesigned to match
                    dashboard cards.
                ========================================== */}

                <View style={styles.stats}>


                    <View style={styles.stat}>


                        <Text style={styles.statValue}>

                            {food.calories}

                        </Text>


                        <Text style={styles.statLabel}>

                            kcal

                        </Text>


                    </View>






                    <View style={styles.stat}>


                        <Text style={styles.statValue}>

                            {food.protein}g

                        </Text>


                        <Text style={styles.statLabel}>

                            Protein

                        </Text>


                    </View>







                    <View style={styles.stat}>


                        <Text style={styles.statValue}>

                            {food.carbs}g

                        </Text>


                        <Text style={styles.statLabel}>

                            Carbs

                        </Text>


                    </View>



                </View>









                <TouchableOpacity


                    style={styles.logButton}


                    onPress={onLog}


                >


                    <Text style={styles.logButtonText}>

                        Quick Log Meal

                    </Text>



                </TouchableOpacity>





            </View>



        </TouchableOpacity>


    );

};










const styles = StyleSheet.create({



    // ==========================================
    // CHANGED:
    // Matches PickTip dashboard card system.
    // ==========================================

    container: {


        backgroundColor: '#FFFFFF',


        borderRadius: 24,


        marginBottom: 16,



        shadowColor: '#000',


        shadowOffset: {


            width: 0,


            height: 7,


        },


        shadowOpacity: .15,


        shadowRadius: 12,


        elevation: 6,


        overflow: 'hidden',


    },






    content: {


        padding: 18,


    },








    header: {


        flexDirection: 'row',


        justifyContent: 'space-between',


        alignItems: 'center',


        marginBottom: 12,


    },







    name: {


        fontSize: 20,


        fontWeight: '800',


        color: '#355817',


        flex: 1,


        marginRight: 10,


    },








    intensityBadge: {


        backgroundColor: '#EEF7E8',


        paddingHorizontal: 10,


        paddingVertical: 6,


        borderRadius: 14,


    },






    intensityText: {


        fontSize: 10,


        fontWeight: '800',


        color: '#4D7A20',


        textTransform: 'uppercase',


    },








    description: {


        fontSize: 14,


        color: '#555',


        lineHeight: 21,


        marginBottom: 16,


    },








    stats: {


        flexDirection: 'row',


        backgroundColor: '#F4F8F0',


        padding: 14,


        borderRadius: 18,


        marginBottom: 16,


    },








    stat: {


        flex: 1,


        alignItems: 'center',


    },








    statValue: {


        fontSize: 17,


        fontWeight: '800',


        color: '#4D7A20',


    },








    statLabel: {


        fontSize: 10,


        color: '#777',


        marginTop: 3,


        textTransform: 'uppercase',


    },








    logButton: {


        backgroundColor: '#4D7A20',


        paddingVertical: 12,


        borderRadius: 18,


        alignItems: 'center',


    },








    logButtonText: {


        color: '#FFFFFF',


        fontWeight: '800',


        fontSize: 14,


    },


});