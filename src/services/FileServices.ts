import { ipcMain } from 'electron'
import fs from 'fs/promises'

const handlers = {}

const events = {}

export default {
    handlers,
    events,
}
