import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// https://panther-api-dev.azurewebsites.net/api/Customer/AddCustomer

// create slice name
const name = "addCustomer";
const baseUrl = `${process.env.REACT_APP_PANTHER_URL}/api`;

const urlParams = {
  isActive: true,
  pageSize: 500,
  pageNumber: 1,
};

/*
https://panther-api-dev.azurewebsites.net/api/Company/GetCompanyDropdown?companyId=1
companyName
industry
*/
export const getCompaniesList = createAsyncThunk(
  `${name}/getCompaniesList`,
  async (payload = {}) => {
    const GET_COMPANIES_STATS = `${baseUrl}/Company/GetCompanyDropdown?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_COMPANIES_STATS);
  }
);

export const getCompanyAdmin = createAsyncThunk(
  `${name}/getCompanyAdmin`,
  async (payload = {}) => {
    const GET_COMPANIES_STATS = `${baseUrl}/Company/Get?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_COMPANIES_STATS);
  }
);

// Get states list
export const getStatesList = createAsyncThunk(`${name}/getStates`, async () => {
  return await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=state`
  );
});

// Get City list
export const getCitiesList = createAsyncThunk(`${name}/getCities`, async () => {
  return await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=city`
  );
});

// Get Countries list
export const getCountriesList = createAsyncThunk(
  `${name}/getCountries`,
  async () => {
    return await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=country`
    );
  }
);

// https://panther-api-dev.azurewebsites.net/api/Customer/AddCustomer
export const addCustomer = createAsyncThunk(
  `${name}/addCustomer`,
  async (payload = {}) => {
    const ADD_CUSTOMER = `${baseUrl}/Customer/AddCustomer`;
    return await fetchWrapper.post(ADD_CUSTOMER, payload);
  }
);

export const updateCustomer = createAsyncThunk(
  `${name}/updateCustomer`,
  async ({ customerId, payload }) => {
    const EDIT_CUSTOMER = `${baseUrl}/Customer/${customerId}`;
    return await fetchWrapper.put(EDIT_CUSTOMER, payload);
  }
);

// https://panther-api-dev.azurewebsites.net/api/Company
export const addCompany = createAsyncThunk(
  `${name}/addCompany`,
  async (payload = {}) => {
    const ADD_COMPANY = `${baseUrl}/Company`;
    return await fetchWrapper.post(ADD_COMPANY, payload);
  }
);

// Create the slice
const addCustomerSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    error: null,
    data: [],
    companiesList: [],
    companiesDetails: [],
    statesList: [],
    citiesList: [],
    countriesList: [],
  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
    },
  },

  extraReducers: {
    // Companies Stats for Admin Listing
    [getCompaniesList.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCompaniesList.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.companiesList = data?.map((item) => {
        return { id: item.companyid, name: item.companyname };
      });
    },
    [getCompaniesList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [getCompanyAdmin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCompanyAdmin.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.companiesDetails = data;
    },
    [getCompanyAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [getStatesList.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getStatesList.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.statesList = data;
    },
    [getStatesList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCitiesList.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCitiesList.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.citiesList = data;
    },
    [getCitiesList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCountriesList.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCountriesList.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.countriesList = data;
      console.log("NG data country", data);
    },
    [getCountriesList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [addCustomer.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addCustomer.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.customerDetailsList?.map((item) => {
        const newContact = item?.phonenumber?.match(/(\d{3})(\d{3})(\d{4})/);
        return {
          ...item,
          phonenumber: newContact
            ? "(" + newContact[1] + ")-" + newContact[2] + newContact[3]
            : null,
        };
      });
    },
    [addCustomer.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [addCompany.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addCompany.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.customerDetailsList?.map((item) => {
        const newContact = item?.phonenumber?.match(/(\d{3})(\d{3})(\d{4})/);
        return {
          ...item,
          phonenumber: newContact
            ? "(" + newContact[1] + ")-" + newContact[2] + newContact[3]
            : null,
        };
      });
    },
    [addCompany.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateCustomer.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateCustomer.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.customerDetailsList?.map((item) => {
        const newContact = item?.phonenumber?.match(/(\d{3})(\d{3})(\d{4})/);
        return {
          ...item,
          phonenumber: newContact
            ? "(" + newContact[1] + ")-" + newContact[2] + newContact[3]
            : null,
        };
      });
    },
    [updateCustomer.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const addCustomerActions = {
  ...addCustomerSlice.actions,
  getCompaniesList,
  getCompanyAdmin,
  addCustomer,
  getStatesList,
  getCitiesList,
  getCountriesList,
  addCompany,
  updateCustomer,
};

export const addCustomerReducer = addCustomerSlice.reducer;
