import create from 'zustand';
import {devtools} from "zustand/middleware";

const useStore = create(devtools(set => ({
    username: '',
    userPlaceInTop: 0,
    referralUsers: [],
    referralCollectionTime: null,
    language: 'en',
    score: 0,
    overallScore: 0,
    level: 0,
    damage: 0,
    energy: {
        energyFullRecoveryDate: new Date(),
        value: 500,
        energyCapacityLevel: 0,
        energyRecoveryLevel: 0,
        lastEntrance: null,
    },
    tasks: [],

    setUsername: (username) => set({username}),
    setUserPlaceInTop: (userPlaceInTop) => set({userPlaceInTop}),
    setReferralCollectionTime: (referralCollectionTime) => set({referralCollectionTime}),

    setReferralUsers: (referralUsers) => set({referralUsers}),
    setScore: (score) => set({score}),
    setOverallScore: (overallScore) => set({overallScore}),
    setEnergy: (energy) => set({energy}),
    setDamage: (damage) => set({damage}),
    setTasks: (tasks) => set({tasks}),
    setLevel: (level) => set({level}),


    updateEnergy: (key, value) => set(state => ({
        energy: {...state.energy, [key]: value}
    })),


}), {name: "ZustandStore"}));

export default useStore;