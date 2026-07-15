export interface Food {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    dietaryLabels: string[];
    pairingIntensity: 'High' | 'Medium' | 'Low';
    pairingCategories: string[];
    description: string;
    mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    servingSize?: string;
}

export const foodItems: Food[] = [
    {
        id: '1',
        name: 'Grilled Chicken & Quinoa',
        calories: 450,
        protein: 35,
        carbs: 45,
        fat: 10,
        dietaryLabels: ['Gluten-Free', 'High Protein'],
        pairingIntensity: 'High',
        pairingCategories: ['legs', 'fullbody', 'arms'],
        description: 'Perfect post-workout meal for muscle recovery.',
        mealType: 'Lunch',
        servingSize: '1 bowl'
    },
    {
        id: '2',
        name: 'Greek Yogurt with Berries',
        calories: 200,
        protein: 15,
        carbs: 25,
        fat: 5,
        dietaryLabels: ['Vegetarian', 'Gluten-Free'],
        pairingIntensity: 'Medium',
        pairingCategories: ['core', 'yoga', 'walking'],
        description: 'Light and refreshing snack for steady energy.',
        mealType: 'Snack',
        servingSize: '200g'
    },
    {
        id: '3',
        name: 'Oatmeal with Almonds',
        calories: 300,
        protein: 10,
        carbs: 40,
        fat: 12,
        dietaryLabels: ['Vegan', 'Heart Healthy'],
        pairingIntensity: 'Low',
        pairingCategories: ['core', 'stretching'],
        description: 'Slow-releasing carbs for sustained energy.',
        mealType: 'Breakfast',
        servingSize: '1 bowl'
    },
    {
        id: '4',
        name: 'Sweet Potato & Black Bean Bowl',
        calories: 400,
        protein: 12,
        carbs: 65,
        fat: 8,
        dietaryLabels: ['Vegan', 'Gluten-Free'],
        pairingIntensity: 'Medium',
        pairingCategories: ['fullbody', 'legs'],
        description: 'High carb meal for glycogen replenishment.',
        mealType: 'Dinner',
        servingSize: '1 bowl'
    },
    {
        id: '5',
        name: 'Salmon & Asparagus',
        calories: 380,
        protein: 30,
        carbs: 5,
        fat: 25,
        dietaryLabels: ['Keto', 'Gluten-Free'],
        pairingIntensity: 'High',
        pairingCategories: ['arms', 'fullbody'],
        description: 'Omega-3 rich meal for inflammation reduction.',
        mealType: 'Dinner',
        servingSize: '1 fillet'
    },
    {
        id: '6',
        name: 'Protein Shake',
        calories: 150,
        protein: 25,
        carbs: 5,
        fat: 3,
        dietaryLabels: ['Quick Snack', 'High Protein'],
        pairingIntensity: 'High',
        pairingCategories: ['arms', 'legs', 'fullbody'],
        description: 'Fast-absorbing protein for immediate recovery.',
        mealType: 'Snack',
        servingSize: '1 scoop/shake'
    },
    {
        id: '7',
        name: 'Avocado Toast with Egg',
        calories: 350,
        protein: 12,
        carbs: 30,
        fat: 20,
        dietaryLabels: ['Vegetarian'],
        pairingIntensity: 'Medium',
        pairingCategories: ['core', 'yoga'],
        description: 'Healthy fats and protein for balanced energy.',
        mealType: 'Breakfast',
        servingSize: '2 slices'
    },
    {
        id: '8',
        name: 'Mixed Nuts',
        calories: 200,
        protein: 6,
        carbs: 6,
        fat: 18,
        dietaryLabels: ['Vegan', 'Keto', 'Gluten-Free'],
        pairingIntensity: 'Low',
        pairingCategories: ['stretching', 'walking'],
        description: 'On-the-go snack for healthy fats.',
        mealType: 'Snack',
        servingSize: '30g'
    },
    {
        id: '9',
        name: 'Turkey Wrap',
        calories: 320,
        protein: 20,
        carbs: 35,
        fat: 12,
        dietaryLabels: ['High Protein'],
        pairingIntensity: 'Medium',
        pairingCategories: ['arms', 'core'],
        description: 'Lean protein wrap for a balanced lunch.',
        mealType: 'Lunch',
        servingSize: '1 wrap'
    },
    {
        id: '10',
        name: 'Tofu Stir-fry with Broccoli',
        calories: 300,
        protein: 18,
        carbs: 20,
        fat: 15,
        dietaryLabels: ['Vegan', 'Gluten-Free'],
        pairingIntensity: 'Medium',
        pairingCategories: ['fullbody', 'legs'],
        description: 'Plant-based protein with nutrient-dense veggies.',
        mealType: 'Dinner',
        servingSize: '1 plate'
    },
    {
        id: '11',
        name: 'Banana with Almond Butter',
        calories: 250,
        protein: 4,
        carbs: 30,
        fat: 14,
        dietaryLabels: ['Vegan', 'Quick Energy'],
        pairingIntensity: 'Medium',
        pairingCategories: ['walking', 'fullbody'],
        description: 'Quick carbs and healthy fats for pre or post workout.',
        mealType: 'Snack',
        servingSize: '1 banana + 1 tbsp butter'
    },
    {
        id: '12',
        name: 'Cottage Cheese with Pineapple',
        calories: 180,
        protein: 20,
        carbs: 15,
        fat: 4,
        dietaryLabels: ['Vegetarian', 'High Protein'],
        pairingIntensity: 'Medium',
        pairingCategories: ['core', 'yoga'],
        description: 'Slow-digesting protein (casein) for recovery.',
        mealType: 'Snack',
        servingSize: '1 cup'
    },
    {
        id: '13',
        name: 'Lentil Soup',
        calories: 280,
        protein: 16,
        carbs: 45,
        fat: 2,
        dietaryLabels: ['Vegan', 'High Fiber'],
        pairingIntensity: 'Low',
        pairingCategories: ['stretching', 'walking'],
        description: 'Hearty and filling soup with complex carbs.',
        mealType: 'Lunch',
        servingSize: '1 bowl'
    },
    {
        id: '14',
        name: 'Steak with Roasted Potatoes',
        calories: 550,
        protein: 40,
        carbs: 40,
        fat: 25,
        dietaryLabels: ['High Protein', 'Gluten-Free'],
        pairingIntensity: 'High',
        pairingCategories: ['legs', 'fullbody'],
        description: 'High calorie meal for intense strength building.',
        mealType: 'Dinner',
        servingSize: '200g steak'
    },
    {
        id: '15',
        name: 'Hard Boiled Eggs',
        calories: 140,
        protein: 12,
        carbs: 1,
        fat: 10,
        dietaryLabels: ['Vegetarian', 'Keto', 'Gluten-Free'],
        pairingIntensity: 'Medium',
        pairingCategories: ['core', 'yoga', 'arms'],
        description: 'Simple and effective protein snack.',
        mealType: 'Snack',
        servingSize: '2 eggs'
    },
    {
        id: '16',
        name: 'Quinoa Salad',
        calories: 320,
        protein: 10,
        carbs: 50,
        fat: 8,
        dietaryLabels: ['Vegan', 'Gluten-Free'],
        pairingIntensity: 'Medium',
        pairingCategories: ['fullbody', 'core'],
        description: 'Light yet filling salad with complete protein.',
        mealType: 'Lunch',
        servingSize: '1 bowl'
    },
    {
        id: '17',
        name: 'Peanut Butter on Rice Cakes',
        calories: 220,
        protein: 8,
        carbs: 15,
        fat: 14,
        dietaryLabels: ['Vegan', 'Gluten-Free'],
        pairingIntensity: 'Low',
        pairingCategories: ['walking', 'stretching'],
        description: 'Quick energy boost with healthy fats.',
        mealType: 'Snack',
        servingSize: '2 rice cakes'
    },
    {
        id: '18',
        name: 'Miso Soup with Tofu',
        calories: 120,
        protein: 8,
        carbs: 10,
        fat: 5,
        dietaryLabels: ['Vegan'],
        pairingIntensity: 'Low',
        pairingCategories: ['yoga', 'stretching'],
        description: 'Warm and comforting soup for light recovery.',
        mealType: 'Snack',
        servingSize: '1 bowl'
    }
];

// Deprecated: Keeping for backward compatibility during transition if needed
export const nutritionRecommendations = {
    High: {
        protein: 'Chicken Breast',
        carbs: 'Brown Rice',
        hydration: '32 oz Water',
    },


    Medium: {
        protein: 'Greek Yogurt',
        carbs: 'Sweet Potato',
        hydration: '24 oz Water',
    },
    Low: {
        protein: 'Eggs',
        carbs: 'Oatmeal',
        hydration: '16 oz Water',
    },
};
