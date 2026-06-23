import { router } from 'expo-router';
import {
    // SafeAreaView, // Remove deprecated import
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Use the recommended package

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoCircle}>
                <Text style={styles.logo}>🌿</Text>
            </View>

            <Text style={styles.title}>PickTip</Text>

            <Text style={styles.subtitle}>
                Your healthy lifestyle companion
            </Text>

            <Text style={styles.description}>
                Get personalized workout recommendations and nutrition tips to fuel your
                fitness journey
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/category')}
            >
                <Text style={styles.buttonText}>Get Started →</Text>
            </TouchableOpacity>

            <Text style={styles.learnMore}>Learn More</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4D7A20',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        fontSize: 70,
    },

    title: {
        color: '#fff',
        fontSize: 52,
        fontWeight: '700',
        marginTop: 24,
    },

    subtitle: {
        color: '#fff',
        fontSize: 20,
        marginTop: 10,
    },

    description: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
        lineHeight: 24,
        maxWidth: 320,
    },

    button: {
        marginTop: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 50,
        paddingVertical: 18,
        borderRadius: 18,
    },

    buttonText: {
        color: '#4D7A20',
        fontSize: 18,
        fontWeight: '700',
    },

    learnMore: {
        marginTop: 25,
        color: '#fff',
        textDecorationLine: 'underline',
    },
});