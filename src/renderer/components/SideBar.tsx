import React, { useState } from 'react'
import { cn } from '../lib/utils'
import { navPages } from '../../shared/constants'
import { useMainStore } from '../providers'
import _ from 'lodash'

export default function Sidebar() {
    const state = useMainStore(state => state)
    const { currentPage, updateCurrentPage } = state || {}

    return (
        <div className="w-16 h-full">
            <div className="fixed left-0 top-0 bottom-0 w-16 bg-gray-900 flex flex-col items-center py-4">
                {_.map(navPages, item => (
                    <button
                        key={item.value}
                        onClick={() => updateCurrentPage(item.value)}
                        className={cn(
                            'w-12 h-12 flex items-center justify-center rounded-lg mb-4 transition-colors cursor-pointer',
                            currentPage === item.value
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        )}
                        title={item.label}
                    >
                        <item.icon className="w-6 h-6" />
                    </button>
                ))}
            </div>
        </div>
    )
}
