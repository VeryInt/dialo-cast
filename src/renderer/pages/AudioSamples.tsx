import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Pause, Play, Tag, Music2 } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { voicePresets, voiceDemoBaseUrl, VoicePresetValues } from '../../shared/constants'
import _ from 'lodash'
import { motion } from 'framer-motion'

export default function AudioSamples() {
    const [playing, setPlaying] = React.useState<string | null>(null)
    const audioRef = React.useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // 组件挂载时，可以在这里做一些初始化操作
        return () => {
            // 组件卸载时，停止音频播放
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0 // 将当前时间重置为0
            }
        }
    }, [])

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
        <div className="container mx-auto p-4 flex flex-col h-full">
            <h1 className="text-2xl font-bold my-4">语音演示</h1>
            <div className="flex-1 overflow-y-scroll">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4 ">
                    {_.map(voicePresets, (voicePreset, voicePresetKey) => {
                        const { title, value, desc, tags } = voicePreset || {}
                        const isPlaying = playing === voicePresetKey

                        return (
                            <AudioDemoCard
                                demo={{ ...voicePreset, voicePresetKey }}
                                isPlaying={isPlaying}
                                onPlay={handlePlayDemo}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

interface VoiceDemo {
    voicePresetKey: string
    value: string
    title: string
    desc: string
    demo: string
    ageGroup?: string
    gender?: string
    language?: string
}

const AudioDemoCard = ({ demo, isPlaying, onPlay }: { demo: VoiceDemo; isPlaying: boolean; onPlay: (id) => void }) => {
    const togglePlay = () => {
        onPlay && onPlay(demo.voicePresetKey)
    }

    return (
        <motion.div
            className="group relative bg-white rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            {/* 装饰性背景元素 */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isPlaying ? 'opacity-100 ' : ''}`}
            />
            <div
                className={`absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isPlaying ? 'opacity-20 ' : ''}`}
            />

            <div className="relative p-6">
                {/* 标题区域 */}
                <div className="flex items-center gap-4 mb-4">
                    <motion.button
                        onClick={togglePlay}
                        className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-indigo-200 transition-shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 hover:opacity-10 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center  cursor-pointer">
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </div>
                    </motion.button>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Music2 className="w-4 h-4 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{demo.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <motion.span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Tag className="w-3.5 h-3.5 mr-1" />
                                {demo.gender}
                            </motion.span>
                            <motion.span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-100"
                                whileHover={{ scale: 1.05 }}
                            >
                                {demo.ageGroup}
                            </motion.span>
                            <motion.span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100"
                                whileHover={{ scale: 1.05 }}
                            >
                                {demo.language}
                            </motion.span>
                        </div>
                    </div>
                </div>

                {/* 描述文本 */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{demo.desc}</p>
            </div>
        </motion.div>
    )
}
