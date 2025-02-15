export const AUDIO_GAP_TEXT = `<#0.60#>`

export const enum DIALOGUE_TYPE {
    TOPIC = 'topic',
    PRODUCT_ITINERARY = 'productItinerary',
    PDF = 'pdf',
}

export const CONFIG_STORE_KEYS = {
    miniMaxApiKey: `MIN_MAX_API_KEY`,
    miniMaxGroupID: `MIN_MAX_GROUND_ID`,
    hostVoiceOne: `HOST_VOICE_ONE`,
    hostVoiceTwo: `HOST_VOICE_TWO`,
    englishDialog: `IS_ENGLISH_DIALOG`,
    voiceSpeed: `VOICE_SPEED`,
}

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

export const voiceDemoBaseUrl = `https://filecdn.minimax.chat/public/`

export const voicePresets = {
    maleQnQingse: {
        title: '青涩青年',
        desc: '青涩青年音色，声音清新自然，适合年轻化场景',
        value: 'male-qn-qingse',
        demo: '1f724442-d4b8-4889-9535-9d4340278b84.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    maleQnJingying: {
        title: '精英青年',
        desc: '精英青年音色，声音沉稳有力，适合商务场景',
        value: 'male-qn-jingying',
        demo: '6a0da686-20a2-40af-a12e-002f265bd11e.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    maleQnBadao: {
        title: '霸道青年',
        desc: '霸道青年音色，声音富有魅力，适合强势场景',
        value: 'male-qn-badao',
        demo: 'c460e3f5-e745-4587-a5de-2657a6a9821e.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    maleQnDaxuesheng: {
        title: '青年大学生',
        desc: '青年大学生音色，声音阳光活力，适合校园场景',
        value: 'male-qn-daxuesheng',
        demo: '9c38026a-3bfc-4c2b-bbf1-ea14f5d095be.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    femaleShaonv: {
        title: '少女',
        desc: '少女音色，声音清脆甜美，适合年轻化场景',
        value: 'female-shaonv',
        demo: 'a5734a27-d733-4cb2-bfe8-7ffd4a5221c6.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    femaleYujie: {
        title: '御姐',
        desc: '御姐音色，声音成熟魅惑，适合时尚场景',
        value: 'female-yujie',
        demo: 'f592eba5-f66d-4916-a8ba-90ad8e27d46c.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    femaleChengshu: {
        title: '成熟女性',
        desc: '成熟女性音色，声音温婉大方，适合商务场景',
        value: 'female-chengshu',
        demo: 'ef660abb-c130-4641-9b2f-79c92a1b8dae.mp3',
        tags: ['女', '成年', '中文'],
        ageGroup: '成年',
        gender: '女',
        language: '中文',
    },
    femaleTianmei: {
        title: '甜美女性',
        desc: '甜美女性音色，声音甜美动听，适合亲和场景',
        value: 'female-tianmei',
        demo: '4a147d57-36ae-4718-a0c0-3e7fe9a98fb8.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    presenterMale: {
        title: '男性主持人',
        desc: '男性主持人音色，声音专业有力，适合新闻播报场景',
        value: 'presenter_male',
        demo: '801f6c65-8fe2-4c4e-8286-b6111170772a.mp3',
        tags: ['男', '成年', '中文'],
        ageGroup: '成年',
        gender: '男',
        language: '中文',
    },
    presenterFemale: {
        title: '女性主持人',
        desc: '女性主持人音色，声音专业亲和，适合新闻播报场景',
        value: 'presenter_female',
        demo: '4fc302d7-8b21-4f0c-9765-f78d7687dee9.mp3',
        tags: ['女', '成年', '中文'],
        ageGroup: '成年',
        gender: '女',
        language: '中文',
    },
    audiobookMale1: {
        title: '男性有声书1',
        desc: '男性有声书音色1，声音富有磁性，适合有声读物场景',
        value: 'audiobook_male_1',
        demo: 'f5bf216a-37ac-43e3-a341-709cb931d6ae.mp3',
        tags: ['男', '成年', '中文'],
        ageGroup: '成年',
        gender: '男',
        language: '中文',
    },
    audiobookMale2: {
        title: '男性有声书2',
        desc: '男性有声书音色2，声音温和从容，适合有声读物场景',
        value: 'audiobook_male_2',
        demo: 'cf89d86b-b543-4ca0-99fd-e1b27c90f687.mp3',
        tags: ['男', '成年', '中文'],
        ageGroup: '成年',
        gender: '男',
        language: '中文',
    },
    audiobookFemale1: {
        title: '女性有声书1',
        desc: '女性有声书音色1，声音温柔细腻，适合有声读物场景',
        value: 'audiobook_female_1',
        demo: 'fc395e4c-5981-41ae-86bc-4fa30f55d143.mp3',
        tags: ['女', '成年', '中文'],
        ageGroup: '成年',
        gender: '女',
        language: '中文',
    },
    audiobookFemale2: {
        title: '女性有声书2',
        desc: '女性有声书音色2，声音优雅动听，适合有声读物场景',
        value: 'audiobook_female_2',
        demo: '903de7cf-bc29-4ff4-b388-2bb2f668ed26.mp3',
        tags: ['女', '成年', '中文'],
        ageGroup: '成年',
        gender: '女',
        language: '中文',
    },
    maleQnQingseJingpin: {
        title: '青涩青年-beta',
        desc: '青涩青年精品音色，声音更加清新自然，适合年轻化场景',
        value: 'male-qn-qingse-jingpin',
        demo: '2aeb25de-9686-4a84-969e-7726c123ac8b.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    maleQnJingyingJingpin: {
        title: '精英青年-beta',
        desc: '精英青年精品音色，声音更加沉稳有力，适合商务场景',
        value: 'male-qn-jingying-jingpin',
        demo: '1d946399-ae87-4ce9-b4d6-da186a6674be.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    maleQnBadaoJingpin: {
        title: '霸道青年-beta',
        desc: '霸道青年精品音色，声音更加富有魅力，适合强势场景',
        value: 'male-qn-badao-jingpin',
        demo: '66fbd126-7f19-4548-875b-c95e37334db7.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    maleQnDaxueshengJingpin: {
        title: '青年大学生-beta',
        desc: '青年大学生精品音色，声音更加阳光活力，适合校园场景',
        value: 'male-qn-daxuesheng-jingpin',
        demo: 'acdfc86c-9288-416d-8936-dde13c6aa351.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    femaleShaonvJingpin: {
        title: '少女-beta',
        desc: '少女精品音色，声音更加清脆甜美，适合年轻化场景',
        value: 'female-shaonv-jingpin',
        demo: '2bbb1f3d-2aba-4975-81cb-bee8c642040a.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    femaleYujieJingpin: {
        title: '御姐-beta',
        desc: '御姐精品音色，声音更加成熟魅惑，适合时尚场景',
        value: 'female-yujie-jingpin',
        demo: '10e8e581-6a41-453c-9c6e-b07445253f32.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    femaleChengshuJingpin: {
        title: '成熟女性-beta',
        desc: '成熟女性精品音色，声音更加温婉大方，适合商务场景',
        value: 'female-chengshu-jingpin',
        demo: '287eb2bb-6456-4e69-b5c2-ca25afc45618.mp3',
        tags: ['女', '成年', '中文'],
        ageGroup: '成年',
        gender: '女',
        language: '中文',
    },
    femaleTianmeiJingpin: {
        title: '甜美女性-beta',
        desc: '甜美女性精品音色，声音更加甜美动听，适合亲和场景',
        value: 'female-tianmei-jingpin',
        demo: '22d9bcb3-70d8-4ed2-811d-bc2face669f3.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    cleverBoy: {
        title: '聪明男童',
        desc: '聪明男童音色，声音机灵可爱，适合儿童场景',
        value: 'clever_boy',
        demo: 'b364b7f9-1ef3-48c4-bf6b-b99454781d1f.mp3',
        tags: ['男', '儿童', '中文'],
        ageGroup: '儿童',
        gender: '男',
        language: '中文',
    },
    cuteBoy: {
        title: '可爱男童',
        desc: '可爱男童音色，声音天真可爱，适合儿童场景',
        value: 'cute_boy',
        demo: '7c1d01fe-4558-4cb6-8e81-2bb77cd2c4aa.mp3',
        tags: ['男', '儿童', '中文'],
        ageGroup: '儿童',
        gender: '男',
        language: '中文',
    },
    lovelyGirl: {
        title: '萌萌女童',
        desc: '萌萌女童音色，声音萌萌可爱，适合儿童场景',
        value: 'lovely_girl',
        demo: '1692905f-e4e2-49fa-9ff4-3b8ec862c33a.mp3',
        tags: ['女', '儿童', '中文'],
        ageGroup: '儿童',
        gender: '女',
        language: '中文',
    },
    cartoonPig: {
        title: '卡通猪小琪',
        desc: '卡通猪小琪音色，声音活泼可爱，适合儿童动画场景',
        value: 'cartoon_pig',
        demo: 'f07a92e2-d09d-4c17-9fcd-2567f9676792.mp3',
        tags: ['女', '儿童', '中文'],
        ageGroup: '儿童',
        gender: '女',
        language: '中文',
    },
    bingjiaoDidi: {
        title: '病娇弟弟',
        desc: '病娇弟弟音色，声音温柔执着，适合特殊角色场景',
        value: 'bingjiao_didi',
        demo: 'd63e53e5-cae9-4dbc-92c2-0c7a23eed1f2.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    junlangNanyou: {
        title: '俊朗男友',
        desc: '俊朗男友音色，声音阳光帅气，适合恋爱场景',
        value: 'junlang_nanyou',
        demo: 'fd7c65f3-83d0-494d-b651-92a9e823aec6.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    chunzhenXuedi: {
        title: '纯真学弟',
        desc: '纯真学弟音色，声音清新阳光，适合校园场景',
        value: 'chunzhen_xuedi',
        demo: '62496011-61cf-44cf-a0bd-d5afb9a9d163.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    lengdanXiongzhang: {
        title: '冷淡学长',
        desc: '冷淡学长音色，声音冷静成熟，适合校园场景',
        value: 'lengdan_xiongzhang',
        demo: '7a9b034e-68dd-4caf-ae38-99baa8ba263c.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    badaoShaoye: {
        title: '霸道少爷',
        desc: '霸道少爷音色，声音高贵傲娇，适合贵族角色场景',
        value: 'badao_shaoye',
        demo: 'c7a5ea87-b037-47c0-bcf0-d1e83528fc5f.mp3',
        tags: ['男', '青年', '中文'],
        ageGroup: '青年',
        gender: '男',
        language: '中文',
    },
    tianxinXiaoling: {
        title: '甜心小玲',
        desc: '甜心小玲音色，声音甜美可人，适合少女场景',
        value: 'tianxin_xiaoling',
        demo: 'be020d4e-3fb2-4b1a-950b-e1cc1ec50939.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    qiaopiMengmei: {
        title: '俏皮萌妹',
        desc: '俏皮萌妹音色，声音活泼可爱，适合年轻化场景',
        value: 'qiaopi_mengmei',
        demo: '521d275d-10d4-4fd9-8e6a-fb67c3ca1dc7.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    wumeiYujie: {
        title: '妩媚御姐',
        desc: '妩媚御姐音色，声音性感成熟，适合成熟女性场景',
        value: 'wumei_yujie',
        demo: '06b5be5a-327d-48e2-bb89-d2cee595a475.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    diadiaXuemei: {
        title: '嗲嗲学妹',
        desc: '嗲嗲学妹音色，声音娇嗲可爱，适合校园场景',
        value: 'diadia_xuemei',
        demo: 'e9323391-cf83-478c-b9a0-d6f7d2d02d96.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    danyaXuejie: {
        title: '淡雅学姐',
        desc: '淡雅学姐音色，声音温柔知性，适合校园场景',
        value: 'danya_xuejie',
        demo: '4992337d-0326-42e2-8a33-63683301b937.mp3',
        tags: ['女', '青年', '中文'],
        ageGroup: '青年',
        gender: '女',
        language: '中文',
    },
    santaClaus: {
        title: 'Santa Claus',
        desc: '圣诞老人音色，声音温暖慈祥，适合节日场景',
        value: 'Santa_Claus',
        demo: 'd0b1794a-76a6-4dfc-a689-d4e53d5ab76b.mp3',
        tags: ['男', '老年', '英语'],
        ageGroup: '老年',
        gender: '男',
        language: '英语',
    },
    grinch: {
        title: 'Grinch',
        desc: '格林奇音色，声音独特有趣，适合特殊角色场景',
        value: 'Grinch',
        demo: '22d950f8-5e23-4237-817f-dae411fdd8f0.mp3',
        tags: ['男', '成年', '英语'],
        ageGroup: '成年',
        gender: '男',
        language: '英语',
    },
    rudolph: {
        title: 'Rudolph',
        desc: '鲁道夫音色，声音活泼可爱，适合节日场景',
        value: 'Rudolph',
        demo: '53c21406-81bd-4f49-8c32-3160ef567767.mp3',
        tags: ['男', '青年', '英语'],
        ageGroup: '青年',
        gender: '男',
        language: '英语',
    },
    arnold: {
        title: 'Arnold',
        desc: '阿诺德音色，声音低沉有力，适合运动场景',
        value: 'Arnold',
        demo: '5fb41d4a-fd7b-48ba-8119-09c81f679b29.mp3',
        tags: ['男', '成年', '英语'],
        ageGroup: '成年',
        gender: '男',
        language: '英语',
    },
    charmingSanta: {
        title: 'Charming Santa',
        desc: '迷人的圣诞老人音色，声音充满魅力，适合节日场景',
        value: 'Charming_Santa',
        demo: 'd55febbf-7854-4823-a52e-6b5708bb5da6.mp3',
        tags: ['男', '老年', '英语'],
        ageGroup: '老年',
        gender: '男',
        language: '英语',
    },
    charmingLady: {
        title: 'Charming Lady',
        desc: '迷人女士音色，声音优雅动听，适合社交场景',
        value: 'Charming_Lady',
        demo: '6c80d0da-8e46-4b2b-b048-6ff4971b6cdc.mp3',
        tags: ['女', '成年', '英语'],
        ageGroup: '成年',
        gender: '女',
        language: '英语',
    },
    sweetGirl: {
        title: 'Sweet Girl',
        desc: '甜美女孩音色，声音清新甜美，适合年轻化场景',
        value: 'Sweet_Girl',
        demo: '5bc60a6d-f644-4135-a5b6-c551d34c265c.mp3',
        tags: ['女', '青年', '英语'],
        ageGroup: '青年',
        gender: '女',
        language: '英语',
    },
    cuteElf: {
        title: 'Cute Elf',
        desc: '可爱精灵音色，声音俏皮可爱，适合童话场景',
        value: 'Cute_Elf',
        demo: '88443567-1971-489c-b8ce-fe99e6ccce0d.mp3',
        tags: ['女', '青年', '英语'],
        ageGroup: '青年',
        gender: '女',
        language: '英语',
    },
    attractiveGirl: {
        title: 'Attractive Girl',
        desc: '迷人女孩音色，声音富有魅力，适合时尚场景',
        value: 'Attractive_Girl',
        demo: '532959ef-051b-46ff-a747-f30f83d5ace3.mp3',
        tags: ['女', '青年', '英语'],
        ageGroup: '青年',
        gender: '女',
        language: '英语',
    },
    sereneWoman: {
        title: 'Serene Woman',
        desc: '恬静女性音色，声音温和从容，适合商务场景',
        value: 'Serene_Woman',
        demo: 'f5ac58a0-c7f7-4c08-b716-1f172f1fb577.mp3',
        tags: ['女', '成年', '英语'],
        ageGroup: '成年',
        gender: '女',
        language: '英语',
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

IMPORTANT NOTICE: 
Since I am currently learning English, please try to use simple and easy-to-understand vocabulary!!! Thank you!
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
