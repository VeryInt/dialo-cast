export const sleep = (seconds: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000)
    })
}

// 从下发的文本中提取JSON数组
export const extractJsonArrayFromText = (text: string): Record<string, any>[] | null => {
    const regex = /{{jsonstart}}\s*\[[\s\S]*?\]\s*{{jsonend}}/
    const match = text.match(regex)
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

        console.log('Parsed JSON Array:', jsonArray)
    }
    return jsonArray
}
