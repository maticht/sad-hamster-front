import React, {useEffect, useState} from 'react';
import ComingSoon from '../../../img/ComingSoonModalImg.png'
import './AlchemicalDetailsModal.css';
import {collectDailyReward, getUserData, updateScore, checkDailyRewards} from "../../../httpRequests/dragonEggApi";
import {useTelegram} from "../../../hooks/useTelegram";
import scoreCoin from "../../../img/icons/scoreCoin.png";

const AlchemicalDetailsModal = ({ onClose }) => {
    const [userData, setUserData] = useState({});

    const {user} = useTelegram();
    const userId = user?.id || '777217409';
    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    const rarities = [
        { rarityName: 'Legendary', chance:'Guaranteed' },
        { rarityName: 'Mythical', chance:'High' },
        { rarityName: 'Epic', chance:'Average' },
        { rarityName: 'Rare', chance:'Minimal' },
        { rarityName: 'Common', chance:'Almost impossible' },
    ];

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
        <div className="newEggModalBackground">
            <div className="dailyRewardContainer">
                <div className="dailyRewardContent">
                    {userData && (
                        <div>
                            <p className="alchemicalChanceTitle">Alchemical conversion chances</p>
                            <p className="alchemicalChanceText">The chances of alchemical conversion are not great and require a decent investment, but perseverance pays off with luck</p>
                            <div>
                                {rarities?.map((rarity, index) => {
                                    return (
                                        <div key={index} className="alchemicalItem">
                                            <div className={'alchemicalChance'}>
                                                <b>WL chance:</b>
                                                <p className="rewardItemText">{rarity.chance}</p>
                                            </div>
                                            <div className={'alchemicalRarity'}>
                                                <p>Rarity:</p>
                                                <b className={`leagueName ${getClassName(rarity.rarityName)}`}>{rarity.rarityName}</b>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button className="dailyRewardContentButton" onClick={onClose}>OK</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlchemicalDetailsModal;