import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "candidateDashboard";

// getSchedules thunk
export const getSchedules = createAsyncThunk(
  `${name}/getSchedules`,
  async ({ candidateId }) => {
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateDashboard/UpcomingScheduleInterview/${candidateId}`;
    return await fetchWrapper.get(DASHBOARD_END_POINT);
  }
);

// getDashboardCount thunk
export const getDashboardCount = createAsyncThunk(
  `${name}/getDashboardCount`,
  async ({ candidateId }) => {
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateDashboard/CandidateDasboardCount/${candidateId}`;
    return await fetchWrapper.get(DASHBOARD_END_POINT);
  }
);

export const getToDo = createAsyncThunk(
  `${name}/getToDo`,
  async ({ userId }) => {
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Todo/GetByUserId?userId=${userId}`;
    return await fetchWrapper.get(DASHBOARD_END_POINT);
  }
);

export const createToDo = createAsyncThunk(
  `${name}/createToDo`,
  async ({ data }) => {
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Todo`;
    return await fetchWrapper.post(DASHBOARD_END_POINT, data);
  }
);

export const updateToDo = createAsyncThunk(
  `${name}/updateToDo`,
  async ({ id, data }) => {
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Todo/${id}`;
    return await fetchWrapper.put(DASHBOARD_END_POINT, data);
  }
);
export const deleteToDo = createAsyncThunk(
  `${name}/deleteToDo`,
  async ({ id }) => {
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Todo/${id}`;
    return await fetchWrapper.delete(DASHBOARD_END_POINT);
  }
);

// Create the slice
const candidateDashboardSlice = createSlice({
  name,
  initialState: {
    dashboardCounts: [],
    dashboardGraphData: [],
    toDoList: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getSchedules.pending]: (state) => {
      state.loading = true;
    },
    [getSchedules.fulfilled]: (state, action) => {
      state.dashboardGraphData = action.payload.data;
      state.loading = false;
    },
    [getSchedules.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getDashboardCount.pending]: (state) => {
      state.loading = true;
    },
    [getDashboardCount.fulfilled]: (state, action) => {
      state.dashboardCounts = action.payload.data;
      state.loading = false;
    },
    [getDashboardCount.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },

    [createToDo.pending]: (state) => {
      state.loading = true;
    },
    [createToDo.fulfilled]: (state, action) => {
      state.dashboardCounts = action.payload.data;
      state.loading = false;
    },
    [createToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },

    [getToDo.pending]: (state) => {
      state.loading = true;
    },
    [getToDo.fulfilled]: (state, action) => {
      state.toDoList = action.payload.data;
      state.loading = false;
    },
    [getToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },

    [updateToDo.pending]: (state) => {
      state.loading = true;
    },
    [updateToDo.fulfilled]: (state, action) => {},
    [updateToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [deleteToDo.pending]: (state) => {
      state.loading = true;
    },
    [deleteToDo.fulfilled]: (state, action) => {},
    [deleteToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const candidateDashboardActions = {
  ...candidateDashboardSlice.actions,
  getSchedules,
  getDashboardCount,
  createToDo,
  getToDo,
  updateToDo,
  deleteToDo,
};

export const candidateDashboardReducer = candidateDashboardSlice.reducer;
