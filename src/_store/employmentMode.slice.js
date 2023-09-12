import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "employmentMode";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const employmentModeActions = { ...slice.actions, ...extraActions };
export const employmentModeReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    employmentMode: [],
    loading: false,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_MASTER_API_URL}/api`;

  return {
    getEmploymentMode: getEmploymentMode(),
  };

  function getEmploymentMode() {
    return createAsyncThunk(
      `${name}/getEmploymentMode`,
      async () =>
        await fetchWrapper.get(
          `${baseUrl}/Common/GetCommonDropdown?searchText=employmentmode`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getEmploymentMode();

    function getEmploymentMode() {
      var { pending, fulfilled, rejected } = extraActions.getEmploymentMode;
      builder
        .addCase(pending, (state) => {
          state.employmentMode = [];
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.employmentMode = action.payload.data;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.employmentTypeDD = { error: action.error };
          state.loading = true;
        });
    }
  };
}
