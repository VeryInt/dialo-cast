import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog'
import { Button } from './ui/button'

interface AlertPopupProps {
    triggerText?: string
    isOpen?: boolean
    title?: string
    content: string
    cancelText?: string
    onCancel?: () => void
    confirmText?: string
    onConfirm?: () => void
}
export default function AlertPopup(props: AlertPopupProps) {
    const { title, isOpen, triggerText, content, cancelText, confirmText, onCancel, onConfirm } = props || {}
    const [openPopup, setOpenPopup] = useState(isOpen)
    useEffect(() => {
        if (!triggerText) {
            setOpenPopup(isOpen)
        }
    }, [isOpen])

    const handleCancel = () => {
        onCancel && onCancel()
        setOpenPopup(false)
    }
    const handleConfirm = () => {
        onConfirm && onConfirm()
        setOpenPopup(false)
    }
    return (
        <AlertDialog onOpenChange={setOpenPopup} open={openPopup}>
            {triggerText ? (
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpenPopup(true)
                        }}
                    >
                        {triggerText}
                    </Button>
                </AlertDialogTrigger>
            ) : null}

            <AlertDialogContent>
                <AlertDialogHeader>
                    {title ? <AlertDialogTitle>{title}</AlertDialogTitle> : null}
                    <AlertDialogDescription>{content}</AlertDialogDescription>
                </AlertDialogHeader>
                {cancelText || confirmText ? (
                    <AlertDialogFooter>
                        {cancelText ? <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel> : null}
                        {confirmText ? (
                            <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
                        ) : null}
                    </AlertDialogFooter>
                ) : null}
            </AlertDialogContent>
        </AlertDialog>
    )
}
