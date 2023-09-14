import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "applyForJob";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const applyForJobActions = { ...slice.actions, ...extraActions };
export const applyForJobReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    applyForJob: [],
    loading: false,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;

  return {
    postApplyForJob: postApplyForJob(),
  };

  function postApplyForJob() {
    return createAsyncThunk(
      `${name}/postApplyForJob`,
      async ({
        jobapplicationid,
        jobid,
        candidateid,
        applicationdate,
        applicationstatus,
        skills,
        noticeperiodid,
        isrelocate,
        isvideoconference,
        isactive,
        currentUserId,
      }) =>
        await fetchWrapper.post(`${baseUrl}/JobApplications`, {
          jobapplicationid,
          jobid,
          candidateid,
          applicationdate,
          applicationstatus,
          skills,
          noticeperiodid,
          isrelocate,
          isvideoconference,
          isactive,
          currentUserId,
        })
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    postApplyForJob();

    function postApplyForJob() {
      var { pending, fulfilled, rejected } = extraActions.postApplyForJob;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.applyForJob = action.payload;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.applyForJob = { error: action.error };
        });
    }
  };
}
