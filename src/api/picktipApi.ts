const API_URL = "https://api.api-ninjas.com/v1/exercises";

const API_KEY = process.env.EXPO_PUBLIC_API_NINJAS_KEY || 'SkBU3mf8WLH2z6ClFSuH9T4qURvqgFYcFpf5ch2a';

// Spoonacular API Configuration
export const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY || 'd57e0c0d4cc04530bc651135d558ef93';
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

  const response = await fetch(
    `${API_URL}?muscle=${encodeURIComponent(muscle)}`,
    {
      headers: {
        "X-Api-Key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Exercise API request failed with status ${response.status}`
    );
  }

  const exercises: Exercise[] = await response.json();

  return exercises;
}
