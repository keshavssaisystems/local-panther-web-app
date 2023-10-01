import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getCity = createAsyncThunk("city/getCity", async (inputValue) => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/api/Common/GetLocation?searchText=${inputValue}`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCity.pending, (state) => {
        state.error = null;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly
      })
      .addCase(getCity.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const cityActions = {
  ...citySlice.actions,
  getCity, // Export the async action
};
export const cityReducer = citySlice.reducer;

export const getLocationFilter = async (searchText) => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  return await fetchWrapper.get(
    `${baseUrl}/Common/GetLocation?searchText=${searchText}`
  );
};
