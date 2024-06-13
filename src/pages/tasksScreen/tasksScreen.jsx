import React, {useEffect, useState} from 'react';
import './tasksScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import {getUserData, getTasks, completeTask} from "../../httpRequests/dragonEggApi";
import NavBar from "../../components/navBar/navBar";
import scoreCoin from "../../img/icons/sadCoin.png";
import storeTemplateData from '../../storeTemplateData/storeTemplateData.json'
import ComingSoonModal from "../../components/modals/ComingSoonModal/ComingSoonModal";
import useStore from "../../store/zustand.store/store";


export const TasksScreen = () => {
    const {user} = useTelegram();
    const userId = user?.id || '777217409'; //'409840876' ;
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);

    //STORE
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);

    const {score,} =
        useStore((state) => ({
            score: state.score,
            overallScore: state.overallScore
        }));


    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            const user = await fetchUserData();
            const tasks = await getTasks(userId);
            setTasks(tasks.tasks);
            console.log(tasks)
            if (!score) {
                setScore(user.scores.score);
            }

        };
        console.log(user)

        if (userId) {
            fetchUserDataAndDisplay();
        }
    }, [userId]);


    const handleModalToggle = () => {
        setShowModal(!showModal);
    };
    const fetchUserData = async () => {
        const response = await getUserData(userId);
        return response.user;
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const response = await completeTask(userId, {taskId});

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === response.completedTaskId ? { ...task, done: true } : task
                )
            );
            setScore(response.score);
            setOverallScore(response.overallScore);

        } catch (error) {
            console.error("Failed to complete task:", error);
        }
    };


    return (
        <div className="store-screen">
            <div className="store-container">
                <div className={'products-store-block'}>
                    <div className={'headerStoreBlock'}>
                        <div className="header-container">
                            <div className={'headerScoreBlock'}>
                                <div className={'headerScoreText'}>
                                    <img src={scoreCoin}></img>
                                    <p>{score}</p>
                                </div>
                            </div>
                            <p className={'lvlText'}>lvl 12</p>
                            <div className="lvl-progress-container">
                                <div className={'lvl-progress-bar'}>
                                    <div className={'lvl-progress-line'}
                                         style={{width: `55%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
                    <div className="products-scroll-block">
                        {tasks.map(task => (
                            <div key={task._id} className={'store-product-item'}>
                                <div className={'store-product-item-upgrade-block'}>
                                    <div>
                                        <div>
                                            <div className={'store-product-item-info'}>
                                                <div className={'store-product-item-info-block'}>
                                                    <b className={'store-product-item-info-title'}>{task.title}</b>
                                                    <p className={'store-product-item-description'}>{task.description}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className={'store-product-upgrade-nums'}>
                                                    <p>{task.reward}</p>
                                                    <img src={scoreCoin} alt="Score Coin"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'upgrade-btn'}>
                                        {task.done ? (
                                            <p>Done</p>
                                        ) : (
                                            <p onClick={() => handleCompleteTask(task._id)}>
                                                Do it!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <NavBar/>
            </div>
            {showModal && <ComingSoonModal onClose={handleModalToggle}/>}
        </div>
    );
}

export default TasksScreen;