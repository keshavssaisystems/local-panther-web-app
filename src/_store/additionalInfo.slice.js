import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "additionalInfo";

export const updateadditionalInfoThunk = createAsyncThunk(
  `${name}/updateadditionalInfoThunk`,
  async ({ id, additional_info }) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateAdditionalInformations/${id}`;
    return await fetchWrapper.put(LOGIN_END_POINT, additional_info);
  }
);

export const addadditionalInfoThunk = createAsyncThunk(
  `${name}/addadditionalInfoThunk`,
  async (postData) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateAdditionalInformations/UpsertCandidateAdditionalInformations`;
    return await fetchWrapper.post(LOGIN_END_POINT, postData);
  }
);

export const deleteadditionalInfoThunk = createAsyncThunk(
  `${name}/deleteadditionalInfoThunk`,
  async (deleteId) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CandidateAdditionalInformations/${deleteId}`;
    return await fetchWrapper.delete(LOGIN_END_POINT);
  }
);

const additionalInfoDataSlice = createSlice({
  name,
  initialState: {
    additionalInfo_data_profile: [],
  },
  reducers: {},

  extraReducers: {
    [updateadditionalInfoThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [updateadditionalInfoThunk.fulfilled]: (state, payload) => {},
    [updateadditionalInfoThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [addadditionalInfoThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [addadditionalInfoThunk.fulfilled]: (state, payload) => {},
    [addadditionalInfoThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [deleteadditionalInfoThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [deleteadditionalInfoThunk.fulfilled]: (state, payload) => {},
    [deleteadditionalInfoThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export const additionalInfoDetailsSlice = {
  ...additionalInfoDataSlice.actions,
  addadditionalInfoThunk,
  updateadditionalInfoThunk,
  deleteadditionalInfoThunk,
};

export const additionalInfoDataReducer = additionalInfoDetailsSlice.reducer;
