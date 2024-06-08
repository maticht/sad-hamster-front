import React,{useState,useContext, createContext, useEffect} from "react";
export const dragonEggContext = createContext();


export const dragonEggProvider = ({children}) => {


    return (
        <dragonEggContext.Provider
            value={{}}
        >
            {children}
        </dragonEggContext.Provider>
    );
}

export const useDragonEggContext = () => {
    return useContext(dragonEggContext);
};