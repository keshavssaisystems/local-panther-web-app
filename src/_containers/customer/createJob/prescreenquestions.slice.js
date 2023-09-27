import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "preScreenQuestion";

// getPreScreenQuestionThunk thunk
export const getPreScreenQuestionThunk = createAsyncThunk(
  `${name}/getPreScreenQuestionThunk`,
  async (payload) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/PrescreenQuestion/GetPrescreenQuestionList`;
    return await fetchWrapper.get(PRESCREEN_END_POINT, payload);
  }
);

// Create the slice
const preScreenQuestionSlice = createSlice({
  name,
  initialState: {
    preScreenQuestion: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getPreScreenQuestionThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPreScreenQuestionThunk.fulfilled]: (state, action) => {
      state.preScreenQuestion = action.payload.data;
      state.loading = false;
    },
    [getPreScreenQuestionThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const preScreenQuestionActions = {
  ...preScreenQuestionSlice.actions,
  getPreScreenQuestionThunk,
};

export const preScreenQuestionReducer = preScreenQuestionSlice.reducer;
