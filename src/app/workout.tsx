import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import {
    //SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { workouts } from '../data/workouts';

export default function WorkoutScreen() {
    const { category } = useLocalSearchParams();

    const filtered = workouts.filter(
        item => item.category === category
    );

    const workout =
        filtered[Math.floor(Math.random() * filtered.length)];

    if (!workout) {
        return (
            <SafeAreaView>
                <Text>No workouts found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                {workout.name}
            </Text>

            <Text>{workout.duration}</Text>

            <Text>{workout.intensity}</Text>

            <Text>{workout.description}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    router.push(
                        `/nutrition?intensity=${workout.intensity}`
                    )
                }
            >
                <Text style={styles.buttonText}>
                    View Nutrition Tips
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },

    title: {
        fontSize: 32,
        fontWeight: '700',
    },

    button: {
        backgroundColor: '#4D7A20',
        padding: 18,
        borderRadius: 16,
        marginTop: 30,
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
    },
});