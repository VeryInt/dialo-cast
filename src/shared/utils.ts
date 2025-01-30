import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'

// 通用延迟方法
export const sleep = (seconds: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000)
    })
}

// 从下发的文本中提取JSON数组
export const extractJsonFromText = (text: string): Record<string, any> | null => {
    const regex = /{{jsonstart}}\s*\{[\s\S]*?\}\s*{{jsonend}}/
    const match = text?.replace(/[\r\n]+/g, '')?.match(regex)
    let jsonResult: Record<string, any> = {}
    if (match && match[0]) {
        let jsonString = match[0].replace('{{jsonstart}}', '').replace('{{jsonend}}', '').trim()
        jsonString = jsonString.replace(/[\r\n]+/g, '') // 移除所有换行符
        console.log('Extracted JSON String:', jsonString)
        try {
            jsonResult = JSON.parse(jsonString)
        } catch {
            console.error('Invalid JSON format in dialogue')
        }
    }
    console.log('Parsed JSON Result:', jsonResult)
    const { dialogue, title } = jsonResult || {}
    return {dialogueList: dialogue, title}
}

export const extractJsonFromObject = (obj: Record<string, any>): Record<string, any> | null => {
    let jsonArray = []
    const { podcast_dialogue } = obj || {}
    const { dialogue, title } = podcast_dialogue || {}
    return {dialogueList: dialogue, title}
}

/**
 * 顺序执行异步任务队列
 * @param tasks 返回 Promise 的任务数组
 * @param gapS 任务之间的间隔时间（秒）
 * @returns 按顺序返回所有结果的 Promise
 */
export const constsequentialAsyncCalls = async <T>(tasks: (() => Promise<T>)[], gapS: number = 0) => {
    const results: T[] = []

    for (const task of tasks) {
        // 等待当前任务完成
        const result = await task()
        results.push(result)

        // 添加间隔等待（最后一个任务后不等待）
        if (gapS > 0 && tasks.indexOf(task) !== tasks.length - 1) {
            await sleep(gapS)
        }
    }

    return results
}

/**
 * 自定义的 "延迟执行版" Promise.all
 * @param {Array<() => Promise<any>>} functionsArray - 返回 Promise 的函数数组
 * @returns {Promise<any[]>} - 所有 Promise 完成后的结果数组
 */
export const fetchAll = functionsArray => {
    // 1. 遍历函数数组，依次执行每个函数以生成 Promise
    const promises = _.map(functionsArray, fn => {
        if (typeof fn !== 'function') {
            // 如果数组元素不是函数，抛出错误（或返回一个拒绝的 Promise）
            throw new Error('PromiseAllNew 要求数组元素为返回 Promise 的函数')
        }
        return fn() // 执行函数，启动异步操作
    })

    // 2. 使用原生 Promise.all 监听所有生成的 Promise
    return Promise.all(promises)
}

export const formatPlayTime = (playTime: number): string => {
    playTime = playTime || 0
    const minutes = Math.floor(playTime / 60)
    const seconds = Math.floor(playTime % 60)
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const ActiveTypeList = {
    [8]: `交通`,
}
export const extractDailyInfo = (IntroductionInfoList: Record<string, any>[]): string => {
    let dailyText = ''
    _.map(IntroductionInfoList, (item, index) => {
        const { Desc, DailyList } = item || {}
        dailyText += `第${index + 1}天 ${Desc}\n`
        _.map(DailyList, (dailyItem, dailyIndex) => {
            const { DepartTime, ActiveType, Desc, ScenicSpotList, TakeMinutes } = dailyItem || {}
            let theInfo = ``
            if (DepartTime) {
                theInfo += `时间: ${DepartTime}\n`
            }
            if (Desc) {
                theInfo += `活动内容: ${sanitizeHtmlClear(Desc || '')}\n`
            }
            if (ScenicSpotList?.length) {
                _.map(ScenicSpotList, (scenic, scenicIndex) => {
                    const { Introduce, SuffixName, Name } = scenic || {}
                    theInfo += `景点${scenicIndex + 1}: ${Name}${SuffixName || ''}\n${sanitizeHtmlClear(Introduce || '')}\n`
                })
            }
            if (TakeMinutes > 0) {
                theInfo += `活动时间: ${TakeMinutes}分钟\n`
            }
            dailyText += theInfo + '\n'
        })
    })
    return dailyText
}

const sanitizeHtmlClear = html => {
    return sanitizeHtml(html || '', {
        allowedTags: [],
        allowedAttributes: [],
    })
}
