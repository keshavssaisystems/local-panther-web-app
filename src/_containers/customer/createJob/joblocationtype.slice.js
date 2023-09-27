import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "jobLocationType";

// getJobLocationTypeThunk thunk
export const getJobLocationTypeThunk = createAsyncThunk(
  `${name}/getJobLocationTypeThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=JobLocationType`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// Create the slice
const jobLocationTypeSlice = createSlice({
  name,
  initialState: {
    jobLocationType: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getJobLocationTypeThunk.pending]: (state) => {
      state.loading = true;
    },
    [getJobLocationTypeThunk.fulfilled]: (state, action) => {
      state.jobLocationType = action.payload.data;
      state.loading = false;
    },
    [getJobLocationTypeThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const jobLocationTypeActions = {
  ...jobLocationTypeSlice.actions,
  getJobLocationTypeThunk,
};

export const jobLocationTypeReducer = jobLocationTypeSlice.reducer;
