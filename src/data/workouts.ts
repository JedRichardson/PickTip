export interface WorkoutOption {
    id: string;
    category: string;
    name: string;
    duration: string;
    intensity: 'Beginner' | 'Intermediate' | 'Expert' | 'Low' | 'Medium' | 'High';
    calories: string;
    description: string;
    muscle: string;
    equipment: string;
    instructions: string;
}

export const workouts: WorkoutOption[] = [
    // --- LEGS / LOWER BODY ---
    {
        id: '1',
        category: 'legs',
        name: 'Heavy Barbell Back Squats (5x5)',
        duration: '35 min',
        intensity: 'Expert',
        calories: '420',
        description: 'Maximum lower body power and leg muscle development',
        muscle: 'quadriceps',
        equipment: 'Barbell',
        instructions: 'Rack the barbell across upper traps. Unrack, squat deep until thighs break parallel, then explode upward keeping core braced.'
    },
    {
        id: '2',
        category: 'legs',
        name: 'Single-Leg Pistol Squats',
        duration: '25 min',
        intensity: 'Expert',
        calories: '340',
        description: 'Unilateral leg strength, balance, and peak mobility',
        muscle: 'quadriceps',
        equipment: 'Bodyweight',
        instructions: 'Extend one leg forward in the air. Lower down smoothly on the standing leg until glutes approach the heel, then drive upward.'
    },
    {
        id: '3',
        category: 'legs',
        name: 'Heavy Romanian Deadlifts',
        duration: '30 min',
        intensity: 'Expert',
        calories: '380',
        description: 'Peak hamstring, glute, and posterior chain strength',
        muscle: 'hamstrings',
        equipment: 'Barbell',
        instructions: 'Hinge forward at the hips with a flat back, lowering the weight along shins until hamstrings stretch, then snap hips forward.'
    },
    {
        id: '4',
        category: 'legs',
        name: 'Walking Dumbbell Lunges',
        duration: '20 min',
        intensity: 'Intermediate',
        calories: '240',
        description: 'Improves balance, leg endurance, and glute activation',
        muscle: 'glutes',
        equipment: 'Dumbbells',
        instructions: 'Step forward into a deep lunge keeping front knee over ankle. Drive off front heel and step straight into the next step.'
    },
    {
        id: '5',
        category: 'legs',
        name: 'Bodyweight Squats & Calf Raises',
        duration: '15 min',
        intensity: 'Beginner',
        calories: '150',
        description: 'Gentle lower body warmup and calf strengthening',
        muscle: 'quadriceps',
        equipment: 'Bodyweight',
        instructions: 'Perform controlled bodyweight squats followed by rising onto toes at the top for calf contraction.'
    },

    // --- ARMS / UPPER BODY ---
    {
        id: '6',
        category: 'arms',
        name: 'Weighted Parallel Bar Dips',
        duration: '25 min',
        intensity: 'Expert',
        calories: '320',
        description: 'Heavy overload for triceps, lower chest, and shoulders',
        muscle: 'triceps',
        equipment: 'Dip Belt / Weight',
        instructions: 'Attach dip belt weight. Lower body on parallel bars until elbows reach 90 degrees, then press firmly to lock out.'
    },
    {
        id: '7',
        category: 'arms',
        name: 'Heavy Preacher Barbell Curls',
        duration: '20 min',
        intensity: 'Expert',
        calories: '280',
        description: 'Isolated bicep peak isolation with heavy weight',
        muscle: 'biceps',
        equipment: 'EZ-Bar / Preacher Bench',
        instructions: 'Rest upper arms flat on preacher pad. Lower weight under control and flex biceps hard at the top of the curl.'
    },
    {
        id: '8',
        category: 'arms',
        name: 'Diamond Push-Ups to Failure',
        duration: '15 min',
        intensity: 'Intermediate',
        calories: '190',
        description: 'High-rep tricep and inner chest finisher',
        muscle: 'triceps',
        equipment: 'Bodyweight',
        instructions: 'Place hands close together forming a diamond shape with thumbs and index fingers. Lower chest to hands and push up.'
    },
    {
        id: '9',
        category: 'arms',
        name: 'Standing Dumbbell Bicep Curls',
        duration: '15 min',
        intensity: 'Beginner',
        calories: '130',
        description: 'Fundamental bicep curl technique',
        muscle: 'biceps',
        equipment: 'Dumbbells',
        instructions: 'Stand tall with dumbbells at sides. Supinate wrists as you curl up toward shoulders, squeezing biceps at top.'
    },

    // --- CHEST DAY ---
    {
        id: '18',
        category: 'chest',
        name: 'Heavy Barbell Bench Press',
        duration: '30 min',
        intensity: 'Expert',
        calories: '360',
        description: 'Maximum chest strength and pectoral overload',
        muscle: 'chest',
        equipment: 'Barbell',
        instructions: 'Unrack heavy barbell, lower smoothly to sternum, and press vertically to lockout keeping shoulder blades retracted.'
    },
    {
        id: '19',
        category: 'chest',
        name: 'Heavy Incline Dumbbell Press',
        duration: '25 min',
        intensity: 'Expert',
        calories: '320',
        description: 'Upper chest hypertrophy and shoulder stability',
        muscle: 'chest',
        equipment: 'Dumbbells',
        instructions: 'Set bench to 30 degrees incline. Press dumbbells vertically, squeezing upper chest at peak contraction.'
    },
    {
        id: '20',
        category: 'chest',
        name: 'Cable Chest Flyes',
        duration: '20 min',
        intensity: 'Intermediate',
        calories: '220',
        description: 'Isolated pectoral stretch and peak contraction',
        muscle: 'chest',
        equipment: 'Cable Machine',
        instructions: 'Bring cable handles together in a hugging arc across chest, holding peak contraction for 1 second.'
    },
    {
        id: '21',
        category: 'chest',
        name: 'Push-Ups & Pec Stretch',
        duration: '15 min',
        intensity: 'Beginner',
        calories: '140',
        description: 'Beginner bodyweight chest conditioning',
        muscle: 'chest',
        equipment: 'Bodyweight',
        instructions: 'Controlled bodyweight push-ups maintaining rigid plank form, followed by chest stretches.'
    },

    // --- BACK & PULL ---
    {
        id: '22',
        category: 'back',
        name: 'Heavy Barbell Bent-Over Rows',
        duration: '30 min',
        intensity: 'Expert',
        calories: '350',
        description: 'Lat thickness, upper back power, and posture',
        muscle: 'lats',
        equipment: 'Barbell',
        instructions: 'Hinge forward at hips with flat back. Pull barbell to lower abdomen, squeezing lat muscles forcefully at top.'
    },
    {
        id: '23',
        category: 'back',
        name: 'Weighted Pull-Ups',
        duration: '25 min',
        intensity: 'Expert',
        calories: '330',
        description: 'Upper back width and bodyweight relative strength',
        muscle: 'lats',
        equipment: 'Dip Belt / Weight',
        instructions: 'Attach plate to dip belt. Grab pull-up bar overhead with overhand grip and pull chest up to touch bar.'
    },
    {
        id: '24',
        category: 'back',
        name: 'Lat Pulldowns & Cable Rows',
        duration: '20 min',
        intensity: 'Intermediate',
        calories: '230',
        description: 'Symmetrical lat and rhomboid activation',
        muscle: 'lats',
        equipment: 'Cable Machine',
        instructions: 'Pull wide lat bar down to upper chest keeping torso tall and driving elbows down and back.'
    },
    {
        id: '25',
        category: 'back',
        name: 'Inverted Rows & Back Extensions',
        duration: '15 min',
        intensity: 'Beginner',
        calories: '150',
        description: 'Light upper back endurance and spinal health',
        muscle: 'lats',
        equipment: 'Bodyweight',
        instructions: 'Hang beneath low bar, pull chest to bar with body extended, then perform controlled hyper-extensions.'
    },

    // --- SHOULDERS ---
    {
        id: '26',
        category: 'shoulders',
        name: 'Overhead Barbell Military Press',
        duration: '30 min',
        intensity: 'Expert',
        calories: '340',
        description: 'Heavy shoulder power and overhead stability',
        muscle: 'traps',
        equipment: 'Barbell',
        instructions: 'Press heavy barbell vertically from clavicles to full lockout overhead keeping core tight.'
    },
    {
        id: '27',
        category: 'shoulders',
        name: 'Heavy Dumbbell Shoulder Press',
        duration: '25 min',
        intensity: 'Expert',
        calories: '300',
        description: 'Anterior and lateral deltoid overload',
        muscle: 'traps',
        equipment: 'Dumbbells',
        instructions: 'Sit tall on bench. Press heavy dumbbells overhead from ear level, squeezing shoulders at peak.'
    },
    {
        id: '28',
        category: 'shoulders',
        name: 'Dumbbell Lateral & Front Raises',
        duration: '20 min',
        intensity: 'Intermediate',
        calories: '200',
        description: 'Side deltoid isolation and shoulder width',
        muscle: 'traps',
        equipment: 'Dumbbells',
        instructions: 'Raise dumbbells out to sides until parallel with shoulders, controlling the weight on descent.'
    },
    {
        id: '29',
        category: 'shoulders',
        name: 'Light Shoulder Press & Arm Circles',
        duration: '15 min',
        intensity: 'Beginner',
        calories: '130',
        description: 'Shoulder joint mobility and light activation',
        muscle: 'traps',
        equipment: 'Bodyweight / Light Dumbbells',
        instructions: 'Controlled light pressing overhead followed by dynamic arm circles for rotators.'
    },

    // --- CORE & ABS ---
    {
        id: '10',
        category: 'core',
        name: 'Standing Ab Wheel Rollouts',
        duration: '20 min',
        intensity: 'Expert',
        calories: '260',
        description: 'Maximum core tension and full abdominal strength',
        muscle: 'abdominals',
        equipment: 'Ab Wheel',
        instructions: 'Roll the ab wheel forward from feet or knees until body is nearly parallel to floor, then contract core to pull back.'
    },
    {
        id: '11',
        category: 'core',
        name: 'Hanging Toes-to-Bar Raises',
        duration: '20 min',
        intensity: 'Expert',
        calories: '250',
        description: 'Explosive lower ab and hip flexor development',
        muscle: 'abdominals',
        equipment: 'Pull-Up Bar',
        instructions: 'Hang from bar. Without swinging, drive toes straight up to touch the bar, then lower with control.'
    },
    {
        id: '12',
        category: 'core',
        name: 'Plank to Elbow Push-Ups',
        duration: '15 min',
        intensity: 'Intermediate',
        calories: '170',
        description: 'Dynamic core stability and shoulder endurance',
        muscle: 'abdominals',
        equipment: 'Bodyweight',
        instructions: 'Hold forearm plank, then press up one hand at a time into high plank, alternating leading hands.'
    },
    {
        id: '13',
        category: 'core',
        name: 'Gentle Crunches & Bicycle Kicks',
        duration: '12 min',
        intensity: 'Beginner',
        calories: '110',
        description: 'Simple core circuit for beginners',
        muscle: 'abdominals',
        equipment: 'Bodyweight',
        instructions: 'Perform controlled crunches followed by slow bicycle kicks, driving opposite elbow toward knee.'
    },

    // --- FULL BODY ---
    {
        id: '14',
        category: 'fullbody',
        name: 'Barbell Clean & Overhead Press',
        duration: '35 min',
        intensity: 'Expert',
        calories: '450',
        description: 'Explosive Olympic full-body compound movement',
        muscle: 'fullbody',
        equipment: 'Barbell',
        instructions: 'Explosively clean barbell from floor to shoulders, then dip knees and press bar overhead with power.'
    },
    {
        id: '15',
        category: 'fullbody',
        name: 'Dumbbell Devil Presses',
        duration: '25 min',
        intensity: 'Expert',
        calories: '410',
        description: 'High-intensity burpee with double dumbbell snatch',
        muscle: 'fullbody',
        equipment: 'Dumbbells',
        instructions: 'Perform a burpee holding dumbbells on floor. Jump feet up, hinge hips, and snatch dumbbells overhead in one motion.'
    },
    {
        id: '16',
        category: 'fullbody',
        name: 'Kettlebell Swings & Thrusters',
        duration: '20 min',
        intensity: 'Intermediate',
        calories: '320',
        description: 'Cardio-strength conditioning for full body',
        muscle: 'fullbody',
        equipment: 'Kettlebell / Dumbbells',
        instructions: 'Hinge hips for explosive swings, followed by deep front squats pressing dumbbells overhead at top.'
    },
    {
        id: '17',
        category: 'fullbody',
        name: 'Jumping Jacks & Bodyweight Circuit',
        duration: '15 min',
        intensity: 'Beginner',
        calories: '160',
        description: 'Light full body warmup and calorie burner',
        muscle: 'fullbody',
        equipment: 'Bodyweight',
        instructions: 'Alternate between jumping jacks, high knees, and light bodyweight squats.'
    }
];