import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "profileSkills";

// login thunk
export const updateSkillThunk = createAsyncThunk(
  `${name}/updateSkillThunk`,
  async ({ id, payload, userId }) => {
    const SKILL_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateSkill/UpdateCandidateSkill/${id}/${userId}`;
    return await fetchWrapper.put(SKILL_END_POINT, payload);
  }
);

export const deleteSkillThunk = createAsyncThunk(
  `${name}/deleteSkillThunk`,
  async (id) => {
    const SKILL_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateSkill/${id}`;
    return await fetchWrapper.delete(SKILL_END_POINT);
  }
);

export const getPopularSkills = createAsyncThunk(
  `${name}/getPopularSkills`,
  async () => {
    const SKILL_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=PopularSkills`;
    return await fetchWrapper.get(SKILL_END_POINT);
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
    [getPopularSkills.pending]: (state, { payload }) => {
      state.error = null;
    },
    [getPopularSkills.fulfilled]: (state, action) => {
      let filtered_data = action?.payload?.data.map((rest) => {
        return {
          value: rest.id,
          label: rest.name,
        };
      });

      state.skill_data_profile = filtered_data;
    },
    [getPopularSkills.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const profileSkillsActions = {
  ...profileSkillSlice.actions,
  updateSkillThunk,
  deleteSkillThunk,
  getPopularSkills,
};

export const profileSkillsReducer = profileSkillSlice.reducer;
