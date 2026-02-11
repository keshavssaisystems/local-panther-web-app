import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "profileCompletion";


export const updateProfileThunk = createAsyncThunk(
  `${name}/updateProfileThunk`,
  async ({ id, payload }) => {

    const SKILL_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateSkill/UpdateCandidateSkill/${id}`;
    return await fetchWrapper.put(SKILL_END_POINT, payload);
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
