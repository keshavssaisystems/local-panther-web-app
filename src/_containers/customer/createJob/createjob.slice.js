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
  async ({ pageNo, searchText, companyId }) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job?pageSize=10&pageNumber=${pageNo}&searchText=${searchText}&companyId=${companyId}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

export const getRecommendedListThunk = createAsyncThunk(
  `${name}/getRecommendedListThunk`,
  async ({ pageNo, searchText }) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job?pageSize=10&pageNumber=${pageNo}&searchText=${searchText}`;
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
};

export const createjobReducer = createjobSlice.reducer;
