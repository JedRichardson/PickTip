import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface UserProfile {
    name: string;
    dietaryPreference: string; // 'None', 'Vegan', 'Vegetarian', 'Keto', 'Gluten-Free'
    goals: UserGoals;
}

interface UserContextType {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    updateGoals: (updates: Partial<UserGoals>) => Promise<void>;
    isLoading: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
    name: 'User',
    dietaryPreference: 'None',
    goals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 70,
    },
};

const UserContext = createContext<UserContextType | undefined>(undefined);
const STORAGE_KEY = '@user_profile';

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProfile(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load profile', e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveProfile = async (newProfile: UserProfile) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
        } catch (e) {
            console.error('Failed to save profile', e);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        await saveProfile(newProfile);
    };

    const updateGoals = async (updates: Partial<UserGoals>) => {
        const newProfile = {
            ...profile,
            goals: { ...profile.goals, ...updates },
        };
        setProfile(newProfile);
        await saveProfile(newProfile);
    };

    return (
        <UserContext.Provider value={{ profile, updateProfile, updateGoals, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
