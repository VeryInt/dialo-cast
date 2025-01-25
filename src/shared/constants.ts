export const AUDIO_GAP_TEXT = `<#0.60#>`

export const AUDIO_Emotion_List = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral']

type VoicePreset = {
    desc: string
    value: string
}

type VoicePresetCollection = {
    [key: string]: VoicePreset
}

export const voicePresets = {
    // 基础青年音色
    maleQnQingse: { desc: '青涩青年音色', value: 'male-qn-qingse' },
    maleQnJingying: { desc: '精英青年音色', value: 'male-qn-jingying' },
    maleQnBadao: { desc: '霸道青年音色', value: 'male-qn-badao' },
    maleQnDaxuesheng: { desc: '青年大学生音色', value: 'male-qn-daxuesheng' },

    // 女性基础音色
    femaleShaonv: { desc: '少女音色', value: 'female-shaonv' },
    femaleYujie: { desc: '御姐音色', value: 'female-yujie' },
    femaleChengshu: { desc: '成熟女性音色', value: 'female-chengshu' },
    femaleTianmei: { desc: '甜美女性音色', value: 'female-tianmei' },

    // 主持人系列
    presenterMale: { desc: '男性主持人', value: 'presenter_male' },
    presenterFemale: { desc: '女性主持人', value: 'presenter_female' },

    // 有声书系列
    audiobookMale1: { desc: '男性有声书1', value: 'audiobook_male_1' },
    audiobookMale2: { desc: '男性有声书2', value: 'audiobook_male_2' },
    audiobookFemale1: { desc: '女性有声书1', value: 'audiobook_female_1' },
    audiobookFemale2: { desc: '女性有声书2', value: 'audiobook_female_2' },

    // 精品Beta音色
    maleQnQingseBeta: { desc: '青涩青年音色-beta', value: 'male-qn-qingse-jingpin' },
    maleQnJingyingBeta: { desc: '精英青年音色-beta', value: 'male-qn-jingying-jingpin' }, // good
    maleQnBadaoBeta: { desc: '霸道青年音色-beta', value: 'male-qn-badao-jingpin' },
    maleQnDaxueshengBeta: { desc: '青年大学生音色-beta', value: 'male-qn-daxuesheng-jingpin' },
    femaleShaonvBeta: { desc: '少女音色-beta', value: 'female-shaonv-jingpin' },
    femaleYujieBeta: { desc: '御姐音色-beta', value: 'female-yujie-jingpin' },
    femaleChengshuBeta: { desc: '成熟女性音色-beta', value: 'female-chengshu-jingpin' },
    femaleTianmeiBeta: { desc: '甜美女性音色-beta', value: 'female-tianmei-jingpin' },

    // 特色角色音色
    cleverBoy: { desc: '聪明男童', value: 'clever_boy' },
    cuteBoy: { desc: '可爱男童', value: 'cute_boy' },
    lovelyGirl: { desc: '萌萌女童', value: 'lovely_girl' },
    cartoonPig: { desc: '卡通猪小琪', value: 'cartoon_pig' },
    bingjiaoDidi: { desc: '病娇弟弟', value: 'bingjiao_didi' },
    junlangNanyou: { desc: '俊朗男友', value: 'junlang_nanyou' },
    chunzhenXuedi: { desc: '纯真学弟', value: 'chunzhen_xuedi' },
    lengdanXiongzhang: { desc: '冷淡学长', value: 'lengdan_xiongzhang' },
    badaoShaoye: { desc: '霸道少爷', value: 'badao_shaoye' },
    tianxinXiaoling: { desc: '甜心小玲', value: 'tianxin_xiaoling' }, // good
    qiaopiMengmei: { desc: '俏皮萌妹', value: 'qiaopi_mengmei' },
    wumeiYujie: { desc: '妩媚御姐', value: 'wumei_yujie' },
    diadiaXuemei: { desc: '嗲嗲学妹', value: 'diadia_xuemei' },
    danyaXuejie: { desc: '淡雅学姐', value: 'danya_xuejie' },

    santaClaus: { desc: 'Santa Claus', value: 'Santa_Claus' },
    grinch: { desc: 'Grinch', value: 'Grinch' },
    rudolph: { desc: 'Rudolph', value: 'Rudolph' },
    arnold: { desc: 'Arnold', value: 'Arnold' },
    charmingSanta: { desc: 'Charming Santa', value: 'Charming_Santa' },
    charmingLady: { desc: 'Charming Lady', value: 'Charming_Lady' },
    sweetGirl: { desc: 'Sweet Girl', value: 'Sweet_Girl' },
    cuteElf: { desc: 'Cute Elf', value: 'Cute_Elf' },
    attractiveGirl: { desc: 'Attractive Girl', value: 'Attractive_Girl' }, // good
    sereneWoman: { desc: 'Serene Woman', value: 'Serene_Woman' },
} as const

// 类型增强
export type VoicePresetValues = (typeof voicePresets)[keyof typeof voicePresets]['value']

export const enum GeneratingSatus {
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
["happy", "sad", "angry", "fearful", "disgusted", "surprised", "neutral"]

另外你认为觉得主持人的话术需要控制语音中间隔时间，可以在字间增加<#x#>, x单位为秒，支持0.01-99.99，最多两位小数。

### 输出格式：
使用纯文本标记主持人对话，并且最终以对象数组的方式返回，另外需要在数组的开头加上标识符{{jsonstart}}，在数组的末尾加上标识符{{jsonend}}好方便我截取并且格式化：
{{jsonstart}}[
{"host": "Mike", "content": "这是Mike说的话"},
{"host": "Jessica", "emotion": "surprised", "content": "这是Jessica惊讶时说的话"},
{"host": "Mike", "emotion":"happy", "content": "这是Mike高兴时说的话"},
]{{jsonend}}

禁止使用任何括号提示词、注释或非内容文本，记住需要严格按照上面提供的格式输出

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
