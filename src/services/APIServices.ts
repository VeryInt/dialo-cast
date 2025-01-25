import { ipcMain } from 'electron'
import OpenAI from 'openai'
import { PODCAST_EXPERT_PROMPT } from '../shared/constants'
let openaiInstance: OpenAI | null = null

const handlers = {
    // 根据topic生成对话
    fetchDialogue: async (event, { topic, apiKey }: { topic: string; apiKey?: string }) => {
        try {
            const openai = getOpenAI(apiKey)
            const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
                { role: 'system', content: PODCAST_EXPERT_PROMPT },
                { role: 'user', content: topic },
            ]
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: `deepseek-coder-v2-lite-instruct`,
            })
            return completion?.choices[0]?.message?.content
        } catch (error) {
            console.log('Error fetching dialogue:', error)
            throw new Error('Failed to fetch dialogue')
        }
    },

    fetchMinMaxAudio: async (event, { content, emotion }: { content: string; emotion?: string }) => {
        const apiKey = process.env.MIN_MAX_API_KEY
        console.log(`apikey is ${apiKey}`)
        const groundID = process.env.MIN_MAX_GROUND_ID
        console.log(`groundID is ${groundID}`)
        const url = `https://api.minimax.chat/v1/t2a_v2?GroupId=${groundID}`
        try {
            const headers = {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
            const body = {
                model: 'speech-01-turbo',
                text: content,
                stream: false,
                voice_setting: {
                    voice_id: 'male-qn-qingse',
                    speed: 1,
                    vol: 1,
                    pitch: 0,
                    emotion: emotion || '',
                },
                audio_setting: {
                    sample_rate: 32000,
                    bitrate: 128000,
                    format: 'mp3',
                    channel: 1,
                },
            }
            const result = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            })
            const response = await result.json()
            console.log(`response`, typeof response?.data?.audio, response)
            return response?.data?.audio
        } catch (e) {}
        return null
    },
}

const events = {}

const getOpenAI = (apiKey: string) => {
    apiKey = apiKey || ``

    if (apiKey != global?.openaiAPI?.apiKey || !openaiInstance) {
        openaiInstance = new OpenAI({
            baseURL: 'http://127.0.0.1:1234/v1',
            apiKey: apiKey,
        })
        return openaiInstance
    }
    return openaiInstance
}

export default {
    handlers,
    events,
}
