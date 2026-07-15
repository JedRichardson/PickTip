import { router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categories } from '../data/categories';

export default function CategoryScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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

                <TouchableOpacity
                    style={styles.nutritionLink}
                    onPress={() => router.push('/nutrition')}
                >
                    <Text style={styles.nutritionLinkText}>Skip to Nutrition Suggestions</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 24,
        backgroundColor: '#4D7A20',
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
       
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
    },

    cardDescription: {
        marginTop: 8,
        color: '#666',
    },

    nutritionLink: {
        marginTop: 10,
        marginBottom: 30,
        padding: 16,
        alignItems: 'center',
    },

    nutritionLinkText: {
        color: '#4D7A20',
        fontWeight: '600',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
