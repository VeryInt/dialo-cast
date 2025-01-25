import { createStore } from 'zustand/vanilla'
import _ from 'lodash'

type MainState = {
    isloading?: boolean
    castTopic: string
    isGenerating: boolean
    audioPlayFile: string
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
    updateCastTopic: (topic: string) => void
    updateIsGenerating: (generating: boolean) => void
    updateAudioPlayFile: (file: string) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    castTopic: '',
    isGenerating: false,
    audioPlayFile: '',
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
            updateAudioPlayFile: (file: string) => {
                return set(state => {
                    if (file) {
                        return {
                            audioPlayFile: String(file ?? '').trim(),
                            isGenerating: false,
                            isloading: true,
                            castTopic: '',
                        }
                    } else {
                        return {
                            audioPlayFile: '',
                        }
                    }
                })
            },
        }
    })
}
