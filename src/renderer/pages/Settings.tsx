import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { ExternalLink } from 'lucide-react'
import { electronServices } from '../../services'
import { CONFIG_STORE_KEYS } from '../../shared/constants'

export default function Settings({ className }: { className?: string }) {
    const [apiKey, setApiKey] = useState('')
    const [groupID, setGroupID] = useState('')
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        // Logic to fetch API key and Base URL
        electronServices.getConfig(CONFIG_STORE_KEYS.miniMaxApiKey).then((key: string) => {
            setApiKey(key)
        })
        electronServices.getConfig(CONFIG_STORE_KEYS.miniMaxGroupID).then((id: string) => {
            setGroupID(id)
        })
    }, [])

    const handleSave = () => {
        // Logic to save API key and Base URL
        console.log('Saving API key:', apiKey)
        setIsSaved(true)
        electronServices.saveConfig(CONFIG_STORE_KEYS.miniMaxApiKey, apiKey)
        electronServices.saveConfig(CONFIG_STORE_KEYS.miniMaxGroupID, groupID)
        setTimeout(() => setIsSaved(false), 1500)
    }

    const handleOpenLink = linkUrl => {
        // Logic to open the link
        console.log('Opening link')
        if (linkUrl) {
            electronServices.openLink(String(linkUrl).trim())
        }
    }

    return (
        <div className={`container mx-auto p-4 flex flex-col h-full ${className || ''}`}>
            <h1 className="text-2xl font-bold my-4">设置</h1>
            <div className="flex flex-col flex-1 ">
                <Card className=" border-gray-100 shadow-xl p-6 w-full mx-auto">
                    <CardHeader className="pt-0 text-xl">
                        <CardTitle>MiniMax API</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="gap-6 flex flex-col">
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="api-key" className="text-base font-bold text-gray-600">
                                        MiniMax API Key
                                    </Label>
                                    <span
                                        onClick={() =>
                                            handleOpenLink(
                                                'https://platform.minimaxi.com/user-center/basic-information/interface-key'
                                            )
                                        }
                                        className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                        获取API <ExternalLink className="ml-2 w-3 h-3" />
                                    </span>
                                </div>
                                <Input
                                    id="api-key"
                                    type="text"
                                    value={apiKey}
                                    onChange={e => setApiKey(e.target.value)}
                                    placeholder="输入您的 API Key"
                                    className="text-lg p-6"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="group-id" className="text-base font-bold text-gray-600">
                                        MiniMax Group ID
                                    </Label>
                                    <span
                                        onClick={() =>
                                            handleOpenLink(
                                                'https://platform.minimaxi.com/user-center/basic-information'
                                            )
                                        }
                                        className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                        查看GroupID <ExternalLink className="ml-2 w-3 h-3" />
                                    </span>
                                </div>
                                <Input
                                    id="group-id"
                                    type="text"
                                    value={groupID}
                                    onChange={e => setGroupID(e.target.value)}
                                    placeholder="输入您的 GroupID"
                                    className="text-lg p-6"
                                />
                            </div>
                        </div>

                        <Button onClick={handleSave} className="w-full py-5 cursor-pointer">
                            保存设置
                        </Button>
                        {isSaved && (
                            <Alert className="mt-4 bg-green-100 border-green-400">
                                <AlertTitle>成功</AlertTitle>
                                <AlertDescription>设置已保存</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
