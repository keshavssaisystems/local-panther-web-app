import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "experienceLevel";

// getExperienceLevelThunk thunk
export const getExperienceLevelThunk = createAsyncThunk(
  `${name}/getExperienceLevelThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=experienceLevel`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// Create the slice
const experienceLevelSlice = createSlice({
  name,
  initialState: {
    experienceLevel: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getExperienceLevelThunk.pending]: (state) => {
      state.loading = true;
    },
    [getExperienceLevelThunk.fulfilled]: (state, action) => {
      state.experienceLevel = action.payload.data;
      state.loading = false;
    },
    [getExperienceLevelThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const experienceLevelActions = {
  ...experienceLevelSlice.actions,
  getExperienceLevelThunk,
};

export const experienceLevelReducer = experienceLevelSlice.reducer;
