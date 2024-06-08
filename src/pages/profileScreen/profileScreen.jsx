import React, {useEffect, useState} from 'react';
import './profileScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData, getUserTopPlace} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import topUsersImg from "../../img/topUsers/topUsersPage.png";
import place1 from "../../img/topUsers/top-1-user.png";
import place2 from "../../img/topUsers/top-2-user.png";
import place3 from "../../img/topUsers/top-3-user.png";
import {Link} from "react-router-dom";
import scoreCoin from "../../img/icons/scoreCoin.png";
import useStore from "../../store/zustand.store/store";

export const ProfileScreen = () => {
    // const [userData, setUserData] = useState({});
    //const [userLeague, setUserLeague] = useState('');
    const {tg, queryId, user} = useTelegram();
    const userId = user?.id || '777217409';
    const rewards = [
        {placeInTop: [1, 3], league: 'Diamond'},
        {placeInTop: [4, 10], league: 'Golden'},
        {placeInTop: [11, 20], league: 'Silver'},
        {placeInTop: [21, 50], league: 'Bronze'},
        {placeInTop: [51, 100], league: 'Stone'},
    ];

    //STORE
    const setUsername = useStore((state) => state.setUsername);
    const setUserLeague = useStore((state) => state.setUserLeague);
    const setUserPlaceInTop = useStore((state) => state.setUserPlaceInTop);
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);
    const setMainEggImage = useStore((state) => state.setMainEggImage);
    const setEggRarity = useStore((state) => state.setEggRarity);
    const setEggName = useStore((state) => state.setEggName);
    const setIsEggOpen = useStore((state) => state.setIsEggOpen);
    const setEggScore = useStore((state) => state.setEggScore);

    const {
        username,
        userLeague,
        userPlaceInTop,
        score,
        overallScore,
        eggScore,
        mainEggImage,
        isEggOpen,
        eggRarity,
        eggName
    } =
        useStore((state) => ({
            username: state.username,
            userLeague: state.userLeague,
            userPlaceInTop: state.userPlaceInTop,
            score: state.score,
            overallScore: state.overallScore,
            eggScore: state.eggScore,
            mainEggImage: state.mainEggImage,
            isEggOpen: state.isEggOpen,
            eggRarity: state.eggRarity,
            eggName: state.eggName,
        }));

    const fetchUserData = async () => {
        const response = await getUserTopPlace(userId);
        return response.user;
    };


    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();

            if (!username) {
                setUsername(user.username);
            }

            if (user.userTopPlace <= rewards[rewards.length - 1].placeInTop[1] && user.userTopPlace > 0) {
                const reward = rewards.find(r =>
                    user.userTopPlace >= r.placeInTop[0] && user.userTopPlace <= r.placeInTop[1]
                );
                console.log(reward)
                setUserLeague(reward.league)
            }

            setUserPlaceInTop(user.userTopPlace);

            if (!score) {
                setScore(user.score);
            }
            if (!overallScore) {
                setOverallScore(user.overallScore);
            }
            if (!eggScore) {
                setEggScore(user.eggs[0].score);
            }
            if (!mainEggImage) {
                setMainEggImage(user.eggs[0].images.model1[0]);
            }
            if (!eggRarity) {
                setEggRarity(user.eggs[0].rarity);
            }
            if (!eggName) {
                setEggName(user.eggs[0].name);
            }
            if (isEggOpen === "") {
                setIsEggOpen(user.eggs[0]?.isOpen);
            }
        };
        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);

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

    const getRarityClassName = (rarity) => {
        switch (rarity) {
            case 'Rare':
                return 'rare';
            case 'Epic':
                return 'epic';
            case 'Mythical':
                return 'mythical';
            case 'Legendary':
                return 'legendary';
            default:
                return 'common';
        }
    };

    return (
        <div className="profile-screen">
            <div className="profile-container">
                <div className={'products-block'}>
                    <div className='profile-info-block'>
                        <h2>Profile</h2>
                        <p>Name: <b>{username}</b></p>
                        <div className='profile-info-score'>
                            <p>Score:</p> <b>{score} </b>
                            <img src={scoreCoin} alt="score coin"/>
                            <p>~<b>???</b>$</p>
                        </div>
                        <div className='profile-info-score'>
                            <p>Overall Score:</p> <b>{overallScore} </b>
                        </div>
                        <p>Place in the top: <b>{userPlaceInTop}</b></p>
                        {userLeague ? (
                            <p className='profile-info-league'>League: <b
                                className={`leagueName ${getClassName(userLeague)}`}>
                                {userLeague}
                            </b>
                            </p>
                        ) : (
                            <p className='profile-info-league'>League: <b>
                                Uncertain League
                            </b>
                            </p>
                        )}
                    </div>
                    {isEggOpen && (
                        <div className="ownEggBlock">
                            <h2>Your Egg</h2>
                            <div className="ownEgg">
                                <div>
                                    <div>
                                        <p>Title: <b>{eggName}</b></p>
                                    </div>
                                    <div className="newEggRarityBlock">
                                        <p>Score: <b>{eggScore}</b></p>
                                    </div>
                                    <div className="newEggRarityBlock">
                                        <p>Rarity: <b
                                            className={`leagueName ${getRarityClassName(eggRarity)}`}>{eggRarity}</b>
                                        </p>
                                    </div>
                                </div>
                                <img src={mainEggImage} alt="new egg"/>
                            </div>
                        </div>
                    )}
                    <div className='topUsersBlock'>
                        <div className='topUsersBlockInfo'>
                            <div>
                                <b>Top users</b>
                                <img src={topUsersImg}/>
                            </div>

                        </div>
                        <p className='topUsersDescription'>Conditions of the competition: be among the top 20 users of
                            the current week and receive a prize</p>
                        <div className='topUsersBlockInfo'>
                            <Link className='topUsersLink' to={'/topUsersScreen'}>
                                Open
                            </Link>
                        </div>
                    </div>

                </div>
                <NavBar/>
            </div>
        </div>
    );
}

export default ProfileScreen;