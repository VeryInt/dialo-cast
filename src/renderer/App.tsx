import React, { useEffect, useState } from 'react'
import { MainStoreProvider, useMainStore } from './providers'
import _ from 'lodash'
import MainPage from './MainPage'
import MainInterface from './pages/MainInterface'
import { electronServices } from '../services'
import Settings from './pages/Settings'
import Sidebar from './components/SideBar'
import PodcastLibrary from './pages/PodcastLibrary'
import AudioSamples from './pages/AudioSamples'
// import { databaseService } from '../services/DatabaseService_reference'; // 引入 databaseService

const Main = () => {
    const state = useMainStore(state => state)
    const { currentPage } = state || {}

    // useEffect(() => {
    //     const testDatabase = async () => {
    //         try {
    //             // 创建 Item
    //             await databaseService.createItem('测试物品', '这是一个测试物品');
    //             console.log('Item 创建成功');

    //             // 获取所有 Items
    //             const items = await databaseService.getAllItems();
    //             console.log('所有 Items:', items);
    //         } catch (error) {
    //             console.error('数据库操作失败:', error);
    //         }
    //     };

    //     testDatabase();
    // }, []);

    return (
        <div className="flex flex-row w-full h-full bg-gray-300 min-w-fit">
            <div className="w-16 h-full">
                <Sidebar />
            </div>
            <div className="flex-1 p-10">
                <div className="flex flex-col min-w-lg w-full">
                    {<MainInterface className={`${currentPage == 'main' ? '' : 'hidden'}`} />}
                    {currentPage == 'settings' && <Settings />}
                    {currentPage == 'podcastLibrary' && <PodcastLibrary />}
                    {currentPage == 'audioSamples' && <AudioSamples />}
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
