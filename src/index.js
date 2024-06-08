import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {dragonEggProvider} from "./store/dragonEggStore";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <dragonEggProvider>
        <App />
    </dragonEggProvider>
);
