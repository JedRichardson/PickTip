import { useMemo } from 'react';
import { foodItems, Food } from '../data/nutrition';


export interface SuggestionFilters {
    intensity?: string | string[];
    category?: string | string[];
    mealType?: string;
    dietaryLabel?: string;
}


// ==========================================
// NORMALIZE ROUTE VALUE
// ==========================================
// Expo Router can return a string or string[].
const getRouteValue = (
    value?: string | string[]
) => {

    return Array.isArray(value)
        ? value[0]
        : value ?? '';

};


// ==========================================
// NORMALIZE WORKOUT INTENSITY
// ==========================================
// API Ninjas: beginner / intermediate / expert
// PickTip:     Low / Medium / High
//
// Accept either naming system so this hook stays
// safe even if another screen passes API values.
const normalizeIntensity = (
    value?: string | string[]
) => {

    const normalized =
        getRouteValue(value)
            .trim()
            .toLowerCase();

    if (
        normalized === 'beginner' ||
        normalized === 'low'
    ) {
        return 'low';
    }

    if (
        normalized === 'intermediate' ||
        normalized === 'medium'
    ) {
        return 'medium';
    }

    if (
        normalized === 'expert' ||
        normalized === 'high'
    ) {
        return 'high';
    }

    return normalized;

};


// ==========================================
// NORMALIZE WORKOUT CATEGORY
// ==========================================
// Treat full body, full-body, full_body, and
// fullBody as the same category value.
const normalizeCategory = (
    value?: string | string[]
) => {

    return getRouteValue(value)
        .trim()
        .toLowerCase()
        .replace(/[\s_-]/g, '');

};


export const useFoodSuggestions = (
    filters: SuggestionFilters
): Food[] => {

    const {
        intensity,
        category,
        mealType,
        dietaryLabel
    } = filters;


    return useMemo(() => {

        let filtered = [...foodItems];


        // ==========================================
        // 1. FILTER BY WORKOUT INTENSITY
        // ==========================================
        // Intensity is the primary nutrition signal.
        if (intensity) {

            const intent =
                normalizeIntensity(intensity);

            filtered = filtered.filter(item =>
                normalizeIntensity(
                    item.pairingIntensity
                ) === intent
            );

        }


        // Keep the valid intensity matches before
        // trying the more-specific category filter.
        const intensityMatches = [...filtered];


        // ==========================================
        // 2. NARROW BY WORKOUT CATEGORY
        // ==========================================
        // If an exact category match exists, use it.
        // If not, keep the correct intensity foods
        // instead of returning an empty/wrong list.
        if (category) {

            const cat =
                normalizeCategory(category);

            const categoryMatches =
                filtered.filter(item =>
                    item.pairingCategories.some(
                        pairingCategory =>
                            normalizeCategory(
                                pairingCategory
                            ) === cat
                    )
                );

            filtered =
                categoryMatches.length > 0
                    ? categoryMatches
                    : intensityMatches;

        }


        // ==========================================
        // 3. FILTER BY MEAL TYPE
        // ==========================================
        // Meal type is a preference, not a reason to
        // lose every valid workout recommendation.
        // If this intensity/category has no exact meal
        // type match, keep the workout-matched foods.
        if (mealType) {

            const beforeMealType = [...filtered];

            const mealMatches =
                filtered.filter(item =>
                    item.mealType?.toLowerCase() ===
                    mealType.toLowerCase()
                );

            filtered =
                mealMatches.length > 0
                    ? mealMatches
                    : beforeMealType;

        }


        // ==========================================
        // 4. FILTER BY DIETARY LABEL
        // ==========================================
        if (dietaryLabel) {

            filtered = filtered.filter(item =>
                item.dietaryLabels.some(label =>
                    label.toLowerCase() ===
                    dietaryLabel.toLowerCase()
                )
            );

        }


        return filtered;

    }, [
        intensity,
        category,
        mealType,
        dietaryLabel
    ]);
};
