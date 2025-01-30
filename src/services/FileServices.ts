import { ipcMain, app } from 'electron'
import fs from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'
import { getConfig, saveConfig } from '../main/electronStore'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import _ from 'lodash'
import { path as ffprobePath } from 'ffprobe-static'

// // 配置 FFmpeg
// if (ffmpegPath && ffprobePath) {
//     ffmpeg.setFfmpegPath(ffmpegPath)
//     ffmpeg.setFfprobePath(ffprobePath)
// } else {
//     console.error('FFmpeg 路径配置失败！')
// }

const audioDir = path.join(app.getPath('userData'), 'audio')
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true })
}

const handlers = {
    // 保存音频文件
    saveAudio: async (event, hexData: string, filename: string) => {
        const now = Date.now()
        try {
            const buffer = Buffer.from(hexData, 'hex')
            const fileNameWithSuffix = filename ? `${filename}.mp3` : `temp_${now}.mp3`
            const filePath = path.join(audioDir, fileNameWithSuffix)
            await fs.promises.writeFile(filePath, buffer)

            const audioStoreInfo = (getConfig('audioInfo') as string) || '[]'
            const audioInfo = JSON.parse(audioStoreInfo)
            const newAudioInfo = {
                name: fileNameWithSuffix,
                filePath: filePath,
                timestamp: now,
            }

            audioInfo.push(newAudioInfo)
            saveConfig('audioInfo', JSON.stringify(audioInfo))
            console.log(`🐹🐹🐹Saved audio file: ${filePath}`)
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
    readAudioFile: async (event, filename): Promise<Buffer> => {
        // 先判断传入的filename是否已经是完整路径
        const filePath = filename.startsWith(audioDir) ? filename : path.join(audioDir, filename)
        const buffer = await fs.promises.readFile(filePath)
        return buffer
    },
    deleteAudioFile: async (event, filename) => {
        // 先判断传入的filename是否已经是完整路径
        const filePath = filename.startsWith(audioDir) ? filename : path.join(audioDir, filename)
        // await fs.promises.unlink(filePath)
        await fsExtra.remove(filePath)
        return {
            success: true,
        }
    },
}

const events = {}

export default {
    handlers,
    events,
}
