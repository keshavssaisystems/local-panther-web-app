import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./auth.slice";
import { usersReducer } from "./users.slice";
import { createjobReducer } from "./createjob.slice";
import { empmodeReducer } from "./dropdownempmode.slice";
import { skillReducer } from "./dropdownskill.slice";
import { remoteReducer } from "./dropdownremote.slice";
import { stateReducer } from "./dropdownstate.slice";
import { cityReducer } from "./dropdowncity.slice";


export * from "./auth.slice";
export * from "./users.slice";
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
    createjob: createjobReducer,
    empmode: empmodeReducer,
    skill: skillReducer,
    remote: remoteReducer,
    state: stateReducer,
    city: cityReducer,
   
  },
});
