import create from 'zustand';
import {devtools} from "zustand/middleware";

const useStore = create(devtools(set => ({
    firstName: '',
    lastName: '',
    username: '',
    userLeague: '',
    userPlaceInTop: 0,
    chatId: '',
    userId: '',
    childReferral: '',
    dailyReward: [
        {isRewardTaken: false, dateOfAward: null},
        {isRewardTaken: false, dateOfAward: null},
        {isRewardTaken: false, dateOfAward: null},
        {isRewardTaken: false, dateOfAward: null},
        {isRewardTaken: false, dateOfAward: null},
        {isRewardTaken: false, dateOfAward: null},
        {isRewardTaken: false, dateOfAward: null},
    ],
    narrativeScenes: {
        faultAppearance: false,
        gettingEgg: false,
        dragonHatching: false,
    },
    topUserReward: {
        reward: false,
        place: false,
        isRewardTaken: false,
    },
    referralUsers: [],
    referralCollectionTime: null,
    language: 'en',
    subscription: false,
    walletToken: '',
    firstEntry: false,
    token: '',
    score: 0,
    overallScore: 0,
    energy: {
        name: '',
        description: '',
        energyFullRecoveryDate: new Date(),
        value: 500,
        images: [],
        energyCapacity: [],
        energyRecovery: [],
        levels: [],
        price: [],
        currentLevel: 0,
        lastEntrance: null,
    },
    axe: {
        name: "Axe",
        description: "By clicking on the egg, you charge the ax, after filling and activating your damage to the egg increases",
        images: [
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841284/axes/ax-1-lvl_pcdryy.png",
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841288/axes/ax-2-lvl_jzn5n5.png",
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841292/axes/ax-3-lvl_p0xrzv.png",
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841296/axes/ax-4-lvl_tiambt.png",
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841299/axes/ax-5-lvl_f9k7p4.png",
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841303/axes/ax-6-lvl_z4zikm.png",
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841308/axes/ax-7-lvl_i4hh7y.png",
            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714841311/axes/ax-8-lvl_pt9jgj.png"
        ],
        damageMultiplier: [2, 3, 4, 5, 6, 7, 8, 10],
        timeOfUse: [5, 7, 9, 11, 13, 15, 17, 20],
        levels: [1, 2, 3, 4, 5, 6, 7, 8],
        price: [100, 150, 220, 300, 400, 550, 700, 1000],
        currentLevel: 0,
    },
    barrel: {
        name: '',
        description: '',
        images: [],
        income: [],
        level: [],
        price: [],
        waitingTime: [],
        currentLevel: 0,
        lastEntrance: null,
        collectionTime: null,
    },
    barrelProgress: 0,
    hammer: {
        name: '',
        description: '',
        strength: [],
        images: [],
        income: [],
        level: [],
        price: [],
        currentLevel: 0,
    },

    eggs: [],
    eggImage: "",
    mainEggImage: "",
    eggRarity: "",
    eggName: "",
    isEggOpen: "",
    eggScore: "",
    blockType: "",
    weeklyRewards: [],

    setUsername: (username) => set({username}),
    setUserLeague: (userLeague) => set({userLeague}),
    setUserPlaceInTop: (userPlaceInTop) => set({userPlaceInTop}),
    setFirstName: (firstName) => set({firstName}),
    setLastName: (lastName) => set({lastName}),
    setChatId: (chatId) => set({chatId}),
    setChildReferral: (childReferral) => set({childReferral}),
    setReferralCollectionTime: (referralCollectionTime) => set({referralCollectionTime}),
    setDailyReward: (index, reward) => set(state => {
        const newDailyReward = [...state.dailyReward];
        newDailyReward[index] = reward;
        return {dailyReward: newDailyReward};
    }),
    setNarrativeScenes: (narrativeScenes) => set({narrativeScenes}),
    setTopUserReward: (topUserReward) => set({topUserReward}),
    setReferralUsers: (referralUsers) => set({referralUsers}),
    setLanguage: (language) => set({language}),
    setWalletToken: (walletToken) => set({walletToken}),
    setFirstEntry: (firstEntry) => set({firstEntry}),
    setToken: (token) => set({token}),
    setScore: (score) => set({score}),
    setOverallScore: (overallScore) => set({overallScore}),
    setEnergy: (energy) => set({energy}),
    setAxe: (axe) => set({axe}),
    setBarrel: (barrel) => set({barrel}),
    setBarrelProgress: (barrelProgress) => set({barrelProgress}),
    setHammer: (hammer) => set({hammer}),
    setEggs: (eggs) => set({eggs}),
    setEggImage: (eggImage) => set({eggImage}),
    setMainEggImage: (mainEggImage) => set({mainEggImage}),
    setEggRarity: (eggRarity) => set({eggRarity}),
    setEggName: (eggName)=>set({eggName}),
    setIsEggOpen: (isEggOpen) => set({isEggOpen}),
    setEggScore: (eggScore) => set({eggScore}),
    setBlockType: (blockType) => set({blockType}),

    setWeeklyRewards: (weeklyRewards) => set({weeklyRewards}),


    updateDailyReward: (index, reward) => set(state => {
        const newDailyReward = [...state.dailyReward];
        newDailyReward[index] = {...newDailyReward[index], ...reward};
        return {dailyReward: newDailyReward};
    }),
    updateNarrativeScene: (scene, value) => set(state => ({
        narrativeScenes: {...state.narrativeScenes, [scene]: value}
    })),
    updateTopUserReward: (key, value) => set(state => ({
        topUserReward: {...state.topUserReward, [key]: value}
    })),
    updateReferralUser: (index, user) => set(state => {
        const newReferralUsers = [...state.referralUsers];
        newReferralUsers[index] = {...newReferralUsers[index], ...user};
        return {referralUsers: newReferralUsers};
    }),
    updateEnergy: (key, value) => set(state => ({
        energy: {...state.energy, [key]: value}
    })),
    updateAxeStore: (key, value) => set(state => ({
        axe: {...state.axe, [key]: value}
    })),
    updateBarrelStore: (key, value) => set(state => ({
        barrel: {...state.barrel, [key]: value}
    })),
    updateHammer: (key, value) => set(state => ({
        hammer: {...state.hammer, [key]: value}
    })),
    updateEgg: (index, egg) => set(state => {
        const newEggs = [...state.eggs];
        newEggs[index] = {...newEggs[index], ...egg};
        return {eggs: newEggs};
    }),
    updateWeeklyReward: (index, reward) => set(state => {
        const newWeeklyRewards = [...state.weeklyRewards];
        newWeeklyRewards[index] = {...newWeeklyRewards[index], ...reward};
        return {weeklyRewards: newWeeklyRewards};
    }),

}), {name: "ZustandStore"}));

export default useStore;