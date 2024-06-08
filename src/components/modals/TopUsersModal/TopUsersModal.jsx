import React, {useEffect, useState} from 'react';
import ComingSoon from '../../../img/ComingSoonModalImg.png'
import './TopUsersModal.css';
import {collectDailyReward, getUserData, updateScore, checkDailyRewards} from "../../../httpRequests/dragonEggApi";
import {useTelegram} from "../../../hooks/useTelegram";
import scoreCoin from "../../../img/icons/scoreCoin.png";
import weeklyRewardModal from "../WeeklyRewardModal/WeeklyRewardModal";
const moment = require('moment-timezone');


const TopUsersModal = ({ onClose, onCollectReward }) => {
    const [userData, setUserData] = useState({});
    const [countdown, setCountdown] = useState('');
    const [matichData, setMatichData] = useState({})

    const {user} = useTelegram();
    const userId = user?.id || '777217409';
    const fetchUserData = async () => {
        const response = await getUserData('777217409');
        return response.user;
    };
    const handleCollectTopReward = async () => {
        try {
            await onCollectReward();
            const response = await collectDailyReward(userId);
            setUserData(response.user);
        } catch (error) {
            console.error(error);
        }
    };


    const leagues = [
        { leagueName: 'Diamond', reward: 20000, topPlaces:'1-3' },
        { leagueName: 'Golden', reward: 12000, topPlaces:'4-10' },
        { leagueName: 'Silver', reward: 8000, topPlaces:'11-20' },
        { leagueName: 'Bronze', reward: 5000, topPlaces:'21-50' },
        { leagueName: 'Stone', reward: 3000, topPlaces:'51-100' },
    ];


    useEffect(() => {
        let intervalId;

        const fetchDataAndUpdateCountdown = async () => {
            try {
                const user = userData;


                if (user && user.weeklyRewards) {
                    // Функция для вычисления времени следующего реворда
                    const getNextRewardTime = (lastRewardTime) => {
                        // Парсим последнее время реворда
                        const lastRewardMoment = moment(lastRewardTime);

                        // Переводим в московское время
                        const moscowTime = lastRewardMoment.tz('Europe/Moscow');

                        // Добавляем 6 часов к последнему времени реворда
                        const nextRewardTime = moscowTime.add(6, 'hours');

                        // Форматируем время и возвращаем
                        return nextRewardTime.format('YYYY-MM-DD HH:mm:ss');
                    };

                    const lastRewardTime = user.weeklyRewards[user.weeklyRewards.length - 1].rewardIssuedDate;
                    const nextRewardTime = getNextRewardTime(lastRewardTime);

                    const updateCountdown = () => {
                        const nextRewardDay = new Date(nextRewardTime);
                        const difference = nextRewardDay.getTime() - Date.now();

                        if (difference > 0) {
                            const seconds = Math.floor((difference / 1000) % 60);
                            const minutes = Math.floor((difference / (1000 * 60)) % 60);
                            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                            setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
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
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataAndUpdateCountdown();


        return () => clearInterval(intervalId);
    }, [userData]);

    useEffect(()=>{
        const fetchData = async () => {
            const user = await fetchUserData();
            setUserData(user);
        };
        fetchData();
    },[]);

    const getClassName = (league) => {
        switch (league) {
            case 'Diamond':
                return 'diamond';
            case 'Golden':
                return 'golden';
            case 'Silver':
                return 'silver';
            case 'Bronze':
                return 'bronze';
            default:
                return 'stone';
        }
    };


    return (
        <div className="newEggModalBackground">
            <div className="dailyRewardContainer">
                <div className="dailyRewardContent">
                    {userData && (
                        <div>
                            <p className="dailyRewardTitle">Top users rewards</p>
                            <p className="dailyRewardText">Every week the top 100 users receive a reward in accordance with the league they are in</p>
                            <p className="dailyRewardText">Until next reward: <b>{countdown}</b></p>
                            <div>
                                {leagues?.map((league, index) => {

                                    return (
                                        <div key={index} className="rewardItem">
                                            <div>
                                                <b>{league.topPlaces}</b>
                                                <div className="rewardItemText">
                                                    <p>Reward: {league.reward}</p>
                                                    <img src={scoreCoin} alt="score coin"/>
                                                </div>
                                            </div>
                                            <div>
                                                <b className={`leagueName ${getClassName(league.leagueName)}`}>{league.leagueName}</b>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/*<div className={'your-top-place-text'}>*/}
                            {/*    You are in <b>{'17'}th</b> place, entering the <b>{'Silver'}</b> league, and your reward is <b>{8000}</b>*/}
                            {/*    <img src={scoreCoin} alt="score coin"/>*/}
                            {/*</div>*/}
                            <button className="dailyRewardContentButton" onClick={onClose}>OK</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopUsersModal;