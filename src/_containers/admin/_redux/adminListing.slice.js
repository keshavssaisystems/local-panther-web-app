import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// https://panther-api-dev.azurewebsites.net/api/Company/
//      Get?searchText=ddd&isActive=true&pageSize=500  ALL
//      Get?companyId=20&isActive=true&pageSize=500  company
//      Get?cityId=473&isActive=true&pageSize=500  city
//      Get?stateId=20&isActive=true&pageSize=500  state
//      Get?countryId=0&isActive=true&pageSize=500 country 
//      Get?countryId=0&isActive=false&pageSize=500  isActive
//      Get?countryId=0&isActive=false&pageSize=500&pageNumber=10

// create slice name
const name = 'adminListing';
const baseUrl = `${process.env.REACT_APP_PANTHER_URL}/api`;

const urlParams= {
  isActive : true,
  pageSize : 1000
};

export const getCompanies = createAsyncThunk(
  `${name}/getCompanies`,
  async (payload = {}) => { 
    const GET_COMPANIES_STATS = `${baseUrl}/Company/Get?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_COMPANIES_STATS);
  }
);

//https://panther-api-dev.azurewebsites.net/api/Customer/Get?isActive=true&pageSize=500
export const getCustomers = createAsyncThunk( 
  `${name}/getCustomers`,
  async (payload = {}) => {
    const GET_CUSTOMERS_STATS = `${baseUrl}/Customer/Get?${new URLSearchParams(payload)}`;
    console.log("NG thunk call GET_CUSTOMERS_STATS", GET_CUSTOMERS_STATS)
    return await fetchWrapper.get(GET_CUSTOMERS_STATS);
  }
);

// Create the slice
const adminListingSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    error: null,
    data: [],
  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
    },
  },

  extraReducers: {
    // Companies Stats for Admin Listing  
    [getCompanies.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCompanies.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.companyDetailsList;    // dummy data, api not available
    },
    [getCompanies.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCustomers.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCustomers.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      console.log("NG in fulfilled payload", payload)
      state.loading = false;
      state.data = data.customerDetailsList;    // dummy data, api not available
    },
    [getCustomers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

  },
});

// Export the actions and reducer
export const adminListingActions = {
  ...adminListingSlice.actions,
  getCompanies,
  getCustomers // Export the async get companies action
};

export const adminListingReducer = adminListingSlice.reducer;
