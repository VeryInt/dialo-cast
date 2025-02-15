import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Play, Trash2, Download } from 'lucide-react'
import { electronServices } from '../../services'
import AudioPlayer from '../components/AudioPlayer'
import MediaAudio from '../components/MediaAudio'
import dayjs from 'dayjs'
import _ from 'lodash'
import AlertPopup from '../components/AlertPopup'

const headTextList = [`标题`, `类型`, `日期`, `操作`]

export default function PodcastLibrary({ className }: { className?: string }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [podcasts, setPodcasts] = useState([])
    const [audioFileName, setAudioFileName] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const downloadRef = useRef(null)

    console.log(`showConfirm`, showConfirm)

    useEffect(() => {
        const getStoredPodcasts = async () => {
            const dialoguesResult = await electronServices.databaseListDialogues(0)
            const { success, data: dialogueList } = dialoguesResult || {}
            if (dialogueList?.length) {
                console.log(`PodcastLibrary`, dialogueList)
                setPodcasts(
                    _.map(dialogueList, dialogueItem => {
                        const { createAt } = dialogueItem || {}
                        const date = dayjs(createAt)
                        return {
                            ...dialogueItem,
                            date: date.format('YYYY-MM-DD HH:mm:ss'),
                        }
                    })
                )
            }
        }

        getStoredPodcasts()
    }, [])

    const handlePlay = (id: number) => {
        // 播放逻辑
        const currentPodcast = _.find(podcasts, p => p.id == id)
        if (currentPodcast?.audioFilePath) {
            setAudioFileName(currentPodcast?.audioFilePath)
        }
    }

    const handleDelete = (id: number) => {
        // electronServices.databaseDelDialogue(id)
        // setPodcasts(podcasts.filter(podcast => podcast.id !== id))
        setShowConfirm(true)
        setDeleteId(id)
    }

    const handleConfirmDelete = () => {
        electronServices.databaseDelDialogue(deleteId)
        setPodcasts(podcasts.filter(podcast => podcast.id !== deleteId))
        setShowConfirm(false)
        setDeleteId(null)
    }

    const handleDownloadAudio = async (id: number) => {
        console.log(`handleDownloadAudio`)
        const currentPodcast = _.find(podcasts, p => p.id == id)
        console.log(`currentPodcast`, currentPodcast)
        const { title, audioFilePath } = currentPodcast || {}
        if (audioFilePath) {
            const buffer: Buffer = await electronServices.readAudioFile(audioFilePath)
            const blob = new Blob([buffer], { type: 'audio/mpeg' })
            const url = URL.createObjectURL(blob)
            const downloadElement = downloadRef?.current as HTMLAnchorElement
            if (downloadElement) {
                downloadElement.download = `${title}.mp3`
                downloadElement.href = url
                downloadElement.click()
            }
        }
    }

    return (
        <>
            <div className={`container mx-auto p-4 h-full flex flex-col ${className || ''}`}>
                <h1 className="text-2xl font-bold my-4">播客库</h1>
                <div className="flex flex-col mb-10 flex-1 overflow-y-hidden gap-4">
                    {/* <AudioPlayer audioFileName={audioFileName} className={`mb-4 relative`} /> */}
                    <MediaAudio audioFileName={audioFileName} className={`mb-4 relative`} />
                    <Card className=" border-none shadow-lg p-6 mb-2 w-full  mx-auto flex-1 overflow-y-scroll">
                        <CardHeader className="pt-0">
                            <CardTitle>播客库</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-500 !border-b-2">
                                        {_.map(headTextList, (ht, ht_index) => {
                                            return (
                                                <TableHead
                                                    key={`podcast_table_${ht_index}`}
                                                    className={
                                                        ht_index == headTextList.length - 1
                                                            ? `flex items-center justify-end pr-6`
                                                            : ''
                                                    }
                                                >
                                                    {ht}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-gray-700">
                                    {_.map(podcasts, (podcast, podcastIndex) => {
                                        const { id, title, date, type } = podcast || {}
                                        return (
                                            <TableRow key={`podcast_${podcastIndex}`} className="border-gray-300">
                                                <TableCell title={title}>
                                                    <div className="flex items-center font-bold line-clamp-1 min-w-36 min-h-10 align-middle">
                                                        {title}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{type}</TableCell>
                                                <TableCell>{date}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-4 justify-end pr-1 ">
                                                        <Download
                                                            className={`w-4 h-4 cursor-pointer `}
                                                            onClick={() => handleDownloadAudio(id)}
                                                        />
                                                        <Play
                                                            className="w-4 h-4 cursor-pointer transition-transform active:scale-90"
                                                            onClick={() => handlePlay(id)}
                                                        />
                                                        <Trash2
                                                            className="w-4 h-4 cursor-pointer"
                                                            onClick={() => handleDelete(id)}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="hidden">
                        <a ref={downloadRef} download="filename.mp3" className="hidden"></a>
                    </div>
                </div>

                <AlertPopup
                    isOpen={showConfirm}
                    title={`确认删除`}
                    content={`确认删除该播客吗？ ${_.find(podcasts, p => p.id == deleteId)?.title}`}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleConfirmDelete}
                    cancelText="取消"
                    confirmText="确认"
                />
            </div>
        </>
    )
}
