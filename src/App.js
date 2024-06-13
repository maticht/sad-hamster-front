import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import HomeScreen from "./pages/homeScreen/homeScreen";
import StoreScreen from "./pages/storeScreen/storeScreen";
import ShareScreen from "./pages/shareScreen/shareScreen";
import TopUsersScreen from './pages/topUsersScreen/topUsersScreen'
import LoadingScreen from "./pages/LoadingScreen/LoadingScreen";
import TasksScreen from "./pages/tasksScreen/tasksScreen";
import MiniGameScreen from "./pages/miniGameScreen/miniGameScreen";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomeScreen/>}/>
                    <Route path='/store' element={<StoreScreen/>}/>
                    <Route path='/share' element={<ShareScreen/>}/>
                    <Route path='/topUsersScreen' element={<TopUsersScreen/>}/>
                    <Route path='/loadingScreen' element={<LoadingScreen/>}/>
                    <Route path='/tasksScreen' element={<TasksScreen/>}/>
                    <Route path='/miniGameScreen' element={<MiniGameScreen/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
