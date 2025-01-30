// src/database/dataSource.ts
import { DataSource } from 'typeorm'
import { app } from 'electron'
import path from 'path'
import { Dialogues } from '../entities/Dialogues'
import { AudioFile } from '../entities/AudioFile'

const dbPath = path.join(app.getPath('userData'), 'data.db')

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: dbPath,
    entities: [Dialogues, AudioFile], // 明确引入实体
    synchronize: process.env.NODE_ENV === 'development', // 仅开发环境同步
    logging: true,
    extra: {
        connection: {
            pragma: 'journal_mode = WAL', // 生产环境推荐设置
        },
    },
})

// 初始化数据库连接
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize()
        console.log('Database connection established')
    } catch (error) {
        console.error('Database connection failed:', error)
        throw error
    }
}
