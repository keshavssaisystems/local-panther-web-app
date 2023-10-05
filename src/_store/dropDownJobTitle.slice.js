import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
  },
  error: null,
};

// Define the async action
export const getJobTitle = createAsyncThunk(
  "certification/getJobTitle",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=jobtitle`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const getJobTitleSlice = createSlice({
  name: "getJobTitle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobTitle.pending, (state) => {
        state.error = null;
      })
      .addCase(getJobTitle.fulfilled, (state, action) => {
        state.user.data = action.payload.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getJobTitle.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const getJobTitleActions = {
  ...getJobTitleSlice.actions,
  getJobTitle, // Export the async action
};
export const jobTitleReducer = getJobTitleSlice.reducer;
