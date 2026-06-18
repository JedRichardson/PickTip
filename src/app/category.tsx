import { router } from 'expo-router';
import {
   // SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categories } from '../data/categories';

export default function CategoryScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>
                Choose Your Focus
            </Text>

            <Text style={styles.subheading}>
                Select a workout category to get started
            </Text>

            {categories.map(category => (
                <TouchableOpacity
                    key={category.id}
                    style={styles.card}
                    onPress={() =>
                        router.push(`/workout?category=${category.id}`)
                    }
                >
                    <Text style={styles.cardTitle}>
                        {category.name}
                    </Text>

                    <Text style={styles.cardDescription}>
                        {category.description}
                    </Text>
                </TouchableOpacity>
            ))}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 24,
    },

    heading: {
        marginTop: 40,
        fontSize: 32,
        fontWeight: '700',
    },

    subheading: {
        marginBottom: 30,
        marginTop: 10,
        color: '#666',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
    },

    cardDescription: {
        marginTop: 8,
        color: '#666',
    },
});