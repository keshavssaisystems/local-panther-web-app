import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "../../../_helpers";

// create slice
const name = "candidateList";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const candidateListsActions = { ...slice.actions, ...extraActions };
export const candidateListsReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    loading: false,
    jobLists: [],
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;

  return {
    getCandidateJobLists: getCandidateJobLists(),
  };

  function getCandidateJobLists() {
    debugger;
    return createAsyncThunk(
      `${name}/getCandidateJobLists`,

      async ({
        jobId,
        pageNo,
        searchText,
        locationId,
        employentModeId,
        pageSize,
        skillId,
      }) =>
        await fetchWrapper.get(
          `${baseUrl}/job?isActive=true&jobId=${jobId}&companyId=&pageSize=${pageSize}&pageNumber=${pageNo}&searchText=${searchText}&jobLocationIds=${locationId}&employmentmodeid=${employentModeId}&skillIds=${skillId}`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getCandidateJobLists();

    function getCandidateJobLists() {
      let { pending, fulfilled, rejected } = extraActions.getCandidateJobLists;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.loading = false;
          state.jobLists = action.payload.data.jobList;
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
        });
    }
  };
}
