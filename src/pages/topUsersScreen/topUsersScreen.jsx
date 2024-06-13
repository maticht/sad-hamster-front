import React, {useEffect, useState} from 'react';
import './topUsersScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getAllUsers} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import useStore from "../../store/zustand.store/store";

export const TopUsersScreen = () => {
    const [allUsers, setAllUsers] = useState([]);
    const {tg, queryId, user} = useTelegram();
    const userId = user?.id || '777217409';

    //STORE
    const setUserPlaceInTop = useStore((state) => state.setUserPlaceInTop);

    const {
        userPlaceInTop,
    } =
        useStore((state) => ({
            userPlaceInTop: state.userPlaceInTop,
        }));

    const fetchAllUsers = async () => {
        return await getAllUsers({userId});
    };
    useEffect(() => {
        const fetchAllUsersDataAndDisplay = async () => {
            const users = await fetchAllUsers();
            setAllUsers(users.users.allUsers);
            setUserPlaceInTop(users.users.userTopPlace);
            console.log(users)
        };
        fetchAllUsersDataAndDisplay();
    }, []);



    return (
        <div className="topUsersScreen-screen">
            <div className="top-users-container">
                <div className={'products-block'}>
                    <div className='top-users-block'>
                        <div className='top-users-text'>
                            <h2>Top users</h2>
                            <p>Current number of users: <b>{allUsers.length}</b></p>
                            <p>Place in the top: <b>{userPlaceInTop}</b></p>
                        </div>
                        {allUsers && (
                            <div className='top-users-list'>
                                {allUsers
                                    .sort((a, b) => b.scores.overallScore - a.scores.overallScore)
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
                                                    <b>{user.scores.overallScore}</b>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                <NavBar/>
            </div>
        </div>
    );
}

export default TopUsersScreen;