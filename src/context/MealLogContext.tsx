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
    isPlanned?: boolean;
}

interface MealLogContextType {
    mealLogs: LoggedMeal[];
    plannedMeals: LoggedMeal[];
    logMeal: (food: Food, quantity?: number) => Promise<void>;
    planMeal: (recipe: SpoonacularRecipe, quantity?: number) => Promise<void>;
    logSpoonacularRecipe: (recipe: SpoonacularRecipe, quantity?: number) => Promise<void>;
    removeLog: (logId: string) => Promise<void>;
    removePlannedMeal: (logId: string) => Promise<void>;
    dailyTotals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        water: number;
        projectedCalories: number;
    };
    logWater: (amount: number) => Promise<void>;
    refreshLogs: () => Promise<void>;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

const STORAGE_KEY = '@meal_logs';
const PLANNED_STORAGE_KEY = '@planned_meals';
const WATER_STORAGE_KEY = '@water_logs';

export const MealLogProvider = ({ children }: { children: ReactNode }) => {
    const [mealLogs, setMealLogs] = useState<LoggedMeal[]>([]);
    const [plannedMeals, setPlannedMeals] = useState<LoggedMeal[]>([]);
    const [waterLogs, setWaterLogs] = useState<{timestamp: number, amount: number}[]>([]);

    useEffect(() => {
        loadLogs();
        loadPlanned();
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

    const loadPlanned = async () => {
        try {
            const stored = await AsyncStorage.getItem(PLANNED_STORAGE_KEY);
            if (stored) {
                setPlannedMeals(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load planned meals', e);
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

    const savePlanned = async (meals: LoggedMeal[]) => {
        try {
            await AsyncStorage.setItem(PLANNED_STORAGE_KEY, JSON.stringify(meals));
        } catch (e) {
            console.error('Failed to save planned meals', e);
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

    const parseMacro = (macro?: string | number): number => {
        if (macro === undefined || macro === null) return 0;
        if (typeof macro === 'number') return macro;
        return parseFloat(macro.replace(/[^\d.]/g, '')) || 0;
    };

    const logSpoonacularRecipe = async (recipe: SpoonacularRecipe, quantity: number = 1) => {
        const newLog: LoggedMeal = {
            logId: Date.now().toString(),
            foodId: String(recipe.id),
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

    const planMeal = async (recipe: SpoonacularRecipe, quantity: number = 1) => {
        const newPlanned: LoggedMeal = {
            logId: Date.now().toString(),
            foodId: String(recipe.id),
            name: recipe.title,
            calories: (recipe.calories || 0) * quantity,
            protein: parseMacro(recipe.protein) * quantity,
            carbs: parseMacro(recipe.carbs) * quantity,
            fat: parseMacro(recipe.fat) * quantity,
            timestamp: Date.now(),
            quantity,
            isPlanned: true,
        };

        const updated = [newPlanned, ...plannedMeals];
        setPlannedMeals(updated);
        await savePlanned(updated);
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

    const removePlannedMeal = async (logId: string) => {
        const updated = plannedMeals.filter(log => log.logId !== logId);
        setPlannedMeals(updated);
        await savePlanned(updated);
    };

    const getDailyTotals = () => {
        const today = new Date().setHours(0, 0, 0, 0);
        const todayLogs = mealLogs.filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today);
        const todayPlanned = plannedMeals.filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today);
        const todayWater = waterLogs
            .filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today)
            .reduce((sum, curr) => sum + curr.amount, 0);

        const totals = todayLogs.reduce(
            (acc, curr) => ({
                ...acc,
                calories: acc.calories + curr.calories,
                protein: acc.protein + curr.protein,
                carbs: acc.carbs + curr.carbs,
                fat: acc.fat + curr.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, water: todayWater }
        );

        const plannedCalories = todayPlanned.reduce((sum, curr) => sum + curr.calories, 0);

        return {
            ...totals,
            projectedCalories: totals.calories + plannedCalories,
        };
    };

    return (
        <MealLogContext.Provider
            value={{
                mealLogs,
                plannedMeals,
                logMeal,
                planMeal,
                logSpoonacularRecipe,
                removeLog,
                removePlannedMeal,
                dailyTotals: getDailyTotals(),
                logWater,
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
