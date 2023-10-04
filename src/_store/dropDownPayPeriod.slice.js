import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
  },
  error: null,
};

// Define the async action
export const getpayPeriod = createAsyncThunk(
  "certification/getpayPeriod",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=payperiodtype`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const getpayPeriodSlice = createSlice({
  name: "getpayPeriod",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getpayPeriod.pending, (state) => {
        state.error = null;
      })
      .addCase(getpayPeriod.fulfilled, (state, action) => {
        state.user.data = action.payload.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getpayPeriod.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const getpayPeriodActions = {
  ...getpayPeriodSlice.actions,
  getpayPeriod, // Export the async action
};
export const payPeriodReducer = getpayPeriodSlice.reducer;
