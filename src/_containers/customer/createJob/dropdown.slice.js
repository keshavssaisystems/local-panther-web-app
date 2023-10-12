import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "dropdown";

// getJobTypeThunk thunk
export const getJobTypeThunk = createAsyncThunk(
  `${name}/getJobTypeThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=JobType`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getExperienceLevelThunk thunk
export const getExperienceLevelThunk = createAsyncThunk(
  `${name}/getExperienceLevelThunk`,
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
export const getShiftThunk = createAsyncThunk(
  `${name}/getShiftThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=shifts`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// getWorkScheduleThunk thunk
export const getWorkScheduleThunk = createAsyncThunk(
  `${name}/getWorkScheduleThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=workSchedules`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
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
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getJobTypeThunk.pending]: (state) => {
      state.loading = true;
    },
    [getJobTypeThunk.fulfilled]: (state, action) => {
      state.jobType = action.payload.data;
      state.loading = false;
    },
    [getJobTypeThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getExperienceLevelThunk.pending]: (state) => {
      state.loading = true;
    },
    [getExperienceLevelThunk.fulfilled]: (state, action) => {
      state.experienceLevel = action.payload.data;
      state.loading = false;
    },
    [getExperienceLevelThunk.rejected]: (state, action) => {
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
    [getShiftThunk.pending]: (state) => {
      state.loading = true;
    },
    [getShiftThunk.fulfilled]: (state, action) => {
      state.shift = action.payload.data;
      state.loading = false;
    },
    [getShiftThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getWorkScheduleThunk.pending]: (state) => {
      state.loading = true;
    },
    [getWorkScheduleThunk.fulfilled]: (state, action) => {
      state.workSchedule = action.payload.data;
      state.loading = false;
    },
    [getWorkScheduleThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const dropdownActions = {
  ...dropdownSlice.actions,
  getJobTypeThunk,
  getExperienceLevelThunk,
  getHiringTimelineThunk,
  getJobLocationTypeThunk,
  getPayPeriodTypeThunk,
  getPreScreenQuestionThunk,
  getShiftThunk,
  getWorkScheduleThunk,
};

export const dropdownReducer = dropdownSlice.reducer;
