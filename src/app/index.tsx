import { router } from 'expo-router';

import  LoadingScreen from '@/components/LoadingScreen';

import { PickTipGradient } from '@/constants/theme';
// ==============================
// ADDED: Import React hooks
// ==============================
import { useEffect, useRef ,useState} from 'react';

// ==============================
// ADDED: Linear Gradient
// Run:
// npx expo install expo-linear-gradient
// ==============================
import { LinearGradient } from 'expo-linear-gradient';

import {
    // ==============================
    // ADDED: Import Animated
    // ==============================
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
    const { profile } = useUser();
    // ====================================
    // ADDED: Loading Screen to match Theme
    // ====================================
    const [isLoading, setIsLoading] = useState(true);
    const loadingOpacity = useRef(new Animated.Value(1)).current; 


    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(loadingOpacity, {

                toValue: 0,
                duration: 500,
                useNativeDriver: true,

            }).start(() => {

                setIsLoading(false);

            });
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // ==========================================
    // ADDED: Animated value for floating effect
    // ==========================================
    const bounceAnim = useRef(new Animated.Value(0)).current;

    // ==========================================
    // ADDED: Runs once when the screen loads and
    // continuously loops the floating animation.
    // ==========================================
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    // ==========================================
                    // CHANGED:
                    // Increased travel distance and slightly
                    // increased speed for a more lively effect.
                    // ==========================================
                    toValue: -25,
                    duration: 425,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 450,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);



    // ==========================================
    // DISPLAY REUSABLE LOADING SCREEN
    // ==========================================
    if (isLoading) {
        return (
            <LoadingScreen
                opacity={loadingOpacity}
                message="Preparing your recommendations..."
            />
        );
    }

    return (
        // ==========================================
        // CHANGED:
        // Replaced flat background with a modern
        // green gradient.
        // ==========================================
        <LinearGradient
            colors={PickTipGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>

                {/* ==========================================
                    CHANGED:
                    View -> Animated.View
                    Applies the floating animation to the logo.
                ========================================== */}
                <Animated.View
                    style={[
                        styles.logoCircle,
                        {
                            transform: [{ translateY: bounceAnim }],
                        },
                    ]}
                >
                    <Text style={styles.logo}>🌿</Text>
                </Animated.View>

                <Text style={styles.title}>
                    PickTip
                </Text>

                <Text style={styles.subtitle}>
                    Welcome back, {profile.name}!
                </Text>

                <Text style={styles.description}>
                    Ready to reach your {profile.goals.calories} kcal goal today?
                </Text>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.button}
                    onPress={() => router.push('/category')}
                >
                    <Text style={styles.buttonText}>
                        Get Started →
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.savedLink}
                    onPress={() => router.push('/dashboard')}
                >
                    <Text style={styles.savedLinkText}>
                        📊 View My Nutrition Dashboard
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.savedLink}
                    onPress={() => router.push('/saved')}
                >
                    <Text style={styles.savedLinkText}>
                        ❤️ View My Saved Meals
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/learnmore')}
                >
                    <Text style={styles.learnMore}>
                        Learn More
                    </Text>
                </TouchableOpacity>

            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    // ==========================================
    // ADDED:
    // Wrapper style for LinearGradient.
    // Handles the full screen background.
    // ==========================================
    gradient: {
        flex: 1,
    },

    container: {
        flex: 1,

        // ==========================================
        // CHANGED:
        // Removed backgroundColor because the
        // LinearGradient now controls the background.
        // ==========================================
        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: 28,
    },

    logoCircle: {
        // ==========================================
        // CHANGED:
        // Increased logo size for stronger branding.
        // ==========================================
        width: 165,
        height: 165,

        borderRadius: 82.5,

        backgroundColor: '#FFFFFF',

        justifyContent: 'center',
        alignItems: 'center',

        // ==========================================
        // ADDED:
        // Creates floating depth around the logo.
        // ==========================================
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.18,
        shadowRadius: 18,

        elevation: 12,
    },

    logo: {
        // ==========================================
        // CHANGED:
        // Larger emoji/logo presence.
        // ==========================================
        fontSize: 84,
    },

    title: {
        color: '#FFFFFF',

        // ==========================================
        // CHANGED:
        // Stronger brand hierarchy.
        // ==========================================
        fontSize: 60,
        fontWeight: '800',

        letterSpacing: 1,

        marginTop: 30,
    },

    subtitle: {
        color: '#FFFFFF',

        // ==========================================
        // CHANGED:
        // More welcoming appearance.
        // ==========================================
        fontSize: 23,
        fontWeight: '600',

        marginTop: 14,

        opacity: 0.95,
    },

    description: {
        color: '#FFFFFF',

        textAlign: 'center',

        // ==========================================
        // CHANGED:
        // Better readability and spacing.
        // ==========================================
        fontSize: 17,

        lineHeight: 28,

        marginTop: 24,

        maxWidth: 330,

        opacity: 0.88,
    },

    button: {
        // ==========================================
        // CHANGED:
        // Larger call-to-action button.
        // ==========================================
        marginTop: 45,

        backgroundColor: '#FFFFFF',

        paddingHorizontal: 58,

        paddingVertical: 20,

        borderRadius: 28,

        // ==========================================
        // ADDED:
        // Elevated button effect.
        // ==========================================
        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 6,
        },

        shadowOpacity: 0.22,

        shadowRadius: 12,

        elevation: 8,
    },

    buttonText: {
        // ==========================================
        // CHANGED:
        // Better contrast with new palette.
        // ==========================================
        color: '#355817',

        fontSize: 19,

        fontWeight: '800',

        letterSpacing: 0.5,
    },

    savedLink: {
        // ==========================================
        // CHANGED:
        // Improved spacing between actions.
        // ==========================================
        marginTop: 22,
    },

    savedLinkText: {
        color: '#FFFFFF',

        // ==========================================
        // CHANGED:
        // More readable navigation text.
        // ==========================================
        fontSize: 17,

        fontWeight: '600',

        opacity: 0.92,
    },

    learnMore: {
        // ==========================================
        // CHANGED:
        // Better separation from other links.
        // ==========================================
        marginTop: 34,

        color: '#FFFFFF',

        fontSize: 16,

        fontWeight: '600',

        textDecorationLine: 'underline',

        opacity: 0.9,
    },
    
});