import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
    yearList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getyear = createAsyncThunk("year/getyear", async () => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=year`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const yearSlice = createSlice({
  name: "year",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getyear.pending, (state) => {
        state.error = null;
      })
      .addCase(getyear.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly

        state.yearList = state.user.data.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getyear.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const yearActions = {
  ...yearSlice.actions,
  getyear, // Export the async action
};
export const yearReducer = yearSlice.reducer;
