const API_URL = "https://api.api-ninjas.com/v1/exercises";

// Unified API Key management
const API_KEY = process.env.EXPO_PUBLIC_API_NINJAS_KEY || '5KATBLHf7SvLorRKxLy4T3Aa3JN8lb6UrEUmwG38';

// Spoonacular API Configuration
export const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY || '2a32d4012603465f97c73a407c55ccef';
export const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

export type Exercise = {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
};

export async function getExercises(
  muscle: string
): Promise<Exercise[]> {
  if (!API_KEY) {
    throw new Error("API Ninjas key is missing");
  }

  const requestUrl = `${API_URL}?muscle=${encodeURIComponent(muscle)}`;

  try {
    const response = await fetch(requestUrl, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Ninjas Error (${response.status}):`, errorText);
      throw new Error(`Exercise API request failed with status ${response.status}`);
    }

    const exercises: Exercise[] = await response.json();
    return exercises;
  } catch (error) {
    console.error("Fetch Exercises Error:", error);
    throw error;
  }
}
