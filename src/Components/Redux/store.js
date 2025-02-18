

import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import {thunk} from 'redux-thunk'; // Import thunk middleware
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import reducer from './reducer'; // Import your root reducer


// Redux Persist config
const persistConfig = {
    key: 'root', // Key to use in localStorage
    storage, // Define storage engine (localStorage in this case)
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// Create the store with thunk middleware and the persisted reducer
export const store = createStore(persistedReducer, applyMiddleware(thunk));

// Create a persistor to persist and rehydrate the store
export const persistor = persistStore(store);

// Subscribe to store changes if needed
store.subscribe(() => {
    console.log(store.getState().LNDedit);
});
