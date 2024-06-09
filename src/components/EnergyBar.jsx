import React, {useEffect, useState} from 'react';
import energyIcon from '../img/icons/energy.png';
import storeTemplateData from "../storeTemplateData/storeTemplateData.json";

const EnergyBar = ({userEnergy}) => {

    const [energy, setEnergy] = useState(userEnergy);

    useEffect(() => {
        setEnergy(userEnergy)
    }, [userEnergy])




    return energy && (
        <div>
            <p className="progress-text">
                <img src={energyIcon} alt="energy" />
                <b>{energy.value}</b>
                /{energy.energyCapacity[energy.currentLevel - 1]}
            </p>
            <div className="energy-progress-container">
                <div className={'energy-progress-bar'}>
                    <div className={'energy-progress-line'}
                         style={{width: `${(energy.value * 100) / energy.energyCapacity[energy.currentLevel - 1]}%`}}
                    ></div>
                </div>
            </div>
        </div>

    );
};

export default EnergyBar;