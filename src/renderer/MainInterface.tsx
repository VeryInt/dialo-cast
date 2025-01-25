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
import { extractJsonArrayFromText } from '../shared/utils'
import _ from 'lodash'

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
    const [audioFileName, setAudioFileName] = useState('')
    useEffect(() => {
        electronServices.mergetAudio(
            [
                `file:///C:/Users/luyi1/AppData/Roaming/dialo-cast/temp_audio/temp_1737797121443.mp3`,

                `file:///C:/Users/luyi1/AppData/Roaming/dialo-cast/temp_audio/temp_1737796584461.mp3`,
            ],
            'output.mp3'
        )
    }, [])
    const handleUpdateTopic = topic => {
        updateCastTopic(topic)
    }
    const handleGenerate = async () => {
        console.log(`topic`, castTopic)
        updateIsGenerating(true)
        const dialogue = await electronServices.fetchDialogue({ topic: castTopic })
        let dialogueList = extractJsonArrayFromText(dialogue)
        if (dialogueList?.length) {
            const testList = _.slice(dialogueList, 0, 2)
            const fetchSaveList = _.compact(
                _.map(testList, dialogueItem => {
                    const { content, emotion } = dialogueItem || {}
                    if (content) {
                        return electronServices
                            .fetchMinMaxAudio({ content, emotion: emotion || 'neutral' })
                            .then((audioHex: string) => {
                                return electronServices.saveAudio(audioHex)
                            })
                    }
                    return null
                })
            )
            console.log(`fetchSaveList`, fetchSaveList)
            const fetchSaveResults = await Promise.all(fetchSaveList)
            const audioFileList = _.map(fetchSaveResults, (fileInfo, fetchIndex) => {
                const { name, filePath } = fileInfo || {}
                return filePath
            })
            if (audioFileList?.length) {
                await electronServices.mergetAudio(audioFileList, 'output.mp3')
                setAudioFileName('output.mp3')
            }
        }

        updateIsGenerating(false)
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
        if (audioFileName) {
            playAudio()
        }
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
