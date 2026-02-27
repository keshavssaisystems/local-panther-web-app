import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "customerReport";

// customer report job list thunk
export const getCustReportJobList = createAsyncThunk(
  `${name}/getCustReportJobList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_JOB_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }/Report/GetReportData?reportId=${payload.reportId}&parameter=@startdate=${payload.startDate ? `'${payload.startDate}'` : null
      },@enddate=${payload.endDate ? `'${payload.endDate}'` : null
      },@subsidiaryid=${payload.subsidiaryid ? payload.subsidiaryid : null}`;
    return await fetchWrapper.get(GET_CUST_REPORT_JOB_LIST_END_POINT);
  }
);

// customer report scheduled interview list thunk
export const getCustReportScheduleIVList = createAsyncThunk(
  `${name}/getCustReportScheduleIVList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_SCHDINV_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }/Report/GetReportData?reportId=${payload.reportId}&parameter=@startdate=${payload.startDate ? `'${payload.startDate}'` : null
      },@enddate=${payload.endDate ? `'${payload.endDate}'` : null
      },@candidateid=${payload.candidateid ? payload.candidateid : null},@jobid=${payload.jobid ? payload.jobid : null
      }`;
    return await fetchWrapper.get(GET_CUST_REPORT_SCHDINV_LIST_END_POINT);
  }
);

// customer report interviewed candidate list thunk
export const getCustReportIVDCandList = createAsyncThunk(
  `${name}/getCustReportIVDCandList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_IVD_CND_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }/Report/GetReportData?reportId=${payload.reportId}&parameter=@startdate=${payload.startDate ? `'${payload.startDate}'` : null
      },@enddate=${payload.endDate ? `'${payload.endDate}'` : null
      },@candidateid=${payload.candidateid ? payload.candidateid : null},@jobid=${payload.jobid ? payload.jobid : null
      }`;
    return await fetchWrapper.get(GET_CUST_REPORT_IVD_CND_LIST_END_POINT);
  }
);

// customer report job aging list thunk
export const getCustReportJobAgingList = createAsyncThunk(
  `${name}/getCustReportJobAgingList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_JOB_AGING_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }/Report/GetReportData?reportId=${payload.reportId}&parameter=@jobid=${payload.jobid ? payload.jobid : null
      }`;
    return await fetchWrapper.get(GET_CUST_REPORT_JOB_AGING_LIST_END_POINT);
  }
);

// customer report matched candidate list thunk
export const getCustReportMatchedCandList = createAsyncThunk(
  `${name}/getCustReportMatchedCandList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_MATCH_CAND_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }/Report/GetReportData?reportId=${payload.reportId}&parameter=@jobid=${payload.jobid ? payload.jobid : null
      },@customerrecommendedjobstatusid=${payload.customerrecommendedjobstatusid
        ? payload.customerrecommendedjobstatusid
        : null
      }`;
    return await fetchWrapper.get(GET_CUST_REPORT_MATCH_CAND_LIST_END_POINT);
  }
);

// customer report matched candidate list thunk
export const getCustReporCandStatList = createAsyncThunk(
  `${name}/getCustReporCandStatList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };

    const GET_CUST_REPORT_CAND_STAT_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }/Report/GetReportData?reportId=${payload.reportId
      }&parameter=@customerrecommendedjobstatusid=${payload.customerrecommendedjobstatusid
        ? payload.customerrecommendedjobstatusid
        : null
      }`;
    return await fetchWrapper.get(GET_CUST_REPORT_CAND_STAT_LIST_END_POINT);
  }
);

// get job dropdown list
export const getJobDropdown = createAsyncThunk(
  `${name}/getJobDropdown`,
  async (search = "") => {
    // const GET_JOB_DROPDOWN_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Job/GetJobDropdown`;
    let companyid = Number(localStorage.getItem("companyid"));
    const base = `${process.env.REACT_APP_NEW_API_URL}/Common/GetCommonDropdown?searchText=JobList`;
    const GET_JOB_DROPDOWN_END_POINT = search
      ? `${base}&searchBy=${encodeURIComponent(search)}`
      : `${base}`;
    return await fetchWrapper.get(GET_JOB_DROPDOWN_END_POINT);
  }
);

// get candidate dropdown list
export const getCandidateDropdown = createAsyncThunk(
  `${name}/getCandidateDropdown`,
  async () => {
    const GET_CANDIDATE_DROPDOWN_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Candidate/GetCandidateDropdown`;
    return await fetchWrapper.get(GET_CANDIDATE_DROPDOWN_END_POINT);
  }
);

// get candidate dropdown list (supports search)
export const getCandidateSearchDropdown = createAsyncThunk(
  `${name}/getCandidateSearchDropdown`,
  async (search = "") => {
    const base = `${process.env.REACT_APP_NEW_API_URL}/Common/GetCommonDropdown?searchText=candidateSearch`;
    const GET_CANDIDATE_DROPDOWN_END_POINT = search
      ? `${base}&searchBy=${encodeURIComponent(search)}`
      : `${base}`;
    return await fetchWrapper.get(GET_CANDIDATE_DROPDOWN_END_POINT);
  }
);

// get candidate Recommended Job Status list
export const getRecommendedJobStatus = createAsyncThunk(
  `${name}/getRecommendedJobStatus`,
  async () => {
    const GET_RECOMMENDED_STATUS_DROPDOWN_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Common/GetCommonDropdown?searchText=RecommendedJobStatus`;
    return await fetchWrapper.get(GET_RECOMMENDED_STATUS_DROPDOWN_END_POINT);
  }
);

// get Scheduled Candidates For Customer Dropdown
export const getScheduledCandidatesForCustomerDropdown = createAsyncThunk(
  `${name}/getScheduledCandidatesForCustomerDropdown`,
  async (id) => {
    const GET_SCFC_DROPDOWN_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Common/GetCommonDropdown?searchText=ScheduledCandidatesForCustomer&commonId=${id}`;
    return await fetchWrapper.get(GET_SCFC_DROPDOWN_END_POINT);
  }
);

// get job detail for customer report
export const getCustReportJobDetail = createAsyncThunk(
  `${name}/getCustReportJobDetail`,
  async (jobId) => {
    const CUST_RPT_JD_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Job/GetJobDetails/${jobId}`;
    return await fetchWrapper.get(CUST_RPT_JD_END_POINT);
  }
);

// get job detail for customer report
export const getCustReportSchdIntvDetail = createAsyncThunk(
  `${name}/getCustReportSchdIntvDetail`,
  async (scheduleInterviewId) => {
    const CUST_RPT_JD_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/ScheduledInterview?pageSize=10&pageNumber=1&scheduleInterviewId=${scheduleInterviewId}&isActive=true&isPaginationRequired=true`;
    return await fetchWrapper.get(CUST_RPT_JD_END_POINT);
  }
);

// get report Subsidiary List
export const getReportSubsidiaryList = createAsyncThunk(
  `${name}/getReportSubsidiaryList`,
  async (companyId) => {
    const SUBSIDIARY_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Subsidiary/GetSubsidiaryDropdown?companyId=${companyId}`;
    return await fetchWrapper.get(SUBSIDIARY_END_POINT);
  }
);


// get report candidate interview feedback List
export const getReportCandidateInterviewList = createAsyncThunk(
  `${name}/getReportCandidateInterviewList`,
  async (payload = {}) => {
    payload = {
      ...payload,
      pageNumber: 1,
      pageSize: 10,
    };
    console.log(payload);
    // @hiringmanager='cait',@date='2025-07-07',@interviewstatusid=7,@jobtitle='st',@candidate='St'
    const GET_CUST_REPORT_CAND_INTERVIEW_FEEDBACK_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }/Report/GetReportBySP?storedProcedure=Report_CandidateInterviewFeedback&parameter=@hiringmanager=${payload.hiringmanager ? payload.hiringmanager : null},@jobtitle=${payload.jobtitle ? payload.jobtitle : null},@candidate=${payload.candidate ? payload.candidate : null},@company=${payload.companyid ? payload.companyid : null}`;
    return await fetchWrapper.get(GET_CUST_REPORT_CAND_INTERVIEW_FEEDBACK_LIST_END_POINT);
  }
);


export const getHiringMangerList = createAsyncThunk(
  `${name}/getHiringMangerList`,
  async (companyIdId = {}) => {
    const GET_CUST_REPORT_CAND_INTERVIEW_FEEDBACK_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }Common/GetCommonDropdown?searchText=userListByCompany&commonId=${companyIdId}`;
    return await fetchWrapper.get(GET_CUST_REPORT_CAND_INTERVIEW_FEEDBACK_LIST_END_POINT);
  }
);

export const getHiringMangerListDynamic = createAsyncThunk(
  `${name}/getHiringMangerListDynamic`,
  async ({companyId, endpoint = 'userListByCompany'}) => {
    const GET_CUST_REPORT_CAND_INTERVIEW_FEEDBACK_LIST_END_POINT = `${process.env.REACT_APP_NEW_API_URL
      }Common/GetCommonDropdown?searchText=${endpoint}&commonId=${companyId}`;
    return await fetchWrapper.get(GET_CUST_REPORT_CAND_INTERVIEW_FEEDBACK_LIST_END_POINT);
  }
);

// get job dropdown list
export const getJobDropdownByUserid = createAsyncThunk(
  `${name}/getJobDropdownByUserid`,
  async ({search = "", userId = null}) => {
    // const GET_JOB_DROPDOWN_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Job/GetJobDropdown`;
    let companyid = Number(localStorage.getItem("companyid"));
    const userIdParam = userId ? `&commonid=${userId}` : "";
    const base = `${process.env.REACT_APP_NEW_API_URL}/Common/GetCommonDropdown?searchText=JobListByUserId`;
    var GET_JOB_DROPDOWN_END_POINT = search
      ? `${base}&searchBy=${encodeURIComponent(search)}${userIdParam}`
      : `${base}${userIdParam}`;
      
    return await fetchWrapper.get(GET_JOB_DROPDOWN_END_POINT);
  }
);
// Create the slice
const customerReportSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    jobList: [],
    schdInterviewList: [],
    interviewedCandidateList: [],
    jobAgingList: [],
    matchedCandidateList: [],
    candidateStatusList: [],
    jobDropDownList: [],
    candidateDropDownList: [],
    recommendedJobStatusList: [],
    jobDetail: [],
    scheduleInterviewDetail: [],
    subsidiaryList: [],
  },
  reducers: {
    // logout: (state, { payload }) => {
    //   state.user = {};
    // },
  },

  extraReducers: {
    // open jobs
    [getCustReportJobList.pending]: (state) => {
      state.loading = true;
      state.jobList = [];
    },
    [getCustReportJobList.fulfilled]: (state, action) => {
      state.loading = false;
      state.jobList = action?.payload?.data;
    },
    [getCustReportJobList.rejected]: (state, action) => {
      state.loading = false;
    },

    // schedule interview list
    [getCustReportScheduleIVList.pending]: (state) => {
      state.loading = true;
      state.schdInterviewList = [];
    },
    [getCustReportScheduleIVList.fulfilled]: (state, action) => {
      state.loading = false;
      state.schdInterviewList = action?.payload?.data;
    },
    [getCustReportScheduleIVList.rejected]: (state, action) => {
      state.loading = false;
    },

    // interviewed candidate list
    [getCustReportIVDCandList.pending]: (state) => {
      state.loading = true;
      state.interviewedCandidateList = [];
    },
    [getCustReportIVDCandList.fulfilled]: (state, action) => {
      state.loading = false;
      state.interviewedCandidateList = action?.payload?.data;
    },
    [getCustReportIVDCandList.rejected]: (state, action) => {
      state.loading = false;
    },

    // job aging list
    [getCustReportJobAgingList.pending]: (state) => {
      state.loading = true;
      state.jobAgingList = [];
    },
    [getCustReportJobAgingList.fulfilled]: (state, action) => {
      state.loading = false;
      state.jobAgingList = action?.payload?.data;
    },
    [getCustReportJobAgingList.rejected]: (state, action) => {
      state.loading = false;
    },

    // matched candidate list
    [getCustReportMatchedCandList.pending]: (state) => {
      state.loading = true;
      state.matchedCandidateList = [];
    },
    [getCustReportMatchedCandList.fulfilled]: (state, action) => {
      state.loading = false;
      state.matchedCandidateList = action?.payload?.data;
    },
    [getCustReportMatchedCandList.rejected]: (state, action) => {
      state.loading = false;
    },

    // candidate status list
    [getCustReporCandStatList.pending]: (state) => {
      state.loading = true;
      state.candidateStatusList = [];
    },
    [getCustReporCandStatList.fulfilled]: (state, action) => {
      state.loading = false;
      state.candidateStatusList = action?.payload?.data;
    },
    [getCustReporCandStatList.rejected]: (state, action) => {
      state.loading = false;
    },

    // candidate dropdown list
    [getCandidateDropdown.pending]: (state) => {
      state.candidateDropDownList = [];
    },
    [getCandidateDropdown.fulfilled]: (state, action) => {
      state.candidateDropDownList = action?.payload?.data;
    },

    [getCandidateSearchDropdown.fulfilled]: (state, action) => {
      // normalize to consistent shape used by selectors
      state.candidateDropDownList =
        action?.payload?.data?.map((item) => ({
          candidatename: item.name || item.candidatename || "",
          candidateid: item.id || item.candidateid,
        })) || [];
    },

    [getCandidateDropdown.rejected]: (state, action) => { },

    // job dropdown list
    [getJobDropdown.pending]: (state) => {
      state.jobDropDownList = [];
    },
    [getJobDropdown.fulfilled]: (state, action) => {
      state.jobDropDownList = action?.payload?.data?.map((item => ({
        jobtitle: item.name,
        jobid: item.id
      })));
      // state.jobDropDownList = action?.payload?.data;
    },
    [getJobDropdown.rejected]: (state, action) => { },

    // recommended status dropdown list
    [getRecommendedJobStatus.pending]: (state) => {
      state.recommendedJobStatusList = [];
    },
    [getRecommendedJobStatus.fulfilled]: (state, action) => {
      state.recommendedJobStatusList = action?.payload?.data;
    },
    [getRecommendedJobStatus.rejected]: (state, action) => { },

    // scheduled candidates for customer dropdown list
    [getScheduledCandidatesForCustomerDropdown.pending]: (state) => {
      state.candidateDropDownList = [];
    },
    [getScheduledCandidatesForCustomerDropdown.fulfilled]: (state, action) => {
      state.candidateDropDownList = action?.payload?.data;
    },
    [getScheduledCandidatesForCustomerDropdown.rejected]: (state, action) => { },

    // customer report job detail
    [getCustReportJobDetail.pending]: (state) => {
      state.jobDetail = [];
    },
    [getCustReportJobDetail.fulfilled]: (state, { payload = {} }) => {
      let data = [];
      data.push(payload.data);
      state.jobDetail = data;
    },
    [getCustReportJobDetail.rejected]: (state, action) => { },
    // customer report schdeule interview detail
    [getCustReportSchdIntvDetail.pending]: (state) => {
      state.scheduleInterviewDetail = [];
    },
    [getCustReportSchdIntvDetail.fulfilled]: (state, { payload = {} }) => {
      state.scheduleInterviewDetail = payload?.data?.scheduledInterviewList
        ? payload?.data?.scheduledInterviewList
        : [];
    },
    [getCustReportSchdIntvDetail.rejected]: (state, action) => { },
    // customer report subsidiary list
    [getReportSubsidiaryList.pending]: (state) => {
      state.subsidiaryList = [];
    },
    [getReportSubsidiaryList.fulfilled]: (state, { payload = {} }) => {
      state.subsidiaryList = payload?.data ? payload?.data : [];
    },
    [getReportSubsidiaryList.rejected]: (state, action) => { },

    // Candidate interview Feedback
    [getReportCandidateInterviewList.pending]: (state) => {
      state.candidateInterviewFeedbacks = [];
    },
    [getReportCandidateInterviewList.fulfilled]: (state, { payload = {} }) => {
      state.candidateInterviewFeedbacks = payload?.data;
    },
    [getReportCandidateInterviewList.rejected]: (state, action) => { },

    [getHiringMangerList.pending]: (state) => {
      state.hiringmangers = [];
    },
    [getHiringMangerList.fulfilled]: (state, { payload = {} }) => {
      state.hiringmangers = payload?.data;
    },
    [getHiringMangerList.rejected]: (state, action) => { },

    [getHiringMangerListDynamic.pending]: (state) => {
      state.hiringmangers = [];
    },
    [getHiringMangerListDynamic.fulfilled]: (state, { payload = {} }) => {
      state.hiringmangers = payload?.data;
    },
    [getHiringMangerListDynamic.rejected]: (state, action) => { },

    // job dropdown list
    [getJobDropdownByUserid.pending]: (state) => {
      state.jobDropDownList = [];
    },
    [getJobDropdownByUserid.fulfilled]: (state, action) => {
      state.jobDropDownList = action?.payload?.data?.map((item => ({
        jobtitle: item.name,
        jobid: item.id
      })));
      // state.jobDropDownList = action?.payload?.data;
    },
    [getJobDropdownByUserid.rejected]: (state, action) => { },
  },

});

// Export the actions and reducer
export const customerReportActions = {
  ...customerReportSlice.actions,
  getCustReportJobList, // Export the async customer report job list action
  getCustReportScheduleIVList,
  getCustReportIVDCandList,
  getCustReportJobAgingList,
  getCustReportMatchedCandList,
  getCustReporCandStatList,
  getCandidateDropdown,
  getCandidateSearchDropdown,
  getJobDropdown,
  getRecommendedJobStatus,
  getScheduledCandidatesForCustomerDropdown,
  getCustReportJobDetail,
  getCustReportSchdIntvDetail,
  getReportSubsidiaryList,
  getReportCandidateInterviewList,
  getHiringMangerList,
  getHiringMangerListDynamic,
  getJobDropdownByUserid
};

export const customerReportReducer = customerReportSlice.reducer;
