import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from './auth.slice';
import { usersReducer } from './users.slice';
import { jobListReducer } from './jobList.slice';
import { locationReducer } from './location.slice';
import { candidateReducer } from './candidate.slice';
import { createjobReducer } from "./createjob.slice";
import { employmentModeReducer } from "./employmentMode.slice";
import { skillReducer } from "./dropdownskill.slice";
import { remoteStatusReducer } from "./remoteStatus.slice";
import { stateReducer } from "./dropdownstate.slice";
import { cityReducer } from "./dropdowncity.slice";
import { noticePeriodReducer } from "./noticePeriod.slice";
import { applyForJobReducer } from "./applyForJob.slice";
import { jobDetailReducer } from "./jobDetail.slice";
import { recommendedjobListReducer } from "./recommendejobList.slice";
import { departmentReducer } from "./department.slice";

export * from './auth.slice';
export * from './users.slice';
export * from './jobList.slice';
export * from './location.slice';
export * from './candidate.slice';
export * from "./createjob.slice";
export * from "./employmentMode.slice";
export * from "./dropdownskill.slice";
export * from "./remoteStatus.slice";
export * from "./dropdownstate.slice";
export * from "./dropdowncity.slice";
export * from "./noticePeriod.slice";
export * from "./applyForJob.slice";
export * from "./jobDetail.slice";
export * from "./recommendejobList.slice";
export * from "./department.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        jobList: jobListReducer,
        location: locationReducer,
        candidates: candidateReducer,
        createjob: createjobReducer,
        empmode: employmentModeReducer,
        skill: skillReducer,
        remote: remoteStatusReducer,
        state: stateReducer,
        city: cityReducer,
        noticePeriod: noticePeriodReducer,
        applyForJob: applyForJobReducer,
        jobDetail: jobDetailReducer,
        recommendedjobList: recommendedjobListReducer,
        department: departmentReducer,
    },
});
