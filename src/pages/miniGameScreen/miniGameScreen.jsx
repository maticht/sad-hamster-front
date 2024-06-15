import React, {useEffect, useRef, useState} from 'react';
import './miniGameScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getMiniGameReward, getUserData} from "../../httpRequests/dragonEggApi";
import scoreCoin from "../../img/icons/sadCoin.png";
import sadBubble from "../../img/icons/sadbubble.png";
import cryingHamster from "../../img/icons/cryingHamster.png";
import bomb from "../../img/icons/bomb.png";
import coldTime from "../../img/icons/coldTime.png";
import storeTemplateData from '../../storeTemplateData/storeTemplateData.json'
import {Link} from "react-router-dom";
import useStore from "../../store/zustand.store/store";


export const MiniGameScreen = () => {
    const {user} = useTelegram();
    const userId = user?.id || '777217409'; //'409840876' ;

    const [started, setStarted] = useState(false);
    const [bubbles, setBubbles] = useState([]);
    const [points, setPoints] = useState(0);
    const [hamsters, setHamsters] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20);
    const [gameOver, setGameOver] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(Date.now());
    const [frozen, setFrozen] = useState(false);
    const [specialItems, setSpecialItems] = useState([]);
    const bubbleTimers = useRef([]);
    const specialItemTimers = useRef([]);
    const bubblePopSound = new Audio('https://res.cloudinary.com/dfl7i5tm2/video/upload/v1718472983/cartoon-bubble-pop-01-_c0srub.mp3');


    //STORE
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);

    const {score} =
        useStore((state) => ({
            score: state.score,
            overallScore: state.overallScore
        }));

    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            if (!score) {
                setScore(user.score);
            }
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
    const handleGetGameReward = async (userId, reward) => {
        try {
            const response = await getMiniGameReward(userId, {reward});

            setScore(response.score);
            setOverallScore(response.overallScore);

        } catch (error) {
            console.error("Failed to complete task:", error);
        }
    };

    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setInterval(() => {
                if (!frozen) setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setGameOver(true);
            setStarted(false);
            handleGetGameReward(userId, points);

        }
    }, [started, timeLeft, frozen]);

    useEffect(() => {
        if (started) {
            spawnBubble();
            spawnSpecialItem();
        }
        return () => {
            bubbleTimers.current.forEach(timer => clearTimeout(timer));
            specialItemTimers.current.forEach(timer => clearTimeout(timer));
            bubbleTimers.current = [];
            specialItemTimers.current = [];
        };
    }, [started]);

    const startGame = () => {
        setStarted(true);
        setTimeLeft(12);
        setPoints(0);
        setBubbles([]);
        setHamsters([]);
        setSpecialItems([]);
        setGameOver(false);
        setFrozen(false);
    };

    const spawnBubble = () => {
        const bubbleCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = {
                id: Date.now() + i,
                left: Math.random() * (window.innerWidth - 80),
                duration: Math.random() * 3 + 2,
            };
            setBubbles((prevBubbles) => [...prevBubbles, bubble]);
        }
        const timer = setTimeout(spawnBubble, Math.random() * 400 + 100);
        bubbleTimers.current.push(timer);
    };

    const spawnSpecialItem = () => {
        const itemTypes = ['bomb', 'bomb', 'coldTime', 'bomb'];
        const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const duration = Math.random() * 2 + 2;
        const item = {
            id: Date.now(),
            type: itemType,
            left: Math.random() * (window.innerWidth - 80),
            duration: duration,
        };
        setSpecialItems((prevItems) => [...prevItems, item]);
        const timer = setTimeout(spawnSpecialItem, Math.random() * 5000 + 2000);
        specialItemTimers.current.push(timer);
    };

    const handleBubbleClick = (id, top, left, duration) => {
        const currentTime = Date.now();
        const timeSinceLastClick = (currentTime - lastClickTime) / 1000;
        const speedBonus = Math.max(0, 5 - timeSinceLastClick);
        const durationBonus = Math.max(0, 5 - duration);
        const pointsToAdd = 1 + Math.floor(speedBonus) + Math.floor(durationBonus);
        bubblePopSound.play();
        setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
        setHamsters((prevHamsters) => [...prevHamsters, {id, top, left}]);
        setPoints((prevPoints) => prevPoints + pointsToAdd);
        setLastClickTime(currentTime);
    };

    const handleBombClick = (id) => {
        setSpecialItems((prevItems) => prevItems.filter((item) => item.id !== id));
        if (points >= 20) {
            setPoints((prevPoints) => prevPoints - 20);
            document.querySelector('.score').classList.add('red');
            setTimeout(() => {
                document.querySelector('.score').classList.remove('red');
            }, 500);
        }
    };

    const handleColdTimeClick = (id) => {
        setSpecialItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setFrozen(true);
        setTimeout(() => {
            setFrozen(false);
        }, 4000);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
                                <p className={`score ${points < 0 ? 'red' : ''}`}>Points: {points}</p>
                                <p className={`timer ${frozen ? 'frozen' : ''}`}>{formatTime(timeLeft)}</p>
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
                                {specialItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="special-item"
                                        style={{
                                            left: item.left,
                                            animationDuration: `${item.duration}s`,
                                        }}
                                        onClick={() => item.type === 'bomb' ? handleBombClick(item.id) : handleColdTimeClick(item.id)}
                                    >
                                        <img className="special-item-img" src={item.type === 'bomb' ? bomb : coldTime}
                                             alt={item.type === 'bomb' ? 'Bomb' : 'Cold Time'}/>
                                    </div>
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