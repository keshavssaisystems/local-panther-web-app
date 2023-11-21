import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "adminDashboard";

export const getMissedInterviewThunk = createAsyncThunk(
  `${name}/getMissedInterviewThunk`,
  async (payload = {}) => {
    const FETCH_MISSED_INTERVIEW = `${
      process.env.REACT_APP_NEW_API_URL
    }/AdminDashboard/GetMissedInterviewList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(FETCH_MISSED_INTERVIEW);
  }
);
export const getDashboardCountThunk = createAsyncThunk(
  `${name}/getDashboardCountThunk`,
  async (payload = {}) => {
    const FETCH_MISSED_INTERVIEW = `${
      process.env.REACT_APP_NEW_API_URL
    }/AdminDashboard/DasboardCount?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(FETCH_MISSED_INTERVIEW);
  }
);
// getAdminChartStatisticsDataThunk
export const getAdminChartStatisticsDataThunk = createAsyncThunk(
  `${name}/getAdminChartStatisticsDataThunk`,
  async () => {
    const FETCH_STATISTICS = `${process.env.REACT_APP_NEW_API_URL}/AdminDashboard/GetAdminChartStatisticsData`;
    return await fetchWrapper.get(FETCH_STATISTICS);
  }
);

// getDashboardAnalyticsCountThunk
export const getDashboardAnalyticsCountThunk = createAsyncThunk(
  `${name}/getDashboardAnalyticsCountThunk`,
  async () => {
    const FETCH_STATISTICS = `${process.env.REACT_APP_NEW_API_URL}/AdminDashboard/GetAdminChartOpenJobsBarData`;
    return await fetchWrapper.get(FETCH_STATISTICS);
  }
);

// Create the slice
const adminDashboardSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    error: null,
    missedInterviewLoading: false,
    missedInterviewList: [],
    dashboardCountLoading: false,
    dashboardCountDetails: [],
    statisticsLoading: false,
    statisticsData: [],
    dashboardCountMidLoading: false,
    dashboardCountMidDetails: [],
  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
    },
  },

  extraReducers: {
    // missed interview Status
    [getMissedInterviewThunk.pending]: (state) => {
      state.missedInterviewLoading = true;
      state.error = null;
    },
    [getMissedInterviewThunk.fulfilled]: (state, { payload = {} }) => {
      const { data: { missedInterviewList = [] } = {} } = payload;
      state.missedInterviewLoading = false;
      state.missedInterviewList = missedInterviewList;
    },
    [getMissedInterviewThunk.rejected]: (state, action) => {
      state.missedInterviewLoading = false;
      state.error = action.error;
    },

    // dashboard count
    [getDashboardCountThunk.pending]: (state) => {
      state.dashboardCountLoading = true;
      state.error = null;
    },
    [getDashboardCountThunk.fulfilled]: (state, { payload = {} }) => {
      const { data = {} } = payload;
      state.dashboardCountLoading = false;
      state.dashboardCountDetails = data;
    },
    [getDashboardCountThunk.rejected]: (state, action) => {
      state.dashboardCountLoading = false;
      state.error = action.error;
    },

    // dashboard count
    [getAdminChartStatisticsDataThunk.pending]: (state) => {
      state.statisticsLoading = true;
      state.error = null;
    },
    [getAdminChartStatisticsDataThunk.fulfilled]: (state, { payload = {} }) => {
      const { data = {} } = payload;
      state.statisticsLoading = false;
      state.statisticsData = data;
    },
    [getAdminChartStatisticsDataThunk.rejected]: (state, action) => {
      state.statisticsLoading = false;
      state.error = action.error;
    },

    // Middle dashboard count
    [getDashboardAnalyticsCountThunk.pending]: (state) => {
      state.dashboardCountMidLoading = true;
      state.error = null;
    },
    [getDashboardAnalyticsCountThunk.fulfilled]: (state, { payload = {} }) => {
      const { data = {} } = payload;
      state.dashboardCountMidLoading = false;
      state.dashboardCountMidDetails = data;
    },
    [getDashboardAnalyticsCountThunk.rejected]: (state, action) => {
      state.dashboardCountMidLoading = false;
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const adminDashboardSliceActions = {
  ...adminDashboardSlice.actions,
  getMissedInterviewThunk,
  getDashboardCountThunk,
  getAdminChartStatisticsDataThunk,
  getDashboardAnalyticsCountThunk,
};
// export const { fetchScores } = adminDashboardSlice.actions;
export const adminDashboardReducer = adminDashboardSlice.reducer;
