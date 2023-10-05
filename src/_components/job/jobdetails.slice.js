import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "jobDetail";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const jobDetailActions = { ...slice.actions, ...extraActions };
export const jobDetailReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    jobDetail: [],
    loading: false,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;

  return {
    getJobDetail: getJobDetail(),
  };

  function getJobDetail() {
    return createAsyncThunk(
      `${name}/getJobDetail`,

      async (jobId) =>
        await fetchWrapper.get(`${baseUrl}/job?isActive=true&jobId=${jobId}`)
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getJobDetail();

    function getJobDetail() {
      var { pending, fulfilled, rejected } = extraActions.getJobDetail;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.jobDetail = action.payload.data;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.jobDetail = { error: action.error };
        });
    }
  };
}
