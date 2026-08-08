import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
} from 'react';

export interface SavedWorkout {
    id: string;
    name: string;
    exercises: any[];
}

interface SavedWorkoutContextType {
    savedWorkouts: SavedWorkout[];
    saveWorkout: (workout: SavedWorkout) => void;
    removeWorkout: (id: string) => void;
    isWorkoutSaved: (id: string) => boolean;
}

const SavedWorkoutContext =
    createContext<SavedWorkoutContextType | undefined>(undefined);

export function SavedWorkoutProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);

    const saveWorkout = (workout: SavedWorkout) => {
        setSavedWorkouts(prev => {
            const alreadySaved = prev.some(
                savedWorkout => savedWorkout.id === workout.id
            );

            if (alreadySaved) {
                return prev.filter(
                    savedWorkout => savedWorkout.id !== workout.id
                );
            }

            return [...prev, workout];
        });
    };

    const removeWorkout = (id: string) => {
        setSavedWorkouts(prev =>
            prev.filter(workout => workout.id !== id)
        );
    };

    const isWorkoutSaved = (id: string) => {
        return savedWorkouts.some(workout => workout.id === id);
    };

    return (
        <SavedWorkoutContext.Provider
            value={{
                savedWorkouts,
                saveWorkout,
                removeWorkout,
                isWorkoutSaved,
            }}
        >
            {children}
        </SavedWorkoutContext.Provider>
    );
}

export function useSavedWorkouts() {
    const context = useContext(SavedWorkoutContext);

    if (!context) {
        throw new Error(
            'useSavedWorkouts must be used inside SavedWorkoutProvider'
        );
    }

    return context;
}