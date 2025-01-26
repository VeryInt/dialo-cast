import React from 'react'
import _ from 'lodash'
import { EMOTION_MAP } from '../../shared/constants'

interface DialogDisplayProps {
    conversationList: {
        host: string
        content: string
        emotion?: string
    }[]
    className?: string
}

export default function DialogDisplay({ conversationList, className }: DialogDisplayProps) {
    if (_.isEmpty(conversationList)) return null
    return (
        <div className={` space-y-3 ${className || ''}`}>
            {_.map(conversationList, (conversation, index) => {
                const { host, content, emotion } = conversation || {}
                const emotionText =
                    EMOTION_MAP[emotion]?.value && EMOTION_MAP[emotion]?.desc ? `[${EMOTION_MAP[emotion].desc}]` : ''
                return (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${
                            index % 2
                                ? 'bg-blue-100 border-l-4 border-blue-500'
                                : 'bg-green-100 border-r-4 border-green-500'
                        }`}
                    >
                        <span className="font-bold">{`${host}${emotionText}`}: </span>
                        <span>{content}</span>
                    </div>
                )
            })}
        </div>
    )
}
