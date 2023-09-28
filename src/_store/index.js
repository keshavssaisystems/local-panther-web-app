import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth.slice";
import { usersReducer } from "./users.slice";
import { jobListReducer } from "./jobList.slice";
import { locationReducer } from "../_components/dropdownComponents/location.slice";
import { candidateReducer } from "./candidate.slice";
import { createjobReducer } from "../_containers/customer/createJob/createjob.slice";
import { employmentModeReducer } from "../_components/dropdownComponents/employmentMode.slice";
import { skillReducer } from "./dropdownskill.slice";
import { remoteStatusReducer } from "../_components/dropdownComponents/remoteStatus.slice";
import { stateReducer } from "./dropdownstate.slice";
import { cityReducer } from "./dropdowncity.slice";
import { noticePeriodReducer } from "../_components/dropdownComponents/noticePeriod.slice";
import { applyForJobReducer } from "../_containers/candidate/applyForJob.slice";
import { jobDetailReducer } from "./jobDetail.slice";
import { recommendedjobListReducer } from "../_containers/candidate/recommendejobList.slice";
import { departmentReducer } from "../_components/dropdownComponents/department.slice.js";
import { empmodeReducer } from "./dropdownempmode.slice";
import { candidateListsReducer } from "_containers/customer/candidatelists/candidatelists.slice";

export * from "./auth.slice";
export * from "./users.slice";
export * from "./jobList.slice";
export * from "../_components/dropdownComponents/location.slice";
export * from "./candidate.slice";
export * from "../_containers/customer/createJob/createjob.slice";
export * from "../_components/dropdownComponents/employmentMode.slice";
export * from "./dropdownskill.slice";
export * from "../_components/dropdownComponents/remoteStatus.slice";
export * from "./dropdownstate.slice";
export * from "./dropdowncity.slice";
export * from "../_components/dropdownComponents/noticePeriod.slice";
export * from "../_containers/candidate/applyForJob.slice";
export * from "./jobDetail.slice";
export * from "../_containers/candidate/recommendejobList.slice";
export * from "../_components/dropdownComponents/department.slice";
export * from "./dropdownempmode.slice";
export * from "../_containers/customer/candidatelists/candidatelists.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    jobList: jobListReducer,
    location: locationReducer,
    candidates: candidateReducer,
    createJob: createjobReducer,
    employmentMode: employmentModeReducer,
    skill: skillReducer,
    remoteStatus: remoteStatusReducer,
    state: stateReducer,
    city: cityReducer,
    noticePeriod: noticePeriodReducer,
    applyForJob: applyForJobReducer,
    jobDetail: jobDetailReducer,
    recommendedjobList: recommendedjobListReducer,
    department: departmentReducer,
    empmode: empmodeReducer,
    candidateLists: candidateListsReducer,
  },
});
