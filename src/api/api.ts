import axios from "axios";

export type DataType = {
    name: string
    format: string
    source: string
    url: string
}
type ResponseType = {
    status: string,
    data: DataType[]
}

export const videoAPI = {
    getData() {
        return axios.get<ResponseType>('data.json')
    }
}