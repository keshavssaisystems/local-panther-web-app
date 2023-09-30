import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "hiringTimeline";

// getHiringTimelineThunk thunk
export const getHiringTimelineThunk = createAsyncThunk(
  `${name}/getHiringTimelineThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=hiringTimeline`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// Create the slice
const hiringTimelineSlice = createSlice({
  name,
  initialState: {
    hiringTimeline: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getHiringTimelineThunk.pending]: (state) => {
      state.loading = true;
    },
    [getHiringTimelineThunk.fulfilled]: (state, action) => {
      state.hiringTimeline = action.payload.data;
      state.loading = false;
    },
    [getHiringTimelineThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const hiringTimelineActions = {
  ...hiringTimelineSlice.actions,
  getHiringTimelineThunk,
};

export const hiringTimelineReducer = hiringTimelineSlice.reducer;
