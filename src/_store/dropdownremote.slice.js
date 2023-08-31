import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
    selectedId: null, // Initialize with null or default ID
  },
  error: null,
};

// Define the async action
export const getRemote = createAsyncThunk("remote/getRemote", async () => {
  const baseUrl = `https://masterservice-api-dev.azurewebsites.net/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=remotestatus`
  );
  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const remoteSlice = createSlice({
  name: "remote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRemote.pending, (state) => {
        state.error = null;
      })
      .addCase(getRemote.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly
      })
      .addCase(getRemote.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const remoteActions = {
  ...remoteSlice.actions,
  getRemote, // Export the async action
};
export const remoteReducer = remoteSlice.reducer;
