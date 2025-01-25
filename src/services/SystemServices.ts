import { ipcMain, BrowserWindow, clipboard } from 'electron'
import { platform } from 'os'
import { getConfig, saveConfig } from '../main/electronStore'
import { ConfigValue } from '../shared/types'

const handlers = {
    getConfig: (event: Electron.IpcMainInvokeEvent, key: string) => {
        return getConfig(key)
    },
    saveConfig: async (event: Electron.IpcMainInvokeEvent, key: string, value: ConfigValue) => {
        return saveConfig(key, value)
    },
}

const events = {
    minimizeToTray: (event: Electron.IpcMainEvent) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (win) {
            win.hide()
        }
    },
}

export default {
    handlers,
    events,
}
