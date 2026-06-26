import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import BottomNav from '../components/navigation/bottom_nav';

export default function RootLayout() {
    return (
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