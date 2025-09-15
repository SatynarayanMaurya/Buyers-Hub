import {createSlice} from "@reduxjs/toolkit"
import { act } from "react";


const initialState = {
    loading :false,
    userDetails:null,
    allBuyers:null
}


const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loading = action.payload;
        },

        setUserDetails:(state,action)=>{
            state.userDetails = action.payload;
        },

        clearUserDetails :(state,action)=>{
            state.userDetails = null
        },
        setAllBuyers:(state,action)=>{
            state.allBuyers= action.payload
        },
        clearAllBuyers :(state,action)=>{
            state.allBuyers = null
        }
    }
})


export const {setLoading,setUserDetails,clearUserDetails,setAllBuyers,clearAllBuyers} = userSlice.actions;
export default userSlice.reducer;