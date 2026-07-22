import { SPOONACULAR_API_KEY, SPOONACULAR_BASE_URL } from '../api/picktipApi';

const API_KEY = SPOONACULAR_API_KEY;
const BASE_URL = SPOONACULAR_BASE_URL;

export interface SpoonacularRecipe {
    id: number;
    title: string;
    image: string;
    summary?: string;
    calories?: number;
    protein?: string;
    fat?: string;
    carbs?: string;
}

export const fetchRecommendations = async (params: {
    diet?: string;
    maxCalories?: number;
    minProtein?: number;
    type?: string;
    number?: number;
}): Promise<SpoonacularRecipe[]> => {
    const { diet, maxCalories, minProtein, type, number = 5 } = params;

    let url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&number=${number}&addRecipeInformation=true&addRecipeNutrition=true`;

    if (diet && diet !== 'None') {
        url += `&diet=${diet.toLowerCase()}`;
    }

    if (maxCalories) url += `&maxCalories=${maxCalories}`;
    if (minProtein) url += `&minProtein=${minProtein}`;
    if (type) url += `&type=${type}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return data.results.map((r: any) => ({
            id: r.id,
            title: r.title,
            image: r.image,
            summary: r.summary,
            calories: r.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount,
            protein: r.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount + 'g',
            fat: r.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount + 'g',
            carbs: r.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount + 'g',
        }));
    } catch (error) {
        console.error('Spoonacular Fetch Error:', error);
        return [];
    }
};

export const getRecipeDetails = async (id: number) => {
    const url = `${BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=true`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Spoonacular Details Error:', error);
        return null;
    }
};
