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
import bubble from '../../img/icons/bubble.png';
import sadHamsterImg from '../../img/icons/sadHamster.png'
import sadHamsterVideo from '../../img/icons/sticker.webm'
import {Link, useNavigate} from "react-router-dom";
import ClickEffect from "../../animations/ClickOnEggAnimation";
import ComingSoonModal from '../../components/modals/ComingSoonModal/ComingSoonModal';
import storeTemplateData from "../../storeTemplateData/storeTemplateData.json";
import EnergyBar from "../../components/EnergyBar";
import useStore from "../../store/zustand.store/store";


export const HomeScreen = () => {
    const [userData, setUserData] = useState({});
    const {user} = useTelegram();
    const userId = user?.id || '777217409';


    const [theme, setTheme] = useState('day');
    const [touchStartPositions, setTouchStartPositions] = useState({});
    const [clickEffects, setClickEffects] = useState([])

    const [dataLoaded, setDataLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [backgroundMusicIsPlaying, setBackgroundMusicIsPlaying] = useState();
    const [sadScore, setSadScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [showVideo, setShowVideo] = useState(false);
    const [audio] = useState(new Audio("https://res.cloudinary.com/dfl7i5tm2/video/upload/v1718217975/LITTLE_COWBOY_-_READY_TO_GO_ORIGINAL_VERSION_mp3cut.net_nxkkxn.mp3"));

    const [countdown, setCountdown] = useState(null);

    const [newEggModal, setNewEggModal] = useState(false);
    const [dailyRewardModal, setDailyRewardModal] = useState(false);
    const [collectReward, setCollectReward] = useState(false);
    const [clickCounter, setClickCounter] = useState(0);

    const [axeButtonActive, setAxeButtonActive] = useState(false);

    const [unclaimedReward, setUnclaimedReward] = useState();
    const [unclaimedRewardModal, setUnclaimedRewardModal] = useState(false);


    const navigate = useNavigate();

    //STORE
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);
    const setEnergy = useStore((state) => state.setEnergy);
    const updateEnergy = useStore((state) => state.updateEnergy);
    const setEggScore = useStore((state) => state.setEggScore);
    const setEggImage = useStore((state) => state.setEggImage);
    const setIsEggOpen = useStore((state) => state.setIsEggOpen);
    const setBlockType = useStore((state) => state.setBlockType);
    const setAxe = useStore((state) => state.setAxe);
    const updateAxeStore = useStore((state)=> state.updateAxeStore);
    const setBarrel = useStore((state) => state.setBarrel);
    const setBarrelProgress = useStore((state) => state.setBarrelProgress);
    const updateBarrelStore = useStore((state) => state.updateBarrelStore);
    const setHammer = useStore((state) => state.setHammer);

    const {score, overallScore, eggScore, eggImage, isEggOpen, blockType, energy, barrel, barrelProgress, hammer, axe} =
        useStore((state) => ({
            score: state.score,
            overallScore: state.overallScore,
            eggScore: state.eggScore,
            eggImage: state.eggImage,
            isEggOpen: state.isEggOpen,
            blockType: state.blockType,
            energy: state.energy,
            barrel: state.barrel,
            barrelProgress: state.barrelProgress,
            hammer: state.hammer,
            axe: state.axe
        }));

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleNewEggModalToggle = () => {
        setNewEggModal(!newEggModal);
    };


    useEffect(() => {
        if (userData && userData?.dailyReward) {
            const hasEligibleReward = userData?.dailyReward.some(reward =>
                !reward.isRewardTaken && new Date(reward.dateOfAward) <= new Date()
            );
            if (hasEligibleReward) {
                setDailyRewardModal(true);
            }
        }
    }, [userData]);

    useEffect(() => {
        const timer = setInterval(() => {
            setClickCounter(prevCounter => {
                if (prevCounter > 0 && prevCounter < 100) {
                    return prevCounter - 2;
                }
                return prevCounter;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

        setSadScore(prevSadScore => {
            const newSadScore = prevSadScore + 1;
            if (newSadScore % 50 === 0) {
                setLevel(prevLevel => prevLevel + 1);
                setShowVideo(true);
                audio.play();
                setTimeout(() => {
                    setShowVideo(false);
                    audio.pause();
                    audio.currentTime = 0;
                }, 8000);
            }
            return newSadScore;
        });

        // Получаем идентификаторы отпущенных касаний
        for (let i = 0; i < touches.length; i++) {
            endedTouches.push(touches[i].identifier);
        }

        let scoreToAdd = userData?.hammer?.currentLevel;
        let axeScoreToAdd = userData?.hammer?.currentLevel;
        if (axeButtonActive) {
            axeScoreToAdd *= axe?.damageMultiplier[axe?.currentLevel - 1];
        }


        const clickThreshold = 10; // Пороговое значение для определения "примерно одинаковых" координат
        const newClickEffects = [];
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const startPosition = touchStartPositions[touch.identifier];
            const distance = Math.sqrt((touch.clientX - startPosition.x) ** 2 + (touch.clientY - startPosition.y) ** 2);
            if (distance <= clickThreshold) {
                if (!isEggOpen) {
                    if (energy.value >= 1) {
                        setEggScore(eggScore + 1);
                        handleDecreaseEnergy(1);
                        setScore(score + scoreToAdd);
                        setOverallScore(overallScore + scoreToAdd)
                    } else {
                        return;
                    }
                } else {
                    if (energy.value >= scoreToAdd) {
                        setEggScore(eggScore + axeScoreToAdd);
                        handleDecreaseEnergy(scoreToAdd);
                        setScore(score + axeScoreToAdd);
                        setOverallScore(overallScore + scoreToAdd)
                    } else {
                        return;
                    }
                }
                // Добавляем эффект клика только если расстояние между начальными и конечными координатами меньше порога
                newClickEffects.push(
                    <ClickEffect
                        key={Date.now()}
                        x={touch.clientX}
                        y={touch.clientY - 50}
                        hammerLevel={axeButtonActive ? userData?.hammer.currentLevel * axe?.damageMultiplier[axe?.currentLevel - 1] : userData?.hammer.currentLevel}
                        color={axeButtonActive}
                    />
                );
            }
        }
        // if ('vibrate' in navigator) {
        //     navigator.vibrate(50);
        // }

        if (!axeButtonActive && clickCounter <= 104) {
            setClickCounter(prevCounter => prevCounter + 1);
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
            if(!barrel.name){
                setBarrel(user.barrel);
            }
            if(!barrel.collectionTime){
                updateBarrelStore('collectionTime', user.barrel.collectionTime)
            }
            //setBarrelCollectionTime(user.barrel.collectionTime);
            if(!barrel.lastEntrance){
                updateBarrelStore('lastEntrance', user.barrel.lastEntrance)
            }
            if(!hammer.name){
                setHammer(user.hammer);
            }
            if(!axe.currentLevel){
                setAxe(storeTemplateData.storeItems.find(item => item.name === 'Axe'));
                updateAxeStore('currentLevel', user.axe.currentLevel);
            }
            //setBarrelLastEntrance(user.barrel.lastEntrance)
            setUnclaimedReward(user.weeklyRewards.find(reward => !reward.isTaken && !reward.isCanceled));
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
            if (!eggScore) {
                setEggScore(user.eggs[0].score);
            }
            if (!blockType) {
                // if (user.eggs[0].score >= 88) {
                //     handleSetBlockType('overlay');
                // } else {
                //     handleSetBlockType('space');
                // }
            }
            if (isEggOpen === "") {
                setIsEggOpen(user.eggs[0]?.isOpen);
            }
            setDataLoaded(true);
            setCollectReward(false);
        };

        if (userId) {
            fetchUserDataAndDisplay();
        }

    }, [userId, collectReward]);


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


    const handleSetBlockType = useMemo(() => {
        return (type) => {
            setBlockType(type);
        };
    }, []);


    return (
        <div className="App">
            <div className="counter-container">
                <header className="header-main-container">
                    <div className={'headerHomeBlock'}>
                        <div className="header-container">
                            <div className='headerScoreBlock'>
                                <div className='headerScoreText'>
                                    <img src={scoreCoin} alt="scoreCoin"/>
                                    <p>{sadScore}</p>
                                </div>
                            </div>
                            <p className='lvlText'>lvl {level}</p>
                            <div className="lvl-progress-container">
                                <div className='lvl-progress-bar'>
                                    <div className='lvl-progress-line' style={{width: `${(sadScore % 50) * 2}%`}}></div>
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
                        {showVideo ? (
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

