import React, {useState, useEffect, useMemo, useCallback} from 'react';
import './mainScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {
    getUserData,
    updateEnergyDate,
    updateScore
} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import scoreCoin from "../../img/icons/sadCoin.png";
import bubbleHamster from '../../img/icons/sadbubble.png'
import bubble from '../../img/icons/bubble.png';
import sadHamsterImg from '../../img/icons/sadHamster.png'
import sadHamsterVideo from '../../img/icons/sticker.webm'
import {Link, useNavigate} from "react-router-dom";
import ClickEffect from "../../animations/ClickOnEggAnimation";
import ComingSoonModal from '../../components/modals/ComingSoonModal/ComingSoonModal';
import storeTemplateData from "../../storeTemplateData/storeTemplateData.json";
import EnergyBar from "../../components/EnergyBar";
import useStore from "../../store/zustand.store/store";

const balance = require("../../storeTemplateData/balanceData.json");



export const HomeScreen = () => {

    //STORE
    const setScore = useStore((state) => state.setScore);
    const setDamage = useStore((state) => state.setDamage);
    const setOverallScore = useStore((state) => state.setOverallScore);
    const setEnergy = useStore((state) => state.setEnergy);
    const updateEnergy = useStore((state) => state.updateEnergy);


    const {score, overallScore, energy, damage} =
        useStore((state) => ({
            score: state.score,
            overallScore: state.overallScore,
            energy: state.energy,
            damage: state.damage,
        }));

    const [userData, setUserData] = useState({});
    const {user} = useTelegram();
    const userId = user?.id || '777217409';

    const [touchStartPositions, setTouchStartPositions] = useState({});
    const [clickEffects, setClickEffects] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [backgroundMusicIsPlaying, setBackgroundMusicIsPlaying] = useState();
    const [showVideo, setShowVideo] = useState(false);
    const [audio] = useState(new Audio("https://res.cloudinary.com/dfl7i5tm2/video/upload/v1718217975/LITTLE_COWBOY_-_READY_TO_GO_ORIGINAL_VERSION_mp3cut.net_nxkkxn.mp3"));


    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleMultiTouchStart = (event) => {
        const touches = event.touches;
        const positions = {};
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            positions[touch.identifier] = {x: touch.clientX, y: touch.clientY};
        }
        setTouchStartPositions(positions);
    };

    const getLevel = (overallScore) => {
        console.log(overallScore)
        const levels = balance.levels;
        let currentLevel = 1;
        for (let i = 0; i < levels.length; i++) {
            if (overallScore < levels[i]) {
                break;
            }
            currentLevel = i + 1;
        }
        return currentLevel;
    };

    const [level, setLevel] = useState(() => getLevel(overallScore));

    useEffect(() => {
        const newLevel = getLevel(overallScore);
        if (newLevel > level && overallScore > 0) {
            console.log(level)
            setShowVideo(true);
            audio.play();
            setTimeout(() => {
                setShowVideo(false);
                audio.pause();
                audio.currentTime = 0;
            }, 8000);
            setLevel(newLevel);
        }
    }, [overallScore,]);

    const getProgressPercentage = (overallScore) => {
        const levels = balance.levels;
        if (level === levels.length) {
            return 100;
        }
        const currentLevelScore = levels[level - 1];
        const nextLevelScore = levels[level];
        const progress = ((overallScore - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    };

    const progressPercentage = getProgressPercentage(overallScore);

    const handleMultiTouchEnd = (event) => {
        const touches = Array.from(event.changedTouches);
        console.log(touches)
        const endedTouches = [];


        // Получаем идентификаторы отпущенных касаний
        for (let i = 0; i < touches.length; i++) {
            endedTouches.push(touches[i].identifier);
        }

        let scoreToAdd = damage;
        let axeScoreToAdd = damage;


        const clickThreshold = 10; // Пороговое значение для определения "примерно одинаковых" координат
        const newClickEffects = [];
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const startPosition = touchStartPositions[touch.identifier];
            const distance = Math.sqrt((touch.clientX - startPosition.x) ** 2 + (touch.clientY - startPosition.y) ** 2);
            if (distance <= clickThreshold) {
                if (energy.value >= scoreToAdd) {
                    handleDecreaseEnergy(scoreToAdd);
                    const newScore = score + axeScoreToAdd;
                    setScore(newScore);
                    setOverallScore(overallScore + scoreToAdd)
                } else {
                    return;
                }
                // Добавляем эффект клика только если расстояние между начальными и конечными координатами меньше порога
                newClickEffects.push(
                    <ClickEffect
                        key={Date.now()}
                        x={touch.clientX}
                        y={touch.clientY - 50}
                        damage={damage}
                    />
                );
            }
        }

        setClickEffects(prevClickEffects => [...prevClickEffects, ...newClickEffects]);
    };


    const fetchUserData = useCallback(async () => {
        try {
            const response = await getUserData(userId);
            return response.user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [userId]);


    useEffect(() => {

        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            setUserData(user);

            if(!damage){
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

            if (!score) {
                setScore(user.scores.score);
            }
            if (!overallScore) {
                setOverallScore(user.scores.overallScore);
            }
            setDataLoaded(true);
        };

        if (userId) {
            fetchUserDataAndDisplay();
        }

    }, [userId]);


    const sendScoreToServer = async () => {
        try {
            await updateScore({userId, score, overallScore}).then((data) => {
                console.log(data)
            });
        } catch (error) {
            console.error('Ошибка при отправке данных о кликах на сервер:', error);
        }
    };

    //ЭНЕРГИЯ
    useEffect(() => {
        if (energy) {
            const interval = setInterval(() => {
                const currentEnergy = useStore.getState().energy;
                const energyCapacityData = balance.energy.energyCapacity;
                const energyRecoveryData = balance.energy.energyRecovery;
                let currentRecoveryLevel = currentEnergy.energyRecoveryLevel;
                let currentCapacityLevel = currentEnergy.energyCapacityLevel;
                const newEnergyValue = Math.min(currentEnergy.value + energyRecoveryData.recovery[currentRecoveryLevel - 1], energyCapacityData.capacity[currentCapacityLevel - 1]);
                useStore.getState().updateEnergy('value', newEnergyValue);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [userData]);

    const handleDecreaseEnergy = (amount) => {
        const newEnergyValue = Math.max(energy.value - amount, 0);
        updateEnergy('value', newEnergyValue);
    };

    const sendEnergyToServer = async () => {
        try {
            if (energy) {
                const currentEnergy = useStore.getState().energy;
                const energyCapacityData = balance.energy.energyCapacity;
                const energyRecoveryData = balance.energy.energyRecovery;
                let currentRecoveryLevel = currentEnergy.energyRecoveryLevel;
                let currentCapacityLevel = currentEnergy.energyCapacityLevel;

                const timeToRestoreEnergy = 1000; // восстановления энергии в сек
                const energyToRestore = energyCapacityData.capacity[currentCapacityLevel - 1] - currentEnergy.value; // сколько не хватает энергии
                const energyRestoredPerSecond = energyRecoveryData.recovery[currentRecoveryLevel - 1];
                const totalTimeToRestore = timeToRestoreEnergy * (energyToRestore / energyRestoredPerSecond)//делим на уровень восстановления энергии;

                const currentTime = new Date();

                const energyRestoreTime = new Date(currentTime.getTime() + totalTimeToRestore);
                await updateEnergyDate({userId, energyRestoreTime, value: energy.value}).then((data) => {
                });
            }
        } catch (error) {
            console.error('Ошибка при отправке данных о кликах на сервер:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (dataLoaded) {
                sendScoreToServer().then(data => {
                });
                sendEnergyToServer().then(data => {
                })
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [score]);


    return (
        <div className="App">
            <div className="counter-container">
                <header className="header-main-container">
                    <div className={'headerHomeBlock'}>
                        <div className="header-container">
                            <div className='headerScoreBlock'>
                                <div className='headerScoreText'>
                                    <img src={scoreCoin} alt="scoreCoin"/>
                                    <p>{score}</p>
                                </div>
                            </div>
                            <p className='lvlText'>lvl {level}</p>
                            <div className="lvl-progress-container">
                                <div className='lvl-progress-bar'>
                                    <div className='lvl-progress-line' style={{width: `${progressPercentage}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
                </header>
                <div className="clickable-area"
                     onTouchStart={handleMultiTouchStart}
                     onTouchEnd={handleMultiTouchEnd}
                     onTouchMove={(e) => e.preventDefault()}
                >
                </div>
                <div className="pedestal-container">
                    <button className="pedestal-overlay"
                            onTouchStart={handleMultiTouchStart}
                            onTouchEnd={handleMultiTouchEnd}
                            onTouchMove={(e) => e.preventDefault()}>
                        <img src={bubble} alt="bubbleHamster" className="bubbleImg"/>
                        {showVideo && overallScore > 0 ? (
                            <video src={sadHamsterVideo} autoPlay loop muted className="sadHamsterVid"/>
                        ) : (
                            <img src={sadHamsterImg} alt="sadHamster" className="sadHamsterImg"/>
                        )}
                    </button>

                    {clickEffects}
                </div>
                <EnergyBar userEnergy={energy}/>
                <NavBar/>
            </div>
        </div>
    );
}


export default HomeScreen;

