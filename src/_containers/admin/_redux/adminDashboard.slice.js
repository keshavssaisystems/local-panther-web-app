import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "adminDashboard";
const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
// const timeIntervalDefault = "month";
// const todaysDate = new Date().toLocaleDateString("fr-CA");
// const yesterday = new Date(
//   new Date().setDate(new Date().getDate() - 1)
// ).toLocaleDateString("fr-CA");

// export const getScores = createAsyncThunk(`${name}/getScores`, async (date) => {
//   const dashboardScoreURL = `${baseUrl}/AdminDashboard/DasboardCount?date=${date}`;
//   return await fetchWrapper.get(dashboardScoreURL);
// });

// export const getCandidates = createAsyncThunk(
//   `${name}/getCandidates`,
//   async (payload = {}) => {
//     const GET_CANDIDATES_STATS = `${
//       process.env.REACT_APP_NEW_API_URL
//     }/Report/GetNewCandidatesList?${new URLSearchParams(payload)}`;
//     return await fetchWrapper.get(GET_CANDIDATES_STATS);
//   }
// );

// export const getInterviewStatusThunk = createAsyncThunk(
//   `${name}/getInterviewStatusThunk`,
//   async (payload = {}) => {
//     payload = {
//       ...payload,
//       isActive: true,
//       isPaginationRequired: false,
//     };
//     const FETCH_SCHEDULED_INTERVIEW = `${
//       process.env.REACT_APP_NEW_API_URL
//     }/ScheduledInterview?${new URLSearchParams(payload)}`;
//     return await fetchWrapper.get(FETCH_SCHEDULED_INTERVIEW);
//   }
// );
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
  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
    },
  },

  extraReducers: {
    // Scores for Dashboard Cards
    // [getScores.pending]: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    // [getScores.fulfilled]: (state, { payload = {} }) => {
    //   const { data } = payload;
    //   state.loading = false;
    //   state.cardStats = data;
    //   state.totalInterviewScheduled =
    //     data.todaysinterviewscheduledcount +
    //     data.upcominginterviewscheduledcount +
    //     data.pastinterviewscheduledcount;
    //   // below are dummy data, api not available
    //   state.cardStats.totalCandidates = 120;
    // },
    // [getScores.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.error = action.error;
    // },
    // // Candidates Stats for Dashboard Charts
    // [getCandidates.pending]: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    // [getCandidates.fulfilled]: (state, { payload = {} }) => {
    //   const { data } = payload;
    //   state.loading = false;
    //   state.candidatesData = candidatesDataDummy;
    // },
    // [getCandidates.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.error = action.error;
    // },

    // // scheduled interview Status
    // [getInterviewStatusThunk.pending]: (state) => {
    //   state.scheduledInterviewLoading = true;
    //   state.error = null;
    // },
    // [getInterviewStatusThunk.fulfilled]: (state, { payload = {} }) => {
    //   const { data: { scheduledInterviewList = [] } = {} } = payload;
    //   state.scheduledInterviewLoading = false;
    //   state.scheduledInterviewList = scheduledInterviewList;
    // },
    // [getInterviewStatusThunk.rejected]: (state, action) => {
    //   state.scheduledInterviewLoading = false;
    //   state.error = action.error;
    // },

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
  },
});

// Export the actions and reducer
export const adminDashboardSliceActions = {
  ...adminDashboardSlice.actions,
  getMissedInterviewThunk,
  getDashboardCountThunk,
  getAdminChartStatisticsDataThunk,
};
// export const { fetchScores } = adminDashboardSlice.actions;
export const adminDashboardReducer = adminDashboardSlice.reducer;
