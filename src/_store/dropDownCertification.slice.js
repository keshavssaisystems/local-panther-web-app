import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
    certificationTypeList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const certificationType = createAsyncThunk(
  "certification/certificationType",
  async () => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=certificationtype`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// Create the slice
const certificationTypeSlice = createSlice({
  name: "certificationType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(certificationType.pending, (state) => {
        state.error = null;
      })
      .addCase(certificationType.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly

        state.certificationTypeList = state.user.data.map(
          ({ id: value, ...rest }) => {
            return {
              value,
              label: `${rest.name}`,
            };
          }
        );
      })
      .addCase(certificationType.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const certificationTypeActions = {
  ...certificationTypeSlice.actions,
  certificationType, // Export the async action
};
export const certificationTypeReducer = certificationTypeSlice.reducer;
