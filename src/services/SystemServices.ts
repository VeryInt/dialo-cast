import { ipcMain, BrowserWindow, clipboard } from 'electron'
import { platform } from 'os'
import { getConfig, saveConfig } from '../main/electronStore'
import { ConfigValue } from '../shared/types'
import { exec } from 'child_process'

const handlers = {
    getConfig: (event: Electron.IpcMainInvokeEvent, key: string) => {
        return getConfig(key)
    },
    saveConfig: async (event: Electron.IpcMainInvokeEvent, key: string, value: ConfigValue) => {
        return saveConfig(key, value)
    },
    openLink: async (event: Electron.IpcMainInvokeEvent, link: string) => {
        return openChrome(link)
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

function openChrome(url: string) {
    let command: string

    switch (platform()) {
        case 'win32': // Windows
            command = `start chrome "${url}"`
            break
        case 'darwin': // macOS
            command = `open -a "Google Chrome" "${url}"`
            break
        default: // Linux 和其他系统
            command = `google-chrome "${url}"`
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行出错: ${error}`)
            return
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`)
            return
        }
        console.log(`Chrome 已启动并访问: ${url}`)
    })
}

export default {
    handlers,
    events,
}
