import React from 'react';
import ComingSoon from '../../../img/ComingSoonModalImg.png'
import './ComingSoonModal.css';

const ComingSoonModal = ({ onClose }) => {
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="modalContent">
                    <p>This feature is currently under development</p>
                    <img src={ComingSoon} alt="coming soon"/>
                    <h2>Coming Soon</h2>
                    <button onClick={onClose}>OK</button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonModal;