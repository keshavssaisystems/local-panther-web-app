import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "custjobList";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const custJobListActions = { ...slice.actions, ...extraActions };
export const custJobListReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    jobList: [],
    totalRows: 0,
    jobDetail: [],
    loading: false,
    jdLoading: false,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_NEW_API_URL}`;

  return {
    getJobList: getJobList(),
    getJobDetails: getJobDetails(),
  };

  function getJobList() {
    return createAsyncThunk(
      `${name}/getJobList`,

      async ({
        pageSize,
        pageNumber,
        searchText,
        jobId,
        companyId,
        cityId,
        skillId,
      }) =>
        await fetchWrapper.get(
          `${baseUrl}/job?isActive=true&jobId=${jobId}&companyId=${companyId}&pageSize=${pageSize}&pageNumber=${pageNumber}&searchText=${searchText}&cityId=${cityId}&skillId=${skillId}`
        )
    );
  }

  function getJobDetails() {
    return createAsyncThunk(
      `${name}/getJobDetails`,

      async ({ jobId }) =>
        await fetchWrapper.get(`${baseUrl}/Job/GetJobDetails/${jobId}`)
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getJobList();
    getJobDetails();

    function getJobList() {
      var { pending, fulfilled, rejected } = extraActions.getJobList;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.loading = false;
          state.jobList = action.payload.data.jobList;
          state.totalRows = action.payload.data.totalRows;
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
          state.jobList = { error: action.error };
        });
    }

    function getJobDetails() {
      var { pending, fulfilled, rejected } = extraActions.getJobDetails;
      builder
        .addCase(pending, (state) => {
          state.jdLoading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.jdLoading = false;
          let data = [];
          data.push(action.payload.data);
          state.jobDetail = data;
        })
        .addCase(rejected, (state, action) => {
          state.jdLoading = false;
        });
    }
  };
}
