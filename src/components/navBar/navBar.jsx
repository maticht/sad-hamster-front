import './navBar.css';
import home from '../../img/navbar/home3.png';
import store from '../../img/navbar/store3.png';
import shear from '../../img/navbar/shearClan3.png';
import wallet from '../../img/icons/scoreCoin.png';
import { Link, useLocation } from "react-router-dom";
import React from "react";

function NavBar() {
    const location = useLocation();

    return (
        <div className={'navBarBlock'}>
            <Link to="/" className={`navBarLink ${location.pathname === '/' ? 'active' : ''}`}>
                <img src={home} className={"App-logo"} alt={"logo"} />
            </Link>
            <Link to="/store" className={`navBarLink ${location.pathname === '/store' ? 'active' : ''}`}>
                <img src={store} className={"App-logo"} alt={"logo"} />
            </Link>
            <Link to="/share" className={`navBarLink ${location.pathname === '/share' ? 'active' : ''}`}>
                <img src={shear} alt={"logo"} />
            </Link>
            <Link to="/wallet" className={`navBarLink ${location.pathname === '/wallet' ? 'active' : ''}`}>
                <img src={wallet} alt={"logo"} />
            </Link>
        </div>
    );
}

export default NavBar;