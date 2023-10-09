import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = 'adminReport';
// login thunk
export const openJobsThunk = createAsyncThunk(
  `${name}/openJobsThunk`,
  async (payload) => {
    // const OPEN_JOBS_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Auth/Login`;
    // return await fetchWrapper.post(OPEN_JOBS_END_POINT, payload);
    return [{
      title: 'L1 Consultant',
      location: 'New Town square',
      experience: "vinit",
      skills: 'Node, React',
      type: 'Full-Time, Part-Time, Contract'
    }];
  }
);

// registration thunk
export const newCandidateThunk = createAsyncThunk(
  `${name}/newCandidateThunk`,
  async (payload) => {
    // const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/RegisterCandidate`;
    // return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
    return [{
      name: 'Ajay Chouhan',
      location: 'New Town square',
      email: "ajay@saisystems.tech",
      skills: 'Node, React',
    }]
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
    [openJobsThunk.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.openJobs = payload;
    },
    [openJobsThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // new candidate
    [newCandidateThunk.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [newCandidateThunk.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      state.newCandidate = payload;
    },
    [newCandidateThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },


  },
});

// Export the actions and reducer
export const adminReportActions = {
  ...adminReportSlice.actions,
  openJobsThunk, // Export the async open jobs action
  newCandidateThunk // Export the async new candidate action
};

export const adminReportReducer = adminReportSlice.reducer;
