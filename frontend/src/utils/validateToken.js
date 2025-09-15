import {jwtDecode} from "jwt-decode"

export const isValid = ()=>{
    
    const token = localStorage.getItem("token")
    if(!token){
        localStorage.clear();
        return false
    }
    try{
        const decode = jwtDecode(token)
        return decode?.exp > Math.floor(Date.now()/1000)
    }
    catch(error){
        console.log("Error in decoding the token : ",error)
        return false
    }
}