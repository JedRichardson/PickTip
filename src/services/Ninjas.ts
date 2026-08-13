// ==========================================
// API NINJAS WORKOUT SERVICE
// ==========================================

// API endpoint used to retrieve exercises.
const API_URL =
    'https://api.api-ninjas.com/v1/exercises';


// ==========================================
// API NINJAS KEY
// ==========================================
// Paste your NEW API Ninjas key here.
// Do not share or upload the new key.
const API_KEY =
    '5KATBLHf7SvLorRKxLy4T3Aa3JN8lb6UrEUmwG38';


// ==========================================
// EXERCISE DATA TYPE
// ==========================================
// Defines the exercise information that
// PickTip expects from API Ninjas.
export type Exercise = {
    name: string;
    type: string;
    muscle: string;
    equipments: string;
    difficulty: string;
    instructions: string;
};


// ==========================================
// GET EXERCISES
// ==========================================
// Requests exercises from API Ninjas based
// on the selected muscle group.
export async function getExercises(
    muscle: string
): Promise<Exercise[]> {

    // ==========================================
    // CHECK API KEY
    // ==========================================
    if (!API_KEY) {
        throw new Error(
            'API Ninjas key is missing'
        );
    }


    // ==========================================
    // BUILD REQUEST URL
    // ==========================================
    const requestUrl =
        `${API_URL}?muscle=${encodeURIComponent(muscle)}`;

    // Safe to log because the API key
    // is not included in this URL.
    console.log(
        'API Ninjas request:',
        requestUrl
    );


    // ==========================================
    // SEND API REQUEST
    // ==========================================
    const response = await fetch(
        requestUrl,
        {
            method: 'GET',

            headers: {
                'X-Api-Key': API_KEY,
            },
        }
    );


    // ==========================================
    // API ERROR HANDLING
    // ==========================================
    // Read the actual response from API Ninjas
    // instead of only displaying status 400.
    if (!response.ok) {

        const errorBody =
            await response.text();

        console.error(
            'API Ninjas returned:',
            response.status,
            errorBody
        );

        throw new Error(
            `Exercise API request failed: ${response.status} ${errorBody}`
        );
    }


    // ==========================================
    // CONVERT RESPONSE TO JSON
    // ==========================================
    const exercises: Exercise[] =
        await response.json();


    // ==========================================
    // RETURN EXERCISES
    // ==========================================
    return exercises;
}