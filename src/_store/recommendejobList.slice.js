import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "recommendedjobList";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const recommendedjobListActions = { ...slice.actions, ...extraActions };
export const recommendedjobListReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    recommendedjobList: [],
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;

  return {
    getrecommendedJobList: getrecommendedJobList(),
  };

  function getrecommendedJobList() {
    return createAsyncThunk(
      `${name}/getrecommendedJobList`,

      async ({ jobId, pageNo, searchText, minExperience, employentModeId }) =>
        await fetchWrapper.get(
          `${baseUrl}/job?isActive=true&jobId=${jobId}&companyId=&pageSize=5&pageNumber=${pageNo}&searchText=${searchText}&minExperience=${minExperience}&employmentmodeid=${employentModeId}`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getrecommendedJobList();

    function getrecommendedJobList() {
      var { pending, fulfilled, rejected } = extraActions.getrecommendedJobList;
      builder
        .addCase(pending, (state) => {
          state.recommendedjobList = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          state.recommendedjobList = action.payload.data.recommendedjobList;
          state.totalRows = action.payload.data.totalRows;
        })
        .addCase(rejected, (state, action) => {
          state.recommendedjobList = { error: action.error };
        });
    }
  };
}