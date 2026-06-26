import { Stack } from 'expo-router';
import { SavedNutritionProvider } from '../context/SavedNutritionContext';
import { MealLogProvider } from '../context/MealLogContext';

export default function RootLayout() {
    return (
        <MealLogProvider>
            <SavedNutritionProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </SavedNutritionProvider>
        </MealLogProvider>
    );
}
