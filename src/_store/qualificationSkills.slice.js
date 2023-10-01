import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "qualification";

export const updateQualificationThunk = createAsyncThunk(
  `${name}/updateQualificationThunk`,
  async ({ id, qualification_data }) => {
    console.log(qualification_data);
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateQualifications/${id}`;
    return await fetchWrapper.put(LOGIN_END_POINT, qualification_data);
  }
);

export const addQualificationThunk = createAsyncThunk(
  `${name}/addQualificationThunk`,
  async (qualification_data) => {
    console.log(qualification_data);
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateQualifications/AddCandidateQualificationList`;
    return await fetchWrapper.post(LOGIN_END_POINT, qualification_data);
  }
);

const qualificationSkillSlice = createSlice({
  name,
  initialState: {
    skill_data_profile: [],
  },
  reducers: {},

  extraReducers: {
    [updateQualificationThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [updateQualificationThunk.fulfilled]: (state, payload) => {},
    [updateQualificationThunk.rejected]: (state, action) => {
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

export const qualificationSlice = {
  ...qualificationSkillSlice.actions,
  addQualificationThunk,
  updateQualificationThunk,
};

export const qualificationsReducer = qualificationSlice.reducer;
