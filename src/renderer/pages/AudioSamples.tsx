import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Play } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'

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
    const [open, setOpen] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState<string>()
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
            // In a real application, you would have actual audio files
            audioRef.current = new Audio('https://filecdn.minimax.chat/public/10b99171-a74e-4f7d-92e3-5f196fb71944.mp3')
            audioRef.current.play()
            setPlaying(voiceId)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Button onClick={() => setOpen(true)}>选择音色</Button>
            {/* <VoiceSelector open={open} onOpenChange={setOpen} selectedVoice={selectedVoice} onSelect={setSelectedVoice} /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                {VOICE_OPTIONS.map(voice => (
                    <Card
                        key={voice.id}
                        className={`relative overflow-hidden transition-colors hover:bg-accent cursor-pointer ${
                            selectedVoice === voice.id ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedVoice(voice.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">{voice.title}</h3>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={e => {
                                        e.stopPropagation()
                                        handlePlayDemo(voice.id)
                                    }}
                                >
                                    <Play className="h-4 w-4" />
                                    <span className="sr-only">Play demo</span>
                                </Button>
                            </div>
                            <div className="flex gap-1 mb-2">
                                <Badge variant="secondary">{voice.tags.gender}</Badge>
                                <Badge variant="secondary">{voice.tags.age}</Badge>
                                <Badge variant="secondary">{voice.tags.language}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{voice.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

const VOICE_OPTIONS: Voice[] = [
    {
        id: 'youth-male',
        title: '青涩青年',
        description: '青涩青年音色，声音清新自然，适合年轻化场景',
        tags: { gender: '男', age: '青年', language: '中文' },
        audioUrl: 'https://filecdn.minimax.chat/public/10b99171-a74e-4f7d-92e3-5f196fb71944.mp3',
    },
    {
        id: 'elite-male',
        title: '精英青年',
        description: '精英青年音色，声音沉稳有力，适合商务场景',
        tags: { gender: '男', age: '青年', language: '中文' },
        audioUrl: '/audio/elite-male.mp3',
    },
    {
        id: 'professional-male',
        title: '霸道青年',
        description: '霸道青年音色，声音富有魅力，适合强势场景',
        tags: { gender: '男', age: '青年', language: '中文' },
        audioUrl: '/audio/professional-male.mp3',
    },
    {
        id: 'college-male',
        title: '青年大学生',
        description: '青年大学生音色，声音阳光活力，适合校园场景',
        tags: { gender: '男', age: '青年', language: '中文' },
        audioUrl: '/audio/college-male.mp3',
    },
    {
        id: 'young-female',
        title: '少女',
        description: '少女音色，声音清脆甜美，适合年轻化场景',
        tags: { gender: '女', age: '青年', language: '中文' },
        audioUrl: '/audio/young-female.mp3',
    },
    {
        id: 'elegant-female',
        title: '御姐',
        description: '御姐音色，声音成熟魅惑，适合时尚场景',
        tags: { gender: '女', age: '青年', language: '中文' },
        audioUrl: '/audio/elegant-female.mp3',
    },
    {
        id: 'mature-female',
        title: '成熟女性',
        description: '成熟女性音色，声音温婉大方，适合商务场景',
        tags: { gender: '女', age: '成年', language: '中文' },
        audioUrl: '/audio/mature-female.mp3',
    },
    {
        id: 'sweet-female',
        title: '甜美女性',
        description: '甜美女性音色，声音甜美动听，适合柔和场景',
        tags: { gender: '女', age: '青年', language: '中文' },
        audioUrl: '/audio/sweet-female.mp3',
    },
    {
        id: 'male-host',
        title: '男性主持人',
        description: '男性主持人音色，声音专业有力，适合新闻播报场景',
        tags: { gender: '男', age: '成年', language: '中文' },
        audioUrl: '/audio/male-host.mp3',
    },
]

interface VoiceSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (voiceId: string) => void
    selectedVoice?: string
}

function VoiceSelector({ open, onOpenChange, onSelect, selectedVoice }: VoiceSelectorProps) {
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
            // In a real application, you would have actual audio files
            audioRef.current = new Audio(`https://filecdn.minimax.chat/public/10b99171-a74e-4f7d-92e3-5f196fb71944.mp3`)
            audioRef.current.play()
            setPlaying(voiceId)
        }
    }

    React.useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">更换音色</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                    {VOICE_OPTIONS.map(voice => (
                        <Card
                            key={voice.id}
                            className={`relative overflow-hidden transition-colors hover:bg-accent cursor-pointer ${
                                selectedVoice === voice.id ? 'border-primary' : ''
                            }`}
                            onClick={() => onSelect(voice.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold">{voice.title}</h3>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        onClick={e => {
                                            e.stopPropagation()
                                            handlePlayDemo(voice.id)
                                        }}
                                    >
                                        <Play className="h-4 w-4" />
                                        <span className="sr-only">Play demo</span>
                                    </Button>
                                </div>
                                <div className="flex gap-1 mb-2">
                                    <Badge variant="secondary">{voice.tags.gender}</Badge>
                                    <Badge variant="secondary">{voice.tags.age}</Badge>
                                    <Badge variant="secondary">{voice.tags.language}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{voice.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <DialogFooter className="flex justify-between">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        取消
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>确定</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
