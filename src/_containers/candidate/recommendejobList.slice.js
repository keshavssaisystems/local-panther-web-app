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
    loading: false,
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

      async ({
        candidateId,
        pageNo,
        searchText,
        locationId,
        employentModeId,
        skillId,
        pageSize,
      }) =>
        await fetchWrapper.get(
          `${baseUrl}/CandidateRecommendedJob/GetRecommendedJobList?pageSize=5&isActive=true&pageNumber=${pageNo}&candidateId=${candidateId}&searchText=${searchText}&skillIds=${skillId}&jobLocationIds=${locationId}&employmentModeId=${employentModeId}`
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
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.recommendedjobList = action.payload.data;
          state.totalRows = action.payload.data.totalRows;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.recommendedjobList = { error: action.error };
        });
    }
  };
}
