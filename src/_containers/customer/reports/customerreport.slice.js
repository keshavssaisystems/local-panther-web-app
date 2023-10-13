import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "customerReport";

// customer report job list thunk
export const getCustReportJobList = createAsyncThunk(
  `${name}/getCustReportJobList`,
  async (payload = {}) => {
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
  },
});

// Export the actions and reducer
export const customerReportActions = {
  ...customerReportSlice.actions,
  getCustReportJobList, // Export the async customer report job list action
};

export const customerReportReducer = customerReportSlice.reducer;
