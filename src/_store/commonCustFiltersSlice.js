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
    startDate: null,
    endDate: null
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
        clearFilters: (state) => {
            state.selectedOpt = "JobTitle";
            state.searchText = "";
            state.hiringManagerId = localStorage.getItem("userId") || "";
            state.jobStatus = "";
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
    setInterviewFeedbackStatusId
} = commonCustFiltersSlice.actions;

export default commonCustFiltersSlice.reducer;
