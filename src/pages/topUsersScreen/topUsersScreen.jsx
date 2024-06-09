import React, {useEffect, useState} from 'react';
import './topUsersScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {collectWeeklyReward, getAllUsers, getUserData} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import place1 from "../../img/topUsers/top-1-user.png";
import place2 from "../../img/topUsers/top-2-user.png";
import place3 from "../../img/topUsers/top-3-user.png";
import place10 from "../../img/topUsers/top-4-10-user.png";
import TopUsersModal from "../../components/modals/TopUsersModal/TopUsersModal";
import WeeklyRewardModal from "../../components/modals/WeeklyRewardModal/WeeklyRewardModal";
import useStore from "../../store/zustand.store/store";

export const TopUsersScreen = () => {
    //const [userData, setUserData] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    //const [userLeague, setUserLeague] = useState('');
    const [topRewardModal, setTopRewardModal] = useState(false);
    const {tg, queryId, user} = useTelegram();
    const userId = user?.id || '777217409';

    //STORE
    const setUserLeague = useStore((state) => state.setUserLeague);
    const setUserPlaceInTop = useStore((state) => state.setUserPlaceInTop);

    const {
        userLeague,
        userPlaceInTop,
    } =
        useStore((state) => ({
            userLeague: state.userLeague,
            userPlaceInTop: state.userPlaceInTop,
        }));

    const rewards = [
        {placeInTop: [1, 3], league: 'Diamond'},
        {placeInTop: [4, 10], league: 'Golden'},
        {placeInTop: [11, 20], league: 'Silver'},
        {placeInTop: [21, 50], league: 'Bronze'},
        {placeInTop: [51, 100], league: 'Stone'},
    ];

    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };
    const handleTopRewardModalToggle = () => {
        setTopRewardModal(!topRewardModal);
    };

    const fetchAllUsers = async () => {
        return await getAllUsers();
    };
    useEffect(() => {
        const fetchAllUsersDataAndDisplay = async () => {
            const users = await fetchAllUsers();
            setAllUsers(users);
            console.log(users)
        };
        fetchAllUsersDataAndDisplay();
    }, []);

    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            if (user.userTopPlace <= rewards[rewards.length - 1].placeInTop[1] && user.userTopPlace > 0) {
                const reward = rewards.find(r =>
                    user.userTopPlace >= r.placeInTop[0] && user.userTopPlace <= r.placeInTop[1]
                );
                console.log(reward)
                setUserLeague(reward.league)
            }
            setUserPlaceInTop(user.userTopPlace);
        };
        console.log(user)

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

    return (
        <div className="topUsersScreen-screen">
            <div className="top-users-container">
                <div className={'products-block'}>
                    {/*<div className='top-users-info-block'>*/}
                    {/*    <h2>Competition conditions</h2>*/}
                    {/*    <p>Be among the top 100 users of the current week and receive a prize</p>*/}
                    {/*    <div className='top-users-btn-block'>*/}
                    {/*        <button onClick={handleTopRewardModalToggle}>Competition details</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*{topRewardModal && <TopUsersModal onClose={() => {*/}
                    {/*    handleTopRewardModalToggle()*/}
                    {/*}}/>}*/}

                    {/*<div className={'top-users-scroll-block'}>*/}

                    <div className='top-users-block'>
                        <div className='top-users-text'>
                            <h2>Top users</h2>
                            <p>Current number of users: <b>{allUsers.length}</b></p>
                            <p>Place in the top: <b>{userPlaceInTop}</b></p>
                            {/*{userLeague ? (*/}
                            {/*    <p className='profile-info-league'>League: <b*/}
                            {/*        className={`leagueName ${getClassName(userLeague)}`}>*/}
                            {/*        {userLeague}*/}
                            {/*    </b>*/}
                            {/*    </p>*/}
                            {/*) : (*/}
                            {/*    <p className='profile-info-league'>League: <b>*/}
                            {/*        Uncertain League*/}
                            {/*    </b>*/}
                            {/*    </p>*/}
                            {/*)}*/}

                        </div>
                        {allUsers && (
                            <div className='top-users-list'>
                                {allUsers
                                    .sort((a, b) => b.overallScore - a.overallScore)
                                    .slice(0, 100)
                                    .map((user, index) => (
                                        <div key={user._id} className='top-user-block'>
                                            <div className='top-user-info after-fourth-user-info'>
                                                <div className='top-user-title'>
                                                    <b className='after-fourth-user-place'>{index + 1}.</b>
                                                    <div>
                                                        <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>
                                                        <p>lvl 12</p>
                                                    </div>
                                                </div>
                                                <div className='top-user-score'>
                                                    <p>Score:</p>
                                                    <b>{user.overallScore}</b>
                                                </div>
                                            </div>
                                            {/*{index === 0 &&*/}
                                            {/*    <div className='top-user-info'>*/}
                                            {/*        <div className='top-user-title'>*/}
                                            {/*            <img className={'top-user-block-img'} src={place1}*/}
                                            {/*                 alt="First Place"/>*/}
                                            {/*            <div>*/}
                                            {/*                <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>*/}
                                            {/*                <p>Score:<b>{user.overallScore}</b></p>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className='top-user-score'>*/}
                                            {/*            <p>League:</p>*/}
                                            {/*            <b className={`leagueName diamond`}>Diamond</b>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*}*/}
                                            {/*{index === 1 &&*/}
                                            {/*    <div className='top-user-info'>*/}
                                            {/*        <div className='top-user-title'>*/}
                                            {/*            <img className={'top-user-block-img'} src={place2}*/}
                                            {/*                 alt="Second Place"/>*/}
                                            {/*            <div>*/}
                                            {/*                <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>*/}
                                            {/*                <p>Score:<b>{user.overallScore}</b></p>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className='top-user-score'>*/}
                                            {/*            <p>League:</p>*/}
                                            {/*            <b className={`leagueName diamond`}>Diamond</b>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*}*/}
                                            {/*{index === 2 &&*/}
                                            {/*    <div className='top-user-info'>*/}
                                            {/*        <div className='top-user-title'>*/}
                                            {/*            <img className={'top-user-block-img'} src={place3}*/}
                                            {/*                 alt="Third Place"/>*/}
                                            {/*            <div>*/}
                                            {/*                <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>*/}
                                            {/*                <p>Score:<b>{user.overallScore}</b></p>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className='top-user-score'>*/}
                                            {/*            <p>League:</p>*/}
                                            {/*            <b className={`leagueName diamond`}>Diamond</b>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*}*/}
                                            {/*{index >= 3 && index < 10 &&*/}
                                            {/*    <div className='top-user-info after-fourth-user-info'>*/}
                                            {/*        <div className='top-user-title'>*/}
                                            {/*            <div className="image-container">*/}
                                            {/*                <img src={place10} alt="Third Place"/>*/}
                                            {/*                <b className="after-fourth-to-ten-user-place">{index + 1}</b>*/}
                                            {/*            </div>*/}
                                            {/*            <div>*/}
                                            {/*                <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>*/}
                                            {/*                <p>Score:<b>{user.overallScore}</b></p>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className='top-user-score'>*/}
                                            {/*            <p>League:</p>*/}
                                            {/*            <b className={`leagueName golden`}>Golden</b>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*}*/}
                                            {/*{index >= 10 && index < 20 &&*/}
                                            {/*    <div className='top-user-info after-fourth-user-info'>*/}
                                            {/*        <div className='top-user-title'>*/}
                                            {/*            <b className='after-fourth-user-place'>{index + 1}.</b>*/}
                                            {/*            <div>*/}
                                            {/*                <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>*/}
                                            {/*                <p>Score:<b>{user.overallScore}</b></p>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className='top-user-score'>*/}
                                            {/*            <p>League:</p>*/}
                                            {/*            <b className={`leagueName silver`}>Silver</b>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*}*/}
                                            {/*{index >= 20 && index < 50 &&*/}
                                            {/*    <div className='top-user-info after-fourth-user-info'>*/}
                                            {/*        <div className='top-user-title'>*/}
                                            {/*            <b className='after-fourth-user-place'>{index + 1}.</b>*/}
                                            {/*            <div>*/}
                                            {/*                <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>*/}
                                            {/*                <p>Score:<b>{user.overallScore}</b></p>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className='top-user-score'>*/}
                                            {/*            <p>League:</p>*/}
                                            {/*            <b className={`leagueName bronze`}>Bronze</b>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*}*/}
                                            {/*{index >= 50 &&*/}
                                            {/*    <div className='top-user-info after-fourth-user-info'>*/}
                                            {/*        <div className='top-user-title'>*/}
                                            {/*            <b className='after-fourth-user-place'>{index + 1}.</b>*/}
                                            {/*            <div>*/}
                                            {/*                <b>{!user.username || user.username === '' || user.username === null || user.username === undefined ? 'Unknown Adventurer' : user.username}</b>*/}
                                            {/*                <p>Score:<b>{user.overallScore}</b></p>*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*        <div className='top-user-score'>*/}
                                            {/*            <p>League:</p>*/}
                                            {/*            <b className={`leagueName stone`}>Stone</b>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*}*/}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                    {/*</div>*/}
                </div>
                <NavBar/>
            </div>
        </div>
    );
}

export default TopUsersScreen;