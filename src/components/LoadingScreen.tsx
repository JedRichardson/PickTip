import { LinearGradient } from 'expo-linear-gradient';

import {
    useState,
    useEffect,
    useRef,

}
    from 'react';

import { PickTipGradient } from '@/constants/theme';

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

// ==========================================
// LOADING SCREEN PROPS
// ==========================================
// message:
// Allows each screen to display its own
// loading message.
//
// opacity:
// Allows a parent screen to pass an
// Animated.Value for fade animations.
interface LoadingScreenProps {
    message?: string; 
    opacity?: Animated.Value;
}

// ==========================================
// REUSABLE LOADING SCREEN COMPONENT
// ==========================================
export default function LoadingScreen({
    message = 'Preparing your recommendations...',
    opacity,
}: LoadingScreenProps) {

    return (
        <LinearGradient
            colors={PickTipGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <Animated.View
                style={[
                    styles.loadingContainer,

                    // Apply an opacity animation only
                    // if one was passed into the component.
                    opacity ? { opacity } : null,
                ]}
            >
                {/* PickTip logo */}
                <View style={styles.loadingLogoCircle}>
                    <Text style={styles.loadingLogo}>
                        🌿
                    </Text>
                </View>

                {/* Application title */}
                <Text style={styles.loadingTitle}>
                    PickTip
                </Text>

                {/* PickTip slogan */}
                <Text style={styles.loadingSubtitle}>
                    Fuel Your Next Move
                </Text>

                {/* Loading indicator */}
                <View style={styles.loadingDots}>
                    <View style={styles.loadingDot} />
                    <View style={styles.loadingDot} />
                    <View style={styles.loadingDot} />
                </View>

                {/* Custom loading message */}
                <Text style={styles.loadingText}>
                    {message}
                </Text>
            </Animated.View>
        </LinearGradient>
    );
}
















const styles = StyleSheet.create({

    // ==========================================
    // LOADING SCREEN STYLES
    // ==========================================

    // Makes the gradient fill the entire screen
    gradient: {
        flex: 1,
    },

    // Centers all loading screen content vertically
    // and horizontally on the screen
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },

    // White circular background behind the PickTip leaf logo
    // Includes a shadow to make the logo stand out
    loadingLogoCircle: {
        width: 145,
        height: 145,
        borderRadius: 72.5,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',

        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 14,

        // Android shadow
        elevation: 10,
    },

    // Controls the size of the leaf icon
    // displayed inside the white logo circle
    loadingLogo: {
        fontSize: 72,
    },

    // Main "PickTip" title displayed below the logo
    loadingTitle: {
        color: '#FFFFFF',
        fontSize: 54,
        fontWeight: '800',
        letterSpacing: 1,
        marginTop: 28,
    },

    // Subtitle displayed underneath the PickTip title
    loadingSubtitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
        opacity: 0.95,
    },

    // Container that places the three loading dots
    // next to each other horizontally
    loadingDots: {
        flexDirection: 'row',
        marginTop: 34,
        gap: 10,
    },

    // Controls the appearance of each individual loading dot
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        opacity: 0.85,
    },

    // "Preparing your recommendations..." message
    // displayed underneath the loading indicator
    loadingText: {
        color: '#FFFFFF',
        fontSize: 15,
        marginTop: 18,
        opacity: 0.85,
    },

    // ==========================================
    // END LOADING SCREEN STYLES
    // ==========================================
});