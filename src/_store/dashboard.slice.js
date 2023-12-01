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

// getAlerts thunk
export const getAlerts = createAsyncThunk(`${name}/getAlerts`, async () => {
  const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Notification/GetNotifications`;
  return await fetchWrapper.get(DASHBOARD_END_POINT);
});

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

export const getLatestJobs = createAsyncThunk(
  `${name}/getLatestJobs`,
  async ({ candidateId }) => {
    const DASHBOARD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateDashboard/LatestJob/${candidateId}`;
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

export const deleteNotifications = createAsyncThunk(
  `${name}/deleteNotifications`,
  async ({ id }) => {
    const DEL_NOT_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Notification/DeleteNotification/${id}`;
    return await fetchWrapper.delete(DEL_NOT_END_POINT);
  }
);

export const readNotification = createAsyncThunk(
  `${name}/readNotification`,
  async ({ id }) => {
    const READ_NOTI_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Notification/UpdateNotification?notificationId=${id}
    `;
    return await fetchWrapper.post(READ_NOTI_END_POINT);
  }
);

// Create the slice
const candidateDashboardSlice = createSlice({
  name,
  initialState: {
    dashboardCounts: [],
    dashboardGraphData: [],
    toDoList: [],
    alertsList: [],
    candidateJobList: [],
    loading: false,
    todoLoader: false,
    alertsLoader: false,
    schedulesLoader: false,
    jobsLoader: false,
  },
  reducers: {},

  extraReducers: {
    [getSchedules.pending]: (state) => {
      state.schedulesLoader = true;
    },
    [getSchedules.fulfilled]: (state, action) => {
      state.dashboardGraphData = action.payload.data;
      state.schedulesLoader = false;
    },
    [getSchedules.rejected]: (state, action) => {
      state.error = action.error;
      state.schedulesLoader = false;
    },
    [getDashboardCount.pending]: (state) => {},
    [getDashboardCount.fulfilled]: (state, action) => {
      state.dashboardCounts = action.payload.data;
    },
    [getDashboardCount.rejected]: (state, action) => {
      state.error = action.error;
    },

    [createToDo.pending]: (state) => {
      state.todoLoader = true;
    },
    [createToDo.fulfilled]: (state, action) => {
      state.dashboardCounts = action.payload.data;
      state.todoLoader = false;
    },
    [createToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.todoLoader = false;
    },

    [getToDo.pending]: (state) => {
      state.todoLoader = true;
    },
    [getToDo.fulfilled]: (state, action) => {
      state.toDoList = action.payload.data;
      state.todoLoader = false;
    },
    [getToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.todoLoader = false;
    },

    [updateToDo.pending]: (state) => {
      state.todoLoader = true;
    },
    [updateToDo.fulfilled]: (state, action) => {
      state.todoLoader = false;
    },
    [updateToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.todoLoader = false;
    },
    [deleteToDo.pending]: (state) => {
      state.todoLoader = true;
    },
    [deleteToDo.fulfilled]: (state, action) => {
      state.todoLoader = false;
    },
    [deleteToDo.rejected]: (state, action) => {
      state.error = action.error;
      state.todoLoader = false;
    },
    [getAlerts.pending]: (state) => {
      state.alertsLoader = true;
      state.alertsList = [];
    },
    [getAlerts.fulfilled]: (state, action) => {
      state.alertsList = action.payload.data;
      state.alertsLoader = false;
    },
    [getAlerts.rejected]: (state, action) => {
      state.error = action.error;
      state.alertsLoader = false;
    },

    [getLatestJobs.pending]: (state) => {
      state.jobsLoader = true;
    },
    [getLatestJobs.fulfilled]: (state, action) => {
      state.candidateJobList = action.payload.data;
      state.jobsLoader = false;
    },
    [getLatestJobs.rejected]: (state, action) => {
      state.error = action.error;
      state.jobsLoader = false;
    },
    [deleteNotifications.pending]: (state) => {
      // state.alertsLoader = true;
    },
    [deleteNotifications.fulfilled]: (state, action) => {
      let data = [...state.alertsList];
      let ind = data.findIndex((rec) => rec.queueid === action?.meta?.arg?.id);
      if (ind !== -1) {
        data.splice(ind, 1);
        state.alertsList = data;
      }

      // state.alertsLoader = false;
    },
    [deleteNotifications.rejected]: (state, action) => {
      // state.alertsLoader = false;
    },
    [readNotification.pending]: (state) => {
      // state.alertsLoader = true;
    },
    [readNotification.fulfilled]: (state, action) => {
      let data = [...state.alertsList];
      let ind = data.findIndex((rec) => rec.queueid === action?.meta?.arg?.id);
      if (ind !== -1) {
        data[ind].notificationstatusid = 3;
        state.alertsList = data;
      }

      // state.alertsLoader = false;
    },
    [readNotification.rejected]: (state, action) => {
      // state.alertsLoader = false;
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
  getAlerts,
  getLatestJobs,
  deleteNotifications,
  readNotification,
};

export const candidateDashboardReducer = candidateDashboardSlice.reducer;
