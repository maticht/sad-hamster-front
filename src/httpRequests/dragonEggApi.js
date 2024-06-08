import {$host} from "./index";


export const getUserData = async (userid) => {
    const {data} = await $host.get('/getUserData/' + userid)
    return data
}
export const checkDailyRewards = async (userid) => {
    const {data} = await $host.get('/checkDailyRewards/' + userid)
    return data
}
export const setEggFlag = async (userid) => {
    const {data} = await $host.get('/api/eggs/' + userid)
    return data
}
export const updateScore = async (value) => {
    const {data} = await $host.patch('/api/score', value);
    return data;
}

export const updateEnergyDate = async (value) => {
    const {data} = await $host.patch('/api/energy', value);
    return data;
}

export const updateEnergyBottle = async (userId) => {
    const {data} = await $host.get('/api/energy/updateBottle/'+userId);
    return data;
}

export const updateAxe = async (userid) => {
    const {data} = await $host.put('/updateAxe/' + userid);
    return data;
}
export const updateHummer = async (userid) => {
    const {data} = await $host.put('/updateHummer/' + userid);
    return data;
}
export const updateBarrel = async (userid) => {
    const {data} = await $host.put('/updateBarrel/' + userid);
    return data;
}
export const alchemistUpgrade = async (userid) => {
    const {data} = await $host.put('/alchemistUpgrade/' + userid);
    return data;
}
export const barrelExpectation = async (userid) => {
    const {data} = await $host.put('/barrelExpectation/' + userid);
    return data;
}
export const collectionBarrel = async (userid) => {
    const {data} = await $host.put('/collectionBarrel/' + userid);
    return data;
}
export const getAllUsers = async () => {
    const {data} = await $host.get('/getAllUsers')
    return data
}
export const collectDailyReward = async (userid) => {
    const {data} = await $host.put('/collectDailyReward/' + userid);
    return data;
}

export const collectWeeklyReward = async (value) => {
    const {data} = await $host.post('/api/weeklyRewards', value);
    return data;
}
export const collectFromInvitees = async (userid) => {
    const {data} = await $host.put('/collectFromInvitees/' + userid);
    return data;
}
export const replenishmentFromInvitees = async (userid) => {
    const {data} = await $host.put('/replenishmentFromInvitees/' + userid);
    return data;
}
export const faultAppearanceScene = async (userid) => {
    const {data} = await $host.put('/faultAppearanceScene/' + userid);
    return data;
}
export const gettingEggScene = async (userid) => {
    const {data} = await $host.put('/gettingEggScene/' + userid);
    return data;
}
export const getUserTopPlace = async (userid) => {
    const {data} = await $host.put('/getUserTopPlace/' + userid);
    return data;
}
export const updateWalletHash = async (userid, auroraWalletHash) => {
    const { data } = await $host.put(`/updateWalletHash/${userid}`, { auroraWalletHash });
    return data;
};
