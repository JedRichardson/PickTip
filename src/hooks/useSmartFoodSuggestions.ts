import { useMemo } from 'react';
import { foodItems, Food } from '../data/nutrition';
import { useMealLog } from '../context/MealLogContext';
import { useUser } from '../context/UserContext';

export const useSmartFoodSuggestions = () => {
    const { dailyTotals } = useMealLog();
    const { profile } = useUser();

    return useMemo(() => {
        const hour = new Date().getHours();
        let targetMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

        if (hour >= 5 && hour < 11) targetMealType = 'Breakfast';
        else if (hour >= 11 && hour < 15) targetMealType = 'Lunch';
        else if (hour >= 15 && hour < 22) targetMealType = 'Dinner';
        else targetMealType = 'Snack';

        // Filter by dietary preference first
        let suggestions = foodItems;
        if (profile.dietaryPreference !== 'None') {
            suggestions = suggestions.filter(item =>
                item.dietaryLabels.includes(profile.dietaryPreference)
            );
        }

        // Filter by meal type
        suggestions = suggestions.filter(item => item.mealType === targetMealType);

        // If we are low on protein, prioritize high protein foods
        if (dailyTotals.protein < profile.goals.protein * 0.5) {
            suggestions.sort((a, b) => b.protein - a.protein);
        }

        return suggestions.slice(0, 3); // Return top 3
    }, [dailyTotals, profile]);
};
