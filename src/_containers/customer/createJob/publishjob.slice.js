import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "publishJob";

// getPublishJobThunk thunk
export const getPublishJobThunk = createAsyncThunk(
  `${name}/getPublishJobThunk`,
  async ({ jobId, payload }) => {
    const PUBLISH_JOB_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/PublishJob/${jobId}`;
    return await fetchWrapper.put(PUBLISH_JOB_END_POINT, payload);
  }
);

// Create the slice
const publishJobSlice = createSlice({
  name,
  initialState: {
    publishJob: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getPublishJobThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPublishJobThunk.fulfilled]: (state, action) => {
      state.publishJob = action;
      state.loading = false;
    },
    [getPublishJobThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const publishJobActions = {
  ...publishJobSlice.actions,
  getPublishJobThunk,
};

export const publishJobReducer = publishJobSlice.reducer;
