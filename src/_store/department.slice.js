import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "department";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const departmentActions = { ...slice.actions, ...extraActions };
export const departmentReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    department: [],
    loading: false,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;

  return {
    getDepartment: getDepartment(),
  };

  function getDepartment() {
    return createAsyncThunk(
      `${name}/getDepartment`,
      async () =>
        await fetchWrapper.get(
          `${baseUrl}/Common/GetCommonDropdown?searchText=department`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getDepartment();

    function getDepartment() {
      var { pending, fulfilled, rejected } = extraActions.getDepartment;
      builder
        .addCase(pending, (state) => {
          state.department = [];
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.department = action.payload.data;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.department = { error: action.error };
        });
    }
  };
}
