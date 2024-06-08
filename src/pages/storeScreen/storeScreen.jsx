import React, {useEffect, useState} from 'react';
import './storeScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData, updateAxe} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import {updateHummer} from "../../httpRequests/dragonEggApi";
import {updateBarrel} from "../../httpRequests/dragonEggApi";
import {updateEnergyBottle} from "../../httpRequests/dragonEggApi";
import scoreCoin from "../../img/icons/scoreCoin.png";
import torch from "../../img/icons/torch.png";
import storeTemplateData from '../../storeTemplateData/storeTemplateData.json'
import ComingSoonModal from "../../components/modals/ComingSoonModal/ComingSoonModal";
import {Link} from "react-router-dom";
import Header from "../../components/header/header";
import helmet from "../../img/icons/profile.png";
import useStore from "../../store/zustand.store/store";


export const StoreScreen = () => {

    //const [userData, setUserData] = useState({});
    //const [axeData, setAxeData] = useState(storeTemplateData.storeItems.find(item => item.name === 'Axe'));
    //const [barrelData, setBarrelData] = useState(storeTemplateData.storeItems.find(item => item.name === 'Barrel'));
    //const [hammerData, setHammerData] = useState(storeTemplateData.storeItems.find(item => item.name === 'Hammer'));
    //const [energyBottleData, setEnergyBottleData] = useState(storeTemplateData.storeItems.find(item => item.name === 'Energy Bottle'));
    const [isPurchaseError, setIsPurchaseError] = useState({
        axe: false,
        hammer: false,
        barrel: false,
        energyBottle: false
    });
    const {user} = useTelegram();
    const userId = user?.id || '777217409'; //'409840876' ;
    const [showModal, setShowModal] = useState(false);


    //STORE
    const setScore = useStore((state) => state.setScore);
    const setEggs = useStore((state) => state.setEggs);
    const setIsEggOpen = useStore((state) => state.setIsEggOpen);
    const setEnergy = useStore((state) => state.setEnergy);
    const setAxe = useStore((state) => state.setAxe);
    const setBarrel = useStore((state) => state.setBarrel);
    const setHammer = useStore((state) => state.setHammer);
    const updateAxeStore = useStore((state)=> state.updateAxeStore);

    const {score, eggs, isEggOpen, energy, barrel, hammer, axe} =
        useStore((state) => ({
            score: state.score,
            eggs: state.eggs,
            isEggOpen: state.isEggOpen,
            overallScore: state.overallScore,
            eggScore: state.eggScore,
            eggImage: state.eggImage,
            blockType: state.blockType,
            energy: state.energy,
            barrel: state.barrel,
            hammer: state.hammer,
            barrelProgress: state.barrelProgress,
            axe: state.axe
        }));


    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            if(!score){
                setScore(user.score);
            }
            if (!eggs || eggs.length <= 0){
                setEggs(user.eggs);
            }
            if (isEggOpen === "") {
                setIsEggOpen(user.eggs[0]?.isOpen);
            }
            if(!barrel.name){
                setBarrel(user.barrel);
            }
            if(!hammer.name){
                setHammer(user.hammer);
            }
            if(!axe.currentLevel){
                setAxe(storeTemplateData.storeItems.find(item => item.name === 'Axe'));
                updateAxeStore('currentLevel', user.axe.currentLevel);
            }
            const usersEnergyObj = user.energy;
            const fullEnergyTime = new Date(usersEnergyObj.energyFullRecoveryDate);
            const now = new Date();
            const diffTime = now.getTime() - fullEnergyTime.getTime();

            console.log("diffTime", diffTime / 1000)

            let energyValue;
            if (diffTime >= 0) {
                energyValue = usersEnergyObj.energyCapacity[usersEnergyObj.currentLevel - 1];
            } else {
                const energyRestoredPerSecond = usersEnergyObj.energyRecovery[usersEnergyObj.currentLevel - 1];
                const timeSinceLastUpdate = Math.abs(diffTime);
                const secondsSinceLastUpdate = Math.floor(timeSinceLastUpdate / 1000); // количество секунд с последнего обновления
                const energyNotRestored = secondsSinceLastUpdate * energyRestoredPerSecond; // всего восстановленной энергии
                energyValue = usersEnergyObj.energyCapacity[usersEnergyObj.currentLevel - 1] - energyNotRestored;
            }
            usersEnergyObj.value = energyValue;

            console.log(usersEnergyObj)
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
    const handleAxeUpgrade = async () => {
        try {
            if (score < axe?.price[axe?.currentLevel - 1]) {
                setIsPurchaseError(prevState => ({ ...prevState, axe: true }));
                setTimeout(() => {
                    setIsPurchaseError(prevState => ({ ...prevState, axe: false }));
                }, 500);
                return;
            }
            const response = await updateAxe(userId);
            console.log(response)
            //setAxe(storeTemplateData.storeItems.find(item => item.name === 'Axe'));
            updateAxeStore('currentLevel', response.user.axe.currentLevel);
        } catch (error) {
            console.error(error);
        }
    };

    const handleHammerUpgrade = async () => {
        try {
            if(score < hammer?.price[hammer?.currentLevel - 1]) {
                setIsPurchaseError(prevState => ({ ...prevState, hammer: true }));
                setTimeout(() => {
                    setIsPurchaseError(prevState => ({ ...prevState, hammer: false }));
                }, 700);
                return;
            }
            const response = await updateHummer(userId);
            setHammer(response.user.hammer);
            setScore(response.user.score);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBarrelUpgrade = async () => {
        try {
            if (score < barrel.price[barrel?.currentLevel - 1]) {
                setIsPurchaseError(prevState => ({ ...prevState, barrel: true }));
                setTimeout(() => {
                    setIsPurchaseError(prevState => ({ ...prevState, barrel: false }));
                }, 700);
                return;
            }
            const response = await updateBarrel(userId);
            setBarrel(response.user.barrel);
            setScore(response.user.score);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEnergyBottleUpgrade = async () => {
        try {
            if (score < energy?.price[energy?.currentLevel - 1]) {
                setIsPurchaseError(prevState => ({ ...prevState, energyBottle: true }));
                setTimeout(() => {
                    setIsPurchaseError(prevState => ({ ...prevState, energyBottle: false }));
                }, 700);
                return;
            }
            const response = await updateEnergyBottle(userId);
            setEnergy(response.user.energy);
            setScore(response.user.score);
        } catch (error) {
            console.error(error);
        }
    };



    const getClassName = (rarity) => {
        switch (rarity) {
            case 'Rare':
                return 'rare';
            case 'Epic':
                return 'epic';
            case 'Mythical':
                return 'mythical';
            case 'Legendary':
                return 'legendary';
            default:
                return 'common';
        }
    };


    return (
        <div className="store-screen">
            <div className="store-container">
                <div className={'products-store-block'}>
                    <div className={'headerStoreBlock'}>
                        <div className="header-container">
                            <Link to={'/profile'} className={'headerLightLink'}>
                                <img src={helmet} alt={"logo"}/>
                            </Link>
                            <div className={'headerScoreBlock'}>
                                <div className={'headerScoreText'}>
                                    <h2>{score}</h2>
                                    {/*<p>{(userData.score * 0.00008 * 1.5).toFixed(2)} $</p>*/}
                                </div>
                                <img src={scoreCoin}></img>
                            </div>
                            <div className={'headerLink'} onClick={handleModalToggle}>
                                <img src={torch} alt={"logo"}/>
                            </div>
                        </div>
                    </div>
                    {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
                    <div className="products-scroll-block">

                        {eggs && eggs.length > 0 && isEggOpen && (
                            <div className={'store-product-item transformation-circle'}>
                                <div className={'store-product-item-info'}>
                                    <div className={'store-product-item-info-block'}>
                                        <div>
                                            <b className={'store-product-item-info-title'}>Alchemist</b>
                                            <p className={'store-product-item-description'}>Alchemist makes it possible
                                                to
                                                improve the rarity of an egg, increasing the chances of getting into a
                                                rarer
                                                WL</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={'store-product-item-upgrade-block'}>
                                    <div>
                                    </div>
                                    <Link to={'/alchemist'} className={'upgrade-alchemist-btn'}>
                                        <p>Open</p>
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div className={'store-product-item'}>
                            <div className={'store-product-item-info'}>
                                <div className={'store-product-item-info-block'}>
                                    <div>
                                        <b className={'store-product-item-info-title'}>{barrel?.name}</b>
                                        <p className={'store-product-item-description'}>{barrel?.description}</p>
                                    </div>
                                    <img className={'store-product-item-img'}
                                         src={barrel.images[barrel?.currentLevel - 1]}
                                         alt={'barrel'}/>
                                </div>

                            </div>
                            <div className={'store-product-item-upgrade-block'}>
                                <div>
                                    <div>
                                        <div>
                                            {barrel?.currentLevel === 8 ? (
                                                <div>
                                                Income: <b>{barrel.income[barrel?.currentLevel - 1]}</b>
                                            </div>
                                        ) : (
                                                <div>
                                                    Income:  <b>{barrel.income[barrel?.currentLevel - 1]}</b> {'⇾ '}
                                                    <b>{barrel.income[barrel?.currentLevel]}</b>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            {barrel?.currentLevel === 8 ? (
                                                <div>
                                                    Time: <b>{barrel?.waitingTime[barrel?.currentLevel - 1]}h</b>
                                                </div>
                                                ) : (
                                                <div>
                                                    Time:  <b>{barrel?.waitingTime[barrel?.currentLevel - 1]}h</b> {'⇾ '}
                                                    <b>{barrel?.waitingTime[barrel?.currentLevel]}h</b>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={'upgrade-btn' + (isPurchaseError.barrel ? ' error' : '')} onClick={handleBarrelUpgrade}>
                                    {barrel?.currentLevel === 8 ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className={'store-product-upgrade-nums'}>
                                            <p>{barrel.price[barrel?.currentLevel - 1]}</p>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={'store-product-item'}>
                        <div className={'store-product-item-info'}>
                                <div className={'store-product-item-info-block'}>
                                    <div>
                                        <b className={'store-product-item-info-title'}>{hammer?.name}</b>
                                        <p className={'store-product-item-description'}>{hammer?.description}</p>
                                    </div>
                                    <img className={'store-product-item-img'}
                                         src={hammer?.images[hammer?.currentLevel - 1]}
                                         alt={'hammer'}/>
                                </div>
                            </div>
                            <div className={'store-product-item-upgrade-block'}>
                                <div>
                                    <div>
                                        <div>
                                            {hammer?.currentLevel === 8 ? (
                                                <div>
                                                    Income: <b>{hammer?.income[hammer?.currentLevel - 1]}</b>
                                                </div>
                                            ) : (
                                                <div>
                                                    Income: <b>{hammer?.income[hammer?.currentLevel - 1]}</b> {'⇾ '}
                                                    <b>{hammer?.income[hammer?.currentLevel]}</b>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            {hammer?.currentLevel === 8 ? (
                                                <div>
                                                    Damage: <b>{hammer?.strength[hammer?.currentLevel - 1]}</b>
                                                </div>
                                            ) : (
                                                <div>
                                                    Damage: <b>{hammer?.strength[hammer?.currentLevel - 1]}</b> {'⇾ '}
                                                    <b>{hammer?.strength[hammer?.currentLevel]}</b>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={'upgrade-btn' + (isPurchaseError.hammer ? ' error' : '')} onClick={handleHammerUpgrade}>
                                    {hammer?.currentLevel === 8 ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className={'store-product-upgrade-nums'}>
                                            <p>{hammer?.price[hammer?.currentLevel - 1]}</p>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className={'store-product-item'}>
                            <div className={'store-product-item-info'}>
                                <div className={'store-product-item-info-block'}>
                                    <div>
                                        <b className={'store-product-item-info-title'}>{energy?.name}</b>
                                        <p className={'store-product-item-description'}>{energy?.description}</p>
                                    </div>
                                    <img className={'store-product-item-img'}
                                         src={energy?.images[energy?.currentLevel - 1]}
                                         alt={'energyBottle'}/>
                                </div>
                            </div>
                            <div className={'store-product-item-upgrade-block'}>
                                <div>
                                    <div>
                                        {energy?.currentLevel === 8 ? (
                                            <div>
                                                Limit: <b>{energy?.energyCapacity[energy?.currentLevel - 1]}</b>
                                            </div>
                                        ) : (
                                            <div>
                                                Limit: <b>{energy?.energyCapacity[energy?.currentLevel - 1]}</b> {'⇾ '}
                                                <b>{energy?.energyCapacity[energy?.currentLevel]}</b>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {energy?.currentLevel === 8 ? (

                                            <div>
                                                Recovery: <b>{energy?.energyRecovery[energy?.currentLevel - 1]}</b>
                                            </div>
                                        ) : (
                                            <div>
                                                Recovery: <b>{energy?.energyRecovery[energy?.currentLevel - 1]}</b> {'⇾ '}
                                                <b>{energy?.energyRecovery[energy?.currentLevel]}</b>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={'upgrade-btn' + (isPurchaseError.energyBottle ? ' error' : '')} onClick={handleEnergyBottleUpgrade}>
                                    {energy?.currentLevel === 8 ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className={'store-product-upgrade-nums'}>
                                            <p>{energy?.price[energy?.currentLevel - 1]}</p>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className={'store-product-item'}>
                            <div className={'store-product-item-info'}>
                                <div className={'store-product-item-info-block'}>
                                    <div>
                                        <b className={'store-product-item-info-title'}>{axe?.name}</b>
                                        <p className={'store-product-item-description'}>{axe?.description}</p>
                                    </div>
                                    <img className={'store-product-item-img'}
                                         src={axe?.images[axe?.currentLevel - 1]}
                                         alt={'axe'}/>
                                </div>
                            </div>
                            <div className={'store-product-item-upgrade-block'}>
                                <div>
                                    <div>
                                        {axe?.currentLevel === 8 ? (

                                            <div>
                                                Damage: <b>{axe?.damageMultiplier[axe?.currentLevel - 1]}x</b>
                                            </div>
                                        ) : (
                                            <div>
                                                Damage: <b>{axe?.damageMultiplier[axe?.currentLevel - 1]}x</b> {'⇾ '}
                                                <b>{axe?.damageMultiplier[axe?.currentLevel]}x</b>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {axe?.currentLevel === 8 ? (
                                            <div>
                                                Duration: <b>{axe?.timeOfUse[axe?.currentLevel - 1]}s</b>
                                            </div>
                                        ) : (
                                            <div>
                                                Duration: <b>{axe?.timeOfUse[axe?.currentLevel - 1]}s</b> {'⇾ '}
                                                <b>{axe?.timeOfUse[axe?.currentLevel]}s</b>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={'upgrade-btn' + (isPurchaseError.axe ? ' error' : '')} onClick={handleAxeUpgrade}>
                                    {axe?.currentLevel === 8 ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className={'store-product-upgrade-nums'}>
                                            <p>{axe?.price[axe?.currentLevel - 1]}</p>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <NavBar/>
            </div>
            {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
        </div>
    );
}

export default StoreScreen;