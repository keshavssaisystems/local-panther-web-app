// _store/commonCustFiltersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedOpt: "JobTitle",
    searchText: "",
    hiringManagerId: "",
    jobStatus: ""
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
        clearFilters: (state) => {
            state.selectedOpt = "JobTitle";
            state.searchText = "";
            state.hiringManagerId = "";
            state.jobStatus = "";
        }
    }
});

export const {
    setSelectedOpt,
    setSearchText,
    setHiringManagerId,
    setJobStatus,
    clearFilters
} = commonCustFiltersSlice.actions;

export default commonCustFiltersSlice.reducer;
