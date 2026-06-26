import { useMemo } from 'react';
import { foodItems, Food } from '../data/nutrition';
import { useMealLog } from '../context/MealLogContext';

export const useSmartFoodSuggestions = () => {
    const { dailyTotals } = useMealLog();

    return useMemo(() => {
        const hour = new Date().getHours();
        let targetMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

        if (hour >= 5 && hour < 11) targetMealType = 'Breakfast';
        else if (hour >= 11 && hour < 15) targetMealType = 'Lunch';
        else if (hour >= 15 && hour < 22) targetMealType = 'Dinner';
        else targetMealType = 'Snack';

        // Filter by meal type first
        let suggestions = foodItems.filter(item => item.mealType === targetMealType);

        // If we are low on protein, prioritize high protein foods
        const PROTEIN_GOAL = 150; // Should ideally come from settings
        if (dailyTotals.protein < PROTEIN_GOAL * 0.5) {
            suggestions.sort((a, b) => b.protein - a.protein);
        }

        return suggestions.slice(0, 3); // Return top 3
    }, [dailyTotals]);
};
