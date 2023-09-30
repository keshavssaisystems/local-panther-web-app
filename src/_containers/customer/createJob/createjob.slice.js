import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "createjob";

// getCreatejobThunk thunk
export const getCreatejobThunk = createAsyncThunk(
  `${name}/getCreatejobThunk`,
  async (jobData) => {
    const CREATE_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/job`;
    return await fetchWrapper.post(CREATE_JOB_END_POINT, jobData);
  }
);

// Create the slice
const createjobSlice = createSlice({
  name,
  initialState: {
    createjob: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getCreatejobThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCreatejobThunk.fulfilled]: (state, action) => {
      state.createjob = action.payload.data;
      state.loading = false;
    },
    [getCreatejobThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const createjobActions = {
  ...createjobSlice.actions,
  getCreatejobThunk,
};

export const createjobReducer = createjobSlice.reducer;
