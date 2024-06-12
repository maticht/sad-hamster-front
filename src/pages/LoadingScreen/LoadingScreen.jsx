import React, {useEffect, useState} from 'react';
import './LoadingScreen.css';
import loadingHamster from "../../img/icons/loadingHamster.png"
import tapScreenHamster from "../../img/icons/tapScreenHamster.png"
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
    const setUserPlaceInTop = useStore((state) => state.setUserPlaceInTop);
    const setDamage = useStore((state) => state.setDamage);
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);
    const setEnergy = useStore((state) => state.setEnergy);
    const setReferralUsers = useStore((state) => state.setReferralUsers);
    const setReferralCollectionTime = useStore((state) => state.setReferralCollectionTime);

    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };


    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            setUserData(user);
            setUsername(user.username);

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
        <div className={`loading-screen ${showTapMessage ? 'active' : ''}`} onClick={handleLoadingScreenClick}>
            <div className="hamsterLoader">
                <img
                    src={!showTapMessage ? loadingHamster : tapScreenHamster}
                    alt="Loading..."/>
            </div>
            <p className={'loaderTitle'}>{!showTapMessage ? `${progress} %` : 'Loading complete'}</p>
            <div className="hamster-loader-progress-container">
                <div className={'hamster-loader-progress-bar'}>
                    <div className={'hamster-loader-progress-line'}
                         style={{width: `${progress}%`}}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;

