import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getCandidate = createAsyncThunk(
  "candidate/getCandidate",
  async (candidateid) => {
    const baseUrl = `${process.env.REACT_APP_PANTHER_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Candidate/GetCandidateById/${candidateid}`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const getProfileSlice = createSlice({
  name: "getProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCandidate.pending, (state) => {
        state.error = null;
      })
      .addCase(getCandidate.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly
      })
      .addCase(getCandidate.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const getProfileActions = {
  ...getProfileSlice.actions,
  getCandidate, // Export the async action
};
export const getProfileReducer = getProfileSlice.reducer;
