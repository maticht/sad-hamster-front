import React, {useEffect, useState} from 'react';
import ComingSoon from '../../../img/ComingSoonModalImg.png'
import './DailyRewardModal.css';
import {collectDailyReward, getUserData, updateScore, checkDailyRewards} from "../../../httpRequests/dragonEggApi";
import {useTelegram} from "../../../hooks/useTelegram";
import scoreCoin from "../../../img/icons/scoreCoin.png";
import useStore from "../../../store/zustand.store/store";

const DailyRewardModal = ({ onClose, onCollectReward }) => {
    const [userData, setUserData] = useState({});
    const [countdown, setCountdown] = useState('');

    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);


    const {user} = useTelegram();
    const userId = user?.id || '777217409';
    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };
    const handleCollectFromInvitees = async () => {
        try {
            await onCollectReward();
            const response = await collectDailyReward(userId);
            setScore(response.user.score);
            setOverallScore(response.user.overallScore);
            setUserData(response.user);

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            setUserData(user);
        };

        const checkAndResetDailyRewards = async () => {
            try {
                await checkDailyRewards(userId);
                const user = await fetchUserData();
                setUserData(user);
            } catch (error) {
                console.error(error);
            }
        };

        if (userId) {
            fetchUserDataAndDisplay();
            checkAndResetDailyRewards();
        }
    }, [userId]);

    const rewards = [
        { day: 'Day 1', reward: 500 },
        { day: 'Day 2', reward: 1000 },
        { day: 'Day 3', reward: 1500 },
        { day: 'Day 4', reward: 2000 },
        { day: 'Day 5', reward: 2500 },
        { day: 'Day 6', reward: 3000 },
        { day: 'Day 7', reward: 3500 },
    ];


    useEffect(() => {
        let intervalId;

        if (userData && userData.dailyReward) {
            const getNextRewardDay = () => {
                return userData.dailyReward ? userData.dailyReward.findIndex(reward => !reward.isRewardTaken) : -1;
            };

            const updateCountdown = () => {
                const nextRewardDay = getNextRewardDay();

                if (nextRewardDay !== -1) {
                    const collectionTime = new Date(userData.dailyReward[nextRewardDay].dateOfAward);
                    const now = new Date();
                    const difference = collectionTime.getTime() - now.getTime();

                    if (difference > 0) {
                        const seconds = Math.floor((difference / 1000) % 60);
                        const minutes = Math.floor((difference / (1000 * 60)) % 60);
                        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                    } else {
                        setCountdown('00:00:00');
                        clearInterval(intervalId);
                    }
                } else {
                    setCountdown('00:00:00');
                    clearInterval(intervalId);
                }
            };

            updateCountdown();
            intervalId = setInterval(updateCountdown, 1000);
        } else {
            setCountdown('00:00:00');
        }

        return () => clearInterval(intervalId);
    }, [userData]);

    const getNextRewardDay = () => {
        return userData && userData.dailyReward ? userData.dailyReward.findIndex(reward => !reward.isRewardTaken) : -1;
    };

    const nextRewardDay = getNextRewardDay();

    return (
        <div className="newEggModalBackground">
            <div className="dailyRewardContainer">
                <div className="dailyRewardContent">
                    {userData && (
                        <div>
                            <p className="dailyRewardTitle">Daily rewards</p>
                            <p className="dailyRewardText">Visit the game every day and receive increasing rewards</p>
                            <p className="dailyRewardText">Until next reward: <b>{countdown}</b></p>
                            <div>
                                {userData.dailyReward?.map((reward, index) => {
                                    const isRewardTaken = reward.isRewardTaken;
                                    const isEligibleForCollect = !isRewardTaken && new Date(reward.dateOfAward) <= new Date();
                                    const isFirstReward = index === 0

                                    return (
                                        <div key={index} className="rewardItem">
                                            <div style={{ opacity: isRewardTaken ? 0.4 : 1 }}>
                                                <b>{rewards[index].day}</b>
                                                <div className="rewardItemText">
                                                    <p>Reward: {rewards[index].reward}</p>
                                                    <br/>
                                                    <img src={scoreCoin} alt="score coin" />
                                                </div>
                                            </div>
                                            {userData.dailyReward[0]?.isRewardTaken ||
                                            userData.dailyReward[0]?.dateOfAward === 0  ? (
                                                <button
                                                    className="rewardItemButton"
                                                    onClick={() => handleCollectFromInvitees(index)}
                                                    disabled={!isEligibleForCollect}
                                                    style={{opacity: isRewardTaken ? 0.3 : (isEligibleForCollect ? 1 : 0.3)}}
                                                >
                                                    Collect
                                                </button>
                                            ) : (
                                                <button
                                                    className="rewardItemButton"
                                                    onClick={() => handleCollectFromInvitees(index)}
                                                    disabled={!isEligibleForCollect}
                                                    style={{opacity: isFirstReward ? 1 : 0.3}}
                                                >
                                                    Collect
                                                </button>
                                            )}
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

export default DailyRewardModal;