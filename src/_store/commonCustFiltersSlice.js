// _store/commonCustFiltersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";

const initialState = {
    selectedOpt: "JobTitle",
    searchText: "",
    hiringManagerId: "",
    jobStatus: "",
    placeHolder: "Search job title",
    interviewFeedbackStatusId: "",
};

const commonCustFiltersSlice = createSlice({
    name: "commonCustFilters",
    initialState,
    reducers: {
        setSelectedOpt: (state, action) => {
            state.selectedOpt = action.payload;
        },
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setHiringManagerId: (state, action) => {
            state.hiringManagerId = action.payload;
        },
        setJobStatus: (state, action) => {
            state.jobStatus = action.payload;
        },
        setPlaceHolder: (state, action) => {
            state.placeHolder = action.payload;
        },
         setInterviewFeedbackStatusId: (state, action) => {
            state.interviewFeedbackStatusId = action.payload;
        },
        clearFilters: (state) => {
            state.selectedOpt = "JobTitle";
            state.searchText = "";
            state.hiringManagerId = localStorage.getItem("userId") || "";
            state.jobStatus = "";
            state.placeHolder = "Search job title"; 
            state.interviewFeedbackStatusId = "";
        }
    }
});

export const {
    setSelectedOpt,
    setSearchText,
    setHiringManagerId,
    setJobStatus,
    setPlaceHolder,
    clearFilters,
    setInterviewStatusId
} = commonCustFiltersSlice.actions;

export default commonCustFiltersSlice.reducer;
