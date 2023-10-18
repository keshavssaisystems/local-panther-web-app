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

// getCustomerDashboardGraphDataThunk thunk
export const getCustomerDashboardGraphDataThunk = createAsyncThunk(
  `${name}/getCustomerDashboardGraphDataThunk`,
  async () => {
    let UserID = localStorage.getItem("userId");
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CustomerDashboard/GetCustomerDashboardList?userId=${UserID}`;
    return await fetchWrapper.get(DASHBOARD_END_POINT);
  }
);

// Create the slice
const customerDashboardSlice = createSlice({
  name,
  initialState: {
    dashboardCounts: [],
    dashboardGraphData: [],
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
    [getCustomerDashboardGraphDataThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCustomerDashboardGraphDataThunk.fulfilled]: (state, action) => {
      state.dashboardGraphData = action.payload.data;
      state.loading = false;
    },
    [getCustomerDashboardGraphDataThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const customerDashboardActions = {
  ...customerDashboardSlice.actions,
  getCustomerDashboardThunk,
  getCustomerDashboardGraphDataThunk,
};

export const customerDashboardReducer = customerDashboardSlice.reducer;
