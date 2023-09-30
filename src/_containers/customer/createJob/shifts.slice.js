import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "shift";

// getShiftThunk thunk
export const getShiftThunk = createAsyncThunk(
  `${name}/getShiftThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=shifts`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// Create the slice
const shiftSlice = createSlice({
  name,
  initialState: {
    shift: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getShiftThunk.pending]: (state) => {
      state.loading = true;
    },
    [getShiftThunk.fulfilled]: (state, action) => {
      state.shift = action.payload.data;
      state.loading = false;
    },
    [getShiftThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const shiftActions = {
  ...shiftSlice.actions,
  getShiftThunk,
};

export const shiftReducer = shiftSlice.reducer;
