import { ipcMain, BrowserWindow, clipboard } from 'electron'
import { platform } from 'os'
import { getConfig, saveConfig } from '../main/electronStore'
import { ConfigValue } from '../shared/types'

export default function SystemServices() {
    ipcMain.on('minimize-to-tray', event => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (win) {
            win.hide()
        }
        // if (platform() === 'win32') {
        //     win.setAlwaysOnTop(true, 'normal');
        //     win.setVisibleOnAllWorkspaces(false);
        //     win.hide();
        // } else {
        //     win.minimize();
        // }
    })

    ipcMain.handle('getConfig', (event, key) => {
        return getConfig(key)
    })

    ipcMain.handle('saveConfig', async (event, key: string, value: ConfigValue) => {
        return saveConfig(key, value)
    })
}
