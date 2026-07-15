import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food } from '../data/nutrition';

interface SavedNutritionContextType {
    savedFoods: Food[];
    saveFood: (food: Food) => Promise<void>;
    removeFood: (foodId: string) => Promise<void>;
    isSaved: (foodId: string) => boolean;
}

const SavedNutritionContext = createContext<SavedNutritionContextType | undefined>(undefined);

const STORAGE_KEY = '@saved_foods';

export const SavedNutritionProvider = ({ children }: { children: ReactNode }) => {
    const [savedFoods, setSavedFoods] = useState<Food[]>([]);

    useEffect(() => {
        loadSavedFoods();
    }, []);

    const loadSavedFoods = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSavedFoods(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load saved foods', e);
        }
    };

    const persistFoods = async (foods: Food[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
        } catch (e) {
            console.error('Failed to save foods', e);
        }
    };

    const saveFood = async (food: Food) => {
        if (savedFoods.find(f => f.id === food.id)) return;
        const updated = [...savedFoods, food];
        setSavedFoods(updated);
        await persistFoods(updated);
    };

    const removeFood = async (foodId: string) => {
        const updated = savedFoods.filter(f => f.id !== foodId);
        setSavedFoods(updated);
        await persistFoods(updated);
    };

    const isSaved = (foodId: string) => {
        return savedFoods.some(f => f.id === foodId);
    };

    return (
        <SavedNutritionContext.Provider value={{ savedFoods, saveFood, removeFood, isSaved }}>
            {children}
        </SavedNutritionContext.Provider>
    );
};

export const useSavedNutrition = () => {
    const context = useContext(SavedNutritionContext);
    if (context === undefined) {
        throw new Error('useSavedNutrition must be used within a SavedNutritionProvider');
    }
    return context;
};
