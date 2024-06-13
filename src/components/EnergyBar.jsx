import React, {useEffect, useState} from 'react';
import energyIcon from '../img/icons/energy.png';
import miniGame from '../img/icons/miniGame.png';
import {Link} from "react-router-dom";
const balance = require("../storeTemplateData/balanceData.json");


const EnergyBar = ({userEnergy}) => {

    const [energy, setEnergy] = useState(userEnergy);

    useEffect(() => {
        setEnergy(userEnergy)
    }, [userEnergy])

    return energy && (
        <div>
            <div className="mini-game-block">
                <img src={miniGame} alt={'miniGame'}/>
                <Link to={'/miniGameScreen'} className="mini-game-btn">
                    Click to earn
                </Link>
            </div>
            <p className="progress-text">
                <img src={energyIcon} alt="energy" />
                <b>{energy.value}</b>
                /{balance.energy.energyCapacity.capacity[energy.energyCapacityLevel - 1]}
            </p>
            <div className="energy-progress-container">
                <div className={'energy-progress-bar'}>
                    <div className={'energy-progress-line'}
                         style={{width: `${(energy.value * 100) / balance.energy.energyCapacity.capacity[energy.energyCapacityLevel - 1]}%`}}
                    ></div>
                </div>
            </div>
        </div>

    );
};

export default EnergyBar;