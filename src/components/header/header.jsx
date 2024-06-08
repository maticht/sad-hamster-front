import React, {useEffect, useState} from 'react';
import {getUserData, updateScore} from "../../httpRequests/dragonEggApi";
import scoreCoin from "../../img/icons/scoreCoin.png";
import {Link} from "react-router-dom";
import helmet from "../../img/icons/profile.png";
import torch from "../../img/icons/torch.png";
import ComingSoonModal from "../modals/ComingSoonModal/ComingSoonModal";
import {useTelegram} from "../../hooks/useTelegram";

const Header = () => {
    const [userData, setUserData] = useState({});
    const [score, setScore] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const {user} = useTelegram();
    const userId = user?.id || '777217409';
    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };
    const handleModalToggle = () => {
        setShowModal(!showModal);
    };
    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            setUserData(user);
            setScore(user.score);
        };

        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);


    return (
        <div className="header-container">
            <Link to={'/profile'} className={'headerLightLink'}>
                <img src={helmet} alt={"logo"}/>
            </Link>
            <div className={'headerScoreBlock'}>
                <div className={'headerScoreText'}>
                    <h2>{score}</h2>
                    {/*<p>{(userData.score * 0.00008 * 1.5).toFixed(2)} $</p>*/}
                </div>
                <img src={scoreCoin}></img>
            </div>
            <div className={'headerLink'} onClick={handleModalToggle}>
                <img src={torch} alt={"logo"}/>
            </div>
            {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
        </div>
    );
};

export default Header;