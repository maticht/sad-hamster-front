import React, {useEffect, useState} from 'react';
import ComingSoon from '../../../img/ComingSoonModalImg.png'
import './newEggModal.css';
import {getUserData, setEggFlag, updateScore} from "../../../httpRequests/dragonEggApi";
import {useTelegram} from "../../../hooks/useTelegram";

const NewEggModal = ({ onClose }) => {
    const [userData, setUserData] = useState({});

    const {user} = useTelegram();
    const userId = user?.id || '777217409';
    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    const handleNewEggModalToggle = () => {
        const savedUser = setEggFlag(userId).then((data) => {
            console.log(data)
            setUserData(data.savedUser);
        });
        onClose();
    };

    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            setUserData(user);
        };

        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);

    const getClassName = (rarity) => {
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
        <div className="newEggModalBackground">
            <div className="newEggModalContainer">
                <div className="newEggModalContent">
                    {userData.eggs && userData.eggs.length > 0 && (
                        <div>
                            <h2>Congratulations!</h2>
                            <p className="newEggCongratulationsText">You have received a new egg</p>
                            <div className="newEggEggBlock">
                                <div>
                                    <div>
                                        <p>Name:</p>
                                        <b className={`egg`}>{userData.eggs[0].name}</b>
                                    </div>
                                    <div className="newEggEggRarity">
                                        <p>Rarity class:</p>
                                        <b className={`egg ${getClassName(userData.eggs[0].rarity)}`}>{userData.eggs[0].rarity}</b>
                                        {/*<p><b className={`egg common`}>common</b></p>*/}
                                        {/*<p><b className={`egg rare`}>rare</b></p>*/}
                                        {/*<p><b className={`egg epic`}>epic</b></p>*/}
                                        {/*<p><b className={`egg mythical`}>mythical</b></p>*/}
                                        {/*<p><b className={`egg legendary`}>legendary</b></p>*/}
                                    </div>
                                </div>
                                <img src={userData.eggs[0].images.model1[0]} alt="new egg"/>
                            </div>
                            <p className="newEggModalContentNote">Note: The rarity class of an egg affects the reward after successfully hatching an egg. You are in a <b>{userData.eggs[0].rarity}</b> WL!</p>
                            <button onClick={handleNewEggModalToggle}>OK</button>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default NewEggModal;