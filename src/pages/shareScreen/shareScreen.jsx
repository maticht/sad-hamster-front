import React, {useEffect, useState} from 'react';
import './shareScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import {collectFromInvitees, replenishmentFromInvitees} from "../../httpRequests/dragonEggApi";
import scoreCoin from "../../img/icons/scoreCoin.png";
import {Link} from "react-router-dom";
import helmet from "../../img/icons/profile.png";
import torch from "../../img/icons/torch.png";
import ComingSoonModal from "../../components/modals/ComingSoonModal/ComingSoonModal";
import useStore from "../../store/zustand.store/store";

export const ShareScreen = () => {
    let currentUrl = window.location.href;
    const [totalScore, setTotalScore] = useState(0);
    //const [userData, setUserData] = useState({});
    const { tg, queryId, user } = useTelegram();
    const userId = user?.id || '777217409';
    const [replenishmentHandled, setReplenishmentHandled] = useState(false);
    const [countdown, setCountdown] = useState('00:00:00');
    const [showModal, setShowModal] = useState(false);

    //STORE
    const setReferralUsers = useStore((state) => state.setReferralUsers)
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);
    const setReferralCollectionTime = useStore((state) => state.setReferralCollectionTime)

    const {
        referralUsers,
        score,
        overallScore,
        referralCollectionTime,
    } =
        useStore((state) => ({
            referralUsers: state.referralUsers,
            score: state.score,
            overallScore: state.overallScore,
            referralCollectionTime: state.referralCollectionTime,
        }));

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleCollectFromInvitees = async () => {
        try {
            const response = await collectFromInvitees(userId);
            setScore(response.user.score);
            setOverallScore(response.user.overallScore);
            setReferralCollectionTime(response.user.referralCollectionTime);
            setReferralUsers(response.user.referralUsers);
            const totalScore = user.referralUsers.reduce((accumulator, referralUser) => accumulator + referralUser.score, 0);
            setTotalScore(totalScore);
            setReplenishmentHandled(false);
        } catch (error) {
            console.error(error);
        }
    };
    const handleReplenishmentFromInvitees = async () => {
        try {
            if (!replenishmentHandled && referralUsers) {
                setReplenishmentHandled(true);
                const response = await replenishmentFromInvitees(userId);
                setReferralUsers(response.user.referralUsers);
                const totalScore = user.referralUsers.reduce((accumulator, referralUser) => accumulator + referralUser.score, 0);
                setTotalScore(totalScore);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let intervalId;

        if (referralCollectionTime) {
            const updateCountdown = () => {
                const refColTime = useStore.getState().referralCollectionTime;
                const collectionTime = new Date(refColTime);
                const now = new Date();
                const difference = collectionTime.getTime() - now.getTime();

                if (difference > 0) {
                    const seconds = Math.floor((difference / 1000) % 60);
                    const minutes = Math.floor((difference / (1000 * 60)) % 60);
                    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                    setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                } else {
                    setCountdown('00:00:00');
                    if(totalScore === 0) {
                        handleReplenishmentFromInvitees();
                    }
                    clearInterval(intervalId);
                }
            };

            updateCountdown();
            intervalId = setInterval(updateCountdown, 1000);
        } else {
            setCountdown('00:00:00');
        }

        return () => clearInterval(intervalId);
    }, [referralCollectionTime]);

    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            if(!referralUsers){
                setReferralUsers(user.referralUsers);
            }
            if(!score){
                setScore(user.score);
            }
            if(!overallScore){
                setOverallScore(user.overallScore);
            }
            if(!referralCollectionTime){
                setReferralCollectionTime(user.referralCollectionTime);
            }
            const totalScore = user.referralUsers.reduce((accumulator, referralUser) => accumulator + referralUser.score, 0);
            setTotalScore(totalScore);
        };
        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {

        }).catch(err => console.error('Could not copy text: ', err));
    };

    return (
        <div className="share-screen">
            <div className="share-container">
                <div className={'headerShareBlock'}>
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
                    </div>
                </div>
                {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
                <div className="share-scroll-block">
                    <div className='share-info-block'>
                        <h2>Invite your friends</h2>
                        <p>Invite your friends and receive <b>250 coins</b> for each new user, as well as <b>8%</b> of
                            the
                            invitee’s income every 24 hours</p>
                        <a href={`https://telegram.me/share/url?url=${encodeURIComponent(`https://t.me/dragons_Eggs_bot?start=${userId}`)}`}
                           onClick={copyLinkToClipboard}>Invite</a>
                    </div>
                    <div className={'referralUsers'}>
                        {referralUsers?.length && (
                            <div className='referral-users-block'>
                                <div className='referral-users-text'>
                                    <h2>Invited users</h2>
                                    <p>Current number of referral users: <b>{referralUsers.length}</b></p>
                                    <div className={'referral-users-replenishment'}>
                                        <div>
                                            <p>Replenishment in:</p>
                                            <b>{countdown}</b>
                                        </div>
                                        <button className='referral-user-score' onClick={handleCollectFromInvitees}>
                                            <p>Collect</p>
                                            <div className='referral-user-score-num'>
                                                <b>{!referralUsers ? '0' : referralUsers.reduce((accumulator, referralUser) => accumulator + referralUser.score, 0)}</b>
                                                <img src={scoreCoin}></img>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className='top-users-list'>
                                    {referralUsers?.length && referralUsers
                                        .sort((a, b) => b.score - a.score)
                                        .map((user, index) => (
                                            <div key={user._id} className='top-user-block'>
                                                <div className='top-user-info after-fourth-user-info'>
                                                    <div className='top-user-title'>
                                                        <div>
                                                            <p>{user.firstName} {user.lastName}</p>
                                                            <b>{user.username}</b>
                                                        </div>
                                                    </div>
                                                    <div className='top-user-score'>
                                                        <p>Score:</p>
                                                        <b>{!user.score ? '0' : user.score}</b>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    {/*{userData.referralUsers*/}
                                    {/*    .sort((a, b) => b.score - a.score)*/}
                                    {/*    .map((user, index) => (*/}
                                    {/*        <div key={user._id} className='top-user-block'>*/}
                                    {/*            <div className='top-user-info after-fourth-user-info'>*/}
                                    {/*                <div className='top-user-title'>*/}
                                    {/*                    <div>*/}
                                    {/*                        <p>{user.firstName} {user.lastName}</p>*/}
                                    {/*                        <b>{user.username}</b>*/}
                                    {/*                    </div>*/}
                                    {/*                </div>*/}
                                    {/*                <div className='top-user-score'>*/}
                                    {/*                    <p>Score:</p>*/}
                                    {/*                    <b>{!user.score ? '0' : user.score}</b>*/}
                                    {/*                </div>*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    ))}*/}
                                    {/*{userData.referralUsers*/}
                                    {/*    .sort((a, b) => b.score - a.score)*/}
                                    {/*    .map((user, index) => (*/}
                                    {/*        <div key={user._id} className='top-user-block'>*/}
                                    {/*            <div className='top-user-info after-fourth-user-info'>*/}
                                    {/*                <div className='top-user-title'>*/}
                                    {/*                    <div>*/}
                                    {/*                        <p>{user.firstName} {user.lastName}</p>*/}
                                    {/*                        <b>{user.username}</b>*/}
                                    {/*                    </div>*/}
                                    {/*                </div>*/}
                                    {/*                <div className='top-user-score'>*/}
                                    {/*                    <p>Score:</p>*/}
                                    {/*                    <b>{!user.score ? '0' : user.score}</b>*/}
                                    {/*                </div>*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    ))}*/}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <NavBar/>
            </div>
        </div>
    );
}

export default ShareScreen;