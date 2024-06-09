import './navBar.css';
import iconRef from '../../img/navbar/refSad.png';
import iconTask from '../../img/navbar/taskSad.png';
import iconHome from '../../img/navbar/homeSad.png';
import iconBoost from '../../img/navbar/boostSad.png';
import iconTop from '../../img/navbar/topSad.png';
import { Link, useLocation } from "react-router-dom";
import React from "react";

function NavBar() {
    const location = useLocation();

    return (
        <div className={'navBarBlock'}>
            <Link to="/share" className={`navBarLink`}>
                {location.pathname !== '/share' ?
                    <p>Ref</p> :
                    <img src={iconRef} alt={"logo"} />
                }
            </Link>
            <Link to="/tasksScreen" className={`navBarLink`}>
                {location.pathname !== '/tasksScreen' ?
                    <p>Task</p> :
                    <img src={iconTask} alt={"logo"} />
                }
            </Link>
            <Link to="/" className={`navBarLink`}>
                {location.pathname !== '/' ?
                    <p>Home</p> :
                    <img src={iconHome} alt={"logo"} />
                }
            </Link>
            <Link to="/store" className={`navBarLink`}>
                {location.pathname !== '/store' ?
                    <p>Boost</p> :
                    <img src={iconBoost} alt={"logo"} />
                }
            </Link>
            <Link to="/topUsersScreen" className={`navBarLink`}>
                {location.pathname !== '/topUsersScreen' ?
                    <p>Top</p> :
                    <img src={iconTop} alt={"logo"} />
                }
            </Link>
        </div>
    );
}

export default NavBar;