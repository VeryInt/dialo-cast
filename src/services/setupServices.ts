// 用于在应用启动时注册所有服务，需要在主进程中启动
// 类似 nodejs 服务
import _ from 'lodash'
import { ipcMain, BrowserWindow, clipboard } from 'electron'
import FileServices from './FileServices'
import APIServices from './APIServices'
import SystemServices from './SystemServices'
import DatabaseServices from './DatabaseServices'

export default function setupServices() {
    // fileServices()
    // apiServices()
    // systemServices()

    Object.entries({
        ...SystemServices.handlers,
        ...FileServices.handlers,
        ...APIServices.handlers,
        ...DatabaseServices.handlers,
    }).forEach(([channel, handler]) => {
        ipcMain.handle(channel, handler)
    })

    Object.entries({
        ...SystemServices.events,
        ...FileServices.events,
        ...APIServices.events,
        ...DatabaseServices.events,
    }).forEach(([event, handler]) => {
        ipcMain.on(event, handler)
    })
}
