// src/entities/Conversation.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { AudioFile } from './AudioFile'

@Entity()
export class Dialogues {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    title: string

    @Column('text')
    keywords: string // topic / productID / NULL

    @Column({
        type: 'text',
        nullable: false, // 强制此字段必须有值
    })
    type: string // topic / productID / PDF

    @Column('json')
    data: {
        dialogue_list: Array<{
            content: string
            emotion: string
            host: string
        }>
    }

    @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @OneToMany(() => AudioFile, audio => audio.dialogues, {
        cascade: true, // 自动保存关联的音频记录
    })
    audioFiles: AudioFile[]
}
