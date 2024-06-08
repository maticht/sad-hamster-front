import React, {useState, useEffect, useMemo, useCallback} from 'react';
import './mainScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import background from "../../img/background/midleagebg.png"
import backgroundNight from "../../img/background/midleagebg_night.png"
import pedestal from "../../img/pedestal.png";
import pedestalNight from "../../img/pedestal_night.png"
import {
    collectWeeklyReward,
    getUserData,
    setEggFlag,
    updateEnergyDate,
    updateScore
} from "../../httpRequests/dragonEggApi";
import {barrelExpectation, collectionBarrel} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import Space from "../../components/space/space";
import helmet from "../../img/icons/profile.png";
import scoreCoin from "../../img/icons/scoreCoin.png";
import torch from "../../img/icons/torch.png";
import soundOn from "../../img/sound/soundOn.png"
import soundOff from "../../img/sound/soundOff.png"
import calendar from "../../img/icons/calendar.png"
import {Link, useNavigate} from "react-router-dom";
import ClickEffect from "../../animations/ClickOnEggAnimation";
import ComingSoonModal from '../../components/modals/ComingSoonModal/ComingSoonModal';
import NewEggModal from '../../components/modals/newEggModal/newEggModal';
import DailyRewardModal from '../../components/modals/DailyRewardModal/DailyRewardModal';
import storeTemplateData from "../../storeTemplateData/storeTemplateData.json";
import EnergyBar from "../../components/EnergyBar";
import WeeklyRewardModal from "../../components/modals/WeeklyRewardModal/WeeklyRewardModal";
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

    const [countdown, setCountdown] = useState(null);
    const expectedDate = new Date('1970-01-01T00:00:00.000+00:00');

    const [newEggModal, setNewEggModal] = useState(false);
    const [dailyRewardModal, setDailyRewardModal] = useState(false);
    const [collectReward, setCollectReward] = useState(false);
    const [clickCounter, setClickCounter] = useState(0);

    const [axeButtonActive, setAxeButtonActive] = useState(false);

    const [unclaimedReward, setUnclaimedReward] = useState();
    const [unclaimedRewardModal, setUnclaimedRewardModal] = useState(false);

    //const [blockType, setBlockType] = useState("");
    //const [score, setScore] = useState(0);
    //const [overallScore, setOverallScore] = useState(0);
    //const [eggScore, setEggScore] = useState(0);
    //const [isEggOpen, setIsEggOpen] = useState(false);
    //const [progress, setProgress] = useState(0);

    // const [eggImageUrl, setEggImageUrl] = useState('');
    //const [energy, setEnergy] = useState();
    //const [axeData, setAxeData] = useState(storeTemplateData.storeItems.find(item => item.name === 'Axe'));
    //const [axeDuration, setAxeDuration] = useState(axe?.timeOfUse[axe?.currentLevel - 1]);


    //const [barrelCollectionTime, setBarrelCollectionTime] = useState(0);
    //const [barrelLastEntrance, setBarrelLastEntrance] = useState(0);


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

    const handleWeeklyRewardModalToggle = async () => {
        setUnclaimedRewardModal(!unclaimedRewardModal);
        const response = await collectWeeklyReward({userId, rewardId: unclaimedReward.id}).then((data) => {
            if (data.success) {
                setScore(score + unclaimedReward.rewardValue);
                setOverallScore(overallScore + unclaimedReward.rewardValue)
            }
        });
        setUnclaimedReward(null);
    };

    const handleNewEggModalToggle = () => {
        setNewEggModal(!newEggModal);
    };
    const handleDailyRewardModalToggle = () => {
        setDailyRewardModal(!dailyRewardModal);
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

    useEffect(() => {
        let timer;
        if (axeButtonActive) {
            const axeDuration = axe?.timeOfUse[axe?.currentLevel - 1];
            timer = setInterval(() => {
                setClickCounter(prevCounter => {
                    const decrement = 100 / (axeDuration * 5);
                    if (prevCounter > 0) {
                        return prevCounter - decrement;
                    } else {
                        clearInterval(timer);
                        setAxeButtonActive(false);
                        return 0;
                    }
                });
            }, 200);

            return () => clearInterval(timer);
        }
    }, [axeButtonActive, axe?.timeOfUse]);


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


    const activateAxeButton = () => {
        setAxeButtonActive(true);
    };

    useEffect(() => {
        if (userData && userData.eggs && userData.eggs.length > 0) {
            const imageUrl = userData.eggs[0].stageScore.reduce((prevImageUrl, stageScore, index) => {
                if (eggScore >= stageScore) {
                    return userData.eggs[0].images.model1[index];
                }
                return prevImageUrl;
            }, userData.eggs[0].images.model1[0]);
            setEggImage(imageUrl);
            if (isEggOpen === "") {
                setIsEggOpen(userData.eggs[0]?.isOpen);
            }
        }
    }, [eggScore, userData]);

    const handleBarrelExpectation = async () => {
        try {
            const response = await barrelExpectation(userId);
            setUserData(response.user);
            updateBarrelStore('collectionTime', response.user.barrel.collectionTime);
            //setBarrelCollectionTime(response.user.barrel.collectionTime);
            updateBarrelStore('lastEntrance', response.user.barrel.lastEntrance)
            //setBarrelLastEntrance(response.user.barrel.lastEntrance)
            setScore(response.user.score);
            setOverallScore(response.user.overallScore);
            setEggScore(response.user.eggs[0].score);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCollectionBarrel = async () => {
        try {
            const response = await collectionBarrel(userId);
            if (response.success) {
                setBarrelProgress(0);
                //setBarrelCollectionTime(response.collectionTime);
                updateBarrelStore('collectionTime', response.collectionTime);
                //setBarrelLastEntrance(response.lastEntrance)
                updateBarrelStore('lastEntrance', response.lastEntrance)
                setScore(response.score);
                setOverallScore(response.overallScore);
            }
        } catch (error) {
            console.error(error);
        }
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

    const handleCollectReward = useCallback(async () => {
        try {
            const user = await fetchUserData();
            setUserData(user);
            console.log('333333333');
            setCollectReward(true)
        } catch (error) {
            console.error(error);
        }
    }, [fetchUserData]);

    useEffect(() => {
        if (unclaimedReward) {
            setUnclaimedRewardModal(true);
        }
    }, [unclaimedReward]);

    useEffect(() => {

        const audio = document.getElementById("backgroundMusic");

        if (audio.paused) {
            setBackgroundMusicIsPlaying(false);
        } else {
            setBackgroundMusicIsPlaying(true);
        }

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


    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 18 || currentHour < 6) {
            setTheme('day');
        } else {
            setTheme('day');
        }

    }, []);

    useEffect(() => {
        let intervalId;

        if (barrel.collectionTime) {
            const updateCountdown = () => {
                const collectionTime = new Date(barrel.collectionTime);
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
            };

            updateCountdown();
            intervalId = setInterval(updateCountdown, 1000);
        } else {
            setCountdown('00:00:00');
        }

        return () => clearInterval(intervalId);
    }, [barrel.collectionTime]);

    useEffect(() => {
        let intervalId;
        if (barrel.collectionTime && barrel.lastEntrance) {
            const collectionTime = new Date(barrel.collectionTime);
            const lastEntrance = new Date(barrel.lastEntrance);
            const now = new Date();
            const totalTime = collectionTime - lastEntrance;
            const elapsedTime = now - lastEntrance;
            const currentProgress = (elapsedTime / totalTime) * 100;
            setBarrelProgress(currentProgress);
            console.log((elapsedTime / totalTime) * 100);
            intervalId = setInterval(() => {
                const now = new Date();
                const elapsedTime = now - lastEntrance;
                const currentProgress = (elapsedTime / totalTime) * 100;
                setBarrelProgress(currentProgress);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [userData, barrel.collectionTime]);

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

    const toggleMusic = () => {
        const audio = document.getElementById("backgroundMusic");
        if (backgroundMusicIsPlaying) {
            setBackgroundMusicIsPlaying(false);
            if (audio) {
                audio.pause()
            }
        } else if (!backgroundMusicIsPlaying) {
            setBackgroundMusicIsPlaying(true);
            if (audio) {
                audio.play()
            }
        }
    }

    const handleSetBlockType = useMemo(() => {
        return (type) => {
            setBlockType(type);
        };
    }, []);


    useEffect(() => {
        if (userData && userData?.narrativeScenes) {
            if (eggScore) {
                if (eggScore >= 88) {
                    console.log(userData)
                    if (!userData?.narrativeScenes?.gettingEgg) {
                        sendScoreToServer().then(data => {
                        });
                        sendEnergyToServer().then(data => {
                        });
                        navigate('/gettingEggScene');
                    }
                    handleSetBlockType('overlay');
                    console.log("Счет достиг 88!");
                } else {
                    if (blockType !== "space" && blockType !== "") {
                        handleSetBlockType('space');
                    }
                }
            }
        }
    }, [userData, eggScore, handleSetBlockType]);

    useEffect(() => {
        if (userData) {
            if (eggScore === 88) {
                if (userData.eggs && userData.eggs[0].isModalShown === false) {
                    handleNewEggModalToggle();
                }
            }
        }
    }, [eggScore, userData]);

    return (
        <div className="App"
             style={{backgroundImage: theme === 'day' ? `url(${background})` : `url(${backgroundNight})`}}>
            {/*{eggScore >= 88 && showOverlay && (*/}
            {/*    <div className={`white-overlay`}>*/}
            {/*        <img src={smokeAnimation} alt="Smoke Animation"/>*/}
            {/*    </div>*/}
            {/*)}*/}
            <div className="counter-container">
                <header className="header-main-container">
                    <div className={'headerHomeBlock'}>
                        <div className="header-container">
                            <Link to={'/profile'} className={'headerLightLink'}>
                                <img src={helmet} alt={"logo"}/>
                            </Link>
                            <div className={'headerScoreBlock'}>
                                <div className={'headerScoreText'}>
                                    <h2>{score}</h2>
                                </div>
                                <img src={scoreCoin}></img>
                            </div>
                            <div className={'headerLink'} onClick={handleModalToggle}>
                                <img src={torch} alt={"logo"}/>
                            </div>
                        </div>
                    </div>
                    {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
                    {newEggModal && <NewEggModal onClose={handleNewEggModalToggle}/>}
                    {dailyRewardModal && !unclaimedReward && <DailyRewardModal onClose={() => {
                        handleDailyRewardModalToggle()
                    }} onCollectReward={handleCollectReward}/>}
                    {unclaimedReward &&
                        <WeeklyRewardModal userData={userData} unclaimedReward={unclaimedReward} onClose={() => {
                            handleWeeklyRewardModalToggle()
                        }}/>}
                    <div className={'filling-barrel-container'}>
                        <img className={'filling-barrel-img'}
                             src={barrel?.images[barrel?.currentLevel - 1]} alt={'barrel'}/>
                        <div className={'filling-barrel-info'}>
                            <div className={'barrel-progress-bar'}>
                                <div className={'barrel-progress-line'} style={{width: `${barrelProgress}%`}}></div>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className={'filling-barrel-footer'}>
                                <div className={'barrel-end-time'}>
                                    <p>Time left:</p>
                                    {new Date(barrel.lastEntrance).getTime() === expectedDate.getTime() ? (
                                        <b>00:00:00</b>
                                    ) : (
                                        <b>{countdown}</b>
                                    )}
                                </div>
                                {new Date(barrel.lastEntrance).getTime() === expectedDate.getTime() ? (
                                    <button className={'barrel-collect-btn'} onClick={handleBarrelExpectation}>
                                        <p>Start!</p>
                                    </button>
                                ) : (
                                    <button
                                        className={`barrel-collect-btn ${countdown !== '00:00:00' ? 'disabled' : ''}`}
                                        onClick={handleCollectionBarrel}>
                                        <p>Collect</p>
                                        <div>
                                            <b>{barrel?.income[barrel?.currentLevel - 1]}</b>
                                            <img src={scoreCoin}></img>
                                        </div>
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className={'additionalButtonsBlock'}>
                        <div>
                            <div className={'homeReward'} onClick={handleDailyRewardModalToggle}>
                                <img src={calendar} alt={"logo"}/>
                            </div>
                            <div className="sound-container">
                                <div className="sound-block" onClick={toggleMusic}>
                                    <div className="sound-image-container">
                                        {backgroundMusicIsPlaying === true ?
                                            <img src={soundOn}/>
                                            : backgroundMusicIsPlaying === false &&
                                            <img src={soundOff}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div disabled={axeButtonActive || clickCounter < 100} onClick={activateAxeButton}>
                            <button
                                disabled={axeButtonActive || clickCounter < 100}
                                className={`axeToggle ${clickCounter > 100 && 'axeToggleActive'}`}
                            >
                                <img src={axe?.images[axe?.currentLevel - 1]} alt="logo"/>
                                <div className={`axe-progress-line`} style={{height: `${clickCounter}%`}}></div>
                            </button>
                            {clickCounter > 100 && (
                                <p className={'axeToggleActiveText'}>Tap<br/>to use!</p>
                            )}
                        </div>
                    </div>

                </header>
                <div className="clickable-area"
                     onTouchStart={handleMultiTouchStart}
                     onTouchEnd={handleMultiTouchEnd}
                     onTouchMove={(e) => e.preventDefault()}
                >

                </div>
                <div className="pedestal-container">
                    <div className="pedestal-block">
                        <img src={theme === "day" ? pedestal : pedestalNight} alt="pedestal"/>
                    </div>
                    {blockType === 'overlay' ? (
                        <button className="pedestal-overlay"
                                onTouchStart={handleMultiTouchStart}
                                onTouchEnd={handleMultiTouchEnd}
                                onTouchMove={(e) => e.preventDefault()}
                        >
                            <img src={eggImage} alt="Egg"/>
                        </button>
                    ) : blockType === 'space' && (
                        <button className="pedestal-space-overlay"
                                onTouchStart={handleMultiTouchStart}
                                onTouchEnd={handleMultiTouchEnd}
                                onTouchMove={(e) => e.preventDefault()}

                        >
                            <Space/>
                        </button>
                    )}

                    {clickEffects}
                </div>
                <EnergyBar userEnergy={energy}/>
                <NavBar/>
            </div>
        </div>
    );
}


export default HomeScreen;

