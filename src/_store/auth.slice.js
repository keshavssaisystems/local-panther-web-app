import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "auth";

// login thunk
export const loginThunk = createAsyncThunk(
  `${name}/loginThunk`,
  async (payload) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_PANTHER_URL}/api/Auth/Login`;
    return await fetchWrapper.post(LOGIN_END_POINT, payload);
  }
);

// registration thunk
export const registerThunk = createAsyncThunk(
  `${name}/registerThunk`,
  async (payload) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_PANTHER_URL}/api/User/RegisterCandidateNew`;
    return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
  }
);

// forgot password thunk
export const forgotPasswordThunk = createAsyncThunk(
  `${name}/forgotPasswordThunk`,
  async (payload) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_PANTHER_URL}/api/User/ForgotUserPassword`;
    return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
  }
);

// Create the slice
const authSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    menuList: JSON.parse(localStorage.getItem("menuList")),
    token: localStorage.getItem("token"),
    error: null,
  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToekn");
      history.navigate("/login");
    },
  },

  extraReducers: {
    [loginThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [loginThunk.fulfilled]: (state, { payload: { data = {} } = {} }) => {
      const { token, refreshToken, menuDtoList = [] } = data;
      state.menuList = menuDtoList;
      state.user = data;
      state.token = token;
      localStorage.setItem("menuList", JSON.stringify(menuDtoList)); // temp fix
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // get return url from location state or default to home page
      const { from } = history.location.state || {
        from: { pathname: "/" },
      };
      history.navigate(from);
    },
    [loginThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [registerThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [registerThunk.fulfilled]: (state, { payload = {} }) => {
      history.navigate("/registration-success");
    },
    [registerThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [forgotPasswordThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [forgotPasswordThunk.fulfilled]: (state, { payload = {} }) => {},
    [forgotPasswordThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

// Export the actions and reducer
export const authActions = {
  ...authSlice.actions,
  loginThunk, // Export the async login action
  registerThunk, // Export the register action
  forgotPasswordThunk,
};

export const authReducer = authSlice.reducer;
