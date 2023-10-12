import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    studyFieldList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getStudyField = createAsyncThunk(
  " studyField/getStudyField",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=fieldofstudy`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const studyFieldSlice = createSlice({
  name: "studyField",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudyField.pending, (state) => {
        state.error = null;
      })
      .addCase(getStudyField.fulfilled, (state, action) => {
        state.studyFieldList = action.payload.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getStudyField.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const studyFieldActions = {
  ...studyFieldSlice.actions,
  getStudyField, // Export the async action
};
export const studyFieldReducer = studyFieldSlice.reducer;
