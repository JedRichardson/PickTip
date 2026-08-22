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

    const {
        diet,
        maxCalories,
        minProtein,
        type,
        number = 5
    } = params;

    let url =
        `${BASE_URL}/complexSearch?apiKey=${API_KEY}` +
        `&number=${number}` +
        `&addRecipeInformation=true` +
        `&addRecipeNutrition=true`;

    if (diet && diet !== 'None') {
        url += `&diet=${encodeURIComponent(diet.toLowerCase())}`;
    }

    if (maxCalories)
        url += `&maxCalories=${maxCalories}`;

    if (minProtein)
        url += `&minProtein=${minProtein}`;

    if (type)
        url += `&type=${encodeURIComponent(type)}`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            console.error(
                `Spoonacular HTTP Error: ${response.status}`
            );
            return [];
        }

        const data = await response.json();

        if (!data?.results || !Array.isArray(data.results)) {
            console.error(
                "Unexpected Spoonacular response:",
                data
            );
            return [];
        }

        return data.results.map((r: any) => {

            const nutrients = r.nutrition?.nutrients ?? [];

            const calories =
                nutrients.find((n: any) => n.name === "Calories")?.amount;

            const protein =
                nutrients.find((n: any) => n.name === "Protein")?.amount;

            const fat =
                nutrients.find((n: any) => n.name === "Fat")?.amount;

            const carbs =
                nutrients.find((n: any) => n.name === "Carbohydrates")?.amount;

            return {
                id: r.id,
                title: r.title,
                image: r.image,
                summary: r.summary,
                calories,
                protein: protein != null ? `${protein}g` : undefined,
                fat: fat != null ? `${fat}g` : undefined,
                carbs: carbs != null ? `${carbs}g` : undefined,
            };
        });

    } catch (error) {

        console.error("Spoonacular Fetch Error:", error);

        return [];
    }
};

export const getRecipeDetails = async (id: number) => {
    const url = `${BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=true`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch recipe details');
        return await response.json();
    } catch (error) {
        console.error('Spoonacular Details Error:', error);
        return null;
    }
};
