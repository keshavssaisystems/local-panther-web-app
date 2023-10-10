import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "remoteStatus";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const remoteStatusActions = { ...slice.actions, ...extraActions };
export const remoteStatusReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    remoteStatus: [],
    loading: false,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_MASTER_API_URL}/api`;

  return {
    getRemoteStatus: getRemoteStatus(),
  };

  function getRemoteStatus() {
    return createAsyncThunk(
      `${name}/getRemoteStatus`,
      async () =>
        await fetchWrapper.get(
          `${baseUrl}/Common/GetCommonDropdown?searchText=remotestatus`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getRemoteStatus();

    function getRemoteStatus() {
      var { pending, fulfilled, rejected } = extraActions.getRemoteStatus;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.remoteStatus = action.payload.data;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.remoteStatus = { error: action.error };
        });
    }
  };
}
