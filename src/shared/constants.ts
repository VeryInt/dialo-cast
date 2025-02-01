export const AUDIO_GAP_TEXT = `<#0.60#>`
import { Home, Headphones, Settings, FileAudio, Podcast } from 'lucide-react'

export const enum DIALOGUE_TYPE {
    TOPIC = 'topic',
    PRODUCTID = 'productID',
    PDF = 'pdf',
}

export const CONFIG_STORE_KEYS = {
    miniMaxApiKey: `MIN_MAX_API_KEY`,
    miniMaxGroupID: `MIN_MAX_GROUND_ID`,
    hostVoiceOne: `HOST_VOICE_ONE`,
    hostVoiceTwo: `HOST_VOICE_TWO`,
    englishDialog: `IS_ENGLISH_DIALOG`,
}
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
export const EMOTION_MAP = {
    happy: { value: 'happy', desc: '高兴' },
    sad: { value: 'sad', desc: '悲伤' },
    angry: { value: 'angry', desc: '愤怒' },
    fearful: { value: 'fearful', desc: '害怕' },
    disgusted: { value: 'disgusted', desc: '厌恶' },
    surprised: { value: 'surprised', desc: '惊讶' },
    neutral: { value: 'neutral', desc: '中性' },
}

type VoicePreset = {
    desc: string
    value: string
}

type VoicePresetCollection = {
    [key: string]: VoicePreset
}

const voiceDemoBaseUrl = `https://filecdn.minimax.chat/public/`

export const voicePresets = {
    // 基础青年音色
    maleQnQingse: {
        title: '青涩青年音色',
        value: 'male-qn-qingse',
        desc: `青涩青年音色，声音清新自然，适合年轻化场景`,
        demo: `10b99171-a74e-4f7d-92e3-5f196fb71944.mp3`,
    },
    maleQnJingying: {
        title: '精英青年音色',
        value: 'male-qn-jingying',
        desc: `精英青年音色，声音沉稳有力，适合商务场景`,
        demo: `d8aa07c5-932a-4022-8601-07784e7191c6.mp3`,
    },
    maleQnBadao: { title: '霸道青年音色', value: 'male-qn-badao', demo: `afb80a39-6420-45c3-94f7-a892acc42ffb.mp3` },
    maleQnDaxuesheng: {
        title: '青年大学生音色',
        value: 'male-qn-daxuesheng',
        desc: ``,
        demo: `fa7ce166-35b3-41fb-9fa5-fc7c3b4f20f9.mp3`,
    },

    // 女性基础音色
    femaleShaonv: {
        title: '少女音色',
        value: 'female-shaonv',
        desc: ``,
        demo: `ee5ddfa7-46a7-4527-a8de-1ff7aba92d36.mp3`,
    },
    femaleYujie: {
        title: '御姐音色',
        value: 'female-yujie',
        desc: ``,
        demo: `e8ca7776-e8d2-40a7-be8e-5d4f5069e844.mp3`,
    },
    femaleChengshu: {
        title: '成熟女性音色',
        value: 'female-chengshu',
        desc: ``,
        demo: `099d09b8-6ff7-415e-a9f1-6cfba86743fc.mp3`,
    },
    femaleTianmei: {
        title: '甜美女性音色',
        value: 'female-tianmei',
        desc: ``,
        demo: `39b10431-fb38-4078-bdbd-72a344322f8f.mp3`,
    },

    // 主持人系列
    presenterMale: {
        title: '男性主持人',
        value: 'presenter_male',
        desc: ``,
        demo: `47738397-b662-480a-83d9-b041178a72b5.mp3`,
    },
    presenterFemale: {
        title: '女性主持人',
        value: 'presenter_female',
        desc: ``,
        demo: `4bbb28bc-e8a9-4b94-9396-2abc119c2caa.mp3`,
    },

    // 有声书系列
    audiobookMale1: {
        title: '男性有声书1',
        value: 'audiobook_male_1',
        desc: ``,
        demo: `6d5e5b99-bf39-45cb-aee1-31fc77c3fbf6.mp3`,
    },
    audiobookMale2: {
        title: '男性有声书2',
        value: 'audiobook_male_2',
        desc: ``,
        demo: `4a7e7b86-1b48-473b-91d9-9d390b8bbd30.mp3`,
    },
    audiobookFemale1: {
        title: '女性有声书1',
        value: 'audiobook_female_1',
        desc: ``,
        demo: `c81aeee6-af01-4b97-b0fe-b140c35d7ce5.mp3`,
    },
    audiobookFemale2: {
        title: '女性有声书2',
        value: 'audiobook_female_2',
        desc: ``,
        demo: `7adce957-19b5-47d3-9d60-059292ad931c.mp3`,
    },

    // 精品Beta音色
    maleQnQingseBeta: {
        title: '青涩青年音色-beta',
        value: 'male-qn-qingse-jingpin',
        desc: ``,
        demo: `71589024-ae4c-41a8-8505-1812861c70c2.mp3`,
    },
    maleQnJingyingBeta: {
        title: '精英青年音色-beta',
        value: 'male-qn-jingying-jingpin',
        desc: ``,
        demo: `38129556-621b-47f6-9bc1-3ea5511b22d0.mp3`,
    }, // good
    maleQnBadaoBeta: {
        title: '霸道青年音色-beta',
        value: 'male-qn-badao-jingpin',
        desc: ``,
        demo: `787ae03a-3c3d-4cdf-a8dd-71ec02d50579.mp3`,
    },
    maleQnDaxueshengBeta: {
        title: '青年大学生音色-beta',
        value: 'male-qn-daxuesheng-jingpin',
        desc: ``,
        demo: `15cf3fab-8757-4ee8-8b59-5f57bb03d15b.mp3`,
    },
    femaleShaonvBeta: {
        title: '少女音色-beta',
        value: 'female-shaonv-jingpin',
        desc: ``,
        demo: `b7dcaee4-7d66-46ec-a22b-ccc449a67cd4.mp3`,
    },
    femaleYujieBeta: {
        title: '御姐音色-beta',
        value: 'female-yujie-jingpin',
        desc: ``,
        demo: `3d5389dd-2cc7-4e28-8031-53d051ffc316.mp3`,
    },
    femaleChengshuBeta: {
        title: '成熟女性音色-beta',
        value: 'female-chengshu-jingpin',
        desc: ``,
        demo: `64a5894e-ee52-43a6-a746-090a79b4f774.mp3`,
    },
    femaleTianmeiBeta: {
        title: '甜美女性音色-beta',
        value: 'female-tianmei-jingpin',
        desc: ``,
        demo: `38e6e4c9-3032-4ffa-8679-f99d0ffebebb.mp3`,
    },

    // 特色角色音色
    cleverBoy: { title: '聪明男童', value: 'clever_boy', desc: ``, demo: `ad50cf8c-f7a9-494f-a042-0117926ea452.mp3` },
    cuteBoy: { title: '可爱男童', value: 'cute_boy', desc: ``, demo: `77c912da-87a1-4c74-a8d2-ca7faacfeb85.mp3` },
    lovelyGirl: { title: '萌萌女童', value: 'lovely_girl', desc: ``, demo: `bb7ada4d-848e-419a-b12c-52838f2043fd.mp3` },
    cartoonPig: {
        title: '卡通猪小琪',
        value: 'cartoon_pig',
        desc: ``,
        demo: `b326f50f-261a-4fbc-977d-d83091e4921f.mp3`,
    },
    bingjiaoDidi: {
        title: '病娇弟弟',
        value: 'bingjiao_didi',
        desc: ``,
        demo: `4989e5cd-4aa1-4d08-a348-51b7f6ef3709.mp3`,
    },
    junlangNanyou: {
        title: '俊朗男友',
        value: 'junlang_nanyou',
        desc: ``,
        demo: `4735ced5-7345-42d1-a746-800cabb74c16.mp3`,
    },
    chunzhenXuedi: {
        title: '纯真学弟',
        value: 'chunzhen_xuedi',
        desc: ``,
        demo: `51567885-d9f5-421c-a78e-7460748a1b55.mp3`,
    },
    lengdanXiongzhang: {
        title: '冷淡学长',
        value: 'lengdan_xiongzhang',
        desc: ``,
        demo: `b4045a74-d980-44b9-ba29-ab0c10e53ec0.mp3`,
    },
    badaoShaoye: {
        title: '霸道少爷',
        value: 'badao_shaoye',
        desc: ``,
        demo: `8ba48f72-254f-4c50-832d-40193f3ecddd.mp3`,
    },
    tianxinXiaoling: {
        title: '甜心小玲',
        value: 'tianxin_xiaoling',
        desc: ``,
        demo: `96d7b822-7a13-4b76-89fa-c04c7f254b60.mp3`,
    }, // good
    qiaopiMengmei: {
        title: '俏皮萌妹',
        value: 'qiaopi_mengmei',
        desc: ``,
        demo: `1464f23e-d26b-44ad-ad50-7c205c247924.mp3`,
    },
    wumeiYujie: { title: '妩媚御姐', value: 'wumei_yujie', desc: ``, demo: `f9eb4ee2-24b0-4183-9b1d-b3b53035de18.mp3` },
    diadiaXuemei: {
        title: '嗲嗲学妹',
        value: 'diadia_xuemei',
        desc: ``,
        demo: `260e0f6c-b8d1-4751-b7f3-799dd9bf4793.mp3`,
    },
    danyaXuejie: {
        title: '淡雅学姐',
        value: 'danya_xuejie',
        desc: ``,
        demo: `d0892ded-df00-4fc2-ad07-02334142c177.mp3`,
    },

    santaClaus: {
        title: 'Santa Claus',
        value: 'Santa_Claus',
        desc: ``,
        demo: `d9233c15-5fd5-46e2-9fa7-e1cb5e8e1c99.mp3`,
    },
    grinch: { title: 'Grinch', value: 'Grinch', desc: ``, demo: `f9825328-7e1f-4a03-bf94-848a6951241e.mp3` },
    rudolph: { title: 'Rudolph', value: 'Rudolph', desc: ``, demo: `77fc8af6-a79d-4cea-bb9d-f1f9f03d0562.mp3` },
    arnold: { title: 'Arnold', value: 'Arnold', desc: ``, demo: `beab2a5e-f458-4809-a441-de0984c3f36a.mp3` },
    charmingSanta: {
        title: 'Charming Santa',
        value: 'Charming_Santa',
        desc: ``,
        demo: `678d5b0c-5206-4be5-9358-c4dd361bc689.mp3`,
    },
    charmingLady: {
        title: 'Charming Lady',
        value: 'Charming_Lady',
        desc: ``,
        demo: `8a7775c7-fab0-4374-a1a1-c6bbd99532ce.mp3`,
    },
    sweetGirl: { title: 'Sweet Girl', value: 'Sweet_Girl', desc: ``, demo: `67b14e4a-5d4e-4903-ab12-cff0ca73c133.mp3` },
    cuteElf: { title: 'Cute Elf', value: 'Cute_Elf', desc: ``, demo: `a5780d10-d752-488b-952e-6bd4505a3565.mp3` },
    attractiveGirl: {
        title: 'Attractive Girl',
        value: 'Attractive_Girl',
        desc: ``,
        demo: `/9b72fa2d-74c7-4725-87d4-9bb9d3a1b50b.mp3`,
    }, // good
    sereneWoman: {
        title: 'Serene Woman',
        value: 'Serene_Woman',
        desc: ``,
        demo: `e39a57ac-457f-483b-919f-580e31fd61dd.mp3`,
    },
} as const

// 类型增强
export type VoicePresetValues = (typeof voicePresets)[keyof typeof voicePresets]['value']

export const enum GeneratingSatus {
    //获取行程中
    FetchingItinerary = '获取行程中',
    // 对话生成中
    DialogueGenerating = `对话生成中`,
    // 对话摘取中
    DialogueExtracting = `对话摘取中`,
    // 正在请求音频
    AudioRequesting = `正在请求音频`,
    // 音频合成正在合成
    AudioSynthesizing = `正在合成音频`,
}

// podcast generating prompt
export const PODCAST_EXPERT_PROMPT = `你是一个专业播客脚本生成器，专门将用户提供的主题或文本文件转换为可直接用于AI音频合成的结构化脚本。请严格遵循以下规则：
由于我需要对文本内容进行转音频，所以需要你严格按照一下格式生成，并且不允许出现旁白，2个主持人分别名为 Mike 和 Jessica，有7种情绪，如果你觉得当前主持人所说的话符合下列情绪，请在当前这句话上标注，否则则留空。
${JSON.stringify(Object.keys(EMOTION_MAP))}

另外你认为觉得主持人的话术需要控制语音中间隔时间，可以在字间增加<#x#>, x单位为秒，支持0.01-99.99，最多两位小数。

### 输出格式：
使用纯文本标记主持人对话，并且最终以对象数组的方式返回，另外需要在数组的开头加上标识符{{jsonstart}}，在数组的末尾加上标识符{{jsonend}}好方便我截取并且格式化：
{{jsonstart}}{
    "title": "对话的主题内容",
    "dialogue":[
        {"host": "Mike", "content": "这是Mike说的话"},
        {"host": "Jessica", "emotion": "surprised", "content": "这是Jessica惊讶时说的话"},
        {"host": "Mike", "emotion":"happy", "content": "这是Mike高兴时说的话"},
    ]
}{{jsonend}}

禁止使用任何括号提示词、注释或非内容文本，记住需要严格按照上面提供的格式输出。

### 内容要求：
如果没有说明，那么默认生成不少于5000字/10分钟的脚本
全程保持双主持人对话形式，每轮对话交替出现
严格排除音乐/音效相关描述，聚焦文本内容展开

### 对话设计：
主持人A负责提问和推进逻辑
主持人B负责补充细节和深入分析
保持口语化表达，每轮对话长度控制在50-150字
自然包含过渡词（"不过值得注意的是..."/"这里需要补充说明..."）

### 结构规范：
[开场]
主持人A: 引入主题+核心问题
主持人B: 点明重要性+提纲预告
[主体]
交替进行观点阐述/案例讨论/数据解读
[结尾]
主持人A: 总结核心观点
主持人B: 提出延伸思考


### 特殊要求：
确保每个对话段落可独立生成音频
自动生成符合逻辑的过渡语句
对专业术语自动附加口语化解释`

export const ENG_PODCAST_EXPERT_PROMPT = `You are a professional podcast script generator that converts user-provided topics/text files into structured scripts ready for AI audio synthesis. Always return content in English regardless of input language. Strictly follow these rules:
Mandatory English Output
Convert all Chinese inputs to English
Return ONLY English text in "content" fields
Maintain original semantic meaning
Use exactly 2 hosts named Mike and Jessica. For each line, annotate one of 7 emotions if applicable:
${JSON.stringify(Object.keys(EMOTION_MAP))}

Insert <#x#> tags (x=0.01-99.99) for speech timing control when needed.

Output Format:
Plain text array wrapped between identifiers:
{{jsonstart}}{
    "title": "the tile for this dialogue",
    "dialogue":[
        {"host": "Mike", "content": "this is Mike's content"},
        {"host": "Jessica", "emotion": "surprised", "content": "this is Jessica's content and she is surprised"},
        {"host": "Mike", "emotion":"happy", "content": "I'm very happy."},
    ]
}{{jsonend}}

NO markdown/extra symbols. Maintain strict JSON array format.

Content Requirements:
Minimum 5000 words/10 minutes duration
Strict alternating dialogue format
Exclude music/sound effect descriptions
Maintain spoken-language style (50-150 words per turn)
Include natural transitions ("However...", "It's worth noting...")

Structure:
[Opening]
Mike: Introduce topic + core question
Jessica: Highlight significance + outline preview
[Body]
Alternate between arguments/case studies/data analysis
[Closing]
Mike: Summarize key points
Jessica: Propose reflective questions

Special Requirements:
Ensure audio-ready segmentation
Auto-generate logical transitions
Explain technical terms conversationally
Never use narration/third-person perspective

Processing Logic
If Chinese input detected:
Auto-translate to English
Generate English script
Never show Chinese characters
If English input: Directly process
Special Cases Handling
Culture-specific terms: Add brief explanations in parentheses
Untranslatable content: Preserve meaning over literal translation
`

export const PODCAST_JSON_SCHEMA = {
    name: 'podcast_dialogue',
    description: '生成双人播客对话的结构化输出',
    schema: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                description: '播客标题',
            },
            dialogue: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        host: {
                            type: 'string',
                            description: '主持人姓名，固定为Mike或Jessica',
                        },
                        content: {
                            type: 'string',
                            description: '对话文本内容',
                        },
                        emotion: {
                            type: 'string',
                            enum: ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral', ''],
                            description: '情绪状态，无则空字符串',
                        },
                    },
                    required: ['host', 'content', 'emotion'],
                },
                description: '必须包含两位主持人的对话',
            },
        },
        required: ['dialogue', 'title'],
        additionalProperties: false,
    },
}
