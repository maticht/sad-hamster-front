import React, {useEffect, useState} from 'react';
import './storeScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData, updateDamage, updateEnergyCapacity, updateEnergyRecovery} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import scoreCoin from "../../img/icons/sadCoin.png";
import storeTemplateData from '../../storeTemplateData/storeTemplateData.json'
import ComingSoonModal from "../../components/modals/ComingSoonModal/ComingSoonModal";
import useStore from "../../store/zustand.store/store";

const balance = require("../../storeTemplateData/balanceData.json");


export const StoreScreen = () => {

    const [isPurchaseError, setIsPurchaseError] = useState({
        damage: false,
        energyCapacity: false,
        energyRecovery: false,
    });
    const {user} = useTelegram();
    const userId = user?.id || '777217409'; //'409840876' ;
    const [showModal, setShowModal] = useState(false);
    const [balanceDamage, setBalanceDamage] = useState(balance.damage)
    const [balanceEnergyCapacity, setBalanceEnergyCapacity] = useState(balance.energy.energyCapacity)
    const [balanceEnergyRecovery, setBalanceEnergyRecovery] = useState(balance.energy.energyRecovery)


    //STORE
    const setScore = useStore((state) => state.setScore);
    const setEnergy = useStore((state) => state.setEnergy);
    const setDamage = useStore((state) => state.setDamage);
    const updateEnergy = useStore((state) => state.updateEnergy);


    const {score, energy, damage} =
        useStore((state) => ({
            score: state.score,
            energy: state.energy,
            damage: state.damage,
        }));


    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            if (!score) {
                setScore(user.scores.score);
            }
            if (!damage) {
                setDamage(user.damageLevel);
            }

            const usersEnergyObj = user.energy.energy;
            const energyCapacityData = balance.energy.energyCapacity;
            const energyRecoveryData = balance.energy.energyRecovery;
            let currentCapacityLevel = usersEnergyObj.energyCapacityLevel;
            let currentRecoveryLevel = usersEnergyObj.energyRecoveryLevel;
            const fullEnergyTime = new Date(usersEnergyObj.energyFullRecoveryDate);

            let now = new Date();
            const diffTime = now.getTime() - fullEnergyTime.getTime();

            console.log("diffTime", diffTime / 1000)

            let energyValue;
            if (diffTime >= 0) {
                energyValue = energyCapacityData.capacity[currentCapacityLevel - 1];
            } else {
                const energyRestoredPerSecond = energyRecoveryData.recovery[currentRecoveryLevel - 1];
                const timeSinceLastUpdate = Math.abs(diffTime);
                const secondsSinceLastUpdate = Math.floor(timeSinceLastUpdate / 1000); // количество секунд с последнего обновления
                const energyNotRestored = secondsSinceLastUpdate * energyRestoredPerSecond; // всего восстановленной энергии
                energyValue = energyCapacityData.capacity[currentCapacityLevel - 1] - energyNotRestored;
            }
            usersEnergyObj.value = energyValue;
            setEnergy(usersEnergyObj);
        };
        console.log(user)

        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);


    const handleModalToggle = () => {
        setShowModal(!showModal);
    };
    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    const handleDamageUpgrade = async () => {
        try {
            if (score < balance.damage.price[damage - 1]) {
                setIsPurchaseError(prevState => ({...prevState, damage: true}));
                setTimeout(() => {
                    setIsPurchaseError(prevState => ({...prevState, damage: false}));
                }, 700);
                return;
            }
            const response = await updateDamage(userId);
            setDamage(response.user.damageLevel);
            setScore(response.user.score);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEnergyCapacityUpgrade = async () => {
        try {
            if (score < balance.energy.energyCapacity.price[energy.energyCapacityLevel - 1]) {
                setIsPurchaseError(prevState => ({...prevState, energyCapacity: true}));
                setTimeout(() => {
                    setIsPurchaseError(prevState => ({...prevState, energyCapacity: false}));
                }, 700);
                return;
            }
            const response = await updateEnergyCapacity(userId);
            setEnergy(response.user.energy);
            setScore(response.user.score);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEnergyRecoveryUpgrade = async () => {
        try {
            if (score < balance.energy.energyRecovery.price[energy.energyRecoveryLevel - 1]) {
                setIsPurchaseError(prevState => ({...prevState, energyRecovery: true}));
                setTimeout(() => {
                    setIsPurchaseError(prevState => ({...prevState, energyRecovery: false}));
                }, 700);
                return;
            }
            const response = await updateEnergyRecovery(userId);
            setEnergy(response.user.energy);
            setScore(response.user.score);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="store-screen">
            <div className="store-container">
                <div className={'products-store-block'}>
                    <div className={'headerStoreBlock'}>
                        <div className="header-container">
                            <div className={'headerScoreBlock'}>
                                <div className={'headerScoreText'}>
                                    <img src={scoreCoin}></img>
                                    <p>{score}</p>
                                </div>
                            </div>
                            <p className={'lvlText'}>lvl 12</p>
                            <div className="lvl-progress-container">
                                <div className={'lvl-progress-bar'}>
                                    <div className={'lvl-progress-line'}
                                         style={{width: `55%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
                    <div className="products-scroll-block">
                        <div className={'store-product-item'}>
                            <div className={'store-product-item-upgrade-block'}>
                                <div>
                                    <div>
                                        <div className={'store-product-item-info'}>
                                            <div className={'store-product-item-info-block'}>
                                                <b className={'store-product-item-info-title'}>Damage</b>
                                                <p className={'store-product-item-description'}>lvl {damage}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {damage === 7 ? (
                                                <div>
                                                    Update: <b>{balanceDamage.income[damage - 1]}</b>
                                                </div>
                                            ) : (
                                                <div>
                                                    Update: <b>{balanceDamage.income[damage - 1]}</b> {'⇾ '}
                                                    <b>{balanceDamage.income[damage]}</b>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={'upgrade-btn' + (isPurchaseError.damage ? ' error' : '')}
                                     onClick={handleDamageUpgrade}>
                                    {damage === 7 ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className={'store-product-upgrade-nums'}>
                                            <p>{balanceDamage.price[damage - 1]}</p>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    )}

                                </div>

                            </div>
                        </div>


                        <div className={'store-product-item'}>
                            <div className={'store-product-item-upgrade-block'}>
                                <div>
                                    <div>
                                        <div className={'store-product-item-info'}>
                                            <div className={'store-product-item-info-block'}>
                                                <b className={'store-product-item-info-title'}>Energy capacity</b>
                                                <p className={'store-product-item-description'}>lvl {energy.energyCapacityLevel}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {energy.energyCapacityLevel === 5 ? (
                                                <div>
                                                    Update: <b>{balanceEnergyCapacity.capacity[energy.energyCapacityLevel - 1]}</b>
                                                </div>
                                            ) : (
                                                <div>
                                                    Update: <b>{balanceEnergyCapacity.capacity[energy.energyCapacityLevel - 1]}</b> {'⇾ '}
                                                    <b>{balanceEnergyCapacity.capacity[energy.energyCapacityLevel]}</b>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={'upgrade-btn' + (isPurchaseError.energyCapacity ? ' error' : '')}
                                     onClick={handleEnergyCapacityUpgrade}>
                                    {energy.energyCapacityLevel === 5 ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className={'store-product-upgrade-nums'}>
                                            <p>{balanceEnergyCapacity.price[energy.energyCapacityLevel - 1]}</p>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        <div className={'store-product-item'}>
                            <div className={'store-product-item-upgrade-block'}>
                                <div>
                                    <div>
                                        <div className={'store-product-item-info'}>
                                            <div className={'store-product-item-info-block'}>
                                                <b className={'store-product-item-info-title'}>Energy recovery</b>
                                                <p className={'store-product-item-description'}>lvl {energy.energyRecoveryLevel}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {energy.energyRecoveryLevel === 5 ? (
                                                <div>
                                                    Update: <b>{balanceEnergyRecovery.recovery[energy.energyRecoveryLevel - 1]}</b>
                                                </div>
                                            ) : (
                                                <div>
                                                    Update: <b>{balanceEnergyRecovery.recovery[energy.energyRecoveryLevel - 1]}</b> {'⇾ '}
                                                    <b>{balanceEnergyRecovery.recovery[energy.energyRecoveryLevel]}</b>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={'upgrade-btn' + (isPurchaseError.energyRecovery ? ' error' : '')}
                                     onClick={handleEnergyRecoveryUpgrade}>
                                    {energy.energyRecoveryLevel === 5 ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className={'store-product-upgrade-nums'}>
                                            <p>{balanceEnergyRecovery.price[energy.energyRecoveryLevel - 1]}</p>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>


                        {/*<div className={'store-product-item'}>*/}
                        {/*    <div className={'store-product-item-upgrade-block'}>*/}
                        {/*        <div>*/}
                        {/*            <div className={'store-product-item-info'}>*/}
                        {/*                <div className={'store-product-item-info-block'}>*/}
                        {/*                    <b className={'store-product-item-info-title'}>Energy</b>*/}
                        {/*                    <p className={'store-product-item-description'}>lvl 2</p>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div>*/}
                        {/*                {energy?.currentLevel === 8 ? (*/}
                        {/*                    <div>*/}
                        {/*                        Limit: <b>{energy?.energyCapacity[energy?.currentLevel - 1]}</b>*/}
                        {/*                    </div>*/}
                        {/*                ) : (*/}
                        {/*                    <div>*/}
                        {/*                        Limit: <b>{energy?.energyCapacity[energy?.currentLevel - 1]}</b> {'⇾ '}*/}
                        {/*                        <b>{energy?.energyCapacity[energy?.currentLevel]}</b>*/}
                        {/*                    </div>*/}
                        {/*                )}*/}
                        {/*            </div>*/}
                        {/*        </div>*/}

                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className={'store-product-item'}>*/}
                        {/*    <div className={'store-product-item-info'}>*/}

                        {/*    </div>*/}
                        {/*    <div className={'store-product-item-upgrade-block'}>*/}
                        {/*        <div>*/}
                        {/*            <div className={'store-product-item-info-block'}>*/}
                        {/*                <b className={'store-product-item-info-title'}>Recharging</b>*/}
                        {/*                <p className={'store-product-item-description'}>lvl 2</p>*/}
                        {/*            </div>*/}
                        {/*            <div>*/}
                        {/*                {axe?.currentLevel === 8 ? (*/}
                        {/*                    <div>*/}
                        {/*                        Duration: <b>{axe?.timeOfUse[axe?.currentLevel - 1]}/s</b>*/}
                        {/*                    </div>*/}
                        {/*                ) : (*/}
                        {/*                    <div>*/}
                        {/*                        Duration: <b>{axe?.timeOfUse[axe?.currentLevel - 1]}/s</b> {'⇾ '}*/}
                        {/*                        <b>{axe?.timeOfUse[axe?.currentLevel]}/s</b>*/}
                        {/*                    </div>*/}
                        {/*                )}*/}
                        {/*            </div>*/}
                        {/*        </div>*/}

                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <NavBar/>
            </div>
            {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
        </div>
    );
}

export default StoreScreen;