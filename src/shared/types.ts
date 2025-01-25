import { VoicePresetValues } from '../shared/constants'
declare global {
    interface Window {
        electronAPI?: ElectronAPI
        electronEvent?: ElectronEvent
    }
}

export interface ElectronEvent {
    minimizeToTray: () => void
}

export interface ElectronAPI {
    getConfig: (key: string) => Promise<ConfigValue>
    saveConfig: (key: string, value: ConfigValue) => Promise<void>
    fetchDialogue: ({ topic }: { topic: string }) => Promise<string>
    fetchProductDailyList: ({ productID }: { productID: number }) => Promise<string>
    fetchMinMaxAudio: ({
        content,
        emotion,
        voiceID,
    }: {
        content: string
        emotion?: string
        voiceID?: VoicePresetValues
    }) => Promise<string>
    saveAudio: (hexData: string, filename: string) => Promise<Record<string, any>>
    mergetAudio: (
        audioFileList: string[],
        filename: string
    ) => Promise<{ success: boolean; path: string; buffer: Buffer }>
    readAudioFile: (filePath: string) => Promise<Buffer>
}

export type ConfigValue = Record<string, any> | string | number | boolean
