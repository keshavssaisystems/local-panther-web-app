import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from './auth.slice';
import { usersReducer } from './users.slice';
import { jobListReducer } from './jobList.slice';
import { locationReducer } from './location.slice';
import { candidateReducer } from './candidate.slice';
import { createjobReducer } from "./createjob.slice";
import { empmodeReducer } from "./dropdownempmode.slice";
import { skillReducer } from "./dropdownskill.slice";
import { remoteReducer } from "./dropdownremote.slice";
import { stateReducer } from "./dropdownstate.slice";
import { cityReducer } from "./dropdowncity.slice";

export * from './auth.slice';
export * from './users.slice';
export * from './jobList.slice';
export * from './location.slice';
export * from './candidate.slice';
export * from "./createjob.slice";
export * from "./dropdownempmode.slice";
export * from "./dropdownskill.slice";
export * from "./dropdownremote.slice";
export * from "./dropdownstate.slice";
export * from "./dropdowncity.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        jobList: jobListReducer,
        location: locationReducer,
        candidates: candidateReducer,
        createjob: createjobReducer,
        empmode: empmodeReducer,
        skill: skillReducer,
        remote: remoteReducer,
        state: stateReducer,
        city: cityReducer
    },
});
