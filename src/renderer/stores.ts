import { createStore } from 'zustand/vanilla'
import _ from 'lodash'

type MainState = {
    isloading?: boolean
    castTopic: string
    isGenerating: boolean
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
    updateCastTopic: (topic: string) => void
    updateIsGenerating: (generating: boolean) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    castTopic: '',
    isGenerating: false,
}

export const initMainStore = (): MainState => {
    return defaultInitState
}

export const createMainStore = (initState: MainState = defaultInitState) => {
    return createStore<MainStore>()(set => {
        return {
            ...initState,
            updateIsLoading: (loading: boolean) => {
                return set(state => {
                    return {
                        isloading: loading,
                    }
                })
            },
            updateCastTopic: (topic: string) => {
                return set(state => {
                    return {
                        castTopic: String(topic ?? '').trim(),
                    }
                })
            },
            updateIsGenerating: (generating: boolean) => {
                return set(state => {
                    return {
                        isGenerating: generating,
                    }
                })
            },
        }
    })
}
