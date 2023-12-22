import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "dropdown";

// getJobTypeThunk thunk
export const getJobTypeThunk2 = createAsyncThunk(
  `${name}/getJobTypeThunk2`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=JobType`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getExperienceLevelThunk thunk
export const getExperienceLevelThunk2 = createAsyncThunk(
  `${name}/getExperienceLevelThunk2`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=experienceLevel`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getHiringTimelineThunk thunk
export const getHiringTimelineThunk = createAsyncThunk(
  `${name}/getHiringTimelineThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=hiringTimeline`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getJobLocationTypeThunk thunk
export const getJobLocationTypeThunk = createAsyncThunk(
  `${name}/getJobLocationTypeThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=JobLocationType`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getPayPeriodTypeThunk thunk
export const getPayPeriodTypeThunk = createAsyncThunk(
  `${name}/getPayPeriodTypeThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=payPeriodType`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getPreScreenQuestionThunk thunk
export const getPreScreenQuestionThunk = createAsyncThunk(
  `${name}/getPreScreenQuestionThunk`,
  async (payload) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/PrescreenQuestion/GetPrescreenQuestionList`;
    return await fetchWrapper.get(PRESCREEN_END_POINT, payload);
  }
);

// getShiftThunk thunk
export const getShiftThunk2 = createAsyncThunk(
  `${name}/getShiftThunk2`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=shifts`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getWorkScheduleThunk thunk
export const getWorkScheduleThunk2 = createAsyncThunk(
  `${name}/getWorkScheduleThunk2`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=workSchedules`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getCompanyListThunk thunk
export const getCompanyListThunk = createAsyncThunk(
  `${name}/getCompanyListThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Company/GetCompanyDropdown`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

export const getStatusListThunk = createAsyncThunk(
  `${name}/getStatusListThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=customerstatus`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

export const getCompanyListPublicThunk = createAsyncThunk(
  `${name}/getCompanyListPublicThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Company/GetCompanyDropdown_PublicAPI`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

export const getEmployeeCountThunk = createAsyncThunk(
  `${name}/getEmployeeCountThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=noofemployees`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// getFieldOfStudyThunk thunk
export const getFieldOfStudyThunk = createAsyncThunk(
  `${name}/getFieldOfStudyThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=fieldofstudy`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getLevelOFEducationThunk thunk
export const getLevelOFEducationThunk = createAsyncThunk(
  `${name}/getLevelOFEducationThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=levelofeducation`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);
// getStateListThunk thunk
export const getStateListThunk = createAsyncThunk(
  `${name}/getStateListThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=State`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getSubsidiaryListThunk thunk
export const getSubsidiaryListThunk = createAsyncThunk(
  `${name}/getSubsidiaryListThunk`,
  async (companyId) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Subsidiary/GetSubsidiaryDropdown?companyId=${companyId}`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// Create the slice
const dropdownSlice = createSlice({
  name,
  initialState: {
    jobType: [],
    experienceLevel: [],
    hiringTimeline: [],
    jobLocationType: [],
    payPeriodType: [],
    preScreenQuestion: [],
    shift: [],
    workSchedule: [],
    companyList: [],
    employeeList: [],
    stateList: [],
    statusList: [],
    levelOfEducationList: [],
    fieldOfStudyList: [],
    subsidiaryList: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getJobTypeThunk2.pending]: (state) => {
      state.loading = true;
    },
    [getJobTypeThunk2.fulfilled]: (state, action) => {
      state.jobType = action.payload.data;
      state.loading = false;
    },
    [getJobTypeThunk2.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getExperienceLevelThunk2.pending]: (state) => {
      state.loading = true;
    },
    [getExperienceLevelThunk2.fulfilled]: (state, action) => {
      state.experienceLevel = action.payload.data;
      state.loading = false;
    },
    [getExperienceLevelThunk2.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getHiringTimelineThunk.pending]: (state) => {
      state.loading = true;
    },
    [getHiringTimelineThunk.fulfilled]: (state, action) => {
      state.hiringTimeline = action.payload.data;
      state.loading = false;
    },
    [getHiringTimelineThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getJobLocationTypeThunk.pending]: (state) => {
      state.loading = true;
    },
    [getJobLocationTypeThunk.fulfilled]: (state, action) => {
      state.jobLocationType = action.payload.data;
      state.loading = false;
    },
    [getJobLocationTypeThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getPayPeriodTypeThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPayPeriodTypeThunk.fulfilled]: (state, action) => {
      state.payPeriodType = action.payload.data;
      state.loading = false;
    },
    [getPayPeriodTypeThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getPreScreenQuestionThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPreScreenQuestionThunk.fulfilled]: (state, action) => {
      state.preScreenQuestion = action.payload.data;
      state.loading = false;
    },
    [getPreScreenQuestionThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getShiftThunk2.pending]: (state) => {
      state.loading = true;
    },
    [getShiftThunk2.fulfilled]: (state, action) => {
      state.shift = action.payload.data;
      state.loading = false;
    },
    [getShiftThunk2.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getWorkScheduleThunk2.pending]: (state) => {
      state.loading = true;
    },
    [getWorkScheduleThunk2.fulfilled]: (state, action) => {
      state.workSchedule = action.payload.data;
      state.loading = false;
    },
    [getWorkScheduleThunk2.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getCompanyListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCompanyListThunk.fulfilled]: (state, action) => {
      state.companyList = action.payload.data;
      state.loading = false;
    },
    [getCompanyListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },

    [getStatusListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getStatusListThunk.fulfilled]: (state, action) => {
      state.statusList = action.payload.data;
      state.loading = false;
    },
    [getStatusListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },

    [getCompanyListPublicThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCompanyListPublicThunk.fulfilled]: (state, action) => {
      state.companyList = action.payload.data;
      state.loading = false;
    },
    [getCompanyListPublicThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },

    [getEmployeeCountThunk.pending]: (state) => {
      state.loading = true;
    },
    [getEmployeeCountThunk.fulfilled]: (state, action) => {
      state.employeeList = action.payload.data;
      state.loading = false;
    },
    [getEmployeeCountThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },

    [getStateListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getStateListThunk.fulfilled]: (state, action) => {
      state.stateList = action.payload.data;
      state.loading = false;
    },
    [getStateListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getFieldOfStudyThunk.pending]: (state) => {
      state.loading = true;
    },
    [getFieldOfStudyThunk.fulfilled]: (state, action) => {
      state.fieldOfStudyList = action.payload.data;
      state.loading = false;
    },
    [getFieldOfStudyThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getLevelOFEducationThunk.pending]: (state) => {
      state.loading = true;
    },
    [getLevelOFEducationThunk.fulfilled]: (state, action) => {
      state.levelOfEducationList = action.payload.data;
      state.loading = false;
    },
    [getLevelOFEducationThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getSubsidiaryListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getSubsidiaryListThunk.fulfilled]: (state, action) => {
      state.subsidiaryList = action.payload.data;
      state.loading = false;
    },
    [getSubsidiaryListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const dropdownActions = {
  ...dropdownSlice.actions,
  getJobTypeThunk2,
  getExperienceLevelThunk2,
  getHiringTimelineThunk,
  getJobLocationTypeThunk,
  getPayPeriodTypeThunk,
  getPreScreenQuestionThunk,
  getShiftThunk2,
  getWorkScheduleThunk2,
  getCompanyListThunk,
  getCompanyListPublicThunk,
  getStateListThunk,
  getEmployeeCountThunk,
  getStatusListThunk,
  getFieldOfStudyThunk,
  getLevelOFEducationThunk,
  getSubsidiaryListThunk,
};

export const dropdownReducer = dropdownSlice.reducer;
