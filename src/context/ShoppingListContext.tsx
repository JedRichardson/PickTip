import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Ingredient {
    id: string;
    name: string;
    amount?: number;
    unit?: string;
    original: string;
    checked: boolean;
}

interface ShoppingListContextType {
    ingredients: Ingredient[];
    addIngredients: (newIngredients: Omit<Ingredient, 'id' | 'checked'>[]) => Promise<void>;
    toggleIngredient: (id: string) => Promise<void>;
    removeIngredient: (id: string) => Promise<void>;
    clearList: () => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

const STORAGE_KEY = '@shopping_list';

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        loadIngredients();
    }, []);

    const loadIngredients = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setIngredients(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load shopping list', e);
        }
    };

    const persistIngredients = async (items: Ingredient[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to save shopping list', e);
        }
    };

    const addIngredients = async (newItems: Omit<Ingredient, 'id' | 'checked'>[]) => {
        const withIds: Ingredient[] = newItems.map(item => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            checked: false,
        }));
        const updated = [...ingredients, ...withIds];
        setIngredients(updated);
        await persistIngredients(updated);
    };

    const toggleIngredient = async (id: string) => {
        const updated = ingredients.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setIngredients(updated);
        await persistIngredients(updated);
    };

    const removeIngredient = async (id: string) => {
        const updated = ingredients.filter(item => item.id !== id);
        setIngredients(updated);
        await persistIngredients(updated);
    };

    const clearList = async () => {
        setIngredients([]);
        await AsyncStorage.removeItem(STORAGE_KEY);
    };

    return (
        <ShoppingListContext.Provider value={{ ingredients, addIngredients, toggleIngredient, removeIngredient, clearList }}>
            {children}
        </ShoppingListContext.Provider>
    );
};

export const useShoppingList = () => {
    const context = useContext(ShoppingListContext);
    if (context === undefined) {
        throw new Error('useShoppingList must be used within a ShoppingListProvider');
    }
    return context;
};
