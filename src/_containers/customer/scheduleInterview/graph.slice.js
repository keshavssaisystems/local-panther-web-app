import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { msWrapper } from "_helpers";

// create slice name
const name = "graph";

// getgraphThunk thunk
export const getgraphThunk = createAsyncThunk(
  `${name}/getgraphThunk`,
  async ({ startDate, endDate }) => {
    const DROPDOWN_END_POINT = `https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${startDate}&enddatetime=${endDate}`;
    return await msWrapper.get(DROPDOWN_END_POINT);
  }
);

// Create the slice
const graphSlice = createSlice({
  name,
  initialState: {
    graph: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getgraphThunk.pending]: (state) => {
      state.loading = true;
    },
    [getgraphThunk.fulfilled]: (state, action) => {
      state.graph = action.payload;
      state.loading = false;
    },
    [getgraphThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const graphActions = {
  ...graphSlice.actions,
  getgraphThunk,
};

export const graphReducer = graphSlice.reducer;
