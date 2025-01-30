// src/entities/AudioFile.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Dialogues } from './Dialogues'

@Entity()
export class AudioFile {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 500 })
    filePath: string

    @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @ManyToOne(() => Dialogues, conversation => conversation.audioFiles, {
        onDelete: 'CASCADE', // 当对话删除时自动删除关联的音频记录
    })
    dialogues: Dialogues
}
