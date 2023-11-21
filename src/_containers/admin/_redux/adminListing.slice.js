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
const name = "adminListing";
const baseUrl = `${process.env.REACT_APP_PANTHER_URL}/api`;

const urlParams = {
  isActive: true,
  pageSize: 500,
  pageNumber: 1,
};

export const getCompanies = createAsyncThunk(
  `${name}/getCompanies`,
  async (payload = {}) => {
    const GET_COMPANIES_STATS = `${baseUrl}/Company/Get?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_COMPANIES_STATS);
  }
);

//https://panther-api-dev.azurewebsites.net/api/Customer/Get?isActive=true&pageSize=500
export const getCustomers = createAsyncThunk(
  `${name}/getCustomers`,
  async (payload = {}) => {
    const GET_CUSTOMERS_STATS = `${baseUrl}/Customer/Get?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_CUSTOMERS_STATS);
  }
);
export const getIndustries = createAsyncThunk(
  `${name}/getIndustry`,
  async (payload = {}) => {
    const GET_INDUSTRIES_STATS = `${baseUrl}/Company/Get?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_INDUSTRIES_STATS);
  }
);

// https://panther-api-dev.azurewebsites.net/api/User?pageSize=500
export const getUsers = createAsyncThunk(
  `${name}/getUsers`,
  async (payload = {}) => {
    const GET_USERS_STATS = `${baseUrl}/User?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_USERS_STATS);
  }
);

export const deleteUser = createAsyncThunk(`${name}/deleteUser`, async (id) => {
  const DELETE_USER = `${baseUrl}/User/${id}`;
  return await fetchWrapper.delete(DELETE_USER);
});

export const deleteRole = createAsyncThunk(`${name}/deleteRole`, async (id) => {
  const DELETE_ROLE = `${baseUrl}/UserRoles/${id}`;
  return await fetchWrapper.delete(DELETE_ROLE);
});

//  https://panther-api-dev.azurewebsites.net/api/UserRoles?pageSize=500
export const getRoles = createAsyncThunk(`${name}/getRoles`, async () => {
  const GET_ROLES_STATS = `${baseUrl}/UserRoles/GetUserRolesDropdown`;
  return await fetchWrapper.get(GET_ROLES_STATS);
});

export const getRolesList = createAsyncThunk(
  `${name}/getRolesList`,
  async (payload = {}) => {
    const GET_ROLES_STATS = `${baseUrl}/UserRoles?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_ROLES_STATS);
  }
);

export const addRole = createAsyncThunk(
  `${name}/addRole`,
  async (payload = {}) => {
    const GET_ROLES_STATS = `${baseUrl}/UserRoles`;
    return await fetchWrapper.post(GET_ROLES_STATS, payload);
  }
);

export const updateMenuMapping = createAsyncThunk(
  `${name}/updateMenuMapping`,
  async ({ rolesData, id }) => {
    const GET_ROLES_STATS = `${baseUrl}/Menus/UpdateMenusPerRole/${id}`;
    return await fetchWrapper.put(GET_ROLES_STATS, rolesData);
  }
);

// ** https://panther-api-dev.azurewebsites.net/api/Menus?isActive=true&pageSize=500&pageNumber=0
export const getMenuMappings = createAsyncThunk(
  `${name}/getMenuMappings`,
  async (payload = {}) => {
    const GET_MENUMAPPING_STATS = `${baseUrl}/Menus?${new URLSearchParams(
      payload
    )}`;
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
    industyList: [],
    industryCompanyMapping: [],
    rolesList: [],
    menuList: [],
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
      state.data = data?.companyDetailsList?.map((item) => {
        const newContact = item?.contactphonenumber?.match(
          /(\d{3})(\d{3})(\d{4})/
        );
        return {
          ...item,
          contactphonenumber: newContact
            ? "(" + newContact[1] + ")-" + newContact[2] + "-" + newContact[3]
            : null,
        };
      });
    },
    [getCompanies.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getIndustries.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getIndustries.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      const industryData = data?.companyDetailsList?.map((item) => {
        return item.industry;
      });
      state.industyList = [...new Set(industryData)];
      state.industryCompanyMapping = data?.companyDetailsList?.map((item) => {
        return { [item.companyid]: item.industry };
      });
    },
    [getIndustries.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getCustomers.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCustomers.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.customerDetailsList;
    },
    [getCustomers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getUsers.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getUsers.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.userList;
      state.data = data?.userList?.map((item) => {
        const newContact = item?.phonenumber?.match(/(\d{3})(\d{3})(\d{4})/);
        return {
          ...item,
          phonenumber: newContact
            ? "(" + newContact[1] + ")-" + newContact[2] + newContact[3]
            : null,
        };
      });
    },
    [getUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getRoles.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getRoles.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      state.rolesList = payload ? payload : [];
    },
    [getRoles.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [getRolesList.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getRolesList.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.userRoleList;
    },
    [getRolesList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [addRole.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addRole.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [addRole.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [updateMenuMapping.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateMenuMapping.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateMenuMapping.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [deleteRole.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteRole.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [deleteRole.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [getMenuMappings.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getMenuMappings.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.menuList = data;
    },
    [getMenuMappings.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [deleteUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteUser.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const adminListingActions = {
  ...adminListingSlice.actions,
  getCompanies,
  getIndustries,
  getCustomers,
  getUsers,
  getRoles,
  getMenuMappings,
  deleteUser, // Export the async get companies action
  getRolesList,
  addRole,
  updateMenuMapping,
  deleteRole,
};

export const adminListingReducer = adminListingSlice.reducer;
