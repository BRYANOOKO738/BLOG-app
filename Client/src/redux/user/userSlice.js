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
        updateStart: (state) => { 
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state) => { 
            state.currentUser=action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => { 
            state.loading = false;
            state.error = action.payload;
        },
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteSuccess: (state) => { 
           state.currentUser=null;
            state.loading = false;
            state.error = null;
        },
        deleteFailure: (state, action) => { 
            state.loading = false;
            state.error = action.payload;
        }
        
    },
})

export const { SigninSuccess, SigninFailure, signinStart,updateFailure,updateStart,updateSuccess,deleteStart,deleteSuccess,deleteFailure } = userSlice.actions;

export const userReducer = userSlice.reducer;
