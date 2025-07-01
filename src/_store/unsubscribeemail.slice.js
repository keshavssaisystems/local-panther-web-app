import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from "_helpers";
const name = "unsubscribe";

const initialState = {

    data: [], // Initialize with an empty array    
    error: null,
};

// Define the async action
export const postUnsubscribeEmail = createAsyncThunk(
    "unsubscribe/postUnsubscribeEmail",
    async (payload) => {
        const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
        const response = await fetchWrapper.post(
            `${baseUrl}/External/UnsubscribeEmail`, payload
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
            .addCase(postUnsubscribeEmail.pending, (state) => {
                state.error = null;
            })
            .addCase(postUnsubscribeEmail.fulfilled, (state, action) => {
                state.unsubscribe.data = action.payload; // Update the state properly
                console.log(action);
            })
            .addCase(postUnsubscribeEmail.rejected, (state, action) => {
                state.error = action.error;
            })
    },
});

// Export the actions and reducer
export const unsubscribeActions = {
    ...unsubscribeSlice.actions,
    postUnsubscribeEmail,
}