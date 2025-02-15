import React from 'react'
import { Clock } from 'lucide-react'

type SpeakerColor = 'blue' | 'purple'

interface PodcastMessage {
    speaker: {
        name: string
        role: string
        color: SpeakerColor
    }
    content: string
    timestamp: string
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
                {messages.map((message, index) => {
                    const colors = getSpeakerColors(message.speaker.color)
                    return (
                        <div key={index} className="group">
                            <div className="flex items-center gap-2 mb-1 px-4">
                                <span className={`font-medium ${colors.light.name} ${colors.dark.name}`}>
                                    {message.speaker.name}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{message.speaker.role}</span>
                                <span className="text-sm text-gray-400 dark:text-gray-500">{message.timestamp}</span>
                            </div>

                            <div className="relative">
                                <div
                                    className={`
                  p-4 rounded-xl
                  ${colors.light.bg} ${colors.dark.bg}
                  ${colors.light.border} ${colors.dark.border}
                  border
                  transition-colors duration-200
                `}
                                >
                                    <p className={`${colors.light.text} ${colors.dark.text} leading-relaxed`}>
                                        {message.content}
                                    </p>
                                </div>
                                {/* Hover 效果 */}
                                <div
                                    className={`
                  absolute -inset-px rounded-xl
                  bg-gradient-to-r ${colors.light.gradient} ${colors.dark.gradient}
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  pointer-events-none
                `}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// 示例数据
const demoMessages: PodcastMessage[] = [
    {
        speaker: {
            name: '王小明',
            role: '主持人',
            color: 'blue',
        },
        content:
            '今天我们要讨论的是人工智能在日常生活中的应用。这个话题最近特别火热，相信大家都很感兴趣。张老师，您能先和我们分享一下您的观点吗？',
        timestamp: '00:00',
    },
    {
        speaker: {
            name: '张教授',
            role: '特邀嘉宾',
            color: 'purple',
        },
        content:
            '是的，人工智能确实正在深刻地改变我们的生活。从智能手机助手到自动驾驶，从医疗诊断到教育领域，我们都能看到AI的身影。不过我认为最重要的是要理性看待AI的发展，既要认识到它的潜力，也要明白它的局限性。',
        timestamp: '00:45',
    },
    {
        speaker: {
            name: '王小明',
            role: '主持人',
            color: 'blue',
        },
        content: '说得很好。那您觉得普通人要如何更好地适应AI时代的到来呢？',
        timestamp: '01:30',
    },
    {
        speaker: {
            name: '张教授',
            role: '特邀嘉宾',
            color: 'purple',
        },
        content:
            '是的，人工智能确实正在深刻地改变我们的生活。从智能手机助手到自动驾驶，从医疗诊断到教育领域，我们都能看到AI的身影。不过我认为最重要的是要理性看待AI的发展，既要认识到它的潜力，也要明白它的局限性。',
        timestamp: '00:45',
    },
    {
        speaker: {
            name: '王小明',
            role: '主持人',
            color: 'blue',
        },
        content: '说得很好。那您觉得普通人要如何更好地适应AI时代的到来呢？',
        timestamp: '01:30',
    },
    {
        speaker: {
            name: '张教授',
            role: '特邀嘉宾',
            color: 'purple',
        },
        content:
            '是的，人工智能确实正在深刻地改变我们的生活。从智能手机助手到自动驾驶，从医疗诊断到教育领域，我们都能看到AI的身影。不过我认为最重要的是要理性看待AI的发展，既要认识到它的潜力，也要明白它的局限性。',
        timestamp: '00:45',
    },
    {
        speaker: {
            name: '王小明',
            role: '主持人',
            color: 'blue',
        },
        content: '说得很好。那您觉得普通人要如何更好地适应AI时代的到来呢？',
        timestamp: '01:30',
    },
]

// 导出组件和示例数据
export { PodcastConversation, demoMessages }
export type { PodcastMessage, PodcastConversationProps }
