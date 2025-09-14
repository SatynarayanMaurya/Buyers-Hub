import axios from "axios"


export const axiosInstance = axios.create({
    // withCredentials:true
})

export const apiConnector = (method,url,bodyData,header,params)=>{
    return axiosInstance({
        method:method,
        url:url,
        data:bodyData,
        headers:header,
        params:params
    })
}