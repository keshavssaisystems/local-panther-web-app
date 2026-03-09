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
    hiringManagerId,
  }) => {
    const LIST_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/job?isActive=true&companyId=${companyId}&pageSize=${pageSize}&pageNumber=${pageNumber}&searchText=${searchText}&searchType=${searchType}&jobStatus=${jobStatus}&createdBy=${hiringManagerId}`;
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

// assignJobs thunk
export const assignJobs = createAsyncThunk(
  `${name}/assignJobs`,
  async ({ jobIds, hiringManagerId }) => {
   
    const ASSIGN_JOBS_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/JobAssignedUsers`;
    
    const payloads = [];
    jobIds.forEach((jobId) => {
      hiringManagerId.forEach((managerId) => {
        payloads.push({
          jobid: jobId,
          assignedto: managerId,
        });
      });
    });
    
    const results = await Promise.all(
      payloads.map((payload) => fetchWrapper.post(ASSIGN_JOBS_END_POINT, payload))
    );
    
    return results;
  }
);

//job list api for Dashboard jobpipeline
// getJobs thunk
export const getJobs= createAsyncThunk(
  `${name}/getJobs`,
  async ({
    pageSize,
    pageNumber,
    companyId,
    userId = null,
    jobId = null
  }) => {
    const LIST_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/Fetch_Jobs_List?parameter=@jobid=${jobId},@companyid=${companyId},@isactive=1,@currentpage=${pageNumber},@pagesize=${pageSize},@userid=${userId},@totalrows=0`;
    return await fetchWrapper.get(LIST_JOB_END_POINT);
  }
);

// Create the slice
const custJobListSlice = createSlice({
  name,
  initialState: {
    jobList: [],
    totalRows: 0,
    jobs: [],
    totalRow: 0,
    jobDetail: [],
    loading: false,
    jdLoading: false,
    assigningLoading: false,
    assigningError: null,
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
            publisheddate: action?.payload?.publisheddate,
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
       // Added this to reset job list manually
    clearJobList: (state) => {
      state.jobList = [];
      state.jobDetail = [];
      state.totalRows = 0;
      state.loading = false;
      state.jdLoading = false;
    },
  },

  extraReducers: {
    [getJobList.pending]: (state) => {
      state.loading = true;
      state.jobList = [];
      state.totalRows = 0;
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
    [assignJobs.pending]: (state) => {
      state.assigningLoading = true;
      state.assigningError = null;
    },
    [assignJobs.fulfilled]: (state, action) => {
      state.assigningLoading = false;
      state.assigningError = null;
    },
    [assignJobs.rejected]: (state, action) => {
      state.assigningLoading = false;
      state.assigningError = action.error.message || "Failed to assign jobs";
    },
    [getJobs.pending]: (state) => {
      state.dbloading = true;
      state.jobs = [];
      state.totalRows = 0;
    },
    [getJobs.fulfilled]: (state, action) => {
      state.dbloading = false;
      state.jobs = action.payload?.data?.data;
      state.totalRow = action.payload?.data?.totalRows;
    },
    [getJobs.rejected]: (state) => {
      state.dbloading = false;
      state.jobs = [];
    },
  },
});
export const { clearJobList } = custJobListSlice.actions;
// Export the actions and reducer
export const custJobListActions = {
  ...custJobListSlice.actions,
  getJobList,
  getJobDetail,
  assignJobs,
  getJobs
};

export const custJobListReducer = custJobListSlice.reducer;
