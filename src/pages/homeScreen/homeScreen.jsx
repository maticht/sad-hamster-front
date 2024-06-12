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
import ClickEffect from "../../animations/ClickOnEggAnimation";
import ComingSoonModal from '../../components/modals/ComingSoonModal/ComingSoonModal';
import EnergyBar from "../../components/EnergyBar";
import useStore from "../../store/zustand.store/store";


export const HomeScreen = () => {
    const [userData, setUserData] = useState({});
    const {user} = useTelegram();
    const userId = user?.id || '777217409';

    const [touchStartPositions, setTouchStartPositions] = useState({});
    const [clickEffects, setClickEffects] = useState([])

    const [dataLoaded, setDataLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);


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

    const handleMultiTouchEnd = (event) => {
        const touches = Array.from(event.changedTouches); // Преобразуем TouchList в массив
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
                    setScore(score + axeScoreToAdd);
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
            setEnergy(usersEnergyObj);//TODO
            if (!score) {
                setScore(user.score);
            }
            if (!overallScore) {
                setOverallScore(user.overallScore);
            }
            setDataLoaded(true);
        };

        if (userId) {
            fetchUserDataAndDisplay();
        }

    }, [userId]);


    const sendScoreToServer = async () => {
        try {
            await updateScore({userId, score, eggScore, overallScore}).then((data) => {
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
                // Используем getState() для получения текущего значения энергии
                const currentEnergy = useStore.getState().energy;
                const newEnergyValue = Math.min(currentEnergy.value + currentEnergy.energyRecovery[currentEnergy.currentLevel - 1], currentEnergy.energyCapacity[currentEnergy.currentLevel - 1]);
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
                const timeToRestoreEnergy = 1000; // восстановления энергии в сек
                const energyToRestore = energy.energyCapacity[energy.currentLevel - 1] - energy.value; // сколько не хватает энергии
                const energyRestoredPerSecond = energy.energyRecovery[energy.currentLevel - 1];
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
                                         style={{width: `${(energy.value * 100) / energy.energyCapacity[energy.currentLevel - 1]}%`}}
                                    ></div>
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
                            onTouchMove={(e) => e.preventDefault()}
                    >
                        <img src={bubbleHamster} alt="bubbleHamster"/>
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

