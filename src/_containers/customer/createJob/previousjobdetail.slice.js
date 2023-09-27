import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "previousJobDetail";

// getPreviousJobDetailThunk thunk
export const getPreviousJobDetailThunk = createAsyncThunk(
  `${name}/getPreviousJobDetailThunk`,
  async (jobId) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/GetJobDetails/${jobId}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

// Create the slice
const previousJobDetailSlice = createSlice({
  name,
  initialState: {
    previousJobDetail: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getPreviousJobDetailThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPreviousJobDetailThunk.fulfilled]: (state, action) => {
      state.previousJobDetail = action.payload.data;
      state.loading = false;
    },
    [getPreviousJobDetailThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const previousJobDetailActions = {
  ...previousJobDetailSlice.actions,
  getPreviousJobDetailThunk,
};

export const previousJobDetailReducer = previousJobDetailSlice.reducer;
