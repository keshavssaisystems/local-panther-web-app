import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "education";

export const updateEducationThunk = createAsyncThunk(
  `${name}/updateEducationThunk`,
  async ({ id, education_data }) => {
    console.log(education_data);
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateEducation/${id}`;
    return await fetchWrapper.put(LOGIN_END_POINT, education_data);
  }
);

export const addEducationThunk = createAsyncThunk(
  `${name}/addEducationThunk`,
  async (qualification_data) => {
    console.log(qualification_data);
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateEducation/AddCandidateEducationList`;
    return await fetchWrapper.post(LOGIN_END_POINT, qualification_data);
  }
);

export const deleteEducationThunk = createAsyncThunk(
  `${name}/deleteEducationThunk`,
  async (id) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateEducation/${id}`;
    return await fetchWrapper.delete(LOGIN_END_POINT);
  }
);

const educationDataSlice = createSlice({
  name,
  initialState: {
    education_data_profile: [],
  },
  reducers: {},

  extraReducers: {
    [updateEducationThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [updateEducationThunk.fulfilled]: (state, payload) => {},
    [updateEducationThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [addEducationThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addEducationThunk.fulfilled]: (state, payload) => {},
    [addEducationThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [deleteEducationThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [deleteEducationThunk.fulfilled]: (state, payload) => {},
    [deleteEducationThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export const educationDetailsSlice = {
  ...educationDataSlice.actions,
  addEducationThunk,
  updateEducationThunk,
  deleteEducationThunk,
};

export const educationDataReducer = educationDetailsSlice.reducer;
