import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { history, fetchWrapper } from "_helpers";

// create slice
const name = "auth";
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    error: null,
  };
}

function createReducers() {
  return {
    logout,
  };

  function logout(state) {
    state.user = {};
    state.token = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToekn");

    history.navigate("/login");
  }
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_USER_API_URL}/api/Auth`;
  return {
    login: login(),
  };

  function login() {
    return createAsyncThunk(`${name}/login`, async ({ email, password }) => {
      return await fetchWrapper.post(`${baseUrl}/Login`, { email, password });
    });
  }
}

function createExtraReducers() {
  return (builder) => {
    login();

    function login() {
      var { pending, fulfilled, rejected } = extraActions.login;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, { payload: { data = {} } = {} }) => {
          const { token, refreshToken, menuDtoList = [] } = data;
          state.menuDtoList = menuDtoList;
          state.user = data;
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);

          // get return url from location state or default to home page
          const { from } = history.location.state || {
            from: { pathname: "/" },
          };
          history.navigate(from);
        })
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}
