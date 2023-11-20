import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "adminReport";

export const getCompanyDropDown = async (searchText) => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  return await fetchWrapper.get(
    `${baseUrl}/Company/GetCompanyDropdown?companyName=${searchText}`
  );
};

// Open Jobs thunk
export const openJobsThunk = createAsyncThunk(
  `${name}/openJobsThunk`,
  async (payload = {}) => {
    payload = {
      ...payload,
    };

    const OPEN_JOBS_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(OPEN_JOBS_END_POINT);
  }
);

// New candidate thunk
export const newCandidateThunk = createAsyncThunk(
  `${name}/newCandidateThunk`,
  async (payload) => {
    payload = {
      ...payload,
    };
    const NEW_CANDIDATE_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetNewCandidatesList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(NEW_CANDIDATE_END_POINT);
  }
);

// scheduled interview list thunk
export const scheduledInterviewListThunk = createAsyncThunk(
  `${name}/scheduledInterviewListThunk`,
  async (payload = {}) => {
    payload = {
      ...payload,
      isActive: true,
    };

    const SCHEDULED_INTERVIEW_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/ScheduledInterview?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(SCHEDULED_INTERVIEW_END_POINT);
  }
);

// get report data thunk
export const getReportDataThunk = createAsyncThunk(
  `${name}/getReportDataThunk`,
  async (payload = {}) => {
    payload = {
      ...payload,
    };

    const OPEN_JOBS_END_POINT = `${
      process.env.REACT_APP_NEW_API_URL
    }/Report/GetReportData?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(OPEN_JOBS_END_POINT);
  }
);

// Create the slice
const adminReportSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    error: null,
    reportData: [],
  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
    },
  },

  extraReducers: {
    // open jobs
    [openJobsThunk.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [openJobsThunk.fulfilled]: (state, { payload = {} }) => {
      const { data: { openJobsList = [], totalRows = 0 } = {} } = payload;

      state.loading = false;
      state.openJobsList = openJobsList;
      state.totalOpenJobs = totalRows;
    },
    [openJobsThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // New Candidate
    [newCandidateThunk.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [newCandidateThunk.fulfilled]: (state, { payload = {} }) => {
      const { data: { newCandidatesList = [], totalRows = 0 } = {} } = payload;

      state.loading = false;
      state.newCandidate = newCandidatesList;
      state.totalNewCandidate = totalRows;
    },
    [newCandidateThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // Get Report Data
    [getReportDataThunk.pending]: (state) => {
      state.loading = true;
      state.reportData = [];
      state.error = null;
    },
    [getReportDataThunk.fulfilled]: (state, { payload = {} }) => {
      const { data = [] } = payload;
      state.loading = false;
      state.reportData = data;
    },
    [getReportDataThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // scheduled interview list
    [scheduledInterviewListThunk.pending]: (state) => {
      state.scheduledLoading = true;
      state.error = null;
    },
    [scheduledInterviewListThunk.fulfilled]: (state, { payload = {} }) => {
      const { data: { scheduledInterviewList = [], totalRows = 0 } = {} } =
        payload;
      state.scheduledLoading = false;
      state.scheduledInterviewList = scheduledInterviewList;
      state.totalScheduledInterview = totalRows;
    },
    [scheduledInterviewListThunk.rejected]: (state, action) => {
      state.scheduledLoading = false;
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const adminReportActions = {
  ...adminReportSlice.actions,
  openJobsThunk, // Export the async open jobs action
  newCandidateThunk, // Export the async new candidate action
  getReportDataThunk, // Export the async report data action
};

export const adminReportReducer = adminReportSlice.reducer;
