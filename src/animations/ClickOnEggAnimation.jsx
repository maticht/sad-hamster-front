import React, {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import "./animationStyles.css";

const ClickEffect = ({ x, y, damage}) => {

    useEffect(()=> {
        console.log(x, y)
    },[])

    return (
        <motion.div
            className={`click-effect`}
            style={{
                position: 'fixed',
                left: x,
                top: y,
                color: '#ffffff',
                pointerEvents: 'none',
            }}
            initial={{ opacity: 1, y: -100 }}
            animate={{ opacity: 0.7, y: -800 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => {
                setTimeout(() => {
                    document.querySelector('.click-effect').remove();
                }, 500);
            }}
        >
            {damage}
        </motion.div>
    );
}

export default ClickEffect;
