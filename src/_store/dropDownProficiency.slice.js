import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
    Proficiency: [], // Initialize with an empty array

    languageList: [],
  },
  error: null,
};

// Define the async action
export const Proficiency = createAsyncThunk(
  "certification/Proficiency",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=proficiency`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const getLanguage = createAsyncThunk(
  "additionalInfo/getLanguage",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=language`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const ProficiencySlice = createSlice({
  name: "Proficiency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Proficiency.pending, (state) => {
        state.error = null;
      })
      .addCase(Proficiency.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly

        state.Proficiency = state.user.data.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(Proficiency.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(getLanguage.pending, (state) => {
        state.error = null;
      })
      .addCase(getLanguage.fulfilled, (state, action) => {
        state.languageList = action.payload;
      })
      .addCase(getLanguage.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const ProficiencyActions = {
  ...ProficiencySlice.actions,
  Proficiency, // Export the async action
  getLanguage,
};
export const ProficiencyReducer = ProficiencySlice.reducer;
