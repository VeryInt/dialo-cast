import React, { useState, useRef, useEffect, HtmlHTMLAttributes } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Slider } from '../components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Loader2, Play, Pause, SkipBack, SkipForward, Edit2, ChevronDown, ChevronUp, Download } from 'lucide-react'
import { useMainStore } from '../providers'
import { electronServices } from '../../services'
import { extractJsonArrayFromText, constsequentialAsyncCalls, formatPlayTime, fetchAll } from '../../shared/utils'
import { AUDIO_GAP_TEXT, voicePresets, GeneratingSatus, CONFIG_STORE_KEYS } from '../../shared/constants'

import _ from 'lodash'

export default function MainInterface() {
    const state = useMainStore(state => state)
    const { audioPlayFile } = state || {}
    const [activeTab, setActiveTab] = useState('topicCast')
    return (
        <div className="flex w-full flex-col gap-6 max-w-6xl mx-auto min-w-lg">
            <div className="">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 gap-2">
                        <TabsTrigger value="topicCast" className="flex items-center cursor-pointer">
                            主题播客
                        </TabsTrigger>
                        <TabsTrigger value="productItinerary" className="flex items-center cursor-pointer">
                            产品行程
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="topicCast">
                        <PodcastGenerator />
                    </TabsContent>
                    <TabsContent value="productItinerary">
                        <ProductCastGenerator />
                    </TabsContent>
                </Tabs>
            </div>
            <AudioPlayer audioFileName={audioPlayFile} />
        </div>
    )
}

const VoiceSelection = ({ className }: { className?: string }) => {
    const state = useMainStore(state => state)
    const [host1Voice, setHost1Voice] = useState('')
    const [host2Voice, setHost2Voice] = useState('')
    useEffect(() => {
        electronServices.getConfig(CONFIG_STORE_KEYS.hostVoiceOne).then((voice: string) => {
            setHost1Voice(voice)
        })
        electronServices.getConfig(CONFIG_STORE_KEYS.hostVoiceTwo).then((voice: string) => {
            setHost2Voice(voice)
        })
    }, [])

    const handleSetHostVoice = (voiceValue, hostIndex) => {
        if (hostIndex == 0) {
            setHost1Voice(voiceValue)
            electronServices.saveConfig(CONFIG_STORE_KEYS.hostVoiceOne, voiceValue)
        } else {
            setHost2Voice(voiceValue)
            electronServices.saveConfig(CONFIG_STORE_KEYS.hostVoiceTwo, voiceValue)
        }
    }

    return (
        <>
            <div className={`grid grid-cols-2 gap-4 ${className}`}>
                <div>
                    <label htmlFor="host1-voice" className="block text-sm font-medium text-gray-700 mb-1">
                        主持人 Mike 音色
                    </label>
                    <Select value={host1Voice} onValueChange={value => handleSetHostVoice(value, 0)}>
                        <SelectTrigger id="host1-voice">
                            <SelectValue placeholder="选择音色" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-200">
                            {_.map(voicePresets, (voiceValue, voicePresetKey) => {
                                const { desc, value } = voiceValue || {}
                                return (
                                    <SelectItem key={value} value={value}>
                                        {desc}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="host2-voice" className="block text-sm font-medium text-gray-700 mb-1">
                        主持人 Jessica 音色
                    </label>
                    <Select value={host2Voice} onValueChange={value => handleSetHostVoice(value, 1)}>
                        <SelectTrigger id="host2-voice">
                            <SelectValue placeholder="选择音色" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-200">
                            {_.map(voicePresets, (voiceValue, voicePresetKey) => {
                                const { desc, value } = voiceValue || {}
                                return (
                                    <SelectItem key={value} value={value}>
                                        {desc}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
}

const ProductCastGenerator = () => {
    const state = useMainStore(state => state)
    const [generatingStatus, setGeneratingStatus] = useState(GeneratingSatus.DialogueGenerating)
    const topicRef = useRef(null)
    const { castProductID, isGenerating, updateCastProductID, updateIsGenerating, updateAudioPlayFile } = state || {}
    const handleUpdateProductID = productID => {
        updateCastProductID(String(productID || '').trim())
    }

    const handleGenerateProduct = async () => {
        // fetchProductDailyList
        console.log(`castProductID`, castProductID)
        updateIsGenerating(true)
        setGeneratingStatus(GeneratingSatus.FetchingItinerary)
        const producItinerary = await electronServices.fetchProductDailyList({ productID: Number(castProductID) })
        console.log(`producItinerary`, producItinerary)
        setGeneratingStatus(GeneratingSatus.DialogueGenerating)
        const dialogue = await electronServices.fetchDialogue({ topic: producItinerary })
        setGeneratingStatus(GeneratingSatus.DialogueExtracting)
        let dialogueList = extractJsonArrayFromText(dialogue)
        if (dialogueList?.length) {
            setGeneratingStatus(GeneratingSatus.AudioRequesting)
            const fetchResults = await fetchMinMaxAudioBatch(dialogueList)

            // 直接通过合并 hex 生成
            const now = Date.now()
            setGeneratingStatus(GeneratingSatus.AudioSynthesizing)
            await electronServices.saveAudio(fetchResults.join(''), `${now}`)
            updateAudioPlayFile(`${now}.mp3`)
        }
        updateIsGenerating(false)
    }

    return (
        <>
            <Card className=" border-gray-100 shadow-xl p-6 w-full mx-auto">
                <CardHeader className="pt-0">
                    <CardTitle>生成行程讨论</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-0">
                    <Input
                        ref={topicRef}
                        placeholder="输入产品ID"
                        value={castProductID}
                        onChange={e => handleUpdateProductID(e.target.value)}
                    />
                    <VoiceSelection className="my-5" />
                    <Button
                        onClick={handleGenerateProduct}
                        disabled={!castProductID || isGenerating}
                        className={`w-full py-5 ${castProductID ? 'cursor-pointer' : ''}`}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>{generatingStatus}</span>
                            </>
                        ) : (
                            '生成讨论对话'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}

const PodcastGenerator = () => {
    const state = useMainStore(state => state)
    const [generatingStatus, setGeneratingStatus] = useState(GeneratingSatus.DialogueGenerating)
    const topicRef = useRef(null)
    const { castTopic, isGenerating, updateCastTopic, updateIsGenerating, updateAudioPlayFile } = state || {}
    const handleUpdateTopic = topic => {
        updateCastTopic(topic)
    }
    const handleGenerate = async () => {
        console.log(`topic`, castTopic)
        updateIsGenerating(true)
        setGeneratingStatus(GeneratingSatus.DialogueGenerating)
        const dialogue = await electronServices.fetchDialogue({ topic: castTopic })
        console.log(dialogue)
        setGeneratingStatus(GeneratingSatus.DialogueExtracting)
        let dialogueList = extractJsonArrayFromText(dialogue)
        if (dialogueList?.length) {
            setGeneratingStatus(GeneratingSatus.AudioRequesting)
            // const fetchList = _.compact(
            //     _.map(dialogueList, (dialogueItem, dialogueIndex) => {
            //         const { content, emotion, host } = dialogueItem || {}
            //         if (content) {
            //             return electronServices.fetchMinMaxAudio({
            //                 content: `${dialogueIndex == 0 ? AUDIO_GAP_TEXT : ''}${content}${AUDIO_GAP_TEXT}`,
            //                 emotion: emotion,
            //                 voiceID:
            //                     host == `Mike`
            //                         ? voicePresets.maleQnJingyingBeta.value
            //                         : voicePresets.attractiveGirl.value,
            //             })
            //         }
            //         return null
            //     })
            // )
            // const fetchResults = await Promise.all(fetchList)
            const fetchResults = await fetchMinMaxAudioBatch(dialogueList)

            // 直接通过合并 hex 生成
            const now = Date.now()
            setGeneratingStatus(GeneratingSatus.AudioSynthesizing)
            await electronServices.saveAudio(fetchResults.join(''), `${now}`)
            updateAudioPlayFile(`${now}.mp3`)
            // const fetchSaveList = _.compact(
            //     _.map(testList, dialogueItem => {
            //         const { content, emotion } = dialogueItem || {}
            //         if (content) {
            //             return electronServices
            //                 .fetchMinMaxAudio({ content, emotion: emotion || 'neutral' })
            //                 .then((audioHex: string) => {
            //                     return electronServices.saveAudio(audioHex)
            //                 })
            //         }
            //         return null
            //     })
            // )
            // console.log(`fetchSaveList`, fetchSaveList)
            // const fetchSaveResults = await Promise.all(fetchSaveList)
            // const audioFileList = _.map(fetchSaveResults, (fileInfo, fetchIndex) => {
            //     const { name, filePath } = fileInfo || {}
            //     return filePath
            // })
            // if (audioFileList?.length) {
            //     await electronServices.mergetAudio(audioFileList, 'output.mp3')
            //     setAudioFileName('output.mp3')
            // }
        }

        updateIsGenerating(false)
    }

    return (
        <>
            <Card className=" border-gray-100 shadow-xl p-6 w-full mx-auto">
                <CardHeader className="pt-0">
                    <CardTitle>生成新播客</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-0">
                    <Input
                        ref={topicRef}
                        placeholder="输入播客主题"
                        value={castTopic}
                        onChange={e => handleUpdateTopic(e.target.value)}
                    />
                    <VoiceSelection className="my-5" />
                    <Button
                        onClick={handleGenerate}
                        disabled={!castTopic || isGenerating}
                        className={`w-full py-5 ${castTopic ? 'cursor-pointer' : ''}`}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>{generatingStatus}</span>
                            </>
                        ) : (
                            '生成播客对话'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}

const AudioPlayer = ({ audioFileName }: { audioFileName: string }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [totalTime, setTotalTime] = useState('00:00')
    const [currentTime, setCurrentTime] = useState(0)
    const [timeDisplay, setTimeDisplay] = useState('00:00')
    const [duration, setDuration] = useState(0)
    const audioRef = useRef(null)
    const downloadRef = useRef(null)
    useEffect(() => {
        setTimeDisplay(formatPlayTime(currentTime))
    }, [currentTime])

    const handleTimeUpdate = () => {
        const audioHtmlElement = audioRef.current as HTMLAudioElement
        setCurrentTime(audioHtmlElement.currentTime)
    }

    const handleCanPlay = () => {
        console.log(`handleCanPlay`)
    }

    const handleDownloadAudio = () => {
        console.log(`handleDownloadAudio`)
        const downloadElement = downloadRef.current as HTMLAnchorElement
        downloadElement.click()
    }

    const handleLoadedMetadata = () => {
        console.log(`handleLoadedMetadata`)
        const audioHtmlElement = audioRef.current as HTMLAudioElement
        const totalDuration = audioHtmlElement?.duration || 0
        if (totalDuration > 0) {
            setTotalTime(formatPlayTime(totalDuration))
            setDuration(totalDuration)
        }
    }

    const handleMoveTime = newTime => {
        console.log(`newTime`, newTime)
        const audioHtmlElement = audioRef.current as HTMLAudioElement
        // 把 audio 调到第一帧
        const src = audioHtmlElement.src
        // audioHtmlElement.src = '';
        // audioHtmlElement.src = src;
        // audioHtmlElement.play()
        audioHtmlElement.pause()
        audioHtmlElement.currentTime = parseInt(newTime)
        setCurrentTime(parseInt(newTime))
        audioHtmlElement.play()
    }

    useEffect(() => {
        const loadNewAudio = async () => {
            const buffer: Buffer = await electronServices.readAudioFile(audioFileName)
            const blob = new Blob([buffer], { type: 'audio/mpeg' })
            const url = URL.createObjectURL(blob)

            // const audio = new Audio(url);
            // audio.play()
            // // 记得在不需要时释放
            // audio.onended = () => URL.revokeObjectURL(url)

            const audioHtmlElement = audioRef.current as HTMLAudioElement
            audioHtmlElement.src = url
            ;(downloadRef.current as HTMLAnchorElement).href = url

            // audioHtmlElement.ontimeupdate = handleTimeUpdate;
            // audioHtmlElement.onloadedmetadata = handleLoadedMetadata;

            // 把 audio 调到第一帧
            // audioHtmlElement.currentTime = 0;
            setCurrentTime(0)
            // 获取播放的总时长
            console.log(`duration`, audioHtmlElement.duration)
            setIsPlaying(true)
        }
        if (audioFileName) {
            loadNewAudio()
        }
    }, [audioFileName])

    useEffect(() => {
        const audioHtmlElement = audioRef.current as HTMLAudioElement
        if (audioHtmlElement?.hasAttribute('src')) {
            if (isPlaying) {
                audioHtmlElement.play()
            } else {
                audioHtmlElement.pause()
            }
        }
    }, [isPlaying])

    if (!audioFileName) {
        return null
    }
    return (
        <>
            <Card className=" border-gray-100 shadow-xl p-6 w-full mx-auto">
                <CardHeader>
                    <CardTitle>播客播放器</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-lg font-medium">{``}</div>
                    <div className="flex justify-center items-center space-x-4 relative">
                        <SkipBack className="w-6 h-6 cursor-pointer" />
                        {isPlaying ? (
                            <Pause className="w-8 h-8 cursor-pointer" onClick={() => setIsPlaying(false)} />
                        ) : (
                            <Play className="w-8 h-8 cursor-pointer" onClick={() => setIsPlaying(true)} />
                        )}
                        <SkipForward className="w-6 h-6 cursor-pointer" />
                        <Download className="w-6 h-6 cursor-pointer absolute right-0 " onClick={handleDownloadAudio} />
                    </div>
                    <Slider
                        value={[currentTime]}
                        max={duration}
                        step={1}
                        // className="w-full"
                        onValueChange={([value]) => handleMoveTime(value)}
                    />
                    <div className="flex justify-between text-sm">
                        <span>{timeDisplay}</span>
                        <span>{totalTime}</span>
                    </div>
                </CardContent>
            </Card>
            <div className="">
                <a ref={downloadRef} download="filename.mp3" className="hidden"></a>
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onCanPlay={handleCanPlay}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full bg-transparent "
                />
            </div>
        </>
    )
}

// 由于miniMax接口有RPM限制，所以需要分批次请求， 目前RPM限制为 20，保险起见，设置为 10
const fetchMinMaxAudioBatch = async (dialogueList: Record<string, any>[]) => {
    // 每一批需要等待上一批全部返回之后才能继续
    const fetchAwaitList = _.map(_.chunk(dialogueList, 10), chunkItem => {
        const fetchList = _.compact(
            _.map(chunkItem, (dialogueItem, dialogueIndex) => {
                const { content, emotion, host } = dialogueItem || {}
                if (content) {
                    return () =>
                        electronServices.fetchMinMaxAudio({
                            content: `${dialogueIndex == 0 ? AUDIO_GAP_TEXT : ''}${content}${AUDIO_GAP_TEXT}`,
                            emotion: emotion,
                            voiceID:
                                host == `Mike`
                                    ? voicePresets.maleQnJingyingBeta.value
                                    : voicePresets.attractiveGirl.value,
                        })
                }
                return null
            })
        )

        return () => fetchAll(fetchList)
    })

    const results = await constsequentialAsyncCalls(fetchAwaitList, 30)
    return _.flatten(results)
}
