import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from "_helpers";
const name = "unsubscribe";

const initialState = {

    data: [], // Initialize with an empty array    
    error: null,
};

// Define the async action
export const getUnsubscribeEmail = createAsyncThunk(
    "unsubscribe/getUnsubscribeEmail",
    async (token) => {
        const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
        const response = await fetchWrapper.get(
            `${baseUrl}/External/UnsubscribeEmail?token=${token}`
        );
        console.log(response);
        return response; // Assuming your API response has a "data" property
    }
);


// Create the slice
const unsubscribeSlice = createSlice({
    name: "unsubscribe",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUnsubscribeEmail.pending, (state) => {
                state.error = null;
            })
            .addCase(getUnsubscribeEmail.fulfilled, (state, action) => {
                state.unsubscribe.data = action.payload; // Update the state properly
                console.log(action);
            })
            .addCase(getUnsubscribeEmail.rejected, (state, action) => {
                state.error = action.error;
            })
    },
});

// Export the actions and reducer
export const unsubscribeActions = {
    ...unsubscribeSlice.actions,
    getUnsubscribeEmail,
}