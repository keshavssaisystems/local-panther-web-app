import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "workSchedule";

// getWorkScheduleThunk thunk
export const getWorkScheduleThunk = createAsyncThunk(
  `${name}/getWorkScheduleThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=workSchedules`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// Create the slice
const workScheduleSlice = createSlice({
  name,
  initialState: {
    workSchedule: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
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
export const workScheduleActions = {
  ...workScheduleSlice.actions,
  getWorkScheduleThunk,
};

export const workScheduleReducer = workScheduleSlice.reducer;
