declare global {
    interface Window {
        electronAPI?: ElectronAPI
    }
}

interface ElectronAPI {
    getConfig: (key: string) => Promise<ConfigValue>
    saveConfig: (key: string, value: ConfigValue) => Promise<void>
}

export type ConfigValue = Record<string, any> | string | number | boolean
