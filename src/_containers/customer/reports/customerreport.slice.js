import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "customerReport";

// customer report job list thunk
export const getCustReportJobList = createAsyncThunk(
  `${name}/getCustReportJobList`,
  async (payload = {}) => {
    debugger;
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_JOB_LIST_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_CUST_REPORT_JOB_LIST_END_POINT);
  }
);

// customer report scheduled interview list thunk
export const getCustReportScheduleIVList = createAsyncThunk(
  `${name}/getCustReportScheduleIVList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_SCHDINV_LIST_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_CUST_REPORT_SCHDINV_LIST_END_POINT);
  }
);

// customer report interviewed candidate list thunk
export const getCustReportIVDCandList = createAsyncThunk(
  `${name}/getCustReportIVDCandList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_IVD_CND_LIST_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_CUST_REPORT_IVD_CND_LIST_END_POINT);
  }
);

// customer report job aging list thunk
export const getCustReportJobAgingList = createAsyncThunk(
  `${name}/getCustReportJobAgingList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_JOB_AGING_LIST_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_CUST_REPORT_JOB_AGING_LIST_END_POINT);
  }
);

// customer report matched candidate list thunk
export const getCustReportMatchedCandList = createAsyncThunk(
  `${name}/getCustReportMatchedCandList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_MATCH_CAND_LIST_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_CUST_REPORT_MATCH_CAND_LIST_END_POINT);
  }
);

// customer report matched candidate list thunk
export const getCustReporCandStatList = createAsyncThunk(
  `${name}/getCustReporCandStatList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_CAND_STAT_LIST_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_CUST_REPORT_CAND_STAT_LIST_END_POINT);
  }
);

// Create the slice
const customerReportSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    jobList: [],
    schdInterviewList: [],
    interviewedCandidateList: [],
    jobAgingList: [],
    matchedCandidateList: [],
    candidateStatusList: [],
  },
  reducers: {
    // logout: (state, { payload }) => {
    //   state.user = {};
    // },
  },

  extraReducers: {
    // open jobs
    [getCustReportJobList.pending]: (state) => {
      state.loading = true;
    },
    [getCustReportJobList.fulfilled]: (state, action) => {
      state.loading = false;
      state.jobList = action?.payload?.data;
    },
    [getCustReportJobList.rejected]: (state, action) => {
      state.loading = false;
    },

    // schedule interview list
    [getCustReportScheduleIVList.pending]: (state) => {
      state.loading = true;
    },
    [getCustReportScheduleIVList.fulfilled]: (state, action) => {
      state.loading = false;
      state.schdInterviewList = action?.payload?.data;
    },
    [getCustReportScheduleIVList.rejected]: (state, action) => {
      state.loading = false;
    },

    // interviewed candidate list
    [getCustReportIVDCandList.pending]: (state) => {
      state.loading = true;
    },
    [getCustReportIVDCandList.fulfilled]: (state, action) => {
      state.loading = false;
      state.interviewedCandidateList = action?.payload?.data;
    },
    [getCustReportIVDCandList.rejected]: (state, action) => {
      state.loading = false;
    },

    // job aging list
    [getCustReportJobAgingList.pending]: (state) => {
      state.loading = true;
    },
    [getCustReportJobAgingList.fulfilled]: (state, action) => {
      state.loading = false;
      state.jobAgingList = action?.payload?.data;
    },
    [getCustReportJobAgingList.rejected]: (state, action) => {
      state.loading = false;
    },

    // matched candidate list
    [getCustReportMatchedCandList.pending]: (state) => {
      state.loading = true;
    },
    [getCustReportMatchedCandList.fulfilled]: (state, action) => {
      state.loading = false;
      state.matchedCandidateList = action?.payload?.data;
    },
    [getCustReportMatchedCandList.rejected]: (state, action) => {
      state.loading = false;
    },

    // candidate status list
    [getCustReporCandStatList.pending]: (state) => {
      state.loading = true;
    },
    [getCustReporCandStatList.fulfilled]: (state, action) => {
      state.loading = false;
      state.candidateStatusList = action?.payload?.data;
    },
    [getCustReporCandStatList.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

// Export the actions and reducer
export const customerReportActions = {
  ...customerReportSlice.actions,
  getCustReportJobList, // Export the async customer report job list action
  getCustReportScheduleIVList,
  getCustReportIVDCandList,
  getCustReportJobAgingList,
  getCustReportMatchedCandList,
  getCustReporCandStatList,
};

export const customerReportReducer = customerReportSlice.reducer;
