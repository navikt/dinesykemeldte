import { configureStore } from '@reduxjs/toolkit';

import paginationSlice from './paginationSlice';
import filterSlice from './filterSlice';
import expandedSlice from './expandedSlice';
import metadataSlice from './metadataSlice';

export const rootReducer = {
    metadata: metadataSlice.reducer,
    pagination: paginationSlice.reducer,
    filter: filterSlice.reducer,
    expanded: expandedSlice.reducer,
};

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
