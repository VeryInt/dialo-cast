import React, { useEffect, useState } from 'react'
import { MainStoreProvider, useMainStore } from './providers'
import _ from 'lodash'
import MainPage from './MainPage'
import MainInterface from './pages/MainInterface'
import { electronServices } from '../services'
import Settings from './pages/Settings'
import Sidebar from './components/SideBar'

const Main = () => {
    const state = useMainStore(state => state)
    const { currentPage } = state || {}
    useEffect(() => {
        setTimeout(() => {
            electronServices.getConfig('audioInfo').then(result => {
                console.log(result)
            })
        }, 2000)
    })

    return (
        <div className="flex flex-row w-full h-full bg-gray-300 min-w-fit">
            <div className="w-16 h-full">
                <Sidebar />
            </div>
            <div className="flex-1 p-10">
                <div className="flex flex-col min-w-lg w-full">
                    {currentPage == 'main' && <MainInterface />}
                    {currentPage == 'settings' && <Settings />}
                </div>
            </div>
        </div>
    )
}

const App: React.FC = () => {
    return (
        <MainStoreProvider>
            <Main />
        </MainStoreProvider>
    )
}

export default App
