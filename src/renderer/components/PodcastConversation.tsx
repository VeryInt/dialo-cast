import React from 'react'
import { Clock } from 'lucide-react'
import _ from 'lodash'
import { EMOTION_MAP } from '../../shared/constants'
type SpeakerColor = 'blue' | 'purple'

interface PodcastMessage {
    content: string
    host: string
    emotion: string
}

interface PodcastConversationProps {
    title?: string
    episode?: string
    duration?: string
    messages: PodcastMessage[]
    className?: string
}

const getSpeakerColors = (color: SpeakerColor) => {
    const colors = {
        blue: {
            light: {
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                text: 'text-blue-800',
                name: 'text-blue-700',
                gradient: 'from-blue-500/10 to-blue-600/10',
            },
            dark: {
                bg: 'dark:bg-blue-950/50',
                border: 'dark:border-blue-900',
                text: 'dark:text-blue-200',
                name: 'dark:text-blue-300',
                gradient: 'dark:from-blue-400/20 dark:to-blue-500/20',
            },
        },
        purple: {
            light: {
                bg: 'bg-purple-50',
                border: 'border-purple-100',
                text: 'text-purple-800',
                name: 'text-purple-700',
                gradient: 'from-purple-500/10 to-purple-600/10',
            },
            dark: {
                bg: 'dark:bg-purple-950/50',
                border: 'dark:border-purple-900',
                text: 'dark:text-purple-200',
                name: 'dark:text-purple-300',
                gradient: 'dark:from-purple-400/20 dark:to-purple-500/20',
            },
        },
    }
    return colors[color]
}

const PodcastConversation = ({ title, episode, duration, messages, className = '' }: PodcastConversationProps) => {
    return (
        <div className={`w-full bg-transparent ${className}`}>
            {/* 可选的头部信息 */}
            {(title || episode || duration) && (
                <div className="mb-6">
                    {title && <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>}
                    {(episode || duration) && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {episode && <span>{episode}</span>}
                            {duration && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{duration}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 对话内容 */}
            <div className="space-y-4">
                {_.map(messages, (message, index) => {
                    const { host, content, emotion } = message || {}
                    const emotionText =
                        EMOTION_MAP[emotion]?.value && EMOTION_MAP[emotion]?.desc
                            ? `[${EMOTION_MAP[emotion].desc}]`
                            : ''
                    const colors = getSpeakerColors(index % 2 ? 'purple' : 'blue')
                    return (
                        <div key={index} className="group">
                            <div className="flex items-center gap-2 mb-1 px-4">
                                <span className={`font-medium ${colors.light.name} ${colors.dark.name}`}>{host}</span>
                                <span className="text-sm text-gray-400 dark:text-gray-500">{emotionText}</span>
                            </div>

                            <div className="relative">
                                <div
                                    className={`p-4 rounded-xl ${colors.light.bg} ${colors.dark.bg} ${colors.light.border} ${colors.dark.border}  border transition-colors duration-200 `}
                                >
                                    <p className={`${colors.light.text} ${colors.dark.text} leading-relaxed`}>
                                        {content}
                                    </p>
                                </div>
                                {/* Hover 效果 */}
                                <div
                                    className={` absolute -inset-px rounded-xl bg-gradient-to-r ${colors.light.gradient} ${colors.dark.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none `}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PodcastConversation
export type { PodcastMessage, PodcastConversationProps }
