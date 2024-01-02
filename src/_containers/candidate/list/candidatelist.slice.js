import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "candidateList";
const internalUserId =
  JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId ?? 0;

// get recommended job list thunk
export const getRecommendedJobList = createAsyncThunk(
  `${name}/getRecommendedJobList`,
  async ({
    pageSize,
    pageNumber,
    candidateRecommendedJobStatusId,
    candidateId,
    isCandidate,
  }) => {
    let jobStatusId = "";
    switch (candidateRecommendedJobStatusId) {
      case undefined:
        jobStatusId = "";
        break;
      case 4:
        jobStatusId = `&customerRecommendedJobStatusId=${candidateRecommendedJobStatusId}&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`;
        break;
      case 3:
        jobStatusId = `&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`;
        break;
      case 6:
        isCandidate = true;
        jobStatusId = `&customerRecommendedJobStatusId=${candidateRecommendedJobStatusId}&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`;
        break;
      case 5:
        jobStatusId = `&customerRecommendedJobStatusId=${candidateRecommendedJobStatusId}&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`;
        break;
      case 7:
        isCandidate = false;
        jobStatusId = `&customerRecommendedJobStatusId=5`;
        break;
      default:
        jobStatusId = `&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`;
        break;
    }
    const RECOMMENDED_JOB_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?isCandidate=${isCandidate}&candidateId=${candidateId}&pageSize=${pageSize}&pageNumber=${pageNumber}${jobStatusId}`;
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

// candidate accept again thunk
export const candidateAcceptAgain = createAsyncThunk(
  `${name}/candidateAcceptAgain`,
  async ({ candidaterecommendedjobid, payload }) => {
    const ACCEPTED_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateAcceptedAgain/${candidaterecommendedjobid}`;
    return await fetchWrapper.put(ACCEPTED_END_POINT, payload);
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
  async ({ candidaterecommendedjobid, payload }) => {
    const REJECT_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/CandidateRecommendedJob/candidateRejected/${candidaterecommendedjobid}`;
    return await fetchWrapper.put(REJECT_END_POINT, payload);
  }
);

// get JobPrescreenApplication thunk
export const getJobPrescreenApplicationQues = createAsyncThunk(
  `${name}/getJobPrescreenApplicationQues`,
  async (jobId) => {
    const PRESCREEN_QUES_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/JobPrescreenApplication?pageSize=10&pageNumber=1&jobId=${jobId}&isActive=true`;
    return await fetchWrapper.get(PRESCREEN_QUES_END_POINT);
  }
);

// post JobPrescreenApplication thunk
export const postJobPrescreenApplication = createAsyncThunk(
  `${name}/postJobPrescreenApplication`,
  async (payload) => {
    const POST_PRESCREEN_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/JobCandidatePrescreenApplication`;
    return await fetchWrapper.post(POST_PRESCREEN_END_POINT, payload);
  }
);

// get completed JobPrescreenApplication thunk
export const getCompJobPrescreenApplication = createAsyncThunk(
  `${name}/getCompJobPrescreenApplication`,
  async (jobId) => {
    const GET_COMP_PRESCREEN_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/JobCandidatePrescreenApplication?pageSize=10&pageNumber=1&jobId=${jobId}&isActive=true&candidateId=${internalUserId}`;
    return await fetchWrapper.get(GET_COMP_PRESCREEN_END_POINT);
  }
);

// update reschedule reason for candidate thunk
export const updateRescheduleReason = createAsyncThunk(
  `${name}/updateRescheduleReason`,
  async (payload) => {
    const UPDATE_RESCHEDULE_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/ScheduledInterview/InterviewRescheduleRequest/${payload.scheduleinterviewid}`;
    return await fetchWrapper.put(UPDATE_RESCHEDULE_END_POINT, payload);
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
    prescreenQues: [],
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

    [candidateAcceptAgain.pending]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [candidateAcceptAgain.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [candidateAcceptAgain.rejected]: (state, action) => {
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

    // prescreen questions
    [getJobPrescreenApplicationQues.pending]: (state) => {
      state.loading = false;
      state.prescreenQues = [];
    },
    [getJobPrescreenApplicationQues.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      if (payload?.data?.jobPrescreenApplicationDetailsList?.length > 0) {
        let newData = payload?.data?.jobPrescreenApplicationDetailsList.map(
          (data) => {
            return {
              isactive: data.isactive,
              iscustomquestion: data.iscustomquestion,
              jobid: data.jobid,
              jobprescreenapplicationid: data.jobprescreenapplicationid,
              prescreenquestion: data.prescreenquestion,
              prescreenquestionid: data.prescreenquestionid,
              error: false,
              answer: "",
            };
          }
        );
        state.prescreenQues = newData;
      }
    },
    [getJobPrescreenApplicationQues.rejected]: (state, action) => {
      state.loading = false;
    },

    // post prescreen questions
    [postJobPrescreenApplication.pending]: (state) => {
      state.loading = false;
    },
    [postJobPrescreenApplication.fulfilled]: (state, action) => {
      state.loading = false;
      let jobId = action?.meta?.arg[0]?.jobid;
      let ind = state.candidateJobList.findIndex(
        (data) => data.jobid === jobId
      );
      if (ind > -1) {
        state.candidateJobList[ind].candidateprescreenstatus = "Completed";
      }
    },
    [postJobPrescreenApplication.rejected]: (state, action) => {
      state.loading = false;
    },

    // prescreen completed questions
    [getCompJobPrescreenApplication.pending]: (state) => {
      state.loading = false;
      state.prescreenQues = [];
    },
    [getCompJobPrescreenApplication.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      if (payload?.data?.jobCandidatePrescreenApplicationList?.length > 0) {
        let newData = payload?.data?.jobCandidatePrescreenApplicationList.map(
          (data) => {
            return {
              isactive: data.isactive,
              iscustomquestion: data.iscustomquestion,
              jobid: data.jobid,
              jobprescreenapplicationid: data.jobprescreenapplicationid,
              prescreenquestion: data.prescreenquestion,
              prescreenquestionid: data.prescreenquestionid,
              error: false,
              answer: data.answer,
            };
          }
        );
        state.prescreenQues = newData;
      }
    },
    [getCompJobPrescreenApplication.rejected]: (state, action) => {
      state.loading = false;
    },

    // update reschedule
    [updateRescheduleReason.pending]: (state) => {},
    [updateRescheduleReason.fulfilled]: (state, { payload = {} }) => {},
    [updateRescheduleReason.rejected]: (state, action) => {},
  },
});

// Export the actions and reducer
export const candidateListActions = {
  ...candidateList.actions,
  getRecommendedJobList, // Export the async job list action
  candidateLike, // Export the like action
  candidateAccept,
  candidateAcceptAgain,
  candidateMayBe,
  getJobDetails,
  candidateApply,
  candidateReject,
  getJobPrescreenApplicationQues,
  postJobPrescreenApplication,
  getCompJobPrescreenApplication,
  updateRescheduleReason,
};
export const candidateListReducer = candidateList.reducer;
