import React, { useEffect, useState } from 'react'
import { MainStoreProvider, useMainStore } from './providers'
import _ from 'lodash'
import MainPage from './MainPage'
import MainInterface from './MainInterface'

const Main = () => {
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
