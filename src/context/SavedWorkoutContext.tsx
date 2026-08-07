import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Workout {
    id: string;
    category: string;
    name: string;
    duration: string;
    intensity: string;
    calories: string;
    description: string;
}

interface SavedWorkoutContextType {
    savedWorkouts: Workout[];
    saveWorkout: (workout: Workout) => Promise<void>;
    removeWorkout: (workoutId: string) => Promise<void>;
    isSaved: (workoutId: string) => boolean;
}

const SavedWorkoutContext = createContext<SavedWorkoutContextType | undefined>(undefined);

const STORAGE_KEY = '@saved_workouts';

export const SavedWorkoutProvider = ({ children }: { children: ReactNode }) => {
    const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        loadSavedWorkouts();
    }, []);

    const loadSavedWorkouts = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSavedWorkouts(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load saved workouts', e);
        }
    };

    const persistWorkouts = async (workouts: Workout[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        } catch (e) {
            console.error('Failed to save workouts', e);
        }
    };

    const saveWorkout = async (workout: Workout) => {
        if (savedWorkouts.find(w => w.id === workout.id)) return;
        const updated = [...savedWorkouts, workout];
        setSavedWorkouts(updated);
        await persistWorkouts(updated);
    };

    const removeWorkout = async (workoutId: string) => {
        const updated = savedWorkouts.filter(w => w.id !== workoutId);
        setSavedWorkouts(updated);
        await persistWorkouts(updated);
    };

    const isSaved = (workoutId: string) => {
        return savedWorkouts.some(w => w.id === workoutId);
    };

    return (
        <SavedWorkoutContext.Provider value={{ savedWorkouts, saveWorkout, removeWorkout, isSaved }}>
            {children}
        </SavedWorkoutContext.Provider>
    );
};

export const useSavedWorkout = () => {
    const context = useContext(SavedWorkoutContext);
    if (context === undefined) {
        throw new Error('useSavedWorkout must be used within a SavedWorkoutProvider');
    }
    return context;
};
