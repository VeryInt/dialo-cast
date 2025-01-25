// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import { ConfigValue } from '../shared/types'

// 在preload阶段挂载方法到electronAPI上，供客户端页面调用，然后触发 ipcRenderer 发送消息到主进程
contextBridge.exposeInMainWorld('electronAPI', {
    minimizeToTray: () => ipcRenderer.send('minimize-to-tray'),
    getConfig: async (key: string) => {
        const result = await ipcRenderer.invoke('getConfig', key)
        return result
    },
    saveConfig: async (key: string, config: ConfigValue) => {
        console.log(`🐹🐹🐹 saveConfig: ${key}, ${config}`)
        return await ipcRenderer.invoke('saveConfig', key, config)
    },
})

console.log(`🐹🐹🐹preload script loaded`)
