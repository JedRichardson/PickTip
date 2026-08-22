import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo
} from 'react';

import {
    createAudioPlayer
} from 'expo-audio';


// ==========================================
// APP SOUNDS CONTEXT TYPE
// ==========================================
interface AppSoundsContextType {

    playTapSound: () => Promise<void>;

    playSuccessSound: () => Promise<void>;

    playCompleteSound: () => Promise<void>;

}



// ==========================================
// APP SOUNDS CONTEXT
// ==========================================
const AppSoundsContext =
    createContext<AppSoundsContextType | undefined>(
        undefined
    );



// ==========================================
// APP SOUNDS PROVIDER
// ==========================================
// Keeps PickTip audio players alive while the
// user moves between Expo Router screens.
//
// createAudioPlayer is used instead of
// useAudioPlayer because these sounds need to
// survive screen navigation.
// ==========================================
export function AppSoundsProvider({
    children
}: {
    children: ReactNode;
}) {


    // ==========================================
    // CREATE GLOBAL AUDIO PLAYERS
    // ==========================================
    // useMemo prevents new players from being
    // created every time the provider re-renders.
    const players = useMemo(() => {


        const tapPlayer =
            createAudioPlayer(
                require('../../assets/sounds/tap.wav')
            );


        const successPlayer =
            createAudioPlayer(
                require('../../assets/sounds/success.wav')
            );


        const completePlayer =
            createAudioPlayer(
                require('../../assets/sounds/completed.wav')
            );


        const crowdPlayer =
            createAudioPlayer(
                require('../../assets/sounds/crowd.wav')
            );


        const victoryPlayer =
            createAudioPlayer(
                require('../../assets/sounds/victory.wav')
            );


        return {

            tapPlayer,

            successPlayer,

            completePlayer,

            crowdPlayer,

            victoryPlayer

        };


    }, []);



    // ==========================================
    // CLEAN UP AUDIO PLAYERS
    // ==========================================
    // createAudioPlayer does not automatically
    // release its native resources.
    //
    // We release each player only when the global
    // AppSoundsProvider itself is removed.
    // ==========================================
    useEffect(() => {


        return () => {


            players.tapPlayer.release();

            players.successPlayer.release();

            players.completePlayer.release();

            players.crowdPlayer.release();

            players.victoryPlayer.release();


        };


    }, [players]);



    // ==========================================
    // PLAY TAP SOUND
    // ==========================================
    const playTapSound = async () => {


        await players.tapPlayer.seekTo(0);

        players.tapPlayer.play();


    };



    // ==========================================
    // PLAY SUCCESS SOUND
    // ==========================================
    const playSuccessSound = async () => {


        await players.successPlayer.seekTo(0);

        players.successPlayer.play();


    };



    // ==========================================
    // PLAY COMPLETE WORKOUT CELEBRATION
    // ==========================================
    const playCompleteSound = async () => {


        // Reset all three celebration sounds.
        await Promise.all([

            players.completePlayer.seekTo(0),

            players.crowdPlayer.seekTo(0),

            players.victoryPlayer.seekTo(0)

        ]);


        // Play all three together.
        players.completePlayer.play();

        players.crowdPlayer.play();

        players.victoryPlayer.play();


    };



    // ==========================================
    // PROVIDE APP SOUND FUNCTIONS
    // ==========================================
    return (

        <AppSoundsContext.Provider
            value={{

                playTapSound,

                playSuccessSound,

                playCompleteSound

            }}
        >

            {children}

        </AppSoundsContext.Provider>

    );

}



// ==========================================
// USE APP SOUNDS
// ==========================================
export const useAppSounds = () => {


    const context =
        useContext(AppSoundsContext);


    if (!context) {

        throw new Error(
            'useAppSounds must be used inside AppSoundsProvider.'
        );

    }


    return context;

};