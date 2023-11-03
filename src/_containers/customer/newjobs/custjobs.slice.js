import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "custjobList";

// getJobList thunk
export const getJobList = createAsyncThunk(
  `${name}/getJobList`,
  async ({
    pageSize,
    pageNumber,
    searchText,
    companyId,
    searchType,
    jobStatus,
  }) => {
    const LIST_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/job?isActive=true&companyId=${companyId}&pageSize=${pageSize}&pageNumber=${pageNumber}&searchText=${searchText}&searchType=${searchType}&jobStatus=${jobStatus}`;
    return await fetchWrapper.get(LIST_JOB_END_POINT);
  }
);

// getJobDetail thunk
export const getJobDetail = createAsyncThunk(
  `${name}/getJobDetail`,
  async ({ jobId }) => {
    const JOB_DETAIL_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/GetJobDetails/${jobId}`;
    return await fetchWrapper.get(JOB_DETAIL_END_POINT);
  }
);

// Create the slice
const custJobListSlice = createSlice({
  name,
  initialState: {
    jobList: [],
    totalRows: 0,
    jobDetail: [],
    loading: false,
    jdLoading: false,
  },
  reducers: {
    closeJob: (state, action) => {
      state.jobDetail[0].isclosed = true;
      let modifiedJobList = [];
      action?.payload?.jobList.forEach((element) => {
        let elementObject = {};
        if (element.jobid === action?.payload?.jobId) {
          elementObject = element;
          let close = {
            isclosed: true,
          };
          elementObject = {
            ...elementObject,
            ...close,
          };
        } else {
          elementObject = element;
        }
        modifiedJobList?.push(elementObject);
      });
      state.jobList = modifiedJobList;
    },
    publishJob: (state, action) => {
      state.jobDetail[0].isdraft = false;
      state.jobDetail[0].isclosed = false;
      let modifiedJobList = [];
      action?.payload?.jobList.forEach((element) => {
        let elementObject = {};
        if (element.jobid === action?.payload?.jobId) {
          elementObject = element;
          let publish = {
            isdraft: false,
            isclosed: false,
          };
          elementObject = {
            ...elementObject,
            ...publish,
          };
        } else {
          elementObject = element;
        }
        modifiedJobList?.push(elementObject);
      });
      state.jobList = modifiedJobList;
    },
  },

  extraReducers: {
    [getJobList.pending]: (state) => {
      state.loading = true;
    },
    [getJobList.fulfilled]: (state, action) => {
      state.loading = false;
      state.jobList = action.payload.data.jobList;
      state.totalRows = action.payload.data.totalRows;
    },
    [getJobList.rejected]: (state, action) => {
      state.loading = false;
      state.jobList = { error: action.error };
    },
    [getJobDetail.pending]: (state) => {
      state.jdLoading = true;
    },
    [getJobDetail.fulfilled]: (state, action) => {
      state.jdLoading = false;
      let data = [];
      data.push(action.payload.data);
      state.jobDetail = data;
    },
    [getJobDetail.rejected]: (state, action) => {
      state.jdLoading = false;
    },
  },
});

// Export the actions and reducer
export const custJobListActions = {
  ...custJobListSlice.actions,
  getJobList,
  getJobDetail,
};

export const custJobListReducer = custJobListSlice.reducer;
