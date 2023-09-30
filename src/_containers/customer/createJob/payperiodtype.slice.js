import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "payPeriodType";

// getPayPeriodTypeThunk thunk
export const getPayPeriodTypeThunk = createAsyncThunk(
  `${name}/getPayPeriodTypeThunk`,
  async (payload) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=payPeriodType`;
    return await fetchWrapper.get(DROPDOWN_END_POINT, payload);
  }
);

// Create the slice
const payPeriodTypeSlice = createSlice({
  name,
  initialState: {
    payPeriodType: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getPayPeriodTypeThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPayPeriodTypeThunk.fulfilled]: (state, action) => {
      state.payPeriodType = action.payload.data;
      state.loading = false;
    },
    [getPayPeriodTypeThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const payPeriodTypeActions = {
  ...payPeriodTypeSlice.actions,
  getPayPeriodTypeThunk,
};

export const payPeriodTypeReducer = payPeriodTypeSlice.reducer;
