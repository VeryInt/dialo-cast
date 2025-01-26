import { ipcMain } from 'electron'
import OpenAI from 'openai'
import { PODCAST_EXPERT_PROMPT, AUDIO_Emotion_List, VoicePresetValues, voicePresets } from '../shared/constants'
import _ from 'lodash'
import { extractDailyInfo } from '../shared/utils'
let openaiInstance: OpenAI | null = null

const handlers = {
    // 根据topic生成对话
    fetchDialogue: async (event, { topic, apiKey }: { topic: string; apiKey?: string }) => {
        try {
            const openai = getOpenAI(apiKey || process.env.MIN_MAX_API_KEY)
            const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
                { role: 'system', content: PODCAST_EXPERT_PROMPT },
                { role: 'user', content: topic },
            ]
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: `MiniMax-Text-01`, //`deepseek-chat`, // `deepseek-reasoner`,
            })
            console.log(`fetchDialogue`, completion?.choices[0]?.message?.content)
            return completion?.choices[0]?.message?.content
        } catch (error) {
            console.log('Error fetching dialogue:', error)
            throw new Error('Failed to fetch dialogue')
        }
    },

    fetchMinMaxAudio: async (
        event,
        { content, emotion, voiceID }: { content: string; emotion?: string; voiceID?: VoicePresetValues }
    ) => {
        const apiKey = process.env.MIN_MAX_API_KEY
        const groundID = process.env.MIN_MAX_GROUND_ID
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
                    speed: 1,
                    vol: 1.5, // 音量
                    pitch: -1, // 声调
                    // emotion: _.includes(AUDIO_Emotion_List, emotion) ? emotion : '',
                },
                audio_setting: {
                    sample_rate: 32000,
                    bitrate: 128000,
                    format: 'mp3',
                    channel: 1,
                },
            }
            if (_.includes(AUDIO_Emotion_List, emotion)) {
                body.voice_setting.emotion = emotion
            }
            const result = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            })
            const response = await result.json()
            console.log(`🐹🐹🐹fetchMinMaxAudio get result`, response?.data?.audio?.length, content)
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
