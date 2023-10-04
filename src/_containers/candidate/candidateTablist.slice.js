import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "candidateTabList";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

//exports
export const candidatejobListTabActions = { ...slice.actions, ...extraActions };
export const candidatejobListTabReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    candidatejobTabList: [],
    jobTabList: [],
    totalRecords: 0,
    loading: false,
  };
}
function createExtraActions() {

  const newUrl = `${process.env.REACT_APP_NEW_API_URL}`;
  console.log('baseurl', newUrl)
  return {
    getcandidateJobList: getcandidateJobList(),
  };
  function getcandidateJobList() {
    return createAsyncThunk(
      `${name}/getrecommendedJobList`,

      async ({
        pageSize, pageNumber, candidateRecommendedJobStatusId
      }) =>
        await fetchWrapper.get(
          `${newUrl}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?pageSize=${pageSize}&pageNumber=${pageNumber}&candidateRecommendedJobStatusId=${candidateRecommendedJobStatusId}`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getcandidateJobList();

    function getcandidateJobList() {
      let { pending, fulfilled, rejected } = extraActions.getcandidateJobList;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })

        .addCase(fulfilled, (state, action) => {
          state.loading = false;
          state.candidatejobTabList = action?.payload?.data
          //   ?.candidateRecommendedJobDtoList
          //   ? action?.payload?.data?.candidateRecommendedJobDtoList
          //   : [];

          state.totalRecords = action?.payload?.data?.totalRows
            ? action?.payload?.data?.totalRows
            : 0;
        })

        .addCase(rejected, (state, action) => {
          state.candidatejobTabList = { error: action.error };

          state.loading = false;
        });
    }
  };
}

