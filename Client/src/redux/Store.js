import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user/userSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This uses localStorage
import { persistStore } from 'redux-persist'; // Correct import here

const rootReducer = combineReducers({
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    storage: storage, // Use default localStorage for persistence
    version: 1,
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false, // Disable serializable checks for large state
    }),
});

// Create the persistor
export const persistor = persistStore(store);

// Export the store as default
export default store;
