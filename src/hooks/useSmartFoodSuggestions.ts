import { useState, useEffect } from 'react';
import { fetchRecommendations, SpoonacularRecipe } from '../services/spoonacular';
import { useMealLog } from '../context/MealLogContext';
import { useUser } from '../context/UserContext';

export const useSmartFoodSuggestions = () => {
    const { dailyTotals } = useMealLog();
    const { profile } = useUser();
    const [suggestions, setSuggestions] = useState<SpoonacularRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getSuggestions = async () => {
            setIsLoading(true);
            const hour = new Date().getHours();
            let mealType: string;

            if (hour >= 5 && hour < 11) mealType = 'breakfast';
            else if (hour >= 11 && hour < 15) mealType = 'main course';
            else if (hour >= 15 && hour < 22) mealType = 'main course';
            else mealType = 'snack';

            try {
                // Determine protein priority
                const proteinGap = profile.goals.protein - dailyTotals.protein;
                const minProtein = proteinGap > 50 ? 30 : 15;

                const results = await fetchRecommendations({
                    diet: profile.dietaryPreference === 'None' ? undefined : profile.dietaryPreference,
                    type: mealType,
                    minProtein: minProtein,
                    number: 3
                });

                setSuggestions(results);
            } catch (error) {
                console.error('Smart Suggestions Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getSuggestions();
    }, [profile.dietaryPreference, dailyTotals.protein < profile.goals.protein * 0.5]);

    return { suggestions, isLoading };
};
