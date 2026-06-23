import React, { createContext, useState, useContext } from 'react';
import { dummyInventory } from '../data/dummyInventory';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [inventory, setInventory] = useState(dummyInventory);
    const [userProfile, setUserProfile] = useState({
        nama: 'Bagus Radhit Pratama',
        role: 'Manajer Operasional',
        email: 'baguspratama5000@gmail.com'
    });

    return (
        <AppContext.Provider value={{ inventory, setInventory, userProfile, setUserProfile }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);