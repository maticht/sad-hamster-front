import React, {useEffect, useState} from 'react';
import storeTemplateData from "../storeTemplateData/storeTemplateData.json";

const EnergyBar = ({userEnergy}) => {

    const [energy, setEnergy] = useState(userEnergy);

    useEffect(() => {
        setEnergy(userEnergy)
    }, [userEnergy])




    return energy && (
        <div className="energy-progress-container">
            <div className={'energy-progress-bar'}>
                <div className={'energy-progress-line'}
                     style={{ width: `${(energy.value * 100) / energy.energyCapacity[energy.currentLevel-1]}%` }}
                ></div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className="progress-text"><b>{energy.value}</b>/{energy.energyCapacity[energy.currentLevel-1]}</p>
        </div>
    );
};

export default EnergyBar;