import React, {useEffect, useState} from 'react';
import './miniGameScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData} from "../../httpRequests/dragonEggApi";
import scoreCoin from "../../img/icons/sadCoin.png";
import sadBubble from "../../img/icons/sadbubble.png";
import cryingHamster from "../../img/icons/cryingHamster.png";
import bomb from "../../img/icons/bomb.png";
import coldTime from "../../img/icons/coldTime.png";

import storeTemplateData from '../../storeTemplateData/storeTemplateData.json'
import ComingSoonModal from "../../components/modals/ComingSoonModal/ComingSoonModal";
import {Link} from "react-router-dom";
import useStore from "../../store/zustand.store/store";


export const MiniGameScreen = () => {
    const {user} = useTelegram();
    const userId = user?.id || '777217409'; //'409840876' ;
    const [showModal, setShowModal] = useState(false);

    const [started, setStarted] = useState(false);
    const [bubbles, setBubbles] = useState([]);
    const [points, setPoints] = useState(0);
    const [hamsters, setHamsters] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [gameOver, setGameOver] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(Date.now());

    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setGameOver(true);
            setStarted(false);
        }
    }, [started, timeLeft]);

    const startGame = () => {
        setStarted(true);
        setTimeLeft(10);
        setPoints(0);
        setBubbles([]);
        setHamsters([]);
        setGameOver(false);
        spawnBubble();
    };

    const spawnBubble = () => {
        const bubbleCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = {
                id: Date.now() + i,
                left: Math.random() * (window.innerWidth - 50),
                duration: Math.random() * 3 + 2,
            };
            setBubbles((prevBubbles) => [...prevBubbles, bubble]);
        }
        setTimeout(spawnBubble, Math.random() * 1700);
    };

    const handleBubbleClick = (id, top, left, duration) => {
        const currentTime = Date.now();
        const timeSinceLastClick = (currentTime - lastClickTime) / 1000;
        const speedBonus = Math.max(0, 5 - timeSinceLastClick);
        const durationBonus = Math.max(0, 5 - duration);
        const pointsToAdd = 1 + Math.floor(speedBonus) + Math.floor(durationBonus);

        setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
        setHamsters((prevHamsters) => [
            ...prevHamsters,
            { id, top, left }
        ]);
        setPoints((prevPoints) => prevPoints + pointsToAdd);
        setLastClickTime(currentTime);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

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

    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };


    return (
        <div className="mini-game-screen" onClick={!started && !gameOver ? startGame : null}>
            <div className="mini-game-container">
                <div className="game-container">
                    {!started && !gameOver ? (
                        <p className="start-message">
                            Tap to start the game
                        </p>
                    ) : (
                        !gameOver && (
                            <>
                                <Link to={'/'} className={'mini-game-home-link'}>
                                    Home
                                </Link>
                                <p className="score">Points: {points}</p>
                                <p className="timer">{formatTime(timeLeft)}</p>
                                {bubbles.map((bubble) => (
                                    <div
                                        key={bubble.id}
                                        className="click-area"
                                        style={{
                                            left: bubble.left,
                                            animationDuration: `${bubble.duration}s`,
                                        }}
                                        onClick={(e) => handleBubbleClick(bubble.id, e.clientY, bubble.left, bubble.duration)}
                                    >
                                        <img src={sadBubble} className="bubble" alt="Sad Bubble"/>
                                    </div>
                                ))}
                                {hamsters.map((hamster) => (
                                    <img
                                        key={hamster.id}
                                        src={cryingHamster}
                                        className="falling-hamster"
                                        style={{top: hamster.top, left: hamster.left}}
                                        alt="Crying Hamster"
                                    />
                                ))}
                            </>
                        )
                    )}
                    {gameOver && (
                        <div className="game-over">
                            <p>Your score: {points}</p>
                            <div className="ok-button" onClick={startGame}>Retry</div>
                            <Link className="ok-link" to={'/'}>Return to home</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MiniGameScreen;