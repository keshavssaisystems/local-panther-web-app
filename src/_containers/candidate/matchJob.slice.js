import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "matchedJob";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const matchedJobActions = { ...slice.actions, ...extraActions };
export const matchedJobReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    matchedJob: [],
  };
}

function createExtraActions() {
  const newUrl = `${process.env.REACT_APP_NEW_API_URL}`;

  return {
    getmatchedJob: getmatchedJob(),
  };

  function getmatchedJob() {
    return createAsyncThunk(
      `${name}/getmatchedJob`,

      async (
        candidateId
      ) =>
        await fetchWrapper.get(
          `${newUrl}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?isCandidate=true&candidateId=${candidateId}`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getmatchedJob();

    function getmatchedJob() {
      var { pending, fulfilled, rejected } = extraActions.getmatchedJob;
      builder
        .addCase(pending, (state) => {
          state.matchedJob = { loading: true };
        })
        .addCase(fulfilled, (state, { payload }) => {
          state.loading = false;
          state.matchedJob = payload.data;
          state.totalRows = payload.data.totalRows;
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
          state.matchedJob = { error: action.error };
        });
    }
  };
}
