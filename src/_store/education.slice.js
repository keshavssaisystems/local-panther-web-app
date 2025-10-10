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

export const addLevelOfEducation = createAsyncThunk(
  `${name}/addLevelOfEducation`,
  async (payload) => {
    const ADDLOED_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/LevelOfEducations`;
    return await fetchWrapper.post(ADDLOED_END_POINT, payload);
  }
);

export const addCertification = createAsyncThunk(
  `${name}/addCertification`,
  async (payload) => {
    const ADD_CERTIFICATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CertificationTypes/AddCertificationTypesList`;
    return await fetchWrapper.post(ADD_CERTIFICATION_END_POINT, payload);
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
    [updateEducationThunk.fulfilled]: (state, payload) => { },
    [updateEducationThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [addEducationThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addEducationThunk.fulfilled]: (state, payload) => { },
    [addEducationThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [deleteEducationThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [deleteEducationThunk.fulfilled]: (state, payload) => { },
    [deleteEducationThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [addLevelOfEducation.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addLevelOfEducation.fulfilled]: (state, payload) => { },
    [addLevelOfEducation.rejected]: (state, action) => {
      state.error = action.error;
    },
    [addCertification.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addCertification.fulfilled]: (state, payload) => { },
    [addCertification.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export const educationDetailsSlice = {
  ...educationDataSlice.actions,
  addEducationThunk,
  updateEducationThunk,
  deleteEducationThunk,
  addLevelOfEducation,
  addCertification
};

export const educationDataReducer = educationDetailsSlice.reducer;
