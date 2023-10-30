import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "candidateTabList";

// get recommended job list thunk
export const getRecommendedJobListThunk = createAsyncThunk(
  `${name}/getRecommendedJobListThunk`,
  async ({ pageSize, pageNumber, candidateRecommendedJobStatusId, candidateId }) => {
    const jobStatusId = candidateRecommendedJobStatusId ? `&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}` : ''
    const RECOMMENDED_JOB_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?isCandidate=true&candidateId=${candidateId}&pageSize=${pageSize}&pageNumber=${pageNumber}${jobStatusId}`;
    return await fetchWrapper.get(RECOMMENDED_JOB_END_POINT);
  }
);

// candidate like thunk
export const candidateLikeThunk = createAsyncThunk(
  `${name}/candidateLikeThunk`,
  async (jobId) => {
    const LIKED_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateLiked/${jobId}`;
    return await fetchWrapper.put(LIKED_END_POINT);
  }
);

// candidate accept thunk
export const candidateAcceptThunk = createAsyncThunk(
  `${name}/candidateAcceptThunk`,
  async (jobId) => {
    const ACCEPTED_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateAccepted/${jobId}`;
    return await fetchWrapper.put(ACCEPTED_END_POINT);
  }
);

// candidate accept thunk
export const candidateMayBeThunk = createAsyncThunk(
  `${name}/candidateMayBeThunk`,
  async (jobId) => {
    const MAY_BE_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateMaybe/${jobId}`;
    return await fetchWrapper.put(MAY_BE_END_POINT);
  }
);


// Create the slice
const candidateJobListTab = createSlice({
  name,
  initialState: {
    candidatejobTabList: [],
    jobTabList: [],
    totalRecords: 0,
    loading: false,
    sweetAlert: {
      show: false,
      type: "success",
      title: ""
    }
  },
  reducers: {
    closeSweetAlert: (state) => {
      state.sweetAlert = { show: false }
    },
  },

  extraReducers: {
    // recommended job list state
    [getRecommendedJobListThunk.pending]: (state) => {
      state.loading = true;
      state.candidatejobTabList = [];
    },
    [getRecommendedJobListThunk.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      state.candidatejobTabList = payload?.data
      state.totalRecords = payload?.data?.totalRows
        ? payload?.data?.totalRows
        : 0;
    },
    [getRecommendedJobListThunk.rejected]: (state, action) => {
      state.loading = false;
      state.candidatejobTabList = { error: action.error };
    },

    // candidate like state
    [candidateLikeThunk.pending]: (state) => {
      state.loading = false;
      state.error = null;
      state.sweetAlert = {show: false};
    },
    [candidateLikeThunk.fulfilled]: (state, { payload = {} }) => {
      state.loading =false;
      state.sweetAlert = { type: 'success', show: true, title: payload?.message ? payload?.message : payload?.status }
    },
    [candidateLikeThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.sweetAlert = { type: 'error', show: true, title: action?.error }
    },

    // candidate may be state
    [candidateMayBeThunk.pending]: (state) => {
      state.loading = false;
      state.error = null;
      state.sweetAlert = {show: false};
    },
    [candidateMayBeThunk.fulfilled]: (state, { payload = {} }) => {
      state.sweetAlert = { type: 'success', show: true, title: payload?.message ? payload?.message : payload?.status }
      state.loading = false;
    },
    [candidateMayBeThunk.rejected]: (state, action) => {
      state.loading =false;
      state.error = action.error;
      state.sweetAlert = { type: 'error', show: true, title: action?.error }
    },
    
    // candidate accept state
    [candidateAcceptThunk.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.sweetAlert = {show: false};
    },
    [candidateAcceptThunk.fulfilled]: (state, { payload = {} }) => {
      state.loading =false;
      state.sweetAlert = { type: 'success', show: true, title: payload?.message ? payload?.message : payload?.status }
    },
    [candidateAcceptThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
      state.sweetAlert = { type: 'error', show: true, title: action?.error }
    },
  },
});

// Export the actions and reducer
export const candidateJobListTabActions = {
  ...candidateJobListTab.actions,
  getRecommendedJobListThunk, // Export the async job list action
  candidateLikeThunk, // Export the like action
  candidateAcceptThunk,
  candidateMayBeThunk
};
export const candidateJobListTabReducer = candidateJobListTab.reducer;

