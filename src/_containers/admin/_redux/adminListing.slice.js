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
const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;

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

export const getSubsidary = createAsyncThunk(
  `${name}/getSubsidary`,
  async (payload = {}) => {
    const GET_SUBSIDARY_STATS = `${baseUrl}/Subsidiary?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_SUBSIDARY_STATS);
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

export const getRolesForCompanyAdmin = createAsyncThunk(`${name}/getRolesForCompanyAdmin`, async () => {
  const GET_ROLES_STATS = `${baseUrl}/Common/GetCommonDropdown?searchText=UserRolesForCompanyAdmin`;
  return await fetchWrapper.get(GET_ROLES_STATS);
});


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

export const getFlaggedWords = createAsyncThunk(
  `${name}/getFlaggedWords`,
  async (payload = {}) => {
    const GET_SKILL_STATS = `${baseUrl}/FlaggedWord/filterList?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_SKILL_STATS);
  }
);

export const addFlaggedWords = createAsyncThunk(
  `${name}/addFlaggedWords`,
  async (payload = {}) => {
    const GET_SKILL_STATS = `${baseUrl}/FlaggedWord`;
    return await fetchWrapper.post(GET_SKILL_STATS, payload);
  }
);

export const updateFlaggedWords = createAsyncThunk(
  `${name}/updateFlaggedWords`,
  async ({ id, payload }) => {
    const GET_SKILL_STATS = `${baseUrl}/FlaggedWord/${id}`;
    return await fetchWrapper.put(GET_SKILL_STATS, payload);
  }
);

export const deleteFlaggedWords = createAsyncThunk(
  `${name}/deleteFlaggedWords`,
  async (id) => {
    const GET_SKILL_STATS = `${baseUrl}/FlaggedWord/${id}`;
    return await fetchWrapper.delete(GET_SKILL_STATS);
  }
);

export const getFlaggedWordList = createAsyncThunk(
  "user/getFlaggedWordList",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=flaggedword`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const getAdmCandidateList = createAsyncThunk(
  `${name}/getAdmCandidateList`,
  async (payload = {}) => {
    const GET_ADM_CAND_LIST = `${baseUrl}/Candidate?${new URLSearchParams(
      payload
    )}`;
    return await fetchWrapper.get(GET_ADM_CAND_LIST);
  }
);

export const deleteAdmCandidatePermanent = createAsyncThunk(
  `${name}/deleteAdmCandidatePermanent`,
  async (id) => {
    const DELETE_URL = `${baseUrl}/Candidate/DeletePermanent/${id}`;
    return await fetchWrapper.delete(DELETE_URL);
  }
);

export const sendEmailInvitation = createAsyncThunk(
  `${name}/sendEmailInvitation`,
  async (candidateId) => {
    const POST_SEND_EMINV = `${baseUrl}/Candidate/SendInvitation/${candidateId}`;
    return await fetchWrapper.post(POST_SEND_EMINV);
  }
);

export const admAddCandidate = createAsyncThunk(
  `${name}/admAddCandidate`,
  async (payload) => {
    const POST_ADM_ADD_CAND = `${baseUrl}/Candidate`;
    return await fetchWrapper.post(POST_ADM_ADD_CAND, payload);
  }
);


export const updateIsVisibleToOthersById = createAsyncThunk(
  `${name}/updateIsVisibleToOthersById`,
  async (customerId) => {
    const PUT_VISIBILITY_STATS = `${baseUrl}/Customer/UpdateIsVisibleToOthersById/${customerId}`;
    return await fetchWrapper.put(PUT_VISIBILITY_STATS);
  }
);

export const updateIsCompanyAdminByUserId = createAsyncThunk(
  `${name}/updateIsCompanyAdminByUserId`,
  async (userid) => {
    const PUT_VISIBILITY_STATS = `${baseUrl}/User/InCompanyAdmin/${userid}`;
    return await fetchWrapper.put(PUT_VISIBILITY_STATS);
  }
);


export const updateAllowDataSharing = createAsyncThunk(
  `${name}/updateAllowDataSharing`,
  async ({ id, payload }) => {
    const put_allow_data_sharing_url = `${baseUrl}/Company/isexcludecandidatesfromecosystem/${id}`;
    return await fetchWrapper.put(put_allow_data_sharing_url, payload);
  }
);

// Set company active/inactive by Super Admin
export const setCompanyActive = createAsyncThunk(
  `${name}/setCompanyActive`,
  async ({ companyId, dto }) => {
    const SET_ACTIVE_URL = `${baseUrl}/Company/SetActive/${companyId}`;
    return await fetchWrapper.put(SET_ACTIVE_URL, dto);
  }
);

// Update candidate name visibility by id - PUT /api/Company/{id}
export const updateCandidateNameVisibility = createAsyncThunk(
  `${name}/updateCandidateNameVisibility`,
  async ({ id, payload }) => {
    const put_candidate_name_visibility_url = `${baseUrl}/V2/543985EC-3630-437F-9E09-9955033C7482/${id}`;
    return await fetchWrapper.put(put_candidate_name_visibility_url, payload);
  }
);

// Update store candidate scan history setting by company id - PUT via V2
export const updateStoreCandidateScanHistory = createAsyncThunk(
  `${name}/updateStoreCandidateScanHistory`,
  async ({ id, payload }) => {
    const put_url = `${baseUrl}/Company/StoreScanHistory/${id}`;
    return await fetchWrapper.put(put_url, payload);
  }
);

// Update candidate resume visibility for hiring managers - PUT /api/V2/543985EC-3630-437F-9E09-9955033C7482/{id}
export const updateCandidateResumeVisibility = createAsyncThunk(
  `${name}/updateCandidateResumeVisibility`,
  async ({ id, payload }) => {
    const put_candidate_resume_visibility_url = `${baseUrl}/V2/543985EC-3630-437F-9E09-9955033C7482/${id}`;
    return await fetchWrapper.put(put_candidate_resume_visibility_url, payload);
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
    flaggedWordList: [],
    totalRecords: 0,
    candidateList: [],
    candPageNo: 1,
    candPageSize: 10,
    candTotalRecords: 0,
    candListLoading: false,
    customersList: [],
    rolesListforCompanyAdmin: []
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
    [getSubsidary.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getSubsidary.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.subsidiaryList;
      state.totalRecords = data.totalRows;
    },
    [getSubsidary.rejected]: (state, action) => {
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
      state.customersList = [];
    },
    [getCustomers.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.customerDetailsList;
      state.customersList = data?.customerDetailsList;
      state.totalRecords = data.totalRows;
    },
    [getCustomers.rejected]: (state, action) => {
      state.loading = false;
      state.customersList = [];
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

    [getFlaggedWords.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getFlaggedWords.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.data = data?.flaggedWordDtoList;
      state.totalRecords = data.totalRows;
    },
    [getFlaggedWords.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [addFlaggedWords.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addFlaggedWords.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [addFlaggedWords.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [updateFlaggedWords.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateFlaggedWords.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateFlaggedWords.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [deleteFlaggedWords.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteFlaggedWords.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [deleteFlaggedWords.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [getFlaggedWordList.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getFlaggedWordList.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      state.flaggedWordList = payload ? payload : [];
    },
    [getFlaggedWordList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [getAdmCandidateList.pending]: (state) => {
      state.candidateList = [];
      state.candListLoading = true;
      state.candTotalRecords = 0;
    },
    [getAdmCandidateList.fulfilled]: (state, { payload = {} }) => {
      state.candidateList =
        payload?.data?.candidateList?.length > 0
          ? payload.data.candidateList
          : [];
      state.candTotalRecords = payload?.data?.totalRows
        ? payload.data.totalRows
        : 0;
      state.candListLoading = false;
    },
    [getAdmCandidateList.rejected]: (state, action) => {
      state.candListLoading = false;
    },
    [deleteAdmCandidatePermanent.pending]: (state) => {
      state.candListLoading = true;
      state.error = null;
    },
    [deleteAdmCandidatePermanent.fulfilled]: (state, { payload = {} }) => {
      state.candListLoading = false;
    },
    [deleteAdmCandidatePermanent.rejected]: (state, action) => {
      state.candListLoading = false;
      state.error = action.error;
    },
    [sendEmailInvitation.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [sendEmailInvitation.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [sendEmailInvitation.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [admAddCandidate.pending]: (state) => { },
    [admAddCandidate.fulfilled]: (state, { payload = {} }) => { },
    [admAddCandidate.rejected]: (state, action) => { },

    [updateIsVisibleToOthersById.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateIsVisibleToOthersById.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateIsVisibleToOthersById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateIsCompanyAdminByUserId.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateIsCompanyAdminByUserId.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateIsCompanyAdminByUserId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [getRolesForCompanyAdmin.pending]: (state) => {

    },
    [getRolesForCompanyAdmin.fulfilled]: (state, action) => {

    },
    [getRolesForCompanyAdmin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getRolesForCompanyAdmin.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
      state.rolesListforCompanyAdmin = payload ? payload?.data : [];
    },
    [getRolesForCompanyAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateAllowDataSharing.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateAllowDataSharing.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateAllowDataSharing.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [setCompanyActive.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [setCompanyActive.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [setCompanyActive.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    [updateCandidateNameVisibility.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateCandidateNameVisibility.fulfilled]: (state, { payload = {} }) => {
      state.loading = false;
    },
    [updateCandidateNameVisibility.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  }
});

// Export the actions and reducer
export const adminListingActions = {
  ...adminListingSlice.actions,
  getCompanies,
  getSubsidary,
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
  getFlaggedWords,
  addFlaggedWords,
  updateFlaggedWords,
  deleteFlaggedWords,
  getFlaggedWordList,
  getAdmCandidateList,
  deleteAdmCandidatePermanent,
  sendEmailInvitation,
  admAddCandidate,
  updateIsVisibleToOthersById,
  updateIsCompanyAdminByUserId,
  updateAllowDataSharing,
  setCompanyActive,
  updateCandidateNameVisibility
};

export const adminListingReducer = adminListingSlice.reducer;
