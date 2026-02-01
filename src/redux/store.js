import { configureStore } from '@reduxjs/toolkit';
import campersReducer from './slices/campersSlice';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
    reducer: {
        campers: campersReducer,
        filters: filtersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['campers/fetchCampers/fulfilled'],
            },
        }),
});

export default store;