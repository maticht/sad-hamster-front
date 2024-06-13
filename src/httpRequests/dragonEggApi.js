import {$host} from "./index";

export const getUserData = async (userid) => {
    const {data} = await $host.get('/api/user/fullUserData/' + userid)
    return data
}

export const getAllUsers = async (body) => {
    const {data} = await $host.post('/api/user/all', body)
    return data
}

export const getUserTopPlace = async (userId) => {
    const {data} = await $host.put('/api/user/topPlace/' + userId);
    return data;
}
export const getMiniGameReward = async (userId, body) => {
    const {data} = await $host.post('/api/user/miniGame/' + userId, body);
    return data;
}

export const updateScore = async (value) => {
    const {data} = await $host.patch('/api/score', value);
    return data;
}

export const updateEnergyDate = async (value) => {
    const {data} = await $host.patch('/api/energy', value);
    return data;
}

export const updateEnergyCapacity = async (userId) => {
    const {data} = await $host.patch('/api/energy/updateCapacity/'+userId);
    return data;
}

export const updateEnergyRecovery = async (userId) => {
    const {data} = await $host.patch('/api/energy/updateRecovery/'+userId);
    return data;
}

export const collectFromInvitees = async (userId) => {
    const {data} = await $host.put('/api/referralUsers/collectFromInvitees/' + userId);
    return data;
}
export const replenishmentFromInvitees = async (userId) => {
    const {data} = await $host.put('/api/referralUsers/replenishmentFromInvitees/' + userId);
    return data;
}

export const getTasks = async (userId) => {
    const {data} = await $host.get('/api/task/' + userId);
    return data;
}
export const completeTask = async (userId, body) => {
    const {data} = await $host.put('/api/task/' + userId, body);
    return data;
}

export const updateDamage = async (userId) => {
    const {data} = await $host.patch('/api/damage/' + userId);
    return data;
}