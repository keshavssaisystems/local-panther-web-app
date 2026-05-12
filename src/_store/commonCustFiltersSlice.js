// _store/commonCustFiltersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedOpt: "JobTitle",
    searchText: "",
    hiringManagerId: "",
    jobStatus: "Publish",
    placeHolder: "Search job title",
    interviewFeedbackStatusId: "",
    startDate: null,
    endDate: null,
    seeAllHiringManagerJobs: false
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
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setSeeAllHiringManagerJobs: (state, action) => {
            state.seeAllHiringManagerJobs = action.payload;
        },
        clearFilters: (state) => {
            state.selectedOpt = "JobTitle";
            state.searchText = "";
            state.hiringManagerId = localStorage.getItem("userId") || "";
            state.jobStatus = "Publish";
            state.placeHolder = "Search job title";
            state.interviewFeedbackStatusId = "";
            state.startDate = null;
            state.endDate = null;
            state.seeAllHiringManagerJobs = false;
        },
        clearFiltersOnPageLoad: (state) => {
            state.searchText = "";
            state.jobStatus = "Publish";
            state.placeHolder = "Search job title";
            state.interviewFeedbackStatusId = "";
            state.startDate = null;
            state.endDate = null;
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
    setInterviewStatusId,
    setStartDate,
    setEndDate,
    setInterviewFeedbackStatusId,
    setSeeAllHiringManagerJobs,
    clearFiltersOnPageLoad
} = commonCustFiltersSlice.actions;

export default commonCustFiltersSlice.reducer;
