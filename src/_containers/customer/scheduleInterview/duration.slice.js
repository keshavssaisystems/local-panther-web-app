import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "duration";

// getDurationThunk thunk
export const getDurationThunk = createAsyncThunk(
  `${name}/getDurationThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=duration`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// Create the slice
const durationSlice = createSlice({
  name,
  initialState: {
    duration: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getDurationThunk.pending]: (state) => {
      state.loading = true;
    },
    [getDurationThunk.fulfilled]: (state, action) => {
      state.duration = action.payload.data;
      state.loading = false;
    },
    [getDurationThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const durationActions = {
  ...durationSlice.actions,
  getDurationThunk,
};

export const durationReducer = durationSlice.reducer;
