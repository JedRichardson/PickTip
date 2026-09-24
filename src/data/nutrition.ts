export interface Food {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    dietaryLabels: string[];
    pairingIntensity: 'Expert' | 'High' | 'Intermediate' | 'Medium' | 'Beginner' | 'Low';
    pairingCategories: string[];
    description: string;
    mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    servingSize?: string;
}

export const foodItems: Food[] = [
    // --- EXPERT / HIGH INTENSITY MEALS (Peak Protein & Recovery) ---
    {
        id: '1',
        name: 'Grilled Steak & Sweet Potato Power Bowl',
        calories: 580,
        protein: 52,
        carbs: 45,
        fat: 18,
        dietaryLabels: ['High Protein', 'Gluten-Free'],
        pairingIntensity: 'Expert',
        pairingCategories: ['legs', 'fullbody', 'arms', 'chest', 'back'],
        description: 'Heavy duty protein and complex carbs for intense muscle repair.',
        mealType: 'Dinner',
        servingSize: '1 bowl'
    },
    {
        id: '2',
        name: 'Bison Rice & Roasted Veggie Bowl',
        calories: 540,
        protein: 48,
        carbs: 42,
        fat: 16,
        dietaryLabels: ['High Protein', 'Lean Fuel'],
        pairingIntensity: 'Expert',
        pairingCategories: ['legs', 'fullbody', 'back', 'chest'],
        description: 'Lean grass-fed bison packed with iron, zinc, and muscle building protein.',
        mealType: 'Dinner',
        servingSize: '1 bowl'
    },
    {
        id: '3',
        name: 'Atlantic Salmon & Quinoa Medley',
        calories: 520,
        protein: 44,
        carbs: 38,
        fat: 20,
        dietaryLabels: ['Keto-Friendly', 'Gluten-Free', 'Omega-3'],
        pairingIntensity: 'Expert',
        pairingCategories: ['arms', 'fullbody', 'shoulders', 'chest'],
        description: 'Rich in anti-inflammatory omega-3 fatty acids for joint recovery.',
        mealType: 'Dinner',
        servingSize: '1 fillet + quinoa'
    },
    {
        id: '4',
        name: 'Double-Scoop Whey Isolate Recovery Shake',
        calories: 320,
        protein: 50,
        carbs: 12,
        fat: 4,
        dietaryLabels: ['High Protein', 'Quick Recovery'],
        pairingIntensity: 'Expert',
        pairingCategories: ['arms', 'legs', 'fullbody', 'core', 'shoulders', 'back', 'chest'],
        description: 'Ultra-fast absorbing whey protein isolate for immediate post-workout synthesis.',
        mealType: 'Snack',
        servingSize: '2 scoops'
    },
    {
        id: '5',
        name: 'Egg White, Turkey Sausage & Spinach Power Wrap',
        calories: 410,
        protein: 38,
        carbs: 34,
        fat: 12,
        dietaryLabels: ['High Protein'],
        pairingIntensity: 'High',
        pairingCategories: ['arms', 'core', 'legs', 'shoulders', 'chest'],
        description: 'Lean egg whites and turkey sausage wrap for clean morning fuel.',
        mealType: 'Breakfast',
        servingSize: '1 wrap'
    },
    {
        id: '6',
        name: 'Seared Ahi Tuna Poke & Edamame Bowl',
        calories: 480,
        protein: 46,
        carbs: 36,
        fat: 12,
        dietaryLabels: ['Gluten-Free', 'High Protein'],
        pairingIntensity: 'High',
        pairingCategories: ['fullbody', 'arms', 'back'],
        description: 'Fresh sushi-grade tuna with edamame and brown rice for clean energy.',
        mealType: 'Lunch',
        servingSize: '1 bowl'
    },

    // --- INTERMEDIATE / MEDIUM INTENSITY MEALS ---
    {
        id: '7',
        name: 'Grilled Chicken & Quinoa Salad',
        calories: 440,
        protein: 36,
        carbs: 40,
        fat: 10,
        dietaryLabels: ['Gluten-Free', 'High Protein'],
        pairingIntensity: 'Intermediate',
        pairingCategories: ['legs', 'fullbody', 'arms', 'chest', 'back'],
        description: 'Balanced lean protein with complete plant carbs for steady energy.',
        mealType: 'Lunch',
        servingSize: '1 plate'
    },
    {
        id: '8',
        name: 'Greek Yogurt Berry Parfait with Chia Seeds',
        calories: 280,
        protein: 24,
        carbs: 32,
        fat: 8,
        dietaryLabels: ['Vegetarian', 'Gluten-Free'],
        pairingIntensity: 'Intermediate',
        pairingCategories: ['core', 'arms', 'shoulders'],
        description: 'Probiotic-rich Greek yogurt with antioxidants for cellular recovery.',
        mealType: 'Breakfast',
        servingSize: '250g'
    },
    {
        id: '9',
        name: 'Pan-Seared Shrimp & Wild Rice',
        calories: 390,
        protein: 34,
        carbs: 38,
        fat: 8,
        dietaryLabels: ['Gluten-Free', 'Lean Protein'],
        pairingIntensity: 'Intermediate',
        pairingCategories: ['core', 'arms', 'back', 'chest'],
        description: 'Low-calorie high-protein shrimp served over fragrant wild rice.',
        mealType: 'Dinner',
        servingSize: '1 plate'
    },
    {
        id: '10',
        name: 'Turkey & Cheddar Whole Wheat Wrap',
        calories: 360,
        protein: 28,
        carbs: 32,
        fat: 12,
        dietaryLabels: ['High Protein'],
        pairingIntensity: 'Medium',
        pairingCategories: ['arms', 'core', 'shoulders'],
        description: 'Sliced roast turkey breast with sharp cheddar in a whole wheat wrap.',
        mealType: 'Lunch',
        servingSize: '1 wrap'
    },
    {
        id: '11',
        name: 'Tofu & Vegetable Sesame Stir-Fry',
        calories: 330,
        protein: 20,
        carbs: 28,
        fat: 14,
        dietaryLabels: ['Vegan', 'Gluten-Free'],
        pairingIntensity: 'Medium',
        pairingCategories: ['fullbody', 'core', 'back'],
        description: 'Crispy pan-fried tofu with broccoli and bell peppers in sesame sauce.',
        mealType: 'Dinner',
        servingSize: '1 bowl'
    },
    {
        id: '12',
        name: 'Baked Cod with Green Beans & Lemon Rice',
        calories: 370,
        protein: 32,
        carbs: 34,
        fat: 6,
        dietaryLabels: ['Gluten-Free', 'Lean Fuel'],
        pairingIntensity: 'Medium',
        pairingCategories: ['fullbody', 'legs', 'chest'],
        description: 'Flaky white cod seasoned with lemon and fresh herbs.',
        mealType: 'Dinner',
        servingSize: '1 fillet'
    },

    // --- BEGINNER / LOW INTENSITY MEALS (Light & Balanced) ---
    {
        id: '13',
        name: 'Avocado Toast with Poached Egg',
        calories: 310,
        protein: 14,
        carbs: 26,
        fat: 18,
        dietaryLabels: ['Vegetarian'],
        pairingIntensity: 'Beginner',
        pairingCategories: ['core', 'legs', 'shoulders', 'back', 'chest'],
        description: 'Creamy avocado on sourdough topped with a farm-fresh poached egg.',
        mealType: 'Breakfast',
        servingSize: '2 slices'
    },
    {
        id: '14',
        name: 'Slow-Cooked Oatmeal with Almonds & Honey',
        calories: 290,
        protein: 12,
        carbs: 42,
        fat: 10,
        dietaryLabels: ['Vegan-Option', 'Heart Healthy'],
        pairingIntensity: 'Beginner',
        pairingCategories: ['core', 'fullbody', 'chest', 'back'],
        description: 'Sustained complex carbohydrates to fuel your day gently.',
        mealType: 'Breakfast',
        servingSize: '1 bowl'
    },
    {
        id: '15',
        name: 'Cucumber & Hummus Pita Pocket',
        calories: 260,
        protein: 10,
        carbs: 34,
        fat: 9,
        dietaryLabels: ['Vegan'],
        pairingIntensity: 'Low',
        pairingCategories: ['core', 'arms', 'shoulders'],
        description: 'Refreshing cucumber slices with garlic hummus in whole pita.',
        mealType: 'Lunch',
        servingSize: '1 pita'
    },
    {
        id: '16',
        name: 'Berry Spinach Protein Smoothie',
        calories: 220,
        protein: 18,
        carbs: 25,
        fat: 4,
        dietaryLabels: ['Quick Energy', 'Vegetarian'],
        pairingIntensity: 'Low',
        pairingCategories: ['core', 'fullbody', 'legs', 'arms', 'chest', 'back', 'shoulders'],
        description: 'Nutrient-dense green smoothie with blueberries and banana.',
        mealType: 'Snack',
        servingSize: '1 glass'
    },
    {
        id: '17',
        name: 'Cottage Cheese with Fresh Pineapple',
        calories: 210,
        protein: 22,
        carbs: 18,
        fat: 4,
        dietaryLabels: ['Vegetarian', 'High Protein'],
        pairingIntensity: 'Low',
        pairingCategories: ['arms', 'core', 'shoulders', 'chest'],
        description: 'Slow-digesting casein protein snack with digestive pineapple enzymes.',
        mealType: 'Snack',
        servingSize: '1 cup'
    },
    {
        id: '18',
        name: 'Miso Soup with Silken Tofu & Seaweed',
        calories: 140,
        protein: 10,
        carbs: 12,
        fat: 4,
        dietaryLabels: ['Vegan', 'Gut Healthy'],
        pairingIntensity: 'Low',
        pairingCategories: ['core', 'back'],
        description: 'Light, comforting miso broth rich in gut-friendly probiotics.',
        mealType: 'Snack',
        servingSize: '1 bowl'
    }
];

export const nutritionRecommendations = {
    Expert: {
        protein: 'Grass-Fed Steak / Whey Isolate',
        carbs: 'Sweet Potatoes / Quinoa',
        hydration: '36 oz Water + Electrolytes',
    },
    High: {
        protein: 'Chicken Breast / Salmon',
        carbs: 'Brown Rice / Whole Wrap',
        hydration: '32 oz Water',
    },
    Medium: {
        protein: 'Greek Yogurt / Turkey',
        carbs: 'Sweet Potato / Oats',
        hydration: '24 oz Water',
    },
    Low: {
        protein: 'Eggs / Cottage Cheese',
        carbs: 'Oatmeal / Avocado Toast',
        hydration: '16 oz Water',
    },
};