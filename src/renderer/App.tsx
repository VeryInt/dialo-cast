import React, { useEffect, useState } from 'react'
import { MainStoreProvider, useMainStore } from './providers'
import _ from 'lodash'
import MainPage from './MainPage'
import MainInterface from './MainInterface'
import { electronServices } from '../services'

const Main = () => {
    useEffect(() => {
        electronServices.saveConfig('test', 'value1111')
        setTimeout(() => {
            electronServices.getConfig('test').then(result => {
                console.log(result)
            })
        }, 2000)
    })

    return (
        <div className="flex flex-col w-full">
            <MainInterface />
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
