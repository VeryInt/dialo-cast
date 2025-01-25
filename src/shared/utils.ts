export const sleep = (seconds: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000)
    })
}

// 从下发的文本中提取JSON数组
export const extractJsonArrayFromText = (text: string): Record<string, any>[] | null => {
    const regex = /{{jsonstart}}\s*\[[\s\S]*?\]\s*{{jsonend}}/
    const match = text?.replace(/[\r\n]+/g, '')?.match(regex)
    let jsonArray = []
    if (match && match[0]) {
        let jsonString = match[0].replace('{{jsonstart}}', '').replace('{{jsonend}}', '').trim()
        jsonString = jsonString.replace(/[\r\n]+/g, '') // 移除所有换行符
        console.log('Extracted JSON String:', jsonString)
        try {
            jsonArray = JSON.parse(jsonString)
        } catch {
            console.error('Invalid JSON format in dialogue')
        }
    }
    console.log('Parsed JSON Array:', jsonArray)
    return jsonArray
}

// 通用延迟方法
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 顺序执行异步任务队列
 * @param tasks 返回 Promise 的任务数组
 * @param gapMs 任务之间的间隔时间（毫秒）
 * @returns 按顺序返回所有结果的 Promise
 */
export const constsequentialAsyncCalls = async <T>(tasks: (() => Promise<T>)[], gapMs: number = 0) => {
    const results: T[] = []

    for (const task of tasks) {
        // 等待当前任务完成
        const result = await task()
        results.push(result)

        // 添加间隔等待（最后一个任务后不等待）
        if (gapMs > 0 && tasks.indexOf(task) !== tasks.length - 1) {
            await delay(gapMs)
        }
    }

    return results
}
