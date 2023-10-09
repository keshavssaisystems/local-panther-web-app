import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "scheduleInterview";

// getDurationThunk thunk
export const getDurationThunk = createAsyncThunk(
  `${name}/getDurationThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=duration`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// getScheduleInterviewThunk thunk
export const getScheduleInterviewThunk = createAsyncThunk(
  `${name}/getScheduleInterviewThunk`,
  async (selectedJobId) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?jobId=${selectedJobId}&isActive=true&isPaginationRequired=false`;
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
  async ({ pageNo, start, end }) => {
    const UPCOMING_INTEVRIEW_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?pageSize=5&pageNumber=${pageNo}&isActive=true&startDate=${start}&endDate=${end}`;
    return await fetchWrapper.get(UPCOMING_INTEVRIEW_END_POINT);
  }
);

// getUpcomingInterviewListWOPaginationThunk thunk
export const getUpcomingInterviewListWOPaginationThunk = createAsyncThunk(
  `${name}/getUpcomingInterviewListWOPaginationThunk`,
  async ({ start, end }) => {
    const UPCOMING_INTEVRIEW_END_POINT_V2 = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?pageNumber=1&isActive=true&startDate=${start}&endDate=${end}&isPaginationRequired=false`;
    return await fetchWrapper.get(UPCOMING_INTEVRIEW_END_POINT_V2);
  }
);

// updateInterviewNotesThunk thunk
export const updateInterviewNotesThunk = createAsyncThunk(
  `${name}/updateInterviewNotesThunk`,
  async ({ scheduleinterviewid, notesdata }) => {
    const UPDATE_INTERVIEW_NOTES_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/TakeInterviewNotes/${scheduleinterviewid}`;
    return await fetchWrapper.put(UPDATE_INTERVIEW_NOTES_END_POINT, notesdata);
  }
);

// updateInterviewerListThunk thunk
export const updateInterviewerListThunk = createAsyncThunk(
  `${name}/updateInterviewerListThunk`,
  async ({ scheduleinterviewid, invitedata }) => {
    const UPDATE_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/InviteToInterview/${scheduleinterviewid}`;
    return await fetchWrapper.put(UPDATE_INTERVIEWER_END_POINT, invitedata);
  }
);

// cancelInterviewThunk thunk
export const cancelInterviewThunk = createAsyncThunk(
  `${name}/cancelInterviewThunk`,
  async ({ scheduleinterviewid, payload }) => {
    const CANCEL_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/cancelInterview/${scheduleinterviewid}`;
    return await fetchWrapper.put(CANCEL_INTERVIEWER_END_POINT, payload);
  }
);

// Create the slice
const scheduleInterviewSlice = createSlice({
  name,
  initialState: {
    duration: [],
    scheduleInterview: [],
    upcomingInterview: [],
    upcomingInterviewWOPagination: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getDurationThunk.pending]: (state) => {
      state.loading = true;
    },
    [getDurationThunk.fulfilled]: (state, action) => {
      state.duration = action.payload.data;
      state.loading = false;
    },
    [getDurationThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
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
    [getUpcomingInterviewListWOPaginationThunk.pending]: (state) => {
      state.loading = true;
    },
    [getUpcomingInterviewListWOPaginationThunk.fulfilled]: (state, action) => {
      state.upcomingInterviewWOPagination = action.payload.data;
      state.loading = false;
    },
    [getUpcomingInterviewListWOPaginationThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [updateInterviewNotesThunk.pending]: (state) => {
      state.loading = true;
    },
    [updateInterviewNotesThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [updateInterviewNotesThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [updateInterviewerListThunk.pending]: (state) => {
      state.loading = true;
    },
    [updateInterviewerListThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [updateInterviewerListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [cancelInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [cancelInterviewThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [cancelInterviewThunk.rejected]: (state, action) => {
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
  getUpcomingInterviewListWOPaginationThunk,
  getDurationThunk,
  updateInterviewNotesThunk,
  updateInterviewerListThunk,
  cancelInterviewThunk,
};

export const scheduleInterviewReducer = scheduleInterviewSlice.reducer;
