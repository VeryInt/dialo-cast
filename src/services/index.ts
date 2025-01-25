import { ConfigValue, ElectronAPI } from '../shared/types'

// 暴露给页面（客户端）
// export const electronServices = {
//     getConfig: (key: string) => {
//         // 触发挂载在window上的electronAPI的getConfig方法，electronAPI在preload阶段挂载这些方法
//         return window.electronAPI.getConfig(key)
//     },
//     saveConfig: (key: string, value: ConfigValue) => {
//         return window.electronAPI.saveConfig(key, value)
//     },
// }

// 类型驱动自动生成方法映射
type ElectronService = {
    [K in keyof ElectronAPI]: ElectronAPI[K] extends (...args: infer P) => infer R ? (...args: P) => R : never
}

// 动态创建代理对象 暴露给页面（客户端）
export const electronServices = new Proxy<ElectronService>({} as ElectronService, {
    get: <K extends keyof ElectronAPI>(_: unknown, method: K) => {
        return (...args: Parameters<ElectronAPI[K]>) => {
            console.log(`🐹🐹🐹method：${method}`, window.electronAPI)
            // 类型断言：明确参数类型与目标方法匹配
            const apiMethod = window.electronAPI[method] as (
                ...args: Parameters<ElectronAPI[K]>
            ) => ReturnType<ElectronAPI[K]>

            return apiMethod(...args)
        }
    },
})
