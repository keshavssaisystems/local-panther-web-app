import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "createjob";

// getCreatejobThunk thunk
export const getCreatejobThunk = createAsyncThunk(
  `${name}/getCreatejobThunk`,
  async (jobData) => {
    const CREATE_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/job`;
    return await fetchWrapper.post(CREATE_JOB_END_POINT, jobData);
  }
);

// getPreviousJobDetailThunk thunk
export const getPreviousJobDetailThunk = createAsyncThunk(
  `${name}/getPreviousJobDetailThunk`,
  async (jobId) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/GetJobDetails/${jobId}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

// getPreviousJobListThunk thunk
export const getPreviousJobListThunk = createAsyncThunk(
  `${name}/getPreviousJobListThunk`,
  async ({ pageNo, searchText, companyId, searchType }) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job?pageSize=10&pageNumber=${pageNo}&searchText=${searchText}&companyId=${companyId}&searchType=${searchType}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

export const getRecommendedListThunk = createAsyncThunk(
  `${name}/getRecommendedListThunk`,
  async ({ pageNo, searchText, searchType }) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/GetAllJobs?pageSize=10&pageNumber=${pageNo}&searchText=${searchText}&searchType=${searchType}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

// getPublishJobThunk thunk
export const getPublishJobThunk = createAsyncThunk(
  `${name}/getPublishJobThunk`,
  async ({ jobId, payload }) => {
    const PUBLISH_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/PublishJob/${jobId}`;
    return await fetchWrapper.put(PUBLISH_JOB_END_POINT, payload);
  }
);

// getCustomerDetailsThunk thunk
export const getCustomerDetailsThunk = createAsyncThunk(
  `${name}/getCustomerDetailsThunk`,
  async (customerid) => {
    const CUSTOMER_DETAILS_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Customer/GetCustomerById/${customerid}`;
    return await fetchWrapper.get(CUSTOMER_DETAILS_END_POINT);
  }
);

// getUpdatejobThunk thunk
export const getUpdatejobThunk = createAsyncThunk(
  `${name}/getUpdatejobThunk`,
  async ({ jobData, jobId }) => {
    const UPDATE_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/${jobId}`;
    return await fetchWrapper.put(UPDATE_JOB_END_POINT, jobData);
  }
);

// getJobDetailForUpdateThunk thunk
export const getJobDetailForUpdateThunk = createAsyncThunk(
  `${name}/getJobDetailForUpdateThunk`,
  async (jobId) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/GetJobDetails/${jobId}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

// getCloseJobThunk thunk
export const getCloseJobThunk = createAsyncThunk(
  `${name}/getCloseJobThunk`,
  async ({ jobId, payload }) => {
    const CLOSE_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/CloseJob/${jobId}`;
    return await fetchWrapper.put(CLOSE_JOB_END_POINT, payload);
  }
);

// Create the slice
const createjobSlice = createSlice({
  name,
  initialState: {
    createjob: [],
    previousJobDetail: [],
    previousJobList: [],
    publishJob: [],
    customerDetails: [],
    recommendedList: [],
    jobForUpdate: [],
    updateJob: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getCreatejobThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCreatejobThunk.fulfilled]: (state, action) => {
      state.createjob = action.payload.data;
      state.loading = false;
    },
    [getCreatejobThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getPreviousJobDetailThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPreviousJobDetailThunk.fulfilled]: (state, action) => {
      state.previousJobDetail = action.payload.data;
      state.loading = false;
    },
    [getPreviousJobDetailThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getPreviousJobListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPreviousJobListThunk.fulfilled]: (state, action) => {
      state.previousJobList = action.payload.data;
      state.loading = false;
    },
    [getPreviousJobListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getPublishJobThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPublishJobThunk.fulfilled]: (state, action) => {
      state.publishJob = action;
      state.loading = false;
    },
    [getPublishJobThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getCustomerDetailsThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCustomerDetailsThunk.fulfilled]: (state, action) => {
      state.customerDetails = action.payload.data;
      localStorage.setItem(
        "companyid",
        action?.payload?.data?.companyid ? action?.payload?.data?.companyid : ""
      );
      state.loading = false;
    },
    [getCustomerDetailsThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getRecommendedListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getRecommendedListThunk.fulfilled]: (state, action) => {
      state.recommendedList = action.payload.data;
      state.loading = false;
    },
    [getRecommendedListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getUpdatejobThunk.pending]: (state) => {
      state.loading = true;
    },
    [getUpdatejobThunk.fulfilled]: (state, action) => {
      state.updateJob = action.payload.data;
      state.loading = false;
    },
    [getUpdatejobThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getJobDetailForUpdateThunk.pending]: (state) => {
      state.loading = true;
    },
    [getJobDetailForUpdateThunk.fulfilled]: (state, action) => {
      state.jobForUpdate = action.payload.data;
      state.loading = false;
    },
    [getJobDetailForUpdateThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getCloseJobThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCloseJobThunk.fulfilled]: (state, action) => {
      state.CloseJob = action;
      state.loading = false;
    },
    [getCloseJobThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const createjobActions = {
  ...createjobSlice.actions,
  getCreatejobThunk,
  getPreviousJobDetailThunk,
  getPreviousJobListThunk,
  getPublishJobThunk,
  getCustomerDetailsThunk,
  getRecommendedListThunk,
  getUpdatejobThunk,
  getJobDetailForUpdateThunk,
  getCloseJobThunk,
};

export const createjobReducer = createjobSlice.reducer;
