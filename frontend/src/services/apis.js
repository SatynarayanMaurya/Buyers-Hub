const BASE_URL = import.meta.env.VITE_BACKEND_URL


export const authEndpoints = {
    SIGN_UP : BASE_URL + "/api/auth/signup",
    LOGIN : BASE_URL + "/api/auth/login",

}

export const buyerEndpoints = {
    GET_ALL_BUYERS : BASE_URL + "/api/buyers/get-all-buyers",
    CREATE_BUYER : BASE_URL + "/api/buyers/create-buyer"
}

export const agentEndpoints ={
    GET_USER_DETAILS: BASE_URL+"/api/agent/get-user-details"
}