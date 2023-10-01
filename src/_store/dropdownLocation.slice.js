import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
  },
  error: null,
};

// Define the async action
export const getSkill = createAsyncThunk("location/getLocation", async (id) => {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;
  const response = await fetchWrapper.get(
    `${baseUrl}/DepartmentSkillMapping/GetDepartmentSkillList?departmentId=${id}&pageSize=100`
  );
  return response.data; // Assuming your API response has a "data" property
});

// Create the slice
const skillSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSkill.pending, (state) => {
        state.error = null;
      })
      .addCase(getSkill.fulfilled, (state, { payload }) => {
        state.data = payload?.departmentSkillMappingList ?? []; // Update the state properly
      })
      .addCase(getSkill.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const skillActions = {
  ...skillSlice.actions,
  getSkill, // Export the async action
};
export const skillReducer = skillSlice.reducer;

export const getSkillsFilter = async (searchText) => {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;
  return await fetchWrapper.get(
    `${baseUrl}/Skill/GetSkillDropdown?searchText=${searchText}`
  );
};
