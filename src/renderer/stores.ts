import { createStore } from 'zustand/vanilla'
import _ from 'lodash'
import { NavPageValue } from '../shared/constants'

type MainState = {
    isloading?: boolean
    castTopic: string
    castProductID: string
    isGenerating: boolean
    audioPlayFile: string
    currentPage: NavPageValue
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
    updateCastTopic: (topic: string) => void
    updateCastProductID: (productID: string) => void
    updateIsGenerating: (generating: boolean) => void
    updateAudioPlayFile: (file: string) => void
    updateCurrentPage: (page: NavPageValue) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
    castTopic: '',
    castProductID: '',
    isGenerating: false,
    audioPlayFile: '',
    currentPage: `main`,
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
            updateCurrentPage: (page: NavPageValue) => {
                return set(state => {
                    return {
                        currentPage: page,
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
            updateCastProductID: (productID: string) => {
                return set(state => {
                    return {
                        castProductID: String(productID ?? '').trim(),
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
