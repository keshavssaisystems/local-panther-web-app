import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
    serviceDetails: [],
    companyDetails: [],
  },
  error: null,
};

// Define the async action
export const getPolicy = createAsyncThunk("settings/getPolicy", async () => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=Privacy policy`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Define the async action
export const getService = createAsyncThunk("settings/getService", async () => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=Terms of service`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Define the async action
export const getCompanyDetails = createAsyncThunk(
  "settings/getCompanyDetails",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=About company`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const changePassword = createAsyncThunk(
  "settings/changePassword",
  async ({ password_data }) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    return await fetchWrapper.post(
      `${baseUrl}/User/ChangePassword`,
      password_data
    );
  }
);

export const deactivateUser = createAsyncThunk(
  "settings/deactivateUser",
  async ({ id, data }) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    return await fetchWrapper.put(`${baseUrl}/User/InActiveUser/${id}`, data);

    // Assuming your API response has a "data" property
  }
);

export const notifications = createAsyncThunk(
  "settings/notifications",
  async ({ id, data }) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    return await fetchWrapper.put(
      `${baseUrl}/User/UpdatePushnotificationSetting/${id}`,
      data
    );

    // Assuming your API response has a "data" property
  }
);

// Create the slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPolicy.pending, (state) => {
        state.error = null;
      })
      .addCase(getPolicy.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly
      })
      .addCase(getPolicy.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(getService.pending, (state) => {
        state.error = null;
      })
      .addCase(getService.fulfilled, (state, action) => {
        state.user.serviceDetails = action.payload; // Update the state properly
      })
      .addCase(getService.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(getCompanyDetails.pending, (state) => {
        state.error = null;
      })
      .addCase(getCompanyDetails.fulfilled, (state, action) => {
        state.user.companyDetails = action.payload; // Update the state properly
      })
      .addCase(getCompanyDetails.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(changePassword.pending, (state) => {
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {})
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(deactivateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {})
      .addCase(deactivateUser.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(notifications.pending, (state) => {
        state.error = null;
      })
      .addCase(notifications.fulfilled, (state, action) => {})
      .addCase(notifications.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const settingsActions = {
  ...settingsSlice.actions,
  getPolicy, // Export the async action
  getService,
  getCompanyDetails,
  changePassword,
  deactivateUser,
  notifications,
};
export const SettingsReducer = settingsSlice.reducer;
