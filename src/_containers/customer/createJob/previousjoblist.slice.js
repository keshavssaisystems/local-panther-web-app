import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "previousJobList";

// getPreviousJobListThunk thunk
export const getPreviousJobListThunk = createAsyncThunk(
  `${name}/getPreviousJobListThunk`,
  async ({ pageNo, searchText }) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job?pageSize=5&pageNumber=${pageNo}&searchText=${searchText}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

// Create the slice
const previousJobListSlice = createSlice({
  name,
  initialState: {
    previousJobList: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getPreviousJobListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPreviousJobListThunk.fulfilled]: (state, action) => {
      state.previousJobList = action.payload.data;
      state.loading = false;
    },
    [getPreviousJobListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const previousJobListActions = {
  ...previousJobListSlice.actions,
  getPreviousJobListThunk,
};

export const previousJobListReducer = previousJobListSlice.reducer;
