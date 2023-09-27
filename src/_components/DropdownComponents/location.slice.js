import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "location";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

export const getLocation = async (searchText) => {
  const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
  return await fetchWrapper.get(
    `${baseUrl}/Common/GetLocation?searchText=${searchText}`
  );
};

// exports
export const locationActions = { ...slice.actions, ...extraActions };
export const locationReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    location: [],
    loading: false,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_MASTER_API_URL}/api`;

  return {
    getLocation: getLocation(),
  };

  function getLocation() {
    return createAsyncThunk(
      `${name}/getLocation`,
      async (searchText) =>
        await fetchWrapper.get(
          `${baseUrl}/Common/GetLocation?searchText=${searchText}`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getLocation();

    function getLocation() {
      var { pending, fulfilled, rejected } = extraActions.getLocation;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, { payload: { data = [] } = {} }) => {
          state.location = data;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.location = { error: action.error };
        });
    }
  };
}
