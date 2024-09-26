import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    isAuthenticated: false,
    error: null,
    loading: false,
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        SigninSuccess: (state, action) => {
            state.isAuthenticated = true; // New line
            state.currentUser=action.payload;
            state.loading = false;
            state.error = null;
        },
        SigninFailure: (state,action) => { 
            state.loading = false;
            state.isAuthenticated = false; // New line
            state.error = action.payload;
        },
        signinStart: (state) => {
            state.loading = true;
            state.error = null;           
        },
        
    },
})

export const { SigninSuccess, SigninFailure, signinStart } = userSlice.actions;

export const userReducer = userSlice.reducer;
