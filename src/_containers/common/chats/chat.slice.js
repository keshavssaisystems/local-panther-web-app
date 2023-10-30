import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "chat";
const userId = Number(localStorage.getItem("userId"));
// getCustomerListThunk thunk
export const getCustomerListThunk = createAsyncThunk(
  `${name}/getCustomerListThunk`,
  async () => {
    const CUSTOMER_LIST = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=ScheduledCustomerListByUserId&commonId=${userId}`;
    return await fetchWrapper.get(CUSTOMER_LIST);
  }
);

// getCandidateListThunk thunk
export const getCandidateListThunk = createAsyncThunk(
  `${name}/getCandidateListThunk`,
  async () => {
    const CANDIDATE_LIST = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=ScheduledCandidateListByUserId&commonId=${userId}`;
    return await fetchWrapper.get(CANDIDATE_LIST);
  }
);

// Create the slice
const chatSlice = createSlice({
  name,
  initialState: {
    customerList: [],
    candidateList: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getCustomerListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCustomerListThunk.fulfilled]: (state, action) => {
      state.customerList = action.payload.data;
      state.loading = false;
    },
    [getCustomerListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getCandidateListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getCandidateListThunk.fulfilled]: (state, action) => {
      state.candidateList = action.payload.data;
      state.loading = false;
    },
    [getCandidateListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const chatActions = {
  ...chatSlice.actions,
  getCustomerListThunk,
  getCandidateListThunk,
};

export const chatReducer = chatSlice.reducer;
