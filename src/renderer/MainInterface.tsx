import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Textarea } from './components/ui/textarea'
import { Progress } from './components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Slider } from './components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible'
import { Loader2, Play, Pause, SkipBack, SkipForward, Edit2, ChevronDown, ChevronUp } from 'lucide-react'

export default function MainInterface() {
    const [topic, setTopic] = useState('')
    const [conversation, setConversation] = useState('')
    const [progress, setProgress] = useState(0)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationStage, setGenerationStage] = useState('')
    const [podcasts, setPodcasts] = useState([
        { id: 1, title: 'AI的未来', duration: '10:30', date: '2023-06-01' },
        { id: 2, title: '深度学习简介', duration: '15:45', date: '2023-06-05' },
    ])
    const [currentPodcast, setCurrentPodcast] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [editingPodcast, setEditingPodcast] = useState(null)
    const [isEditCollapsibleOpen, setIsEditCollapsibleOpen] = useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)
        setProgress(0)
        setGenerationStage('生成对话')

        // 模拟对话生成
        for (let i = 0; i <= 100; i += 20) {
            await new Promise(resolve => setTimeout(resolve, 500))
            setProgress(i)
        }
        const generatedConversation = '主持人A: 今天我们要讨论的话题是' + topic + '\n主持人B: 这确实是一个有趣的话题...'
        setConversation(generatedConversation)

        setGenerationStage('生成音频')
        setProgress(0)

        // 模拟音频生成
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 300))
            setProgress(i)
        }

        setIsGenerating(false)
        setGenerationStage('')

        // 添加新生成的播客到列表
        const newPodcast = {
            id: podcasts.length + 1,
            title: topic,
            duration: '05:00', // 假设生成的播客长度为5分钟
            date: new Date().toISOString().split('T')[0],
        }
        setPodcasts([...podcasts, newPodcast])
        setCurrentPodcast(newPodcast)
        setEditingPodcast(newPodcast)
        setIsEditCollapsibleOpen(true)
    }

    const handlePlay = podcast => {
        setCurrentPodcast(podcast)
        setIsPlaying(true)
        // 这里应该有实际的音频播放逻辑
    }

    const handleEdit = podcast => {
        setEditingPodcast(podcast)
        setIsEditCollapsibleOpen(true)
    }

    const handleSaveEdit = () => {
        // 保存编辑后的对话内容
        setPodcasts(podcasts.map(p => (p.id === editingPodcast.id ? { ...p, ...editingPodcast } : p)))
        setIsEditCollapsibleOpen(false)
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>生成新播客</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="输入播客主题" value={topic} onChange={e => setTopic(e.target.value)} />
                    <Button onClick={handleGenerate} disabled={!topic || isGenerating} className="w-full">
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                生成中
                            </>
                        ) : (
                            '生成播客'
                        )}
                    </Button>
                    {isGenerating && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium">{generationStage}</div>
                            <Progress value={progress} className="w-full" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>播客播放器</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-lg font-medium">{currentPodcast ? currentPodcast.title : '未选择播客'}</div>
                    <div className="flex justify-center items-center space-x-4">
                        <SkipBack className="w-6 h-6 cursor-pointer" />
                        {isPlaying ? (
                            <Pause className="w-8 h-8 cursor-pointer" onClick={() => setIsPlaying(false)} />
                        ) : (
                            <Play className="w-8 h-8 cursor-pointer" onClick={() => setIsPlaying(true)} />
                        )}
                        <SkipForward className="w-6 h-6 cursor-pointer" />
                    </div>
                    <Slider
                        value={[currentTime]}
                        max={duration}
                        step={1}
                        className="w-full"
                        onValueChange={([value]) => setCurrentTime(value)}
                    />
                    <div className="flex justify-between text-sm">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>播客库</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>标题</TableHead>
                                <TableHead>时长</TableHead>
                                <TableHead>日期</TableHead>
                                <TableHead>操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {podcasts.map(podcast => (
                                <TableRow key={podcast.id}>
                                    <TableCell>{podcast.title}</TableCell>
                                    <TableCell>{podcast.duration}</TableCell>
                                    <TableCell>{podcast.date}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Play
                                                className="w-4 h-4 cursor-pointer"
                                                onClick={() => handlePlay(podcast)}
                                            />
                                            <Edit2
                                                className="w-4 h-4 cursor-pointer"
                                                onClick={() => handleEdit(podcast)}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Collapsible open={isEditCollapsibleOpen} onOpenChange={setIsEditCollapsibleOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                        {isEditCollapsibleOpen ? (
                            <>
                                <ChevronUp className="mr-2 h-4 w-4" />
                                收起编辑
                            </>
                        ) : (
                            <>
                                <ChevronDown className="mr-2 h-4 w-4" />
                                展开编辑
                            </>
                        )}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    {editingPodcast && (
                        <>
                            <Textarea
                                value={conversation}
                                onChange={e => setConversation(e.target.value)}
                                className="min-h-[200px]"
                            />
                            <Button onClick={handleSaveEdit}>保存修改</Button>
                        </>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
