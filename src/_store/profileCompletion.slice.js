import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "profileCompletion";


export const updateProfileThunk = createAsyncThunk(
  `${name}/updateProfileThunk`,
  async ({ payload }) => {
    const Chatbot_End_Point = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/Update_Candidate_Profile_By_ChatBot_Json`;
    return await fetchWrapper.post(Chatbot_End_Point, payload);
  }
);
// Create the slice
const profileCompletionSlice = createSlice({
  name,
  initialState: {
  },
  reducers: {},

  extraReducers: {
    [updateProfileThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [updateProfileThunk.fulfilled]: (state, payload) => { },
    [updateProfileThunk.rejected]: (state, action) => {
      state.error = action.error;
    }
  },
});

export const profileCompletionActions = {
  updateProfileThunk
};
export const profileCompletionReducer = profileCompletionSlice.reducer;
