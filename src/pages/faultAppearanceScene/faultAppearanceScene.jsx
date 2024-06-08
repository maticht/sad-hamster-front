import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './faultAppearanceScene.css';
import scene1 from '../../img/narrativeScenes/faultAppearance/scene1.png';
import scene2 from '../../img/narrativeScenes/faultAppearance/scene2.png';
import scene3 from '../../img/narrativeScenes/faultAppearance/scene3.png';
import scene4 from '../../img/narrativeScenes/faultAppearance/scene4.png';
import {faultAppearanceScene} from "../../httpRequests/dragonEggApi";
import {useTelegram} from "../../hooks/useTelegram";

const images = [
    scene1,
    scene2,
    scene3,
    scene4
];

const FaultAppearanceScene = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(false);
    const { tg, queryId, user } = useTelegram();
    const userId = user?.id || '777217409';
    const navigate = useNavigate();

    const handleScreenClick = async () => {
        if (currentImageIndex === images.length - 1) {
            await faultAppearanceScene(userId);
            navigate('/');
        } else {
            setFade(true);
            setCurrentImageIndex((prevIndex) => prevIndex + 1);
            setFade(false);
        }
    };

    return (
        <div className="fault-appearance-scene" onClick={handleScreenClick}>
            <img
                src={images[currentImageIndex]}
                alt={`Scene ${currentImageIndex + 1}`}
                className={`scene-image ${fade ? 'fade-out' : ''}`}
            />
            <div className="fault-appearance-scene-btn">Tap to continue...</div>
        </div>
    );
};

export default FaultAppearanceScene;