import React, { useEffect, useState } from 'react'
import { MainStoreProvider, useMainStore } from './providers'
import _ from 'lodash'
import MainPage from './MainPage'

const Main = () => {
    return (
        <div className="flex flex-col w-full">
            <MainPage />
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
