import React from 'react';


import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';


import {
    SpoonacularRecipe
} from '../services/spoonacular';







interface RecipeCardProps {

    recipe: SpoonacularRecipe;

    onPress: () => void;

}








export const RecipeCard = ({

    recipe,

    onPress

}: RecipeCardProps) => {


    return (


        <TouchableOpacity


            style={styles.container}


            onPress={onPress}


            activeOpacity={0.85}


        >





            {/* ==========================================
                CHANGED:
                Rounded image section to match
                PickTip card styling.
            ========================================== */}

            <Image

                source={{
                    uri: recipe.image
                }}

                style={styles.image}

            />






            <View style={styles.content}>


                <Text

                    style={styles.title}

                    numberOfLines={2}

                >

                    {recipe.title}

                </Text>






                {/* ==========================================
                    CHANGED:
                    Nutrition stats redesigned to match
                    dashboard components.
                ========================================== */}

                <View style={styles.macroRow}>


                    <View style={styles.macro}>


                        <Text style={styles.macroValue}>

                            {Math.round(recipe.calories || 0)}

                        </Text>



                        <Text style={styles.macroLabel}>

                            kcal

                        </Text>



                    </View>







                    <View style={styles.macro}>


                        <Text style={styles.macroValue}>

                            {recipe.protein}

                        </Text>



                        <Text style={styles.macroLabel}>

                            Protein

                        </Text>



                    </View>



                </View>





            </View>



        </TouchableOpacity>


    );

};









const styles = StyleSheet.create({



    // ==========================================
    // CHANGED:
    // Premium PickTip recipe card.
    // ==========================================

    container: {


        width: 220,


        backgroundColor: '#FFFFFF',


        borderRadius: 24,


        marginRight: 16,



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








    image: {


        width: '100%',


        height: 140,


    },








    content: {


        padding: 16,


    },








    title: {


        fontSize: 16,


        fontWeight: '800',


        color: '#355817',


        lineHeight: 22,


        height: 46,


        marginBottom: 12,


    },








    macroRow: {


        flexDirection: 'row',


        justifyContent: 'space-around',


        backgroundColor: '#F4F8F0',


        paddingVertical: 10,


        borderRadius: 16,


    },








    macro: {


        alignItems: 'center',


    },








    macroValue: {


        fontSize: 16,


        fontWeight: '800',


        color: '#4D7A20',


    },








    macroLabel: {


        fontSize: 10,


        color: '#777',


        marginTop: 3,


        textTransform: 'uppercase',


    },


});