import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "payment";

// get customer user details
export const getCustomerUserDetails = createAsyncThunk(
  `${name}/getCustomerUserDetails`,
  async (id) => {
    const GET_CUST_USER_END_POINT = `${process.env.REACT_APP_NEW_API_URL}Customer/CustomerInfoById/${id}`;
    return await fetchWrapper.get(GET_CUST_USER_END_POINT);
  }
);

// get payment currency type
export const getpaymentCurrencyType = createAsyncThunk(
  `${name}/getpaymentCurrencyType`,
  async () => {
    const GET_PAY_CURR_END_POINT = `${process.env.REACT_APP_NEW_API_URL}Common/GetCommonDropdown?searchText=currency`;
    return await fetchWrapper.get(GET_PAY_CURR_END_POINT);
  }
);

// post payment billing details
export const postPaymentBillingDetails = createAsyncThunk(
  `${name}/postPaymentBillingDetails`,
  async (payload) => {
    const GET_PAY_BILL_END_POINT = `${process.env.REACT_APP_NEW_API_URL}BillingDetail`;
    return await fetchWrapper.post(GET_PAY_BILL_END_POINT, payload);
  }
);

// get customer billing details
export const getBillingDetails = createAsyncThunk(
  `${name}/getBillingDetails`,
  async (id) => {
    const GET_BILL_DETAILS_END_POINT = `${process.env.REACT_APP_NEW_API_URL}BillingDetail/GetBillingDetailsForCustomer?customerId=${id}`;
    return await fetchWrapper.get(GET_BILL_DETAILS_END_POINT);
  }
);

//get company billing details
export const getBillingDetailsByCompany = createAsyncThunk(
  `${name}/getBillingDetailsByCompany`,
  async (id) => {
    const GET_BILL_DETAILS_CMP_END_POINT = `${process.env.REACT_APP_NEW_API_URL}BillingDetail/GetBillingDetailsForCustomer?companyId=${id}`;
    return await fetchWrapper.get(GET_BILL_DETAILS_CMP_END_POINT);
  }
);

// delete customer billing details
export const deleteBillingDetails = createAsyncThunk(
  `${name}/deleteBillingDetails`,
  async (id) => {
    const DELETE_BILL_DETAILS_END_POINT = `${process.env.REACT_APP_NEW_API_URL}BillingDetail/${id}`;
    return await fetchWrapper.delete(DELETE_BILL_DETAILS_END_POINT);
  }
);

// get card type dropdown
export const getCardTypeDrpDwn = createAsyncThunk(
  `${name}/getCardTypeDrpDwn`,
  async () => {
    const GET_CARD_TYPE_END_POINT = `${process.env.REACT_APP_NEW_API_URL}Common/GetCommonDropdown?searchText=creditcardtype`;
    return await fetchWrapper.get(GET_CARD_TYPE_END_POINT);
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
    billingDetails: [],
    compBillingDetails: [],
    cardType: [],
    showBilling: false,
  },
  reducers: {
    updateUserDetails: (state, { payload }) => {
      state.userDetails = payload;
    },
    clearBillingData: (state) => {
      state.billingDetails = [];
      state.compBillingDetails = [];
    },
    clearUserData: (state) => {
      state.userDetails = [];
    },
    updateShowBilling: (state, { payload }) => {
      state.showBilling = payload;
    },
  },

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
    // post payment details
    [postPaymentBillingDetails.pending]: (state) => {
      state.loading = true;
    },
    [postPaymentBillingDetails.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [postPaymentBillingDetails.rejected]: (state, action) => {
      state.loading = false;
    },
    // get customer Billing details
    [getBillingDetails.pending]: (state) => {
      state.billingDetails = [];
    },
    [getBillingDetails.fulfilled]: (state, action) => {
      state.billingDetails = action?.payload?.data;
    },
    [getBillingDetails.rejected]: (state, action) => {},

    //get company billing details

    [getBillingDetailsByCompany.pending]: (state) => {
      state.compBillingDetails = [];
    },
    [getBillingDetailsByCompany.fulfilled]: (state, action) => {
      state.compBillingDetails = action?.payload?.data;
    },
    [getBillingDetailsByCompany.rejected]: (state, action) => {},

    // delete customer Billing details
    [deleteBillingDetails.pending]: (state) => {
      state.loading = true;
    },
    [deleteBillingDetails.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [deleteBillingDetails.rejected]: (state, action) => {
      state.loading = false;
    },
    // currency dropdown
    [getCardTypeDrpDwn.pending]: (state) => {
      state.cardType = [];
    },
    [getCardTypeDrpDwn.fulfilled]: (state, action) => {
      state.cardType = action?.payload?.data;
    },
    [getCardTypeDrpDwn.rejected]: (state, action) => {},
  },
});

// Export the actions and reducer
export const paymentActions = {
  ...paymentSlice.actions,
  getCustomerUserDetails,
  getpaymentCurrencyType,
  postPaymentBillingDetails,
  getBillingDetails,
  deleteBillingDetails,
  getCardTypeDrpDwn,
  getBillingDetailsByCompany,
};

export const paymentReducer = paymentSlice.reducer;
