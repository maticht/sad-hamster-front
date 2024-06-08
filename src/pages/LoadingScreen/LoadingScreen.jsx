import React, {useEffect, useState} from 'react';
import './LoadingScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData} from "../../httpRequests/dragonEggApi";
import {useNavigate} from 'react-router-dom';
import useStore from "../../store/zustand.store/store";

export const LoadingScreen = () => {
    const [showTapMessage, setShowTapMessage] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Loading');
    const [backgroundMusicIsPlaying, setBackgroundMusicIsPlaying] = useState();
    const [userData, setUserData] = useState({});
    const {user} = useTelegram();
    const userId = user?.id || '777217409';
    const navigate = useNavigate();

    const setUsername = useStore((state) => state.setUsername);
    const setUserLeague = useStore((state) => state.setUserLeague);
    const setUserPlaceInTop = useStore((state) => state.setUserPlaceInTop);
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);
    const setEnergy = useStore((state) => state.setEnergy);
    const setBarrel = useStore((state) => state.setBarrel);
    const setBarrelProgress = useStore((state) => state.setBarrelProgress);
    const setHammer = useStore((state) => state.setHammer);
    const setEggs = useStore((state) => state.setEggs);
    const setEggImage = useStore((state) => state.setEggImage);
    const setMainEggImage = useStore((state) => state.setMainEggImage);
    const setEggRarity = useStore((state) => state.setEggRarity);
    const setEggName = useStore((state) => state.setEggName);
    const setIsEggOpen = useStore((state) => state.setIsEggOpen);
    const setEggScore = useStore((state) => state.setEggScore);
    const setBlockType = useStore((state) => state.setBlockType);
    const updateAxeStore = useStore((state) => state.updateAxeStore);
    const setReferralUsers = useStore((state) => state.setReferralUsers);
    const setReferralCollectionTime = useStore((state) => state.setReferralCollectionTime);


    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    const rewards = [
        {placeInTop: [1, 3], league: 'Diamond'},
        {placeInTop: [4, 10], league: 'Golden'},
        {placeInTop: [11, 20], league: 'Silver'},
        {placeInTop: [21, 50], league: 'Bronze'},
        {placeInTop: [51, 100], league: 'Stone'},
    ];

    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            setUserData(user);
            setUsername(user.username);
            if (user.userTopPlace <= rewards[rewards.length - 1].placeInTop[1] && user.userTopPlace > 0) {
                const reward = rewards.find(r =>
                    user.userTopPlace >= r.placeInTop[0] && user.userTopPlace <= r.placeInTop[1]
                );
                console.log(reward)
                setUserLeague(reward.league);
            }
            setUserPlaceInTop(user.placeInTop);

            setScore(user.score);
            setOverallScore(user.overallScore);

            setReferralUsers(user.referralUsers);
            setReferralCollectionTime(user.referralCollectionTime);

            const usersEnergyObj = user.energy;
            const fullEnergyTime = new Date(usersEnergyObj.energyFullRecoveryDate);
            let now = new Date();
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

            setEnergy(usersEnergyObj);
            updateAxeStore('currentLevel', user.axe.currentLevel);
            setBarrel(user.barrel);
            const collectionTime = new Date(user.barrel.collectionTime);
            const lastEntrance = new Date(user.barrel.lastEntrance);
            now = new Date();
            const totalTime = collectionTime - lastEntrance;
            const elapsedTime = now - lastEntrance;
            const currentProgress = (elapsedTime / totalTime) * 100;
            setBarrelProgress(currentProgress);

            setHammer(user.hammer);
            setEggs(user.eggs);
            console.log(user.eggs)
            const imageUrl = user.eggs[0].stageScore.reduce((prevImageUrl, stageScore, index) => {
                if (user.eggs[0].score >= stageScore) {
                    return user.eggs[0].images.model1[index];
                }
                return prevImageUrl;
            }, user.eggs[0].images.model1[0]);
            setMainEggImage(user.eggs[0].images.model1[0]);
            setEggRarity(user.eggs[0].rarity);
            setEggName(user.eggs[0].name);
            if (user.eggs[0].score >= 88) {
                setBlockType('overlay');
            } else {
                setBlockType('space');
            }
            setEggImage(imageUrl);
            setIsEggOpen(user.eggs[0]?.isOpen);
            setEggScore(user.eggs[0].score);
        }

        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);

    useEffect(() => {
        const audio = document.getElementById("backgroundMusic");

        if (!audio.paused) {
            setBackgroundMusicIsPlaying(true);
        } else {
            setBackgroundMusicIsPlaying(false);
        }

        const timer = setTimeout(() => {
            setShowTapMessage(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 30);

        return () => clearInterval(progressInterval);
    }, []);

    const loadingMessages = [
        "Loading textures",
        "Connecting to Aurora",
        "Complete setup"
    ];
    useEffect(() => {
        const loadingTextInterval = setInterval(() => {
            setLoadingText(prev => {
                switch (prev) {
                    case 'Loading':
                        return 'Loading.';
                    case 'Loading.':
                        return 'Loading..';
                    case 'Loading..':
                        return 'Loading...';
                    default:
                        return 'Loading';
                }
            });
        }, 200);

        return () => clearInterval(loadingTextInterval);
    }, []);

    const getLoadingMessage = (progress) => {
        if (progress < 33) return loadingMessages[0];
        if (progress < 66) return loadingMessages[1];
        return loadingMessages[2];
    };

    const handleLoadingScreenClick = () => {

        if (showTapMessage) {
            if (!userData?.narrativeScenes?.faultAppearance) {
                navigate('/faultAppearanceScene');
            } else {
                navigate('/');
            }
        }

        const audio = document.getElementById("backgroundMusic");
        if (backgroundMusicIsPlaying) {
            setBackgroundMusicIsPlaying(false);
            if (audio) {
                audio.pause();
            }
        } else {
            setBackgroundMusicIsPlaying(true);
            if (audio) {
                audio.play();
            }
        }
    };

    return (
        <div className="loading-screen" onClick={handleLoadingScreenClick}>
            <div className="eggLoader">
                <img
                    src={'https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714130717/dragonEggs/eggRarity1Stage1_et105p.png'}
                    alt="LoadingEgg"/>
            </div>
            <p className={'loaderTitle'}>{!showTapMessage ? loadingText : 'Loading complete'}</p>
            <div className="energy-progress-container">
                <div className={'energy-progress-bar'}>
                    <div className={'energy-progress-line'}
                         style={{width: `${progress}%`}}
                    ></div>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p className="progress-text"><b>{progress}</b>%</p>
            </div>
            {!showTapMessage && <p className={'loaderSubTitle'}>{getLoadingMessage(progress)}</p>}
            {showTapMessage && <p className={'loaderTapBtn'}>Tap your screen</p>}
        </div>
    );
};

export default LoadingScreen;

