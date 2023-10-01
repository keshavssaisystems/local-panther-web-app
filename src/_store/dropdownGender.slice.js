import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [],
    genderList: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getGender = createAsyncThunk("gender/getGender", async () => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/Common/GetCommonDropdown?searchText=gender`
  );

  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const genderSlice = createSlice({
  name: "gender",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGender.pending, (state) => {
        state.error = null;
      })
      .addCase(getGender.fulfilled, (state, action) => {
        state.user.data = action.payload; // Update the state properly

        state.genderList = state.user.data.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getGender.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const genderActions = {
  ...genderSlice.actions,
  getGender, // Export the async action
};
export const genderReducer = genderSlice.reducer;
