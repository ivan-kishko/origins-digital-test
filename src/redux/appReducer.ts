import {Dispatch} from "redux";
import {DataType, videoAPI} from "../api/api";

type InitStateType = typeof initState
export type StatusType = 'loading' | 'idle' | 'success' | 'failed'
type FetchDataType = ReturnType<typeof fetchData>
type SetAppInitStatus = ReturnType<typeof setAppInitStatus>
type SetLoadDataStatus = ReturnType<typeof setLoadDataStatus>
type ActionsType = FetchDataType | SetAppInitStatus | SetLoadDataStatus

const initState = {
    data: [] as DataType[],
    appInitStatus: 'idle' as StatusType,
    loadDataStatus: 'idle' as StatusType
}

export const appReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
    switch(action.type) {
        case 'app/FETCH-DATA': {
            return {
                ...state, data: {...action.data}
            }
        }
        case "app/SET-INIT-STATUS": {
            return {
                ...state, appInitStatus: action.appInitStatus
            }
        }
        case "app/SET-LOAD-DATA-STATUS": {
            return {
                ...state, loadDataStatus: action.loadDataStatus
            }
        }
        default:
            return state
    }
}

export const fetchData = (data: DataType[]) => {
    return {type: 'app/FETCH-DATA', data} as const
}
export const setAppInitStatus = (appInitStatus: StatusType) => {
    return {type: 'app/SET-INIT-STATUS', appInitStatus} as const
}
export const setLoadDataStatus = (loadDataStatus: StatusType) => {
    return {type: 'app/SET-LOAD-DATA-STATUS', loadDataStatus} as const
}

export const fetchDataTC = () => (dispatch: Dispatch) => {
    dispatch(setAppInitStatus('loading'))
    dispatch(setLoadDataStatus('loading'))
    videoAPI.getData()
        .then(res => {
            dispatch(fetchData(res.data.data))
            dispatch(setLoadDataStatus('success'))
        })
        .catch(err => {
            dispatch(setLoadDataStatus('failed'))
        })
        .finally(() => {
            dispatch(setAppInitStatus('success'))
        })
}

