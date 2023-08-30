import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth.slice';
import { usersReducer } from './users.slice';
import { candidateReducer } from './candidate.slice';

export * from './auth.slice';
export * from './users.slice';
export * from './candidate.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        candidates: candidateReducer
    },
});