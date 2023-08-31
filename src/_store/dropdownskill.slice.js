import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getSkill = createAsyncThunk("skill/getSkill", async () => {
  const baseUrl = `https://masterservice-api-dev.azurewebsites.net/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=skills`
  );
  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSkill.pending, (state) => {
        state.error = null;
      })
      .addCase(getSkill.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly
      })
      .addCase(getSkill.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const skillActions = {
  ...skillSlice.actions,
  getSkill, // Export the async action
};
export const skillReducer = skillSlice.reducer;
