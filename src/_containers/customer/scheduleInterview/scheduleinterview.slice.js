import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "scheduleInterview";

// getScheduleInterviewThunk thunk
export const getScheduleInterviewThunk = createAsyncThunk(
  `${name}/getScheduleInterviewThunk`,
  async ({ selectedJobId }) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/GetAccpetedCandidateWithScheduledDetails/${selectedJobId}?pageSize=10&pageNumber=1&isActive=true`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// postScheduleInterviewThunk thunk
export const postScheduleInterviewThunk = createAsyncThunk(
  `${name}/postScheduleInterviewThunk`,
  async (payload) => {
    const POST_SCHEDULED_INTEVRIEW_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview`;
    return await fetchWrapper.post(POST_SCHEDULED_INTEVRIEW_END_POINT, payload);
  }
);

// getUpcomingInterviewListThunk thunk
export const getUpcomingInterviewListThunk = createAsyncThunk(
  `${name}/getUpcomingInterviewListThunk`,
  async () => {
    const UPCOMING_INTEVRIEW_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?pageNumber=1&isActive=true&startDate=2023-09-30T00%3A00%3A00&endDate=2023-10-30T00%3A00%3A00&isPaginationRequired=false`;
    return await fetchWrapper.get(UPCOMING_INTEVRIEW_END_POINT);
  }
);

// Create the slice
const scheduleInterviewSlice = createSlice({
  name,
  initialState: {
    scheduleInterview: [],
    upcomingInterview: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getScheduleInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [getScheduleInterviewThunk.fulfilled]: (state, action) => {
      state.scheduleInterview = action.payload.data;
      state.loading = false;
    },
    [getScheduleInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [postScheduleInterviewThunk.pending]: (state, action) => {
      state.error = null;
    },
    [postScheduleInterviewThunk.fulfilled]: (state, action) => {
      state.error = null;
    },
    [postScheduleInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [getUpcomingInterviewListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getUpcomingInterviewListThunk.fulfilled]: (state, action) => {
      state.upcomingInterview = action.payload.data;
      state.loading = false;
    },
    [getUpcomingInterviewListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const scheduleInterviewActions = {
  ...scheduleInterviewSlice.actions,
  getScheduleInterviewThunk,
  postScheduleInterviewThunk,
  getUpcomingInterviewListThunk,
};

export const scheduleInterviewReducer = scheduleInterviewSlice.reducer;
