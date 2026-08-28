import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Ingredient {
    id: string;
    name: string;
    amount?: number;
    unit?: string;
    original: string;
    checked: boolean;
    category: string;
}

interface ShoppingListContextType {
    ingredients: Ingredient[];
    addIngredients: (newIngredients: Omit<Ingredient, 'id' | 'checked' | 'category'>[]) => Promise<void>;
    toggleIngredient: (id: string) => Promise<void>;
    removeIngredient: (id: string) => Promise<void>;
    clearList: () => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);
const STORAGE_KEY = '@shopping_list_v2';

const inferCategory = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('chicken') || n.includes('beef') || n.includes('steak') || n.includes('pork') || n.includes('turkey')) return 'Meat';
    if (n.includes('milk') || n.includes('cheese') || n.includes('yogurt') || n.includes('butter')) return 'Dairy';
    if (n.includes('apple') || n.includes('onion') || n.includes('garlic') || n.includes('lettuce') || n.includes('tomato')) return 'Produce';
    if (n.includes('rice') || n.includes('pasta') || n.includes('bread') || n.includes('flour')) return 'Pantry';
    return 'Other';
};

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

    const addIngredients = async (newItems: Omit<Ingredient, 'id' | 'checked' | 'category'>[]) => {
        const withMetadata: Ingredient[] = newItems.map(item => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            checked: false,
            category: inferCategory(item.name)
        }));
        const updated = [...ingredients, ...withMetadata];
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
