import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "profile-skills";

// login thunk
const candidateId = JSON.parse(localStorage.getItem("userDetails")).UserId;
export const updateSkillThunk = createAsyncThunk(
  `${name}/updateSkillThunk`,
  async (id, payload) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_PANTHER_URL}/apiCandidateSkill/UpdateCandidateSkill/${id}/${candidateId}`;
    return await fetchWrapper.put(LOGIN_END_POINT, payload);
  }
);

// Create the slice
const profileSkillSlice = createSlice({
  name,
  initialState: {
    skill_data_profile: [],
  },
  reducers: {},

  extraReducers: {
    [updateSkillThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [updateSkillThunk.fulfilled]: (state, payload) => {},
    [updateSkillThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const profileSkillsActions = {
  ...profileSkillSlice.actions,
  updateSkillThunk,
};

export const profileSkillsReducer = profileSkillsActions.reducer;
