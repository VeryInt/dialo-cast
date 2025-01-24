import React, { useEffect, useState, useRef } from 'react'
import { LoaderPinwheel } from 'lucide-react'
export default function MainPage() {
    const [activeTab, setActiveTab] = useState(0)
    const [topic, setTopic] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [dialogues, setDialogues] = useState([])
    const [voices, setVoices] = useState({
        hostA: 'en-US-Wavenet-A',
        hostB: 'en-US-Wavenet-B',
    })
    const [mergedAudio, setMergedAudio] = useState('')
    const [isMerging, setIsMerging] = useState(false)

    const generateDialogue = async () => {}

    const regenerateDialogue = async () => {}

    const updateSpeaker = (index, speaker) => {}

    const updateDialogue = (index, text) => {}

    const deleteDialogue = index => {}

    const updateVoice = (host, voice) => {}

    const generateFullPodcast = async () => {}

    return (
        <div className="h-screen bg-gray-50 flex">
            {/* 左侧导航 */}
            <aside className="w-64 bg-white border-r p-4 space-y-2">
                <nav>
                    {['主题设置', '对话编辑', '声音配置', '导出合成'].map((item, index) => (
                        <button
                            key={item}
                            className={`w-full text-left p-3 rounded-lg transition-all
                                ${activeTab === index ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100'}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* 主内容区 */}
            <main className="flex-1 p-8 max-w-4xl">
                {/* 步骤1：主题输入 */}
                {activeTab === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">🎙️ 创建新播客</h2>
                        <textarea
                            className="w-full h-32 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="输入播客主题，例如：人工智能如何改变医疗行业..."
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        />
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg  hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                            disabled={!topic.trim()}
                            onClick={generateDialogue}
                        >
                            {isGenerating ? (
                                <>
                                    <LoaderPinwheel />
                                    生成中...
                                </>
                            ) : (
                                '生成对话脚本 →'
                            )}
                        </button>
                    </div>
                )}

                {/* 步骤2：对话编辑 */}
                {activeTab === 1 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">对话编排</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-700" onClick={regenerateDialogue}>
                                ↻ 重新生成
                            </button>
                        </div>

                        <div className="space-y-4">
                            {dialogues.map((dialogue, index) => (
                                <div
                                    key={index}
                                    className="group flex items-start gap-4 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex-1">
                                        <select
                                            className="text-sm font-medium mb-2 bg-transparent border-b border-dashed focus:outline-none"
                                            value={dialogue.speaker}
                                            onChange={e => updateSpeaker(index, e.target.value)}
                                        >
                                            <option value="hostA">主持人 A</option>
                                            <option value="hostB">主持人 B</option>
                                        </select>
                                        <textarea
                                            className="w-full bg-transparent focus:outline-none  resize-none text-gray-700"
                                            rows={2}
                                            value={dialogue.text}
                                            onChange={e => updateDialogue(index, e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 text-gray-400  hover:text-red-500 transition-opacity"
                                        onClick={() => deleteDialogue(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 步骤3：声音配置 */}
                {activeTab === 2 && (
                    <div className="grid grid-cols-2 gap-6">
                        {['hostA', 'hostB'].map(host => (
                            <div key={host} className="bg-white p-6 rounded-xl shadow-sm">
                                <h4 className="text-lg font-medium mb-4">
                                    {host === 'hostA' ? '主持人 A' : '主持人 B'}
                                </h4>

                                <div className="space-y-4">
                                    <VoicePreview
                                        voice={voices[host]}
                                        onVoiceChange={newVoice => updateVoice(host, newVoice)}
                                    />

                                    <div className="flex gap-2">
                                        <button className="text-sm text-blue-600 hover:text-blue-700">
                                            试听声音样本
                                        </button>
                                        <button className="text-sm text-gray-500 hover:text-gray-700">调节语速</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 步骤4：合成输出 */}
                {activeTab === 3 && (
                    <div className="text-center space-y-6">
                        <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                            <WaveformVisualizer audioUrl={mergedAudio} />

                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                    onClick={generateFullPodcast}
                                >
                                    {isMerging ? (
                                        <>
                                            <LoaderPinwheel />
                                            合成中...
                                        </>
                                    ) : (
                                        '🎧 生成完整播客'
                                    )}
                                </button>

                                {mergedAudio && (
                                    <a
                                        href={mergedAudio}
                                        download="podcast-final.mp3"
                                        className="bg-gray-800 text-white px-6 py-3 rounded-lg
                  hover:bg-gray-900 transition-colors"
                                    >
                                        ↓ 下载MP3
                                    </a>
                                )}
                            </div>
                        </div>

                        <ProcessingTimeline
                            steps={[
                                { name: '生成对话', status: 'complete' },
                                { name: '配置声音', status: 'complete' },
                                {
                                    name: '音频合成',
                                    status: isMerging ? 'processing' : 'pending',
                                },
                            ]}
                        />
                    </div>
                )}
            </main>
        </div>
    )
}

const WaveformVisualizer = ({ audioUrl }) => {
    const canvasRef = useRef(null)
    const drawWaveform = (canvas, audioBuffer) => {}

    useEffect(() => {
        if (audioUrl) {
            // 使用Web Audio API绘制波形
            const audioContext = new AudioContext()
            fetch(audioUrl)
                .then(res => res.arrayBuffer())
                .then(buffer => audioContext.decodeAudioData(buffer))
                .then(audioBuffer => {
                    drawWaveform(canvasRef.current, audioBuffer)
                })
        }
    }, [audioUrl])

    return <canvas ref={canvasRef} className="w-full h-24" />
}

const ProcessingTimeline = ({ steps }) => {
    return (
        <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            step.status === 'complete' ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                    >
                        {step.status === 'complete' && <span className="text-white">✔️</span>}
                    </div>
                    <p className="text-sm font-medium">{step.name}</p>
                </div>
            ))}
        </div>
    )
}

const VoicePreview = ({ voice, onVoiceChange }) => {
    return (
        <div className="flex items-center gap-4">
            <select
                className="text-sm font-medium bg-transparent border-b border-dashed focus:outline-none"
                value={voice}
                onChange={e => onVoiceChange(e.target.value)}
            >
                <option value="en-US-Wavenet-A">美式男声</option>
                <option value="en-US-Wavenet-B">美式女声</option>
            </select>
            <button className="text-sm text-blue-600 hover:text-blue-700">试听声音样本</button>
        </div>
    )
}
