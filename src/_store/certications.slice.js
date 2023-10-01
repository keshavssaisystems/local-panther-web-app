import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "certificate";

export const updatecertificateThunk = createAsyncThunk(
  `${name}/updatecertificateThunk`,
  async ({ id, certification_data }) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateCertification/${id}`;
    return await fetchWrapper.put(LOGIN_END_POINT, certification_data);
  }
);

export const addcertificateThunk = createAsyncThunk(
  `${name}/addcertificateThunk`,
  async (qualification_data) => {
    console.log(qualification_data);
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateCertification`;
    return await fetchWrapper.post(LOGIN_END_POINT, qualification_data);
  }
);

export const deletecertificateThunk = createAsyncThunk(
  `${name}/deletecertificateThunk`,
  async (deleteId) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateCertification/${deleteId}`;
    return await fetchWrapper.delete(LOGIN_END_POINT);
  }
);

const certificateDataSlice = createSlice({
  name,
  initialState: {
    certificate_data_profile: [],
  },
  reducers: {},

  extraReducers: {
    [updatecertificateThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [updatecertificateThunk.fulfilled]: (state, payload) => {},
    [updatecertificateThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [addcertificateThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addcertificateThunk.fulfilled]: (state, payload) => {},
    [addcertificateThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [deletecertificateThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [deletecertificateThunk.fulfilled]: (state, payload) => {},
    [deletecertificateThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export const certificateDetailsSlice = {
  ...certificateDataSlice.actions,
  addcertificateThunk,
  updatecertificateThunk,
  deletecertificateThunk,
};

export const certificateDataReducer = certificateDetailsSlice.reducer;
