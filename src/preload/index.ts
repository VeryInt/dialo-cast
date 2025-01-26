// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import type { ConfigValue, ElectronEvent, ElectronAPI } from '../shared/types'

const APIList: (keyof ElectronAPI)[] = [
    'getConfig',
    'saveConfig',
    'fetchDialogue',
    'fetchMinMaxAudio',
    'saveAudio',
    'mergetAudio',
    'readAudioFile',
    'fetchProductDailyList',
    'openLink',
]
const eventList: (keyof ElectronEvent)[] = ['minimizeToTray']

// 类型安全的通用 IPC 调用构造器, 精确约束每个属性
const createIPCBridge = <T extends { [K in keyof T]: (...args: any[]) => Promise<any> }>(
    APIList: (keyof ElectronAPI)[]
) => {
    return Object.fromEntries(
        APIList.map(method => [
            method,
            async (...args: unknown[]) => {
                // 添加统一错误处理（可选扩展）
                try {
                    return await ipcRenderer.invoke(method, ...args)
                } catch (error) {
                    console.error(`IPC调用 ${method} 失败:`, error)
                    throw error // 保持与原始Promise相同的拒绝行为
                }
            },
        ])
    ) as T
}

// 通过类型系统自动生成桥接方法
const electronAPI = createIPCBridge<ElectronAPI>(APIList)

// 安全暴露给渲染进程,
// 在preload阶段挂载方法到electronAPI上，供客户端页面调用，然后触发 ipcRenderer 发送消息到主进程
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// 通用事件桥接构造器
const createEventBridge = <T extends { [K in keyof T]: (...args: any[]) => void }>(
    eventList: (keyof ElectronEvent)[]
) => {
    return Object.fromEntries(
        eventList.map(eventName => [
            eventName,
            (...args: Parameters<T[keyof T]>) => {
                ipcRenderer.send(eventName, ...args)
            },
        ])
    ) as T
}

// 自动生成事件桥接方法
const electronEvent = createEventBridge<ElectronEvent>(eventList)

// 暴露给渲染进程
contextBridge.exposeInMainWorld('electronEvent', electronEvent)
