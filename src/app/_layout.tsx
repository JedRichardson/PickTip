import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SavedNutritionProvider } from '../context/SavedNutritionContext';
import { MealLogProvider } from '../context/MealLogContext';
import { UserProvider } from '../context/UserContext';

import BottomNav from '../components/navigation/bottom_nav';

export default function RootLayout() {
    return (
        <UserProvider>
            <MealLogProvider>
                <SavedNutritionProvider>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                }}
                            />
                        </View>

                        <BottomNav />
                    </View>
                </SavedNutritionProvider>
            </MealLogProvider>
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
    },
});
