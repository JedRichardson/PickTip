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
    streak: {
        current: number;
        history: string[]; // ISO dates of activity
    };
    logWater: (amount: number) => Promise<void>;
    refreshLogs: () => Promise<void>;
    loadDemoData: () => Promise<void>;
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

    const loadDemoData = async () => {
        const demoMeals: LoggedMeal[] = [];
        const demoWater: {timestamp: number, amount: number}[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const ts = date.getTime();

            demoMeals.push({
                logId: `demo-m-${i}`,
                foodId: 'demo',
                name: 'Showcase Balanced Meal',
                calories: 600 + Math.random() * 200,
                protein: 30 + Math.random() * 10,
                carbs: 50 + Math.random() * 20,
                fat: 20 + Math.random() * 5,
                timestamp: ts,
                quantity: 1
            });

            demoWater.push({ timestamp: ts, amount: 2000 + Math.random() * 1000 });
        }

        setMealLogs(demoMeals);
        setWaterLogs(demoWater);
        await saveLogs(demoMeals);
        await saveWater(demoWater);
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

    const getStreakInfo = () => {
        const activityDates = new Set([
            ...mealLogs.map(l => new Date(l.timestamp).toDateString()),
            ...waterLogs.map(w => new Date(w.timestamp).toDateString())
        ]);

        const sortedDates = Array.from(activityDates)
            .map(d => new Date(d))
            .sort((a, b) => b.getTime() - a.getTime());

        let currentStreak = 0;
        const today = new Date();
        today.setHours(0,0,0,0);

        if (sortedDates.length > 0) {
            let checkDate = new Date(sortedDates[0]);
            checkDate.setHours(0,0,0,0);

            // If the latest activity was today or yesterday, streak continues
            const diff = (today.getTime() - checkDate.getTime()) / (1000 * 3600 * 24);

            if (diff <= 1) {
                currentStreak = 1;
                for (let i = 0; i < sortedDates.length - 1; i++) {
                    const d1 = new Date(sortedDates[i]);
                    const d2 = new Date(sortedDates[i+1]);
                    d1.setHours(0,0,0,0);
                    d2.setHours(0,0,0,0);

                    const dayDiff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
                    if (dayDiff === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }

        return {
            current: currentStreak,
            history: Array.from(activityDates)
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
                streak: getStreakInfo(),
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
