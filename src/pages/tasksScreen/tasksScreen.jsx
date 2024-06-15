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

    //STORE
    const setScore = useStore((state) => state.setScore);
    const setOverallScore = useStore((state) => state.setOverallScore);
    const setTasks = useStore((state) => state.setTasks);

    const {score, overallScore, tasks} =
        useStore((state) => ({
            score: state.score,
            overallScore: state.overallScore,
            tasks: state.tasks,
        }));


    useEffect(() => {
        const fetchUserDataAndDisplay = async () => {
            if(!score || ! overallScore){
                const user = await fetchUserData();
                if (!score) {
                    setScore(user.scores.score);
                }
                if(!setOverallScore){
                    setOverallScore(user.scores.overallScore);
                }
            }
            if(!tasks.length){
                const tasks = await getTasks(userId);
                setTasks(tasks.tasks);
                console.log(tasks)
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
            const newTasks = tasks.map(task =>
                task._id === response.completedTaskId ? { ...task, done: true } : task
            )
            setTasks(newTasks);
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