// 用于仅存放renderer层的constants
import { Home, Headphones, Settings, FileAudio, Podcast } from 'lucide-react'

type ExtractPropValues<T extends readonly any[], K extends string> = T[number] extends infer Item
    ? Item extends { [P in K]: infer V }
        ? V
        : never
    : never

export const navPages = [
    { icon: Home, label: '主界面', value: 'main' },
    { icon: FileAudio, label: '音频示例', value: 'audioSamples' },
    { icon: Podcast, label: '播客库', value: 'podcastLibrary' },
    { icon: Settings, label: '设置', value: 'settings' },
] as const

// 提取所有 value 的类型（自动过滤没有 value 的项）
export type NavPageValue = ExtractPropValues<typeof navPages, 'value'>
