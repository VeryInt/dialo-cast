// src/services/DatabaseServices.ts
import { AppDataSource } from '../database/dataSource'
import { Dialogues } from '../entities/Dialogues'
import { AudioFile } from '../entities/AudioFile'
import FileServices from './FileServices'
import { DIALOGUE_TYPE } from '../shared/constants'
import { DialogueProps } from '../shared/types'
import _ from 'lodash'

class DatabaseService {
    private dialoguesRepo = AppDataSource.getRepository(Dialogues)
    private audioFileRepo = AppDataSource.getRepository(AudioFile)

    async saveDialogue({
        type,
        title,
        keywords,
        dialogue_list,
        audioFilePath,
    }: { audioFilePath: string } & DialogueProps) {
        console.log(
            `🐹🐹🐹 saveDialogue`,
            `type: ${type}`,
            `title: ${title}`,
            `keywords: ${keywords}`,
            `audioFilePath: ${audioFilePath}`
        )
        return this.dialoguesRepo.manager.transaction(async manager => {
            // 创建对话实体（级联保存音频）
            const dialogue = manager.create(Dialogues, {
                title: title || '',
                type: type || DIALOGUE_TYPE.TOPIC,
                keywords: keywords || null,
                data: {
                    dialogue_list,
                },
                audioFiles: [
                    {
                        filePath: audioFilePath,
                    },
                ],
            })

            // 单次保存操作完成所有关联
            return manager.save(dialogue)
        })
    }

    async getDialogueList(page: number, pageSize?: number) {
        // 如果page 和 pageSize 都未传入，则获取所有的
        if (!page && !pageSize) {
            return this.dialoguesRepo.find({
                relations: ['audioFiles'],
                order: { createdAt: 'DESC' },
            })
        }

        pageSize = pageSize > 0 ? pageSize : 10

        return this.dialoguesRepo.find({
            relations: ['audioFiles'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        })
    }

    // 获取单个conversation
    async getDialogue(id: number) {
        return this.dialoguesRepo.findOne({
            where: { id },
            relations: ['audioFiles'],
        })
    }

    async deleteDialogue(id: number) {
        return this.dialoguesRepo.manager.transaction(async manager => {
            const dialogue = await manager.findOne(Dialogues, {
                where: { id },
                relations: ['audioFiles'],
            })

            if (!dialogue) return

            // 批量删除关联文件
            await Promise.all(
                _.map(dialogue.audioFiles, audio => FileServices.handlers.deleteAudioFile(null, audio.filePath))
            )

            await manager.remove(dialogue)
        })
    }
}

const dialogueDatabaseService = new DatabaseService()

const handlers = {
    databaseSaveDialogue: async (event, props: { audioFilePath: string } & DialogueProps) => {
        const { type, dialogue_list, title, keywords, audioFilePath } = props || {}
        let error = {
            msg: ``,
        }
        try {
            const savedDialogue = await dialogueDatabaseService.saveDialogue({
                type,
                title,
                keywords,
                dialogue_list,
                audioFilePath,
            })
            // 检查返回的实体
            if (savedDialogue?.id) {
                console.log('保存成功，生成的对话ID:', savedDialogue.id)
                console.log('关联的音频文件:', savedDialogue.audioFiles)

                // // 可选：进一步查询数据库确认
                // const exists = await dialogueDatabaseService.getDialogueList(1, 10);
                // const found = _.find(exists, d => d.id === savedDialogue.id);
                // console.assert(found !== undefined, '数据库未找到对应记录');

                return {
                    success: true,
                    data: {
                        ...savedDialogue,
                    },
                }
            } else {
                error.msg = `保存失败，未生成有效ID`
                console.error(error.msg)
            }
        } catch (err) {
            error = {
                ...err,
                msg: '保存过程中发生错误:',
            }
            console.error(error.msg, err)
        }
        return {
            suceess: false,
        }
    },

    databaseGetDialogue: async (event, dialogueID: number) => {
        let error = {
            msg: ``,
        }
        try {
            const dialogue = await dialogueDatabaseService.getDialogue(dialogueID)
            if (dialogue) {
                return {
                    success: true,
                    data: {
                        ...dialogue,
                        dialogue_list: dialogue?.data || [],
                        audioFilePath: dialogue?.audioFiles?.[0]?.filePath,
                    },
                }
            } else {
                error.msg = `未找到对应记录`
                console.error(error.msg)
            }
        } catch (err) {
            error = {
                ...err,
                msg: `获取过程中出错`,
            }
        }
        return {
            success: false,
            error,
        }
    },

    databaseListDialogues: async (event, page: number, pageSize: number) => {
        let error = {
            msg: ``,
        }
        try {
            const list = await dialogueDatabaseService.getDialogueList(page, pageSize)

            return {
                success: true,
                data: list?.length
                    ? _.map(list, item => {
                          return {
                              ...item,
                              dialogue_list: item?.data || [],
                              audioFilePath: item?.audioFiles?.[0]?.filePath,
                          }
                      })
                    : [],
            }
        } catch (err) {
            error = {
                ...err,
                msg: `获取过程中出错`,
            }
        }
        return {
            success: false,
            error,
        }
    },

    databaseDelDialogue: async (event, dialogueID: number) => {
        let error = {
            msg: ``,
        }
        if (!(dialogueID > 0)) {
            return {
                success: false,
                error: {
                    msg: `dialogueID is not verified`,
                },
            }
        }
        try {
            const list = await dialogueDatabaseService.deleteDialogue(dialogueID)
            return {
                success: true,
                data: list,
            }
        } catch (err) {
            error = {
                ...err,
                msg: `获取过程中出错`,
            }
        }
        return {
            success: false,
            error,
        }
    },
}
const events = {}

export default {
    handlers,
    events,
}
