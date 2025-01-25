export const AUDIO_GAP_TEXT = `<#0.60#>`

export const AUDIO_Emotion_List = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral']

export const enum VoicePreset {
    // 基础音色
    YouthfulVoice = 'male-qn-qingse',
    EliteYouth = 'male-qn-jingying',
    DomineeringYouth = 'male-qn-badao',
    CollegeYouth = 'male-qn-daxuesheng',
    GirlVoice = 'female-shaonv',
    MatureFemale = 'female-yujie',
    MatureWoman = 'female-chengshu',
    SweetVoice = 'female-tianmei',

    // 主持人
    MalePresenter = 'presenter_male',
    FemalePresenter = 'presenter_female',

    // 有声书
    AudiobookMale1 = 'audiobook_male_1',
    AudiobookMale2 = 'audiobook_male_2',
    AudiobookFemale1 = 'audiobook_female_1',
    AudiobookFemale2 = 'audiobook_female_2',

    // 精品音色 (Beta)
    YouthfulVoiceBeta = 'male-qn-qingse-jingpin',
    EliteYouthBeta = 'male-qn-jingying-jingpin',
    DomineeringYouthBeta = 'male-qn-badao-jingpin',
    CollegeYouthBeta = 'male-qn-daxuesheng-jingpin',
    GirlVoiceBeta = 'female-shaonv-jingpin',
    MatureFemaleBeta = 'female-yujie-jingpin',
    MatureWomanBeta = 'female-chengshu-jingpin',
    SweetVoiceBeta = 'female-tianmei-jingpin',

    // 特殊角色
    CleverBoy = 'clever_boy',
    CuteBoy = 'cute_boy',
    LovelyGirl = 'lovely_girl',
    CartoonPig = 'cartoon_pig',
    SicklyYoungerBrother = 'bingjiao_didi',
    HandsomeBoyfriend = 'junlang_nanyou',
    InnocentJunior = 'chunzhen_xuedi',
    ColdSenior = 'lengdan_xiongzhang',
    DomineeringYoungMaster = 'badao_shaoye',
    SweetXiaoling = 'tianxin_xiaoling',
    PlayfulCutie = 'qiaopi_mengmei',
    CharmingMatureSister = 'wumei_yujie',
    CoquettishJuniorSister = 'diadia_xuemei',
    ElegantSeniorSister = 'danya_xuejie',
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
