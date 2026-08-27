import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoggedWorkout {
    id: string;
    name: string;
    duration: string;
    calories: number;
    intensity: string;
    timestamp: number;
}

interface WorkoutLogContextType {
    workouts: LoggedWorkout[];
    logWorkout: (workout: Omit<LoggedWorkout, 'id' | 'timestamp'>) => Promise<void>;
    removeWorkout: (id: string) => Promise<void>;
    dailyTotalCalories: number;
    loadDemoData: () => Promise<void>;
}

const WorkoutLogContext = createContext<WorkoutLogContextType | undefined>(undefined);
const STORAGE_KEY = '@workout_logs';

export const WorkoutLogProvider = ({ children }: { children: ReactNode }) => {
    const [workouts, setWorkouts] = useState<LoggedWorkout[]>([]);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setWorkouts(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load workouts', e);
        }
    };

    const logWorkout = async (workout: Omit<LoggedWorkout, 'id' | 'timestamp'>) => {
        const newLog: LoggedWorkout = {
            ...workout,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };
        const updated = [newLog, ...workouts];
        setWorkouts(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const removeWorkout = async (id: string) => {
        const updated = workouts.filter(w => w.id !== id);
        setWorkouts(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const loadDemoData = async () => {
        const demoWorkouts: LoggedWorkout[] = [];
        const names = ['Morning Run', 'Full Body Power', 'Core Blast', 'Leg Day'];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            demoWorkouts.push({
                id: `demo-w-${i}`,
                name: names[i % names.length],
                duration: '30:00',
                calories: 300 + Math.random() * 200,
                intensity: 'High',
                timestamp: date.getTime()
            });
        }

        setWorkouts(demoWorkouts);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demoWorkouts));
    };

    const getDailyCalories = () => {
        const today = new Date().setHours(0, 0, 0, 0);
        return workouts
            .filter(w => new Date(w.timestamp).setHours(0, 0, 0, 0) === today)
            .reduce((sum, curr) => sum + curr.calories, 0);
    };

    return (
        <WorkoutLogContext.Provider value={{
            workouts,
            logWorkout,
            removeWorkout,
            dailyTotalCalories: getDailyCalories()
        }}>
            {children}
        </WorkoutLogContext.Provider>
    );
};

export const useWorkoutLog = () => {
    const context = useContext(WorkoutLogContext);
    if (context === undefined) {
        throw new Error('useWorkoutLog must be used within a WorkoutLogProvider');
    }
    return context;
};
