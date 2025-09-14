const BASE_URL = import.meta.env.VITE_BACKEND_URL


export const authEndpoints = {
    SIGN_UP : BASE_URL + "/api/auth/signup",
    LOGIN : BASE_URL + "/api/auth/login",

}