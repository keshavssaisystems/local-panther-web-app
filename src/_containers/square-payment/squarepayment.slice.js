import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";
// create slice name
const name = "squarepayment";

// post payment billing details
export const postSquareCardDetails = createAsyncThunk(
  `${name}/postSquareCardDetails`,
  async (token) => {
    const GET_PAY_BILL_END_POINT = `${process.env.REACT_APP_NEW_API_URL}BillingDetail`;
    return await fetchWrapper.post(GET_PAY_BILL_END_POINT, JSON.stringify({ nonce: token }));
  }
);

const squarepaymentSlice = createSlice({
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

  },

  extraReducers: {
    // user details
    
    // post payment details
    [postSquareCardDetails.pending]: (state) => {
      state.loading = true;
    },
    [postSquareCardDetails.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [postSquareCardDetails.rejected]: (state, action) => {
      state.loading = false;
    },
   
  },
});

// Export the actions and reducer
export const paymentActions = {
  postSquareCardDetails,
};

export const paymentReducer = squarepaymentSlice.reducer;
