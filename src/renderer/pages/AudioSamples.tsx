import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Pause, Play } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { voicePresets, voiceDemoBaseUrl } from '../../shared/constants'
import _ from 'lodash'

interface Voice {
    id: string
    title: string
    description: string
    tags: {
        gender: '男' | '女'
        age: '青年' | '成年'
        language: '中文'
    }
    audioUrl?: string
}

export default function AudioSamples() {
    const [playing, setPlaying] = React.useState<string | null>(null)
    const audioRef = React.useRef<HTMLAudioElement | null>(null)

    const handlePlayDemo = (voiceId: string) => {
        if (playing === voiceId) {
            audioRef.current?.pause()
            setPlaying(null)
        } else {
            if (audioRef.current) {
                audioRef.current.pause()
            }
            const playUrl = `${voiceDemoBaseUrl}${voicePresets[voiceId].demo}`
            audioRef.current = new Audio(playUrl)
            audioRef.current.play()
            setPlaying(voiceId)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                {_.map(voicePresets, (voicePreset, voicePresetKey) => {
                    const { title, value, desc, tags } = voicePreset || {}
                    const isPlaying = playing === voicePresetKey
                    return (
                        <Card
                            key={`voice_${voicePresetKey}`}
                            className={` shadow-lg relative overflow-hidden transition-colors hover:bg-accent cursor-pointer min-h-28  border-none ${
                                isPlaying ? '!bg-gray-700 text-white' : ''
                            }`}
                            onClick={() => handlePlayDemo(voicePresetKey)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">{title}</h3>
                                    <div className="h-8 p-0 flex w-fit items-center gap-1">
                                        {isPlaying ? (
                                            <>
                                                <span>暂停</span>
                                                <Pause className="h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                <span>播放</span>
                                                <Play className="h-4 w-4" />
                                            </>
                                        )}
                                        <span className="sr-only">Play demo</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-2">
                                    {_.map(tags || [], (tag, tagIndex) => {
                                        return (
                                            <Badge key={`tag_${tagIndex}`} variant="secondary">
                                                {tag}
                                            </Badge>
                                        )
                                    })}
                                </div>
                                <p
                                    className={`text-sm ${isPlaying ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                                >
                                    {desc}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
