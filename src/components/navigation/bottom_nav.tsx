import { router, usePathname } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function BottomNav() {
    const pathname = usePathname();

    const isHome = pathname === '/';
    const isCategory = pathname.startsWith('/category');
    const isWorkout = pathname.startsWith('/workoutsession');
    const isNutrition = pathname.startsWith('/nutrition');
    const isSaved = pathname.startsWith('/saved');

    const isPickActive = isCategory || isWorkout || isNutrition;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push('/')}
            >
                <Text style={isHome ? styles.activeIcon : styles.icon}>🏠</Text>
                <Text style={isHome ? styles.activeText : styles.text}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push('/category')}
            >
                <Text style={isPickActive ? styles.activeIcon : styles.icon}>💪</Text>
                <Text style={isPickActive ? styles.activeText : styles.text}>Pick</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push('/saved')}
            >
                <Text style={isSaved ? styles.activeIcon : styles.icon}>❤️</Text>
                <Text style={isSaved ? styles.activeText : styles.text}>Saved</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 78,
        backgroundColor: '#fff',
        borderTopColor: '#DDD',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
    },

    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    icon: {
        fontSize: 22,
        marginBottom: 4,
    },

    activeIcon: {
        fontSize: 24,
        marginBottom: 4,
    },

    text: {
        fontSize: 12,
        color: '#777',
        fontWeight: '600',
    },

    activeText: {
        fontSize: 12,
        color: '#4D7A20',
        fontWeight: '800',
    },
});