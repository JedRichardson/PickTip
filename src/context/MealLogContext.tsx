import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food } from '../data/nutrition';
import { SpoonacularRecipe } from '../services/spoonacular';

export interface LoggedMeal {
    logId: string;
    foodId: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    timestamp: number;
    quantity: number;
}

interface MealLogContextType {
    mealLogs: LoggedMeal[];
    logMeal: (food: Food, quantity?: number) => Promise<void>;
    logSpoonacularRecipe: (recipe: SpoonacularRecipe, quantity?: number) => Promise<void>;
    removeLog: (logId: string) => Promise<void>;
    dailyTotals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        water: number;
    };
    logWater: (amount: number) => Promise<void>;
    refreshLogs: () => Promise<void>;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

const STORAGE_KEY = '@meal_logs';
const WATER_STORAGE_KEY = '@water_logs';

export const MealLogProvider = ({ children }: { children: ReactNode }) => {
    const [mealLogs, setMealLogs] = useState<LoggedMeal[]>([]);
    const [waterLogs, setWaterLogs] = useState<{timestamp: number, amount: number}[]>([]);

    useEffect(() => {
        loadLogs();
        loadWater();
    }, []);

    const loadLogs = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setMealLogs(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load logs', e);
        }
    };

    const loadWater = async () => {
        try {
            const stored = await AsyncStorage.getItem(WATER_STORAGE_KEY);
            if (stored) {
                setWaterLogs(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load water logs', e);
        }
    };

    const saveLogs = async (logs: LoggedMeal[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to save logs', e);
        }
    };

    const saveWater = async (logs: {timestamp: number, amount: number}[]) => {
        try {
            await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to save water logs', e);
        }
    };

    const logMeal = async (food: Food, quantity: number = 1) => {
        const newLog: LoggedMeal = {
            logId: Date.now().toString(),
            foodId: String(food.id),
            name: food.name,
            calories: (food.calories || 0) * quantity,
            protein: (food.protein || 0) * quantity,
            carbs: (food.carbs || 0) * quantity,
            fat: (food.fat || 0) * quantity,
            timestamp: Date.now(),
            quantity,
        };

        const updatedLogs = [newLog, ...mealLogs];
        setMealLogs(updatedLogs);
        await saveLogs(updatedLogs);
    };

    const parseMacro = (macro?: string): number => {
        if (!macro) return 0;
        return parseFloat(macro.replace(/[^\d.]/g, '')) || 0;
    };

    const logSpoonacularRecipe = async (recipe: SpoonacularRecipe, quantity: number = 1) => {
        const newLog: LoggedMeal = {
            logId: Date.now().toString(),
            foodId: recipe.id.toString(),
            name: recipe.title,
            calories: (recipe.calories || 0) * quantity,
            protein: parseMacro(recipe.protein) * quantity,
            carbs: parseMacro(recipe.carbs) * quantity,
            fat: parseMacro(recipe.fat) * quantity,
            timestamp: Date.now(),
            quantity,
        };

        const updatedLogs = [newLog, ...mealLogs];
        setMealLogs(updatedLogs);
        await saveLogs(updatedLogs);
    };

    const logWater = async (amount: number) => {
        const newLog = { timestamp: Date.now(), amount };
        const updated = [...waterLogs, newLog];
        setWaterLogs(updated);
        await saveWater(updated);
    };

    const removeLog = async (logId: string) => {
        const updatedLogs = mealLogs.filter(log => log.logId !== logId);
        setMealLogs(updatedLogs);
        await saveLogs(updatedLogs);
    };

    const getDailyTotals = () => {
        const today = new Date().setHours(0, 0, 0, 0);
        const todayLogs = mealLogs.filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today);
        const todayWater = waterLogs
            .filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today)
            .reduce((sum, curr) => sum + curr.amount, 0);

        return todayLogs.reduce(
            (acc, curr) => ({
                ...acc,
                calories: acc.calories + curr.calories,
                protein: acc.protein + curr.protein,
                carbs: acc.carbs + curr.carbs,
                fat: acc.fat + curr.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, water: todayWater }
        );
    };

    return (
        <MealLogContext.Provider
            value={{
                mealLogs,
                logMeal,
                logSpoonacularRecipe,
                removeLog,
                logWater,
                dailyTotals: getDailyTotals(),
                refreshLogs: loadLogs
            }}
        >
            {children}
        </MealLogContext.Provider>
    );
};

export const useMealLog = () => {
    const context = useContext(MealLogContext);
    if (context === undefined) {
        throw new Error('useMealLog must be used within a MealLogProvider');
    }
    return context;
};
