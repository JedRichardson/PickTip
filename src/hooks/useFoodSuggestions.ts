import { useMemo } from 'react';
import { foodItems, Food } from '../data/nutrition';

export interface SuggestionFilters {
    intensity?: string | string[];
    category?: string | string[];
    mealType?: string;
    dietaryLabel?: string;
}

export const useFoodSuggestions = (filters: SuggestionFilters): Food[] => {
    const { intensity, category, mealType, dietaryLabel } = filters;

    return useMemo(() => {
        let pool = [...foodItems];

        // 1. Intensity Filter Mapping
        if (intensity) {
            const rawIntensity = (Array.isArray(intensity) ? intensity[0] : intensity).toLowerCase();
            let targetIntensities: string[] = [rawIntensity];

            if (rawIntensity === 'expert' || rawIntensity === 'high') {
                targetIntensities = ['expert', 'high'];
            } else if (rawIntensity === 'intermediate' || rawIntensity === 'medium') {
                targetIntensities = ['intermediate', 'medium', 'high'];
            } else if (rawIntensity === 'beginner' || rawIntensity === 'low') {
                targetIntensities = ['beginner', 'low', 'medium'];
            }

            const intensityFiltered = pool.filter(item =>
                targetIntensities.includes(item.pairingIntensity.toLowerCase())
            );

            if (intensityFiltered.length > 0) {
                pool = intensityFiltered;
            }
        }

        // 2. Category Filter
        if (category) {
            const cat = (Array.isArray(category) ? category[0] : category).toLowerCase();
            const categoryFiltered = pool.filter(item =>
                item.pairingCategories.some(pc => pc.toLowerCase() === cat)
            );
            if (categoryFiltered.length > 0) {
                pool = categoryFiltered;
            }
        }

        // 3. Meal Type Filter
        if (mealType) {
            const mealTypeFiltered = pool.filter(item => item.mealType === mealType);
            if (mealTypeFiltered.length > 0) {
                pool = mealTypeFiltered;
            }
        }

        // 4. Dietary Label Filter
        if (dietaryLabel) {
            const labelFiltered = pool.filter(item =>
                item.dietaryLabels.some(label => label.toLowerCase() === dietaryLabel.toLowerCase())
            );
            if (labelFiltered.length > 0) {
                pool = labelFiltered;
            }
        }

        // 5. Dynamic Shuffling for Meal Variety
        return [...pool].sort(() => 0.5 - Math.random());
    }, [intensity, category, mealType, dietaryLabel]);
};
