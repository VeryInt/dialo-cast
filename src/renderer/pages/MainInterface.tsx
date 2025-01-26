import React, { useState, useRef, useEffect, HtmlHTMLAttributes } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
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
import { Switch } from '../components/ui/switch'
import { extractJsonArrayFromText, constsequentialAsyncCalls, formatPlayTime, fetchAll } from '../../shared/utils'
import { AUDIO_GAP_TEXT, voicePresets, GeneratingSatus, CONFIG_STORE_KEYS } from '../../shared/constants'
import DialogDisplay from '../components/DialogDisplay'

import _ from 'lodash'
const demoDialogue = [
    {
        emotion: 'neutral',
        host: 'Mike',
        content: '大家好，欢迎收听我们的经济展望节目。我是Mike，今天我们将用一分钟的时间快速回顾一下当前的经济形势',
    },
    {
        emotion: 'neutral',
        host: 'Jessica',
        content: '大家好，我是Jessica。<#0.5#>当前全球经济正面临多重挑战，包括通货膨胀、供应链问题和地缘政治紧张局势',
    },
    {
        emotion: 'neutral',
        host: 'Mike',
        content: '首先，我们来看看通货膨胀的情况。<#0.5#>根据最新数据，全球主要经济体的通胀率仍然处于高位',
    },
    {
        emotion: 'neutral',
        host: 'Jessica',
        content: '是的，Mike。<#0.5#>美国和欧元区的通胀率都超过了预期，这给各国央行带来了巨大的加息压力',
    },
    {
        emotion: 'neutral',
        host: 'Mike',
        content: '不过值得注意的是，<#0.5#>尽管通胀率居高不下，但一些经济学家认为这可能是暂时的',
    },
    {
        emotion: 'neutral',
        host: 'Jessica',
        content: '确实如此。<#0.5#>供应链问题正在逐步缓解，这可能会在未来几个月对物价产生积极影响',
    },
    {
        emotion: 'neutral',
        host: 'Mike',
        content: '接下来，我们来看看地缘政治的影响。<#0.5#>俄乌冲突对全球能源市场和粮食供应造成了显著冲击',
    },
    {
        emotion: 'neutral',
        host: 'Jessica',
        content: '没错。<#0.5#>能源价格上涨不仅影响了消费者，也对工业生产造成了压力',
    },
]
export default function MainInterface() {
    const state = useMainStore(state => state)
    const [dialogueList, setDialogueList] = useState<any[]>([])
    const { audioPlayFile } = state || {}
    const [activeTab, setActiveTab] = useState('topicCast')
    return (
        <div className="flex w-full flex-col gap-6 max-w-3xl mx-auto min-w-md">
            <div className="">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 gap-2 bg-gray-100">
                        <TabsTrigger
                            value="topicCast"
                            className="flex items-center cursor-pointer data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                        >
                            主题播客
                        </TabsTrigger>
                        <TabsTrigger
                            value="productItinerary"
                            className="flex items-center cursor-pointer data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                        >
                            产品行程
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="topicCast">
                        <PodcastGenerator callback={setDialogueList} />
                    </TabsContent>
                    <TabsContent value="productItinerary">
                        <ProductCastGenerator callback={setDialogueList} />
                    </TabsContent>
                </Tabs>
            </div>
            <AudioPlayer audioFileName={audioPlayFile} />
            {dialogueList?.length ? (
                <div className="border-gray-100 bg-white rounded-2xl shadow-xl py-8 w-full mx-auto text-sm">
                    <DialogDisplay conversationList={dialogueList} className="max-h-[28rem] overflow-y-auto mx-6" />
                </div>
            ) : null}
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

const ProductCastGenerator = ({ callback }: { callback?: (dialogueList: Record<string, any>[]) => void }) => {
    const state = useMainStore(state => state)
    const [isEnglish, setIsEnglish] = useState(false)
    const [generatingStatus, setGeneratingStatus] = useState(GeneratingSatus.DialogueGenerating)
    const topicRef = useRef(null)
    const { castProductID, isGenerating, updateCastProductID, updateIsGenerating, updateAudioPlayFile } = state || {}
    const handleUpdateProductID = productID => {
        const productIDNumber = (productID ? productID.match(/\d+/g)?.[0] : '') || ''
        updateCastProductID(String(productIDNumber).trim())
    }

    const handleGenerateProduct = async () => {
        // fetchProductDailyList
        console.log(`castProductID`, castProductID)
        updateIsGenerating(true)
        setGeneratingStatus(GeneratingSatus.FetchingItinerary)
        const producItinerary = await electronServices.fetchProductDailyList({ productID: Number(castProductID) })
        console.log(`producItinerary`, producItinerary)
        setGeneratingStatus(GeneratingSatus.DialogueGenerating)
        const dialogue = await electronServices.fetchDialogue({ topic: producItinerary, requestJson: false })
        setGeneratingStatus(GeneratingSatus.DialogueExtracting)
        const { dialogueList } = dialogue || {}
        if (dialogueList?.length) {
            callback && callback(dialogueList)
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

    const handleChagneLanguage = isEnglish => {
        setIsEnglish(isEnglish)
        electronServices.saveConfig(CONFIG_STORE_KEYS.englishDialog, isEnglish)
    }

    useEffect(() => {
        electronServices.getConfig(CONFIG_STORE_KEYS.englishDialog).then((isEnglish: boolean) => {
            setIsEnglish(!!isEnglish)
        })
    }, [])

    return (
        <>
            <Card className=" border-gray-100 shadow-xl p-6 w-full mx-auto">
                <CardHeader className="pt-0">
                    <CardTitle>
                        <div className="flex flex-row justify-between">
                            <span>生成行程讨论</span>
                            <div className="grid grid-cols-2 gap-1 text-[14px] items-center">
                                <span className="text-end">En</span>
                                <Switch checked={isEnglish} onCheckedChange={handleChagneLanguage} />
                            </div>
                        </div>
                    </CardTitle>
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

const PodcastGenerator = ({ callback }: { callback?: (dialogueList: Record<string, any>[]) => void }) => {
    const state = useMainStore(state => state)
    const [generatingStatus, setGeneratingStatus] = useState(GeneratingSatus.DialogueGenerating)
    const [isEnglish, setIsEnglish] = useState(false)
    const topicRef = useRef(null)
    const { castTopic, isGenerating, updateCastTopic, updateIsGenerating, updateAudioPlayFile } = state || {}
    const handleUpdateTopic = topic => {
        updateCastTopic(topic)
    }
    const handleGenerate = async () => {
        console.log(`topic`, castTopic)
        updateIsGenerating(true)
        setGeneratingStatus(GeneratingSatus.DialogueGenerating)
        const dialogue = await electronServices.fetchDialogue({ topic: castTopic, requestJson: false })
        console.log(`dialogue`, dialogue)
        const { dialogueList } = dialogue || {}
        setGeneratingStatus(GeneratingSatus.DialogueExtracting)
        if (dialogueList?.length) {
            callback && callback(dialogueList)
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

    const handleChagneLanguage = isEnglish => {
        setIsEnglish(isEnglish)
        electronServices.saveConfig(CONFIG_STORE_KEYS.englishDialog, isEnglish)
    }

    useEffect(() => {
        electronServices.getConfig(CONFIG_STORE_KEYS.englishDialog).then((isEnglish: boolean) => {
            setIsEnglish(!!isEnglish)
        })
    }, [])

    return (
        <>
            <Card className=" border-gray-100 shadow-xl p-6 w-full mx-auto">
                <CardHeader className="pt-0">
                    <CardTitle>
                        <div className="flex flex-row justify-between">
                            <span>生成新播客</span>
                            <div className="grid grid-cols-2 gap-1 text-[14px] items-center">
                                <span className="text-end">En</span>
                                <Switch checked={isEnglish} onCheckedChange={handleChagneLanguage} />
                            </div>
                        </div>
                    </CardTitle>
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
                <CardHeader className="pt-0">
                    <CardTitle>播客播放器</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-0">
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
                    <div className="flex justify-between text-sm mb-0">
                        <span>{timeDisplay}</span>
                        <span>{totalTime}</span>
                    </div>
                    <div className="hidden">
                        <a ref={downloadRef} download="filename.mp3" className="hidden"></a>
                        <audio
                            ref={audioRef}
                            onTimeUpdate={handleTimeUpdate}
                            onCanPlay={handleCanPlay}
                            onLoadedMetadata={handleLoadedMetadata}
                            className="w-full bg-transparent "
                        />
                    </div>
                </CardContent>
            </Card>
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
