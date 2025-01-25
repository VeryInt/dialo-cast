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
import { useMainStore } from './providers'

export default function MainInterface() {
    return (
        <div>
            <PodcastGenerator />
        </div>
    )
}

export const PodcastGenerator = () => {
    const state = useMainStore(state => state)
    const { castTopic, isGenerating, updateCastTopic, updateIsGenerating } = state || {}
    const handleUpdateTopic = topic => {
        updateCastTopic(topic)
    }
    const handleGenerate = async () => {
        updateIsGenerating(true)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>生成新播客</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input placeholder="输入播客主题" value={castTopic} onChange={e => handleUpdateTopic(e.target.value)} />
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
    )
}
