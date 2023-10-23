import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = 'adminReport';

export const getCompanyDropDown = async (searchText) => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  return await fetchWrapper.get(
    `${baseUrl}/Company/Get?isActive=true&searchText=${searchText}`
  );
};

// Open Jobs thunk
export const openJobsThunk = createAsyncThunk(
  `${name}/openJobsThunk`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10
    }

    const OPEN_JOBS_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Report/GetOpenJobsList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(OPEN_JOBS_END_POINT);
  }
);

// New candidate thunk
export const newCandidateThunk = createAsyncThunk(
  `${name}/newCandidateThunk`,
  async (payload) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10
    }
    const NEW_CANDIDATE_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Report/GetNewCandidatesList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(NEW_CANDIDATE_END_POINT);
  }
);

// Hiring manager thunk
export const hiringManagerThunk = createAsyncThunk(
  `${name}/hiringManagerThunk`,
  async (payload) => {
    // const HIRING_MANAGER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/RegisterCandidate`;
    // return await fetchWrapper.post(HIRING_MANAGER_END_POINT, payload);
    return [{
      name: 'Ajay Chouhan',
      location: 'New Town square',
      email: "ajay@saisystems.tech",
      skills: 'Node, React',
    }]
  }
);

// scheduled interview list thunk
export const scheduledInterviewListThunk = createAsyncThunk(
  `${name}/scheduledInterviewListThunk`,
  async (payload = {}) => {
    payload = {
      ...payload,
      isActive: true
    }
    
    const SCHEDULED_INTERVIEW_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/ScheduledInterview?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(SCHEDULED_INTERVIEW_END_POINT);
  }
);

// Create the slice
const adminReportSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    error: null,
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
      const { data: { openJobsList = [], totalRows = 0 } = {}} = payload;
      
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
      const { data: { newCandidatesList = [], totalRows = 0 } = {}} = payload;

      state.loading = false;
      state.newCandidate = newCandidatesList;      
      state.totalNewCandidate = totalRows;
    },
    [newCandidateThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    
    // Hiring Manager
    [hiringManagerThunk.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [hiringManagerThunk.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      state.hiringManager = payload;
    },
    [hiringManagerThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    
    // scheduled interview list
    [scheduledInterviewListThunk.pending]: (state) => {
      state.scheduledLoading = true;
      state.error = null;
    },
    [scheduledInterviewListThunk.fulfilled]: (state, { payload = {} }) => {
      const { data: { scheduledInterviewList = [], totalRows = 0 } = {}} = payload;
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
  hiringManagerThunk // Export the async hiring manager action
};

export const adminReportReducer = adminReportSlice.reducer;
