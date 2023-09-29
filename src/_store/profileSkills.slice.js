import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "profile-skills";

// login thunk
// const candidateId = JSON.parse(localStorage.getItem("userDetails")).UserId;
export const updateSkillThunk = createAsyncThunk(
  `${name}/updateSkillThunk`,
  async ({ id, payload, userId }) => {
    const SKILL_END_POINT = `${process.env.REACT_APP_PANTHER_URL}/api/CandidateSkill/UpdateCandidateSkill/${id}/${userId}`;
    return await fetchWrapper.put(SKILL_END_POINT, payload);
  }
);

export const addQualificationThunk = createAsyncThunk(
  `${name}/addQualificationThunk`,
  async (id, qualification_data) => {
    console.log(qualification_data);
    const LOGIN_END_POINT = `${process.env.REACT_APP_PANTHER_URL}/api/CandidateQualifications/${id}`;
    return await fetchWrapper.put(LOGIN_END_POINT, qualification_data);
  }
);

export const deleteSkillThunk = createAsyncThunk(
  `${name}/deleteSkillThunk`,
  async (id) => {
    debugger;
    console.log("triggered--");
    const SKILL_END_POINT = `${process.env.REACT_APP_PANTHER_URL}/api/CandidateSkill/${id}`;
    return await fetchWrapper.delete(SKILL_END_POINT);
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

    [deleteSkillThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [deleteSkillThunk.fulfilled]: (state, payload) => {},
    [deleteSkillThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [addQualificationThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addQualificationThunk.fulfilled]: (state, payload) => {},
    [addQualificationThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const profileSkillsActions = {
  ...profileSkillSlice.actions,
  updateSkillThunk,
  addQualificationThunk,
  deleteSkillThunk,
};

export const profileSkillsReducer = profileSkillsActions.reducer;
