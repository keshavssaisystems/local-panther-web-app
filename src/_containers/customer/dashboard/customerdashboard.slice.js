import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "customerDashboard";

// getCustomerDashboardThunk thunk
export const getCustomerDashboardThunk = createAsyncThunk(
  `${name}/getCustomerDashboardThunk`,
  async () => {
    let UserID = localStorage.getItem("userId");
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CustomerDashboard/DasboardCount?userId=${UserID}`;
    return await fetchWrapper.get(DASHBOARD_END_POINT);
  }
);

// Create the slice
const customerDashboardSlice = createSlice({
  name,
  initialState: {
    dashboardCounts: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getCustomerDashboardThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCustomerDashboardThunk.fulfilled]: (state, action) => {
      state.dashboardCounts = action.payload.data;
      state.loading = false;
    },
    [getCustomerDashboardThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const customerDashboardActions = {
  ...customerDashboardSlice.actions,
  getCustomerDashboardThunk,
};

export const customerDashboardReducer = customerDashboardSlice.reducer;
