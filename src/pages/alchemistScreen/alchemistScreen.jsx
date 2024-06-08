import React, {useEffect, useState} from 'react';
import './alchemistScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import {alchemistUpgrade} from "../../httpRequests/dragonEggApi";
import lightningAnimation from "../../img/icons/XSNu.gif";
import storeTemplateData from '../../storeTemplateData/storeTemplateData.json'
import ComingSoonModal from "../../components/modals/ComingSoonModal/ComingSoonModal";
import NewEggRarity from '../../components/modals/newEggRarity/newEggRarity';
import AlchemicalDetailsModal from '../../components/modals/AlchemicalDetailsModal/AlchemicalDetailsModal';
import scoreCoin from "../../img/icons/scoreCoin.png";
import {Link} from "react-router-dom";
import helmet from "../../img/icons/profile.png";
import torch from "../../img/icons/torch.png";
import info from "../../img/icons/info.png";
import useStore from "../../store/zustand.store/store";

export const AlchemistScreen = () => {
    //const [userData, setUserData] = useState({});
    const {tg, queryId, user} = useTelegram();
    const userId = user?.id || '777217409';
    const [showModal, setShowModal] = useState(false);
    const [showAlchemicalModal, setShowAlchemicalModal] = useState(false);
    const [newEggRarityModal, setNewEggRarityModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showLightning, setShowLightning] = useState(false);
    const [isPurchaseError, setIsPurchaseError] = useState(false);

    //STORE
    const setScore = useStore((state) => state.setScore);
    const setMainEggImage = useStore((state) => state.setMainEggImage);
    const setEggRarity = useStore((state) => state.setEggRarity);

    const {
        score,
        mainEggImage,
        eggRarity,
    } =
        useStore((state) => ({
            score: state.score,
            mainEggImage: state.mainEggImage,
            eggRarity: state.eggRarity,
        }));

    const handleAlchemistUpgrade = async () => {
        try {
            if (score < 2000) {
                setIsPurchaseError(true);
                setTimeout(() => {
                    setIsPurchaseError(false);
                }, 500);
                return;
            }
            setIsAnimating(true);
            setShowLightning(true);

            setTimeout(() => {
                setShowLightning(false);
            }, 1400);

            setTimeout(async () => {
                const response = await alchemistUpgrade(userId);
                setEggRarity(response.user.eggs[0].rarity);
                setScore(response.user.score);
                setIsAnimating(false);
                handleNewEggRarity();
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNewEggRarity = () => {
        setNewEggRarityModal(!newEggRarityModal);
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };
    const handleAlchemicalToggle = () => {
        setShowAlchemicalModal(!showAlchemicalModal);
    };
    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            if(!score){
                setScore(user.score);
            }
            if(!eggRarity){
                setEggRarity(user.eggs[0].rarity);
            }
            if(!mainEggImage){
                setMainEggImage(user.eggs[0].images.model1[0])
            }
        };
        console.log(user)

        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);

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
        <div className="alchemist-screen">
            <div className="alchemist-container">
                <div className={'products-store-block'}>
                    <div className={'headerAlchemistBlock'}>
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
                    <div className={'alchemist-info-block'}>
                        <div className={'alchemist-info-text'}>
                            <b>Alchemist's Luck</b>
                            <p>Alchemical conversion chances details</p>
                        </div>
                        <div className={'alchemist-info-btn'} onClick={handleAlchemicalToggle}>
                            <img src={info}></img>
                        </div>
                    </div>
                    <div className={'alchemistEggBlock' + (isAnimating ? ' animating' : '')}>
                            <img
                                src={mainEggImage}
                                alt={'egg'}
                            />
                        {showLightning &&
                            <img src={lightningAnimation} alt="lightning" className="lightningAnimation"/>}
                    </div>
                    {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
                    {newEggRarityModal && <NewEggRarity onClose={handleNewEggRarity}/>}
                    {showAlchemicalModal && <AlchemicalDetailsModal onClose={handleAlchemicalToggle}/>}
                    <div className={'alchemist-product-item-footer'}>
                        <div className={'store-product-item-info'}>
                            <div className={'store-product-item-info-block'}>
                                <div>
                                    <b className={'store-product-item-info-title'}>Alchemist services</b>
                                </div>
                            </div>
                        </div>
                        <div className={'store-product-item-upgrade-block'}>
                            <div>
                                <p className={'store-product-upgrade-text'}>Upgrade egg rarity:</p>
                                <div>

                                        <div>
                                            <b className={`egg ${getClassName(eggRarity)}`}>{eggRarity}</b> {'⇾'}
                                            <b>???</b>
                                        </div>
                                </div>
                            </div>
                                <div
                                    className={`upgrade-btn${isPurchaseError ? ' error' : ''}${isAnimating || eggRarity === 'Legendary' ? ' disabled' : ''}`}
                                    onClick={!isAnimating || eggRarity !== 'Legendary' ? handleAlchemistUpgrade : null}
                                >
                                    {eggRarity === 'Legendary' ? (
                                        <p>MAX lvl</p>
                                    ) : (
                                        <div className="store-product-upgrade-nums">
                                            <p>2000</p>
                                            <img src={scoreCoin} alt="score coin"/>
                                        </div>
                                    )}

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

export default AlchemistScreen;