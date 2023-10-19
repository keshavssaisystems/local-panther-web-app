import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
    monthList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getmonth = createAsyncThunk("month/getMonth", async () => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=month`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const monthSlice = createSlice({
  name: "month",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getmonth.pending, (state) => {
        state.error = null;
      })
      .addCase(getmonth.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly

        state.monthList = state.user.data.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getmonth.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const monthActions = {
  ...monthSlice.actions,
  getmonth, // Export the async action
};
export const monthReducer = monthSlice.reducer;
