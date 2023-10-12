import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "candidateList";

// get recommended job list thunk
export const getRecommendedJobList = createAsyncThunk(
  `${name}/getRecommendedJobList`,
  async ({
    pageSize,
    pageNumber,
    candidateRecommendedJobStatusId,
    candidateId,
  }) => {
    const jobStatusId =
      candidateRecommendedJobStatusId === 4
        ? `&customerRecommendedJobStatusId=${candidateRecommendedJobStatusId}&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`
        : candidateRecommendedJobStatusId
        ? `&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`
        : "";
    const RECOMMENDED_JOB_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?candidateId=${candidateId}&pageSize=${pageSize}&pageNumber=${pageNumber}${jobStatusId}`;
    return await fetchWrapper.get(RECOMMENDED_JOB_END_POINT);
  }
);

// get job details
export const getJobDetails = createAsyncThunk(
  `${name}/getJobDetails`,
  async ({ jobId }) => {
    return await fetchWrapper.get(
      `${process.env.REACT_APP_NEW_API_URL}/Job/GetJobDetails/${jobId}`
    );
  }
);

// candidate like thunk
export const candidateLike = createAsyncThunk(
  `${name}/candidateLike`,
  async (jobId) => {
    const LIKED_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateLiked/${jobId}`;
    return await fetchWrapper.put(LIKED_END_POINT);
  }
);

// candidate accept thunk
export const candidateAccept = createAsyncThunk(
  `${name}/candidateAccept`,
  async (jobId) => {
    const ACCEPTED_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateAccepted/${jobId}`;
    return await fetchWrapper.put(ACCEPTED_END_POINT);
  }
);

// candidate accept thunk
export const candidateMayBe = createAsyncThunk(
  `${name}/candidateMayBe`,
  async (jobId) => {
    const MAY_BE_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateMaybe/${jobId}`;
    return await fetchWrapper.put(MAY_BE_END_POINT);
  }
);

// candidate apply thunk
export const candidateApply = createAsyncThunk(
  `${name}/candidateApply`,
  async (jobId) => {
    const APPLY_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateApplied/${jobId}`;
    return await fetchWrapper.put(APPLY_END_POINT);
  }
);

// candidate reject thunk
export const candidateReject = createAsyncThunk(
  `${name}/candidateReject`,
  async (jobId) => {
    const REJECT_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateRejected/${jobId}`;
    return await fetchWrapper.put(REJECT_END_POINT, {
      candidaterejectedcomment: "",
      candidaterejectedreasonid: 0,
    });
  }
);

// Create the slice
const candidateList = createSlice({
  name,
  initialState: {
    candidateJobList: [],
    totalRecords: 0,
    loading: false,
    jobDetail: [],
    jdLoading: false,
  },
  reducers: {},

  extraReducers: {
    // recommended job list state
    [getRecommendedJobList.pending]: (state) => {
      state.loading = true;
      state.candidateJobList = [];
      state.totalRecords = 0;
    },
    [getRecommendedJobList.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      state.candidateJobList = payload?.data?.candidateRecommendedJobDtoList
        ? payload?.data?.candidateRecommendedJobDtoList
        : [];
      state.totalRecords = payload?.data?.totalRows
        ? payload?.data?.totalRows
        : 0;
    },
    [getRecommendedJobList.rejected]: (state, action) => {
      state.loading = false;
      state.candidateJobList = { error: action.error };
    },

    // candidate like state
    [candidateLike.pending]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [candidateLike.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [candidateLike.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // candidate may be state
    [candidateMayBe.pending]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [candidateMayBe.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [candidateMayBe.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // candidate accept state
    [candidateAccept.pending]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [candidateAccept.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [candidateAccept.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // job detail
    [getJobDetails.pending]: (state) => {
      state.jdLoading = true;
      state.jobDetail = [];
    },
    [getJobDetails.fulfilled]: (state, { payload = {} }) => {
      state.jdLoading = false;
      let data = [];
      data.push(payload.data);
      state.jobDetail = data;
    },
    [getJobDetails.rejected]: (state, action) => {
      state.jdLoading = false;
    },

    // candidate apply state
    [candidateApply.pending]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [candidateApply.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [candidateApply.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // candidate reject state
    [candidateReject.pending]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [candidateReject.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [candidateReject.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const candidateListActions = {
  ...candidateList.actions,
  getRecommendedJobList, // Export the async job list action
  candidateLike, // Export the like action
  candidateAccept,
  candidateMayBe,
  getJobDetails,
  candidateApply,
  candidateReject,
};
export const candidateListReducer = candidateList.reducer;
