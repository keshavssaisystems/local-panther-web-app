import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "payment";

// get customer user details
export const getCustomerUserDetails = createAsyncThunk(
  `${name}/getCustomerUserDetails`,
  async (id) => {
    const GET_CUST_USER_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Customer/CustomerInfoById/${id}`;
    return await fetchWrapper.get(GET_CUST_USER_END_POINT);
  }
);

// get payment currency type
export const getpaymentCurrencyType = createAsyncThunk(
  `${name}/getpaymentCurrencyType`,
  async () => {
    const GET_PAY_CURR_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Common/GetCommonDropdown?searchText=currency`;
    return await fetchWrapper.get(GET_PAY_CURR_END_POINT);
  }
);

// post payment billing details
export const postPaymentBillingDetails = createAsyncThunk(
  `${name}/postPaymentBillingDetails`,
  async (payload) => {
    const GET_PAY_BILL_END_POINT = `${process.env.REACT_APP_NEW_API_URL}/Common/GetCommonDropdown?searchText=currency`;
    return await fetchWrapper.post(GET_PAY_BILL_END_POINT, payload);
  }
);

// Create the slice
const paymentSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    userDetails: [],
    currencyType: [],
  },
  reducers: {},

  extraReducers: {
    // user details
    [getCustomerUserDetails.pending]: (state) => {
      state.userDetails = [];
    },
    [getCustomerUserDetails.fulfilled]: (state, action) => {
      state.userDetails = action?.payload?.data;
    },
    [getCustomerUserDetails.rejected]: (state, action) => {},

    // currency dropdown
    [getpaymentCurrencyType.pending]: (state) => {
      state.currencyType = [];
    },
    [getpaymentCurrencyType.fulfilled]: (state, action) => {
      state.currencyType = action?.payload?.data;
    },
    [getpaymentCurrencyType.rejected]: (state, action) => {},
    // currency dropdown
    [postPaymentBillingDetails.pending]: (state) => {
      state.loading = true;
    },
    [postPaymentBillingDetails.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [postPaymentBillingDetails.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

// Export the actions and reducer
export const paymentActions = {
  ...paymentSlice.actions,
  getCustomerUserDetails,
  getpaymentCurrencyType,
  postPaymentBillingDetails,
};

export const paymentReducer = paymentSlice.reducer;
