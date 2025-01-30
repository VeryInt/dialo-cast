import { ipcMain } from 'electron'
import OpenAI from 'openai'
import {
    PODCAST_EXPERT_PROMPT,
    EMOTION_MAP,
    VoicePresetValues,
    voicePresets,
    CONFIG_STORE_KEYS,
    PODCAST_JSON_SCHEMA,
    ENG_PODCAST_EXPERT_PROMPT,
} from '../shared/constants'
import _ from 'lodash'
import { extractDailyInfo, extractJsonFromText, extractJsonFromObject } from '../shared/utils'
import { getConfig } from '../main/electronStore'
let openaiInstance: OpenAI | null = null

const handlers = {
    // 根据topic生成对话
    fetchDialogue: async (
        event,
        { topic, apiKey, requestJson }: { topic: string; apiKey?: string; requestJson?: boolean }
    ) => {
        const modelName = `MiniMax-Text-01` // `abab6.5s-chat` // MiniMax-Text-01`, //`deepseek-chat`, // `deepseek-reasoner`,
        try {
            const isEnglish = getConfig(CONFIG_STORE_KEYS.englishDialog) || false
            console.log(`isEnglish Dialogue`, isEnglish)
            const openai = getOpenAI(
                apiKey || (getConfig(CONFIG_STORE_KEYS.miniMaxApiKey) as string) || process.env.MIN_MAX_API_KEY
            )
            const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
                { role: 'system', content: isEnglish ? ENG_PODCAST_EXPERT_PROMPT : PODCAST_EXPERT_PROMPT },
                { role: 'user', content: topic },
            ]
            if (requestJson) {
                console.log(`🐹🐹🐹 start fetchDialogue`)
                const completion = await openai.beta.chat.completions.parse({
                    messages: messages,
                    model: modelName,
                    max_tokens: 30720,
                    response_format: { type: 'json_schema', json_schema: PODCAST_JSON_SCHEMA },
                })
                const event = completion.choices[0].message?.parsed
                const { dialogueList, title } = extractJsonFromObject(event)
                return { dialogueList, title }
            } else {
                const completion = await openai.chat.completions.create({
                    messages: messages,
                    model: modelName,
                    max_tokens: 30720,
                })
                console.log(`🐹🐹🐹 completion?.choices[0]?.message?.content`, completion?.choices[0]?.message?.content)
                const { dialogueList, title } = extractJsonFromText(completion?.choices[0]?.message?.content)
                return { dialogueList, title }
            }
        } catch (error) {
            console.log('Error fetching dialogue:', error)
            throw new Error('Failed to fetch dialogue')
        }
        return null
    },

    fetchMinMaxAudio: async (
        event,
        { content, emotion, voiceID }: { content: string; emotion?: string; voiceID?: VoicePresetValues }
    ) => {
        const apiKey = (getConfig(CONFIG_STORE_KEYS.miniMaxApiKey) as string) || process.env.MIN_MAX_API_KEY || ``
        const groundID = (getConfig(CONFIG_STORE_KEYS.miniMaxGroupID) as string) || process.env.MIN_MAX_GROUND_ID || ``
        const url = `https://api.minimax.chat/v1/t2a_v2?GroupId=${groundID}`
        console.log(`🐹🐹🐹fetchMinMaxAudio start`, content, emotion, voiceID)
        try {
            const headers = {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
            const body: Record<string, any> = {
                model: 'speech-01-turbo',
                text: content,
                stream: false,
                voice_setting: {
                    voice_id: voiceID || voicePresets.badaoShaoye.value,
                    speed: 1.15, // 语速
                    vol: 2, // 音量
                    pitch: -1, // 声调
                },
                audio_setting: {
                    sample_rate: 32000,
                    bitrate: 128000,
                    format: 'mp3',
                    channel: 1,
                },
            }
            if (EMOTION_MAP[emotion]?.value) {
                body.voice_setting.emotion = EMOTION_MAP[emotion].value
            }
            const result = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            })
            const response = await result.json()
            console.log(
                `🐹🐹🐹fetchMinMaxAudio get result`,
                response?.data?.audio?.status,
                response?.data?.audio?.length,
                content
            )
            return response?.data?.audio
        } catch (e) {}
        return null
    },

    fetchProductDailyList: async (event, { productID }: { productID: number }) => {
        const url = `https://online.ctrip.com/restapi/soa2/12447/ProductDetailTimingV5`
        try {
            const headers = {
                'Content-Type': 'application/json',
            }
            const body: Record<string, any> = {
                contentType: 'json',
                head: {
                    cid: '',
                    ctok: '',
                    cver: '1.0',
                    lang: '01',
                    sid: '8888',
                    syscode: '09',
                    auth: '',
                    extension: [],
                },
                ChannelCode: 0,
                ChannelId: 114,
                PlatformId: 4,
                Version: '856000',
                Locale: 'zh-CN',
                Currency: 'CNY',
                ProductId: String(productID),
                DepartureCityId: 2,
                QueryNode: {
                    IsTravelIntroductionInfo: true,
                },
            }
            const result = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            })
            const response = await result.json()
            const IntroductionInfoList =
                response?.Data?.TravelIntroductionInfo?.TravelIntroductionList?.[0].IntroductionInfoList || []
            console.log(`IntroductionInfoList`)
            return extractDailyInfo(IntroductionInfoList)
        } catch (e) {
            console.log(`fetchProductDailyList error `, e)
        }
        return null
    },
}

const events = {}

const getOpenAI = (apiKey: string) => {
    apiKey = apiKey || ``

    if (!openaiInstance) {
        // // deepseek
        // openaiInstance = new OpenAI({
        //     baseURL: 'https://api.deepseek.com',
        //     apiKey: apiKey,
        // })

        // minimax
        openaiInstance = new OpenAI({
            baseURL: 'https://api.minimax.chat/v1',
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
