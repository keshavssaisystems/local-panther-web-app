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

export const resetPassword = createAsyncThunk(
  `${name}/resetPassword`,
  async (payload = {}) => {
    const GET_ROLES_STATS = `${baseUrl}/User/ForgotUserPassword`;
    return await fetchWrapper.post(GET_ROLES_STATS, payload);
  }
);

export const addRole = createAsyncThunk(
  `${name}/addRole`,
  async (payload = {}) => {
    const GET_ROLES_STATS = `${baseUrl}/UserRoles`;
    return await fetchWrapper.post(GET_ROLES_STATS, payload);
  }
);

export const updateRole = createAsyncThunk(
  `${name}/updateRole`,
  async ({ rolesData, roleId }) => {
    const GET_ROLES_STATS = `${baseUrl}/UserRoles/${roleId}`;
    return await fetchWrapper.put(GET_ROLES_STATS, rolesData);
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
  async (id) => {
    const GET_MENUMAPPING_STATS = `${baseUrl}/Menus/GetMappedMenusByRole/${id}`;
    return await fetchWrapper.get(GET_MENUMAPPING_STATS);
  }
);

export const getSkills = createAsyncThunk(
  `${name}/getSkills`,
  async (payload = {}) => {
    const GET_SKILL_STATS = `${baseUrl}/Skill/GetSkills?type=Skill&${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_SKILL_STATS);
  }
);

export const addSkills = createAsyncThunk(
  `${name}/addSkills`,
  async (payload = {}) => {
    const GET_SKILL_STATS = `${baseUrl}/Skill`;
    return await fetchWrapper.post(GET_SKILL_STATS, payload);
  }
);

export const updateSkills = createAsyncThunk(
  `${name}/updateSkills`,
  async ({ id, payload }) => {
    const GET_SKILL_STATS = `${baseUrl}/Skill/${id}`;
    return await fetchWrapper.put(GET_SKILL_STATS, payload);
  }
);

export const deleteSkills = createAsyncThunk(
  `${name}/deleteSkills`,
  async (id) => {
    const GET_SKILL_STATS = `${baseUrl}/Skill/${id}`;
    return await fetchWrapper.delete(GET_SKILL_STATS);
  }
);

export const verifyCustomer = createAsyncThunk(
  `${name}/verifyCustomer`,
  async (payload = {}) => {
    const CUSTOMER = `${baseUrl}/User/VerifyCustomer`;
    return await fetchWrapper.post(CUSTOMER, payload);
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
    totalRecords: 0,
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
      state.data = data?.companyDetailsList;
      state.totalRecords = data.totalRows;
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
      state.totalRecords = data.totalRows;
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
      state.totalRecords = data.totalRows;
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

    [resetPassword.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [resetPassword.fulfilled]: (state) => {
      state.loading = false;
    },
    [resetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [updateRole.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateRole.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateRole.rejected]: (state, action) => {
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

    [getSkills.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getSkills.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.getSkillsList;
      state.totalRecords = data.totalRows;
    },
    [getSkills.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [addSkills.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addSkills.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [addSkills.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [updateSkills.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateSkills.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateSkills.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [deleteSkills.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteSkills.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [deleteSkills.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [verifyCustomer.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [verifyCustomer.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [verifyCustomer.rejected]: (state, action) => {
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
  updateRole,
  resetPassword,
  getSkills,
  addSkills,
  updateSkills,
  deleteSkills,
  verifyCustomer,
};

export const adminListingReducer = adminListingSlice.reducer;
