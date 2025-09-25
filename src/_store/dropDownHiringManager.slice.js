import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
    hiringManagers: [],
    error: null,
};

// Define the async action
export const getHiringManager = createAsyncThunk("hiringManager/getHiringManager", async (companyIdId) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    return await fetchWrapper.get(
        `${baseUrl}/Common/GetCommonDropdown?searchText=userListByCompany&commonId=${companyIdId}`
    );

    // return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const hiringManagerSlice = createSlice({
    name: "getHiringManager",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getHiringManager.pending, (state) => {
                state.error = null;
            })
            .addCase(getHiringManager.fulfilled, (state, action) => {
                console.log("Hiring Manager Data:", action.payload);
                state.hiringManagers = action.payload?.data || []; // Update the state properly
            })
            .addCase(getHiringManager.rejected, (state, action) => {
                state.error = action.error;
            });
    },
});

// Export the actions and reducer
export const hiringManagerActions = {
    ...hiringManagerSlice.actions,
    getHiringManager, // Export the async action
};
export const hiringManagerReducer = hiringManagerSlice.reducer;