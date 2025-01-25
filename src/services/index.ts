import { ConfigValue } from '../shared/types'

// 暴露给页面（客户端）
export const electronServices = {
    getConfig: (key: string) => {
        // 触发挂载在window上的electronAPI的getConfig方法，electronAPI在preload阶段挂载这些方法
        return window.electronAPI.getConfig(key)
    },
    saveConfig: (key: string, value: ConfigValue) => {
        return window.electronAPI.saveConfig(key, value)
    },
}
