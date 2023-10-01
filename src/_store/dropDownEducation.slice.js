import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    educationList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getEducation = createAsyncThunk(
  "education/educationLevel",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=levelofeducation`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const educationSlice = createSlice({
  name: "educationLevel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEducation.pending, (state) => {
        state.error = null;
      })
      .addCase(getEducation.fulfilled, (state, action) => {
        state.educationList = action.payload.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getEducation.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const educationActions = {
  ...educationSlice.actions,
  getEducation, // Export the async action
};
export const educationReducer = educationSlice.reducer;
