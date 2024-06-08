import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import HomeScreen from "./pages/homeScreen/homeScreen";
import StoreScreen from "./pages/storeScreen/storeScreen";
import ProfileScreen from "./pages/profileScreen/profileScreen";
import WalletScreen from "./pages/walletScreen/walletScreen";
import ShareScreen from "./pages/shareScreen/shareScreen";
import TopUsersScreen from './pages/topUsersScreen/topUsersScreen'
import AlchemistScreen from "./pages/alchemistScreen/alchemistScreen";
import FaultAppearanceScene from "./pages/faultAppearanceScene/faultAppearanceScene";
import GettingEggScene from "./pages/gettingEggScene/gettingEggScene";
import LoadingScreen from "./pages/LoadingScreen/LoadingScreen";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomeScreen/>}/>
                    <Route path='/store' element={<StoreScreen/>}/>
                    <Route path='/alchemist' element={<AlchemistScreen/>}/>
                    <Route path='/profile' element={<ProfileScreen/>}/>
                    <Route path='/wallet' element={<WalletScreen/>}/>
                    <Route path='/share' element={<ShareScreen/>}/>
                    <Route path='/topUsersScreen' element={<TopUsersScreen/>}/>
                    <Route path='/faultAppearanceScene' element={<FaultAppearanceScene/>}/>
                    <Route path='/gettingEggScene' element={<GettingEggScene/>}/>
                    <Route path='/loadingScreen' element={<LoadingScreen/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
