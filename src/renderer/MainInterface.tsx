import React, { useState, useRef, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Textarea } from './components/ui/textarea'
import { Progress } from './components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Slider } from './components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible'
import { Loader2, Play, Pause, SkipBack, SkipForward, Edit2, ChevronDown, ChevronUp } from 'lucide-react'
import { useMainStore } from './providers'
import { electronServices } from '../services'

export default function MainInterface() {
    return (
        <div className="flex w-full">
            <PodcastGenerator />
        </div>
    )
}

export const PodcastGenerator = () => {
    const state = useMainStore(state => state)
    const topicRef = useRef(null)
    const { castTopic, isGenerating, updateCastTopic, updateIsGenerating } = state || {}
    const [audioFileName, setAudioFileName] = useState('temp_1737793507628.mp3')
    const handleUpdateTopic = topic => {
        updateCastTopic(topic)
    }
    const handleGenerate = async () => {
        console.log(`topic`, castTopic)
        updateIsGenerating(true)
        electronServices
            .fetchDialogue({ topic: castTopic })
            .then(dialogue => {
                console.log('Dialogue:', dialogue)
                // 正则表达式用于提取返回内容的数组对话，开头是{{jsonstart}}，结尾是{{jsonend}}，中间是json格式的数组对话
                const regex = /{{jsonstart}}\s*\[[\s\S]*?\]\s*{{jsonend}}/
                const match = dialogue.match(regex)
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
                updateIsGenerating(false)
                return jsonArray
            })
            .catch(error => {
                console.log('Error fetching dialogue:', error)
                updateIsGenerating(false)
            })
            .then(dialogueList => {
                console.log('Dialogue Result:', dialogueList?.[0])
                const { content, emotion } = dialogueList?.[0] || {}
                if (content) {
                    electronServices
                        .fetchMinMaxAudio({ content, emotion: emotion || 'neutral' })
                        .then((audioHex: string) => {
                            return electronServices.saveAudio(audioHex)
                        })
                        .catch(error => console.log('Error fetching min max audio:', error))
                        .then((fileInfo: Record<string, any>) => {
                            const { name, filePath } = fileInfo || {}
                            setAudioFileName(name)
                        })
                }
            })
    }

    return (
        <>
            <Card className=" border-gray-100 shadow-lg p-6 w-full mx-auto">
                <CardHeader>
                    <CardTitle>生成新播客</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        ref={topicRef}
                        placeholder="输入播客主题"
                        value={castTopic}
                        onChange={e => handleUpdateTopic(e.target.value)}
                    />
                    <Button onClick={handleGenerate} disabled={!castTopic || isGenerating} className="w-full">
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>对话生成中</span>
                            </>
                        ) : (
                            '生成播客对话'
                        )}
                    </Button>
                </CardContent>
            </Card>
            <AudioPlayer audioFileName={audioFileName} />
        </>
    )
}

const AudioPlayer = ({ audioFileName }: { audioFileName: string }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)
    const handleTimeUpdate = e => {
        console.log(`e`, e)
    }
    const handleLoadedMetadata = () => {}

    useEffect(() => {
        const playAudio = async () => {
            const buffer: ArrayBuffer = await window.electronAPI.readAudioFile(audioFileName)
            const blob = new Blob([buffer], { type: 'audio/mp3' })
            const url = URL.createObjectURL(blob)

            const audio = new Audio(url)
            audio.play()

            // 记得在不需要时释放
            audio.onended = () => URL.revokeObjectURL(url)
        }
        playAudio()
    }, [audioFileName])

    if (!audioFileName) {
        return null
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>播客播放器</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-lg font-medium">{``}</div>
                <div className="flex justify-center items-center space-x-4">
                    <SkipBack className="w-6 h-6 cursor-pointer" />
                    {isPlaying ? (
                        <Pause className="w-8 h-8 cursor-pointer" onClick={() => setIsPlaying(false)} />
                    ) : (
                        <Play className="w-8 h-8 cursor-pointer" onClick={() => setIsPlaying(true)} />
                    )}
                    <SkipForward className="w-6 h-6 cursor-pointer" />
                </div>
                {/* <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    className="w-full"
                    onValueChange={([value]) => setCurrentTime(value)}
                />
                <div className="flex justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div> */}
                {/* <audio ref={audioRef} src={audioFilePath} onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} /> */}
            </CardContent>
        </Card>
    )
}
