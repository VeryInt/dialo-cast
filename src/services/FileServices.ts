import { ipcMain, app } from 'electron'
import fs from 'fs'
import path from 'path'
import { getConfig, saveConfig } from '../main/electronStore'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import ffprobePath from 'ffprobe-static'
import _ from 'lodash'

// 配置 FFmpeg
if (ffmpegPath && ffprobePath) {
    ffmpeg.setFfmpegPath(ffmpegPath)
    ffmpeg.setFfprobePath(ffprobePath.path)
} else {
    console.error('FFmpeg 路径配置失败！')
}
const audioDir = path.join(app.getPath('userData'), 'audio')
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true })
}

const handlers = {
    // 保存音频文件
    saveAudio: async (event, hexData: string) => {
        const tempDir = path.join(app.getPath('userData'), 'temp_audio')
        // 确保目录存在
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir)
        }
        const now = Date.now()
        try {
            const buffer = Buffer.from(hexData, 'hex')
            const tempFileName = `temp_${now}.mp3`
            const filePath = path.join(tempDir, tempFileName)
            await fs.promises.writeFile(filePath, buffer)

            const audioStoreInfo = (getConfig('audioInfo') as string) || '[]'
            const audioInfo = JSON.parse(audioStoreInfo)
            const newAudioInfo = {
                name: tempFileName,
                filePath: filePath,
                timestamp: now,
            }

            audioInfo.push(newAudioInfo)
            saveConfig('audioInfo', JSON.stringify(audioInfo))
            return { success: true, ...newAudioInfo }
        } catch (error) {
            console.log('Error saving audio file:', error)
            return { success: false }
        }
    },
    mergetAudio: async (event, audioFileList: string[], filename: string) => {
        // 生成输出路径
        const outputPath = path.join(audioDir, `merged_${Date.now()}.mp3`)
        await new Promise((resolve, reject) => {
            const command = ffmpeg()

            audioFileList.forEach(file => {
                command.input(file)
            })

            command.on('end', resolve).on('error', reject).mergeToFile(outputPath, audioDir)
        })

        // 读取合并结果
        const mergedBuffer = await fs.promises.readFile(outputPath)
        return {
            success: true,
            filePath: outputPath,
            buffer: mergedBuffer,
        }
    },
    readAudioFile: async (_, filename): Promise<Buffer> => {
        const filePath = path.join(audioDir, filename)

        const buffer = await fs.promises.readFile(filePath)
        return buffer
    },
}

const events = {}

export default {
    handlers,
    events,
}
