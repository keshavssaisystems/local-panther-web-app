import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "jobPreference";

export const updatejobPreferenceThunk = createAsyncThunk(
  `${name}/updatejobPreferenceThunk`,
  async ({ id, formDetails }) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateJobPreference/${id}`;
    return await fetchWrapper.put(LOGIN_END_POINT, formDetails);
  }
);

export const addjobPreferenceThunk = createAsyncThunk(
  `${name}/addjobPreferenceThunk`,
  async (qualification_data) => {
    console.log(qualification_data);
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateJobPreference`;
    return await fetchWrapper.post(LOGIN_END_POINT, qualification_data);
  }
);

export const deletejobPreferenceThunk = createAsyncThunk(
  `${name}/deletejobPreferenceThunk`,
  async (deleteId) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateJobPreference/${deleteId}`;
    return await fetchWrapper.delete(LOGIN_END_POINT);
  }
);

export const deleteProfileImgThunk = createAsyncThunk(
  `${name}/deleteProfileImg`,
  async (id) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/DeleteUserProfilePhoto/${id}`;
    return await fetchWrapper.delete(LOGIN_END_POINT);
  }
);

const jobPreferenceDataSlice = createSlice({
  name,
  initialState: {
    jobPreference_data_profile: [],
  },
  reducers: {},

  extraReducers: {
    [updatejobPreferenceThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [updatejobPreferenceThunk.fulfilled]: (state, payload) => {},
    [updatejobPreferenceThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [addjobPreferenceThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addjobPreferenceThunk.fulfilled]: (state, payload) => {},
    [addjobPreferenceThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [deletejobPreferenceThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [deletejobPreferenceThunk.fulfilled]: (state, payload) => {},
    [deletejobPreferenceThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [deleteProfileImgThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [deleteProfileImgThunk.fulfilled]: (state, payload) => {},
    [deleteProfileImgThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export const jobPreferenceDetailsActions = {
  ...jobPreferenceDataSlice.actions,
  addjobPreferenceThunk,
  updatejobPreferenceThunk,
  deletejobPreferenceThunk,
  deleteProfileImgThunk,
};

export const jobPreferenceDataReducer = jobPreferenceDataSlice.reducer;
