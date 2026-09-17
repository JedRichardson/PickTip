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
        let filtered = [...foodItems];

        if (intensity) {
            const intent = (Array.isArray(intensity) ? intensity[0] : intensity).toLowerCase();
            filtered = filtered.filter(item => item.pairingIntensity.toLowerCase() === intent);
        }

        if (category) {
            const cat = (Array.isArray(category) ? category[0] : category).toLowerCase();
            filtered = filtered.filter(item =>
                item.pairingCategories.some(pc => pc.toLowerCase() === cat)
            );
        }

        if (mealType) {
            filtered = filtered.filter(item => item.mealType === mealType);
        }

        if (dietaryLabel) {
            filtered = filtered.filter(item =>
                item.dietaryLabels.some(label => label.toLowerCase() === dietaryLabel.toLowerCase())
            );
        }

        return filtered;
    }, [intensity, category, mealType, dietaryLabel]);
};
