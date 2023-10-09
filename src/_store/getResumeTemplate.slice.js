import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
    resumeTemplateList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getResumeTemplate = createAsyncThunk(
  "resume/getResumeTemplate",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=resumetemplate`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const resumeTemplateSlice = createSlice({
  name: "resumeTemplate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getResumeTemplate.pending, (state) => {
        state.error = null;
      })
      .addCase(getResumeTemplate.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly

        state.resumeTemplateList = state.user.data.map(
          ({ id: value, ...rest }) => {
            return {
              value,
              label: `${rest.name}`,
            };
          }
        );
      })
      .addCase(getResumeTemplate.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const resumeTemplateActions = {
  ...resumeTemplateSlice.actions,
  getResumeTemplate, // Export the async action
};
export const resumeTemplateReducer = resumeTemplateSlice.reducer;
