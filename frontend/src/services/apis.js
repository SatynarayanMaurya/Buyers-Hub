const BASE_URL = import.meta.env.VITE_BACKEND_URL


export const authEndpoints = {
    SIGN_UP : BASE_URL + "/api/auth/signup",
    LOGIN : BASE_URL + "/api/auth/login",

}

export const buyerEndpoints = {
    GET_ALL_BUYERS : BASE_URL + "/api/buyers/get-all-buyers",
    CREATE_BUYER : BASE_URL + "/api/buyers/create-buyer",
    UPDATE_BUYER : BASE_URL + "/api/buyers/update-buyer",
    GET_BUYER_HISTORY : BASE_URL + "/api/buyers/get-buyer-history",
    EXPORT_CSV : BASE_URL + "/api/buyers/export-buyers",
    IMPORT_CSV : BASE_URL + "/api/buyers/import-buyers",

}

export const agentEndpoints ={
    GET_USER_DETAILS: BASE_URL+"/api/agent/get-user-details"
}