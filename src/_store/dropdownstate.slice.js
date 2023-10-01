import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getState = createAsyncThunk("state/getState", async () => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=state`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getState.pending, (state) => {
        state.error = null;
      })
      .addCase(getState.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly
      })
      .addCase(getState.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const stateActions = {
  ...stateSlice.actions,
  getState, // Export the async action
};
export const stateReducer = stateSlice.reducer;
