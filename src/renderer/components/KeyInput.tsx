import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface KeyInputProps {
    id?: string
    placeholder?: string
    value: string
    className?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function KeyInput({ id, className, placeholder, value, onChange }: KeyInputProps) {
    const [showKey, setShowKey] = useState(false)

    const toggleVisibility = () => {
        setShowKey(!showKey)
    }

    return (
        <div className="relative">
            <Input
                value={value}
                id={id || undefined}
                type={showKey ? 'text' : 'password'}
                onChange={onChange}
                className={`${className} pr-10`}
                placeholder={placeholder || ''}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={toggleVisibility}
            >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showKey ? 'Hide API key' : 'Show API key'}</span>
            </Button>
        </div>
    )
}
