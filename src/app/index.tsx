import { router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
    const { profile } = useUser();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoCircle}>
                <Text style={styles.logo}>🌿</Text>
            </View>

            <Text style={styles.title}>PickTip</Text>

            <Text style={styles.subtitle}>
                Welcome back, {profile.name}!
            </Text>

            <Text style={styles.description}>
                Ready to reach your {profile.goals.calories} kcal goal today?
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/category')}
            >
                <Text style={styles.buttonText}>Get Started →</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.savedLink}
                onPress={() => router.push('/dashboard')}
            >
                <Text style={styles.savedLinkText}>View My Nutrition Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.savedLink}
                onPress={() => router.push('/saved')}
            >
                <Text style={styles.savedLinkText}>View My Saved Meals</Text>
            </TouchableOpacity>

            <Text style={styles.learnMore}>Learn More</Text>


            <TouchableOpacity
                onPress={() => router.push('/learnmore')}
                >
                <Text style={styles.learnMore}>Learn More</Text>
               
            </TouchableOpacity>
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

    savedLink: {
        marginTop: 20,
    },

    savedLinkText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});