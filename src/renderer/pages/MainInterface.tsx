import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
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
import { extractJsonFromText, constsequentialAsyncCalls, formatPlayTime, fetchAll } from '../../shared/utils'
import {
    AUDIO_GAP_TEXT,
    voicePresets,
    GeneratingSatus,
    CONFIG_STORE_KEYS,
    DIALOGUE_TYPE,
    VoicePresetValues,
} from '../../shared/constants'
import DialogDisplay from '../components/DialogDisplay'
import AudioPlayer from '../components/AudioPlayer'
import MediaAudio from '../components/MediaAudio'
import readPDF from '../../shared/readPDF'

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
export default function MainInterface({ className }: { className?: string }) {
    const state = useMainStore(state => state)
    const [dialogueList, setDialogueList] = useState<any[]>([])
    const { audioPlayFile } = state || {}
    const [activeTab, setActiveTab] = useState('topicCast')
    return (
        <div className={`container mx-auto p-4 ${className || ''}`}>
            <h1 className="text-2xl font-bold my-4">主界面</h1>
            <div className={`flex w-full flex-col gap-6 min-w-md `}>
                <div className="">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-100 min-h-12 ">
                            <TabsTrigger
                                value="topicCast"
                                className="flex items-center cursor-pointer h-8 data-[state=active]:bg-gray-600 data-[state=active]:font-bold data-[state=active]:text-white bg-gray-200 shadow-md"
                            >
                                主题播客
                            </TabsTrigger>
                            <TabsTrigger
                                value="productItinerary"
                                className="flex items-center cursor-pointer h-8 data-[state=active]:bg-gray-600 data-[state=active]:font-bold data-[state=active]:text-white bg-gray-200 shadow-md"
                            >
                                产品行程
                            </TabsTrigger>
                            <TabsTrigger
                                value="PDFCast"
                                className="flex items-center cursor-pointer h-8 data-[state=active]:bg-gray-600 data-[state=active]:font-bold data-[state=active]:text-white bg-gray-200 shadow-md"
                            >
                                PDF
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="topicCast">
                            <PodcastGenerator callback={setDialogueList} />
                        </TabsContent>
                        <TabsContent value="productItinerary">
                            <ProductCastGenerator callback={setDialogueList} />
                        </TabsContent>
                        <TabsContent value="PDFCast">
                            <PDFPodcastGenerator />
                        </TabsContent>
                    </Tabs>
                </div>
                {/* <AudioPlayer audioFileName={audioPlayFile} /> */}
                <MediaAudio audioFileName={audioPlayFile} useSutro={true} />
                {dialogueList?.length ? (
                    <div className="border-gray-100 bg-white rounded-2xl shadow-xl py-8 w-full mx-auto text-sm">
                        <DialogDisplay conversationList={dialogueList} className="max-h-[28rem] overflow-y-auto mx-6" />
                    </div>
                ) : null}
            </div>
        </div>
    )
}

const VoiceSelection = React.memo(({ className }: { className?: string }) => {
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

    // 缓存音色选项列表
    const voiceOptions = useMemo(
        () =>
            _.map(voicePresets, ({ title, value }) => (
                <SelectItem key={value} value={value}>
                    {title}
                </SelectItem>
            )),
        [] // voicePresets 为静态数据时使用空依赖
    )

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
                        <SelectContent className="border-gray-200">{voiceOptions}</SelectContent>
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
                        <SelectContent className="border-gray-200">{voiceOptions}</SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
})

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
        const dialogueResult = await electronServices.fetchDialogue({ topic: producItinerary, requestJson: false })
        const { dialogueList, title: dialogueTitle } = dialogueResult || {}
        setGeneratingStatus(GeneratingSatus.DialogueExtracting)
        if (dialogueList?.length) {
            callback && callback(dialogueList)
            setGeneratingStatus(GeneratingSatus.AudioRequesting)
            const fetchResults = await fetchMinMaxAudioBatch(dialogueList)

            // 直接通过合并 hex 生成
            const now = Date.now()
            setGeneratingStatus(GeneratingSatus.AudioSynthesizing)
            const savedAudio = await electronServices.saveAudio(fetchResults.join(''), `${now}`)
            updateAudioPlayFile(`${now}.mp3`)
            const { filePath } = savedAudio || {}
            const savedDialog = await electronServices.databaseSaveDialogue({
                audioFilePath: filePath,
                title: dialogueTitle || '',
                keywords: castProductID,
                type: DIALOGUE_TYPE.PRODUCTID,
                dialogue_list: dialogueList,
            })
            console.log(`savedDialog`, savedDialog)
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
        updateCastTopic(String(castTopic || '').trim())
        updateIsGenerating(true)
        setGeneratingStatus(GeneratingSatus.DialogueGenerating)
        const dialogueResult = await electronServices.fetchDialogue({ topic: castTopic, requestJson: false })
        console.log(`dialogue`, dialogueResult)
        const { dialogueList, title: dialogueTitle } = dialogueResult || {}
        setGeneratingStatus(GeneratingSatus.DialogueExtracting)
        if (dialogueList?.length) {
            callback && callback(dialogueList)
            setGeneratingStatus(GeneratingSatus.AudioRequesting)
            const fetchResults = await fetchMinMaxAudioBatch(dialogueList)

            // 直接通过合并 hex 生成
            const now = Date.now()
            setGeneratingStatus(GeneratingSatus.AudioSynthesizing)
            const savedAudio = await electronServices.saveAudio(fetchResults.join(''), `${now}`)
            updateAudioPlayFile(`${now}.mp3`)
            const { filePath } = savedAudio || {}
            const savedDialog = await electronServices.databaseSaveDialogue({
                audioFilePath: filePath,
                title: dialogueTitle || '',
                keywords: castTopic,
                type: DIALOGUE_TYPE.TOPIC,
                dialogue_list: dialogueList,
            })

            console.log(`savedDialog`, savedDialog)
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

const PDFPodcastGenerator = ({ callback }: { callback?: (dialogueList: Record<string, any>[]) => void }) => {
    const [PDFFile, setPDFFile] = useState<Record<string, any>>({})
    const [PDFContent, setPDFContent] = useState('')
    const [isEnglish, setIsEnglish] = useState(false)
    const state = useMainStore(state => state)
    const [generatingStatus, setGeneratingStatus] = useState(GeneratingSatus.DialogueGenerating)
    const topicRef = useRef(null)
    const { castTopic, isGenerating, updateCastTopic, updateIsGenerating, updateAudioPlayFile } = state || {}

    const onDrop = useCallback(acceptedFiles => {
        setPDFContent('')
        const acceptedFile = acceptedFiles?.[0]
        if (acceptedFile?.path) {
            setPDFFile(acceptedFile)
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = async () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)

                const pdfContent = await readPDF(binaryStr)
                setPDFContent(pdfContent)
            }
            reader.readAsArrayBuffer(acceptedFile)
        }
        console.log(`acceptedFile`, acceptedFile)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
        },
    })

    const handleChagneLanguage = isEnglish => {
        setIsEnglish(isEnglish)
        electronServices.saveConfig(CONFIG_STORE_KEYS.englishDialog, isEnglish)
    }

    const handleGenerate = async () => {
        updateIsGenerating(true)
        setGeneratingStatus(GeneratingSatus.DialogueGenerating)
        const dialogueResult = await electronServices.fetchDialogue({ topic: PDFContent, requestJson: false })
        console.log(`dialogue`, dialogueResult)
        const { dialogueList, title: dialogueTitle } = dialogueResult || {}
        setGeneratingStatus(GeneratingSatus.DialogueExtracting)
        if (dialogueList?.length) {
            callback && callback(dialogueList)
            setGeneratingStatus(GeneratingSatus.AudioRequesting)
            const fetchResults = await fetchMinMaxAudioBatch(dialogueList)

            // 直接通过合并 hex 生成
            const now = Date.now()
            setGeneratingStatus(GeneratingSatus.AudioSynthesizing)
            const savedAudio = await electronServices.saveAudio(fetchResults.join(''), `${now}`)
            updateAudioPlayFile(`${now}.mp3`)
            const { filePath } = savedAudio || {}
            const savedDialog = await electronServices.databaseSaveDialogue({
                audioFilePath: filePath,
                title: dialogueTitle || '',
                keywords: PDFFile?.name || '',
                type: DIALOGUE_TYPE.PDF,
                dialogue_list: dialogueList,
            })

            console.log(`savedDialog`, savedDialog)
        }

        updateIsGenerating(false)
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
                            <span>Podcast by PDF</span>
                            <div className="grid grid-cols-2 gap-1 text-[14px] items-center">
                                <span className="text-end">En</span>
                                <Switch checked={isEnglish} onCheckedChange={handleChagneLanguage} />
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-0">
                    <div
                        {...getRootProps()}
                        className=" bg-gray-200 rounded-2xl min-h-20 text-gray-700 text-sm font-bold flex items-center justify-center cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        {PDFFile?.name ? (
                            <>
                                <p>
                                    {PDFFile?.name || ''} -{' '}
                                    {PDFFile?.size > 0 ? (PDFFile.size / 1024).toFixed(0) + 'KB' : ''}
                                </p>
                            </>
                        ) : isDragActive ? (
                            <p>将PDF拖到这里 ...</p>
                        ) : (
                            <p>
                                拖拽PDF到这里，或
                                <br />
                                点击选择PDF文件
                            </p>
                        )}
                    </div>
                    <VoiceSelection className="my-5" />
                    <Button
                        onClick={handleGenerate}
                        disabled={!PDFContent || isGenerating}
                        className={`w-full py-5 ${PDFContent ? 'cursor-pointer' : ''}`}
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

// 由于miniMax接口有RPM限制，所以需要分批次请求， 目前RPM限制为 20，保险起见，设置为 10
const fetchMinMaxAudioBatch = async (dialogueList: Record<string, any>[]) => {
    let [mikeVoice, jessicaVoice] = await Promise.all([
        electronServices.getConfig(CONFIG_STORE_KEYS.hostVoiceOne) as Promise<VoicePresetValues>,
        electronServices.getConfig(CONFIG_STORE_KEYS.hostVoiceTwo) as Promise<VoicePresetValues>,
    ])

    mikeVoice = mikeVoice || voicePresets.maleQnJingyingJingpin.value
    jessicaVoice = jessicaVoice || voicePresets.attractiveGirl.value
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
                            voiceID: host == `Mike` ? mikeVoice : jessicaVoice,
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
