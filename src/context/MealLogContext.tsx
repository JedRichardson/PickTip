import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food } from '../data/nutrition';

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
    removeLog: (logId: string) => Promise<void>;
    dailyTotals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    refreshLogs: () => Promise<void>;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

const STORAGE_KEY = '@meal_logs';

export const MealLogProvider = ({ children }: { children: ReactNode }) => {
    const [mealLogs, setMealLogs] = useState<LoggedMeal[]>([]);

    useEffect(() => {
        loadLogs();
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

    const saveLogs = async (logs: LoggedMeal[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to save logs', e);
        }
    };

    const logMeal = async (food: Food, quantity: number = 1) => {
        const newLog: LoggedMeal = {
            logId: Date.now().toString(),
            foodId: food.id,
            name: food.name,
            calories: food.calories * quantity,
            protein: food.protein * quantity,
            carbs: food.carbs * quantity,
            fat: food.fat * quantity,
            timestamp: Date.now(),
            quantity,
        };

        const updatedLogs = [newLog, ...mealLogs];
        setMealLogs(updatedLogs);
        await saveLogs(updatedLogs);
    };

    const removeLog = async (logId: string) => {
        const updatedLogs = mealLogs.filter(log => log.logId !== logId);
        setMealLogs(updatedLogs);
        await saveLogs(updatedLogs);
    };

    const getDailyTotals = () => {
        const today = new Date().setHours(0, 0, 0, 0);
        const todayLogs = mealLogs.filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today);

        return todayLogs.reduce(
            (acc, curr) => ({
                calories: acc.calories + curr.calories,
                protein: acc.protein + curr.protein,
                carbs: acc.carbs + curr.carbs,
                fat: acc.fat + curr.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    };

    return (
        <MealLogContext.Provider
            value={{
                mealLogs,
                logMeal,
                removeLog,
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
