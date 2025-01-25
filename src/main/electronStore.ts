// src/main/electronStore.ts
import Store from 'electron-store'
import { ConfigValue } from '../shared/types'

const configStore = new Store()

export const saveConfig = (key: string, value: ConfigValue) => {
    // @ts-ignore
    configStore.set(key, value)
}

export const getConfig = (key: string): ConfigValue | undefined => {
    // @ts-ignore
    return configStore.get(key) || ``
}
