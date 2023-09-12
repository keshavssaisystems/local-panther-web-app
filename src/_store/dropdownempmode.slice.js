import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
    user: {
        data: [], // Initialize with an empty array
    },
    error: null,
};

// Define the async action
export const getEmpmode = createAsyncThunk("empmode/getEmpmode", async () => {
    const baseUrl = `${process.env.REACT_APP_MASTER_API_URL}/api`;
    const response = await fetchWrapper.get(
        `${baseUrl}/Common/GetCommonDropdown?searchText=employmentmode`
    );

    return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const empmodeSlice = createSlice({
    name: "empmode",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEmpmode.pending, (state) => {
                state.error = null;
            })
            .addCase(getEmpmode.fulfilled, (state, action) => {
                state.user.data = action.payload; // Update the state properly
            })
            .addCase(getEmpmode.rejected, (state, action) => {
                state.error = action.error;
            });
    },
});

// Export the actions and reducer
export const empmodeActions = {
    ...empmodeSlice.actions,
    getEmpmode, // Export the async action
};
export const empmodeReducer = empmodeSlice.reducer;