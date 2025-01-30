import React, { useState, useEffect, useRef } from 'react'
import { formatPlayTime } from '../../shared/utils'
import { electronServices } from '../../services'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Loader2, Play, Pause, SkipBack, SkipForward, Edit2, ChevronDown, ChevronUp, Download } from 'lucide-react'
import { Slider } from './ui/slider'

export default function AudioPlayer({ audioFileName, className }: { audioFileName: string; className?: string }) {
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
            setIsPlaying(false)
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

    // if (!audioFileName) {
    //     return null
    // }
    return (
        <>
            <Card className={` border-gray-100 shadow-xl p-6 w-full mx-auto ${className || ''}`}>
                <CardHeader className="pt-0">
                    <CardTitle>播客播放器</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-0">
                    <div className="text-lg font-medium">{``}</div>
                    <div className="flex justify-center items-center space-x-4 relative">
                        <SkipBack className={`w-6 h-6  ${!audioFileName ? 'text-gray-300' : 'cursor-pointer'}`} />
                        {isPlaying ? (
                            <Pause
                                className={`w-8 h-8  ${!audioFileName ? 'text-gray-300' : 'cursor-pointer'}`}
                                onClick={() => setIsPlaying(false)}
                            />
                        ) : (
                            <Play
                                className={`w-8 h-8  ${!audioFileName ? 'text-gray-300' : 'cursor-pointer'}`}
                                onClick={() => !!audioFileName && setIsPlaying(true)}
                            />
                        )}
                        <SkipForward className={`w-6 h-6  ${!audioFileName ? 'text-gray-300' : 'cursor-pointer'}`} />
                        <Download
                            className={`w-6 h-6 ${!audioFileName ? 'text-gray-300' : 'cursor-pointer'} absolute right-0 `}
                            onClick={handleDownloadAudio}
                        />
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
