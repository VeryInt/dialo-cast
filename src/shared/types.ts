import { VoicePresetValues, DIALOGUE_TYPE } from '../shared/constants'
declare global {
    interface Window {
        electronAPI?: ElectronAPI
        electronEvent?: ElectronEvent
    }
}

// dialogue types
export interface DialogueProps {
    id?: number
    title?: string
    keywords?: string
    type?: DIALOGUE_TYPE
    dialogue_list: Array<{
        content: string
        emotion: string
        host: string
    }>
    createdAt?: string // datetime
    audioFiles?: Array<{
        id?: number
        filePath?: string
        createdAt?: string
    }>
}

export interface ElectronEvent {
    minimizeToTray: () => void
}

export interface ElectronAPI {
    openLink: (link: string) => Promise<void>

    // electron-store
    getConfig: (key: string) => Promise<ConfigValue>
    saveConfig: (key: string, value: ConfigValue) => Promise<void>

    // fetch List
    fetchDialogue: ({ topic, requestJson }: { topic: string; requestJson?: boolean }) => Promise<Record<string, any>>
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

    // File Services
    saveAudio: (hexData: string, filename: string) => Promise<Record<string, any>>
    mergetAudio: (
        audioFileList: string[],
        filename: string
    ) => Promise<{ success: boolean; path: string; buffer: Buffer }>
    readAudioFile: (filePath: string) => Promise<Buffer>

    // Database Services
    databaseSaveDialogue: (props: { audioFilePath: string } & DialogueProps) => Promise<Record<string, any>>
    databaseGetDialogue: (dialogueID: DialogueProps['id']) => Promise<Record<string, any>>
    databaseListDialogues: (page: number, pageSize?: number) => Promise<Record<string, any>>
    databaseDelDialogue: (dialogueID: DialogueProps['id']) => Promise<Record<string, any>>
}

export type ConfigValue = Record<string, any> | string | number | boolean
