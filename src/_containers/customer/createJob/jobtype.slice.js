import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "jobType";

// getJobTypeThunk thunk
export const getJobTypeThunk = createAsyncThunk(
  `${name}/getJobTypeThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=JobType`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// Create the slice
const jobTypeSlice = createSlice({
  name,
  initialState: {
    jobType: [],
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
  },
});

// Export the actions and reducer
export const jobTypeActions = {
  ...jobTypeSlice.actions,
  getJobTypeThunk,
};

export const jobTypeReducer = jobTypeSlice.reducer;
