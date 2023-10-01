import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
    ethnicityList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getEthnicity = createAsyncThunk("race/getEthnicity", async () => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=race`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const ethnicitySlice = createSlice({
  name: "ethnicity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEthnicity.pending, (state) => {
        state.error = null;
      })
      .addCase(getEthnicity.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly

        state.ethnicityList = state.user.data.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getEthnicity.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const ethnicityActions = {
  ...ethnicitySlice.actions,
  getEthnicity, // Export the async action
};
export const ethnicityReducer = ethnicitySlice.reducer;
