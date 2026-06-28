
import { router } from 'expo-router';
import {
    // SafeAreaView, // Remove deprecated import
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Use the recommended package
export default function LearnMoreScreen() {
    return (

   <SafeAreaView style={styles.container}>



            <Text style={styles.textcontainer}> Welcome to PickTip!
                PickTip helps you make smarter fitness and nutrition choices—one simple step at a time.

                How PickTip Works
                Choose Your Workout Type: Select the kind of workout you want to do, like strength training, cardio, flexibility, or HIIT.
                Pick a Specific Workout: Once you’ve chosen the type, PickTip presents a workout that fits your goal—whether it’s deadlifting, running, or yoga.
                Get Personalized Meal Recommendations: After your workout, PickTip suggests the best meal to fuel your recovery and energy needs. For example, if you choose deadlifting, it might recommend chicken breast and oatmeal for breakfast to support muscle growth and replenish energy.
                Repeat Anytime: Mix and match workouts and meals to keep your routine balanced and exciting!
                Why Use PickTip?
                No more guessing what workout to do or what to eat afterward. PickTip guides you through workouts tailored to your preference and pairs them with nutrition advice designed to help you get the most from every session.
                ss
Make fitness simple, effective, and delicious with PickTip! </Text>














  






 </SafeAreaView>
    );
   
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#4D7A20',
        padding: 24,
    },

    textcontainer: {

        marginTop: 25,
        color: '#fff',

    }

});