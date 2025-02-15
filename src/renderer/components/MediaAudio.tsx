import React, { useEffect, useState, useRef, use } from 'react'
import MediaThemeTailwindAudio from 'player.style/tailwind-audio/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { electronServices } from '../../services'
import MediaThemeSutroAudio from 'player.style/sutro-audio/react'

export default function MediaAudio({
    audioFileName,
    className,
    useSutro,
}: {
    audioFileName: string
    className?: string
    useSutro?: boolean
}) {
    const [audioUrl, setAudioUrl] = useState('')
    const audioRef = useRef(null)
    useEffect(() => {
        const loadNewAudio = async () => {
            // setIsPlaying(false)
            const buffer: Buffer = await electronServices.readAudioFile(audioFileName)
            const blob = new Blob([buffer], { type: 'audio/mpeg' })
            const url = URL.createObjectURL(blob)
            // setAudioUrl(url)
            const audioHtmlElement = audioRef.current as HTMLAudioElement
            console.log(`audioHtmlElement`, audioHtmlElement, audioHtmlElement.currentTime)
            audioHtmlElement.pause()
            audioHtmlElement.src = url
            audioHtmlElement.currentTime = 0
            audioHtmlElement.play()
        }
        if (audioFileName) {
            loadNewAudio()
        }
    }, [audioFileName])

    return (
        <>
            <Card className={` border-gray-100 p-6 w-full shadow-lg mx-auto ${className || ''}`}>
                <CardHeader className="pt-0">
                    <CardTitle>播客播放器</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-0 w-full">
                    {useSutro ? (
                        <MediaThemeSutroAudio
                            style={{
                                // @ts-ignore
                                '--media-primary-color': '#fff',
                                '--media-secondary-color': '#444',
                                width: '100%',
                            }}
                        >
                            <audio
                                ref={audioRef}
                                slot="media"
                                src={audioUrl || ''}
                                playsInline
                                crossOrigin="anonymous"
                            ></audio>
                        </MediaThemeSutroAudio>
                    ) : (
                        <MediaThemeTailwindAudio
                            style={{
                                width: '100%',
                                // @ts-ignore
                            }}
                        >
                            <audio
                                ref={audioRef}
                                slot="media"
                                src={audioUrl || ''}
                                playsInline
                                crossOrigin="anonymous"
                            ></audio>
                        </MediaThemeTailwindAudio>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
