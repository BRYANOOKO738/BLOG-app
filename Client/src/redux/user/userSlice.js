import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CurrentUser: null,
    isAuthenticated: false,
    error: null,
    loading: false,
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        SigninSuccess: (state, action) => {
            state.CurrentUser=action.payload;
            state.loading = false;
            state.error = false;
        },
        SigninFailure: (state,action) => { 
            state.loading = false;
            state.error = action.payload;
        },
        SiginStart: (state) => {
            state.loading = true;
            state.error = null;           
        },
        
    },
})

export const { SigninSuccess, SigninFailure, SiginStart } = userSlice.actions;

export const userReducer = userSlice.reducer;
