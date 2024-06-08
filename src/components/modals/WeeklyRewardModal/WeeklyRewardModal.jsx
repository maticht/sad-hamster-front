import React from 'react';
import scoreCoin from "../../../img/icons/scoreCoin.png";

const WeeklyRewardModal = ({onClose, unclaimedReward, userData}) => {

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
        <div>
            <div className="newEggModalBackground">
                <div className="newEggModalContainer">
                    <div className="newEggModalContent">
                        <div>
                            <h2>Congratulations!</h2>
                            <p className="newEggCongratulationsText">You have received weekly reward!</p>
                            <div className="newEggEggBlock">
                                <div className={'topRewardInfo'}>
                                    <div className={'headerScoreText'}>
                                        <div>
                                            <p>Place in Top: <b className={`egg`}>{unclaimedReward.placeInTop}</b></p>
                                        </div>
                                        <p>Reward:</p>
                                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            <b className={`egg`}>{unclaimedReward.rewardValue}</b>
                                            <div style={{marginLeft: "2px", width: "15px", height: "15px"}}>
                                                <img src={scoreCoin}></img>
                                            </div>
                                        </div>
                                        {/*<p>{(userData.score * 0.00008 * 1.5).toFixed(2)} $</p>*/}

                                    </div>
                                    <div className={'topRewardLeague'}>
                                        <p>League:</p>
                                        <b className={`leagueName ${getClassName(unclaimedReward.league)}`}>{unclaimedReward.league}</b>
                                    </div>
                                </div>

                            </div>
                            <p>You did a great job this week. We expect such achievements from you in the future.</p>
                            <button className="dailyRewardContentButton" onClick={onClose}>Collect Reward</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyRewardModal;