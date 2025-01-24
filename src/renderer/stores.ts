import { createStore } from 'zustand/vanilla'
import _ from 'lodash'

type MainState = {
    isloading?: boolean
}

type MainActions = {
    updateIsLoading: (loading: boolean) => void
}

export type MainStore = MainState & MainActions

const defaultInitState: MainState = {
    isloading: false,
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
        }
    })
}
