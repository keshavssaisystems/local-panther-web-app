import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";
import jwtDecode from "jwt-decode";
// create slice name
const name = "auth";

// login thunk
export const loginThunk = createAsyncThunk(
  `${name}/loginThunk`,
  async (payload) => {
    const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Auth/Login`;
    return await fetchWrapper.post(LOGIN_END_POINT, payload);
  }
);

// registration thunk
export const registerThunk = createAsyncThunk(
  `${name}/registerThunk`,
  async (payload) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/RegisterCandidate`;
    return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
  }
);

// forgot password thunk
export const forgotPasswordThunk = createAsyncThunk(
  `${name}/forgotPasswordThunk`,
  async (payload) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/ForgotUserPassword`;
    return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
  }
);

// user register thunk
export const userRegisterThunk = createAsyncThunk(
  `${name}/userRegisterThunk`,
  async (payload) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/UserRegistration`;
    return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
  }
);

export const registerCustomer = createAsyncThunk(
  `${name}/registerCustomer`,
  async (payload) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Customer/RegisterCustomer`;
    return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
  }
);

// verigy otp thunk
export const verifyOTPThunk = createAsyncThunk(
  `${name}/verifyOTPThunk`,
  async ({ userRegistrationId, otpDetails }) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/VerifyOTP?userRegistrationId=${userRegistrationId}`;
    return await fetchWrapper.put(REGISTRATION_END_POINT, otpDetails);
  }
);

// userRegisterThunkNew thunk
export const userRegisterThunkNew = createAsyncThunk(
  `${name}/userRegisterThunkNew`,
  async ({ userRegistrationId, post_data }) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/VerifyEmailOrPhone?userRegistrationId=${userRegistrationId}`;
    return await fetchWrapper.put(REGISTRATION_END_POINT, post_data);
  }
);

// generate zoom token thunk
export const generateToken = createAsyncThunk(
  `${name}/generateToken`,
  async ({ scheduleInterviewId, userIdentity }) => {
    const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/GetZoomVideoInterviewSession?scheduleInterviewId=${scheduleInterviewId}&userIdentity=${userIdentity}`;
    return await fetchWrapper.get(TOKEN_END_POINT);
  }
);

//Get share job details
export const getShareJobDetails = createAsyncThunk(
  `${name}/getShareJobDetails`,
  async (jobid) => {
    const SHARE_JD_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Job/GetShareJobDetails/${jobid}`;
    return await fetchWrapper.get(SHARE_JD_END_POINT);
  }
);

export const logoutThunk = createAsyncThunk(
  `${name}/logoutThunk`,
  async (userLoginInfoId) => {
    const LOGOUT_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Auth/Logout/${userLoginInfoId}`;
    return await fetchWrapper.put(LOGOUT_END_POINT);
  }
);

// Create the slice
const authSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    menuList: localStorage.getItem("menuList")
      ? JSON.parse(localStorage.getItem("menuList"))
      : [],
    userroleid: localStorage.getItem("userroleid")
      ? parseInt(localStorage.getItem("userroleid"))
      : "",
    token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
    error: null,
    shareJobDetail: [],
  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToekn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("userroleid");
      localStorage.removeItem("pushnotification");
      localStorage.removeItem("userLoginInfoId");
      localStorage.clear();

      history.navigate("/login");
    },
  },

  extraReducers: {
    [loginThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [loginThunk.fulfilled]: (state, { payload: { data = {} } = {} }) => {
      const { token, refreshToken, menuDtoList = [], userLoginInfoId } = data;
      state.menuList = menuDtoList;
      state.user = data;
      state.token = token;
      localStorage.setItem("menuList", JSON.stringify(menuDtoList)); // temp fix
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      const decodedData = jwtDecode(token);
      localStorage.setItem("userId", decodedData.UserId);
      localStorage.setItem("profileImage", decodedData.Profilephotopath);
      localStorage.setItem("userLoginInfoId", userLoginInfoId);
      localStorage.setItem(
        "userroleid",
        decodedData.role.toLowerCase() === "admin"
          ? 1
          : decodedData.role.toLowerCase() === "customer"
          ? 2
          : 3
      );
      state.userroleid =
        decodedData.role.toLowerCase() === "admin"
          ? 1
          : decodedData.role.toLowerCase() === "customer"
          ? 2
          : 3;
      localStorage.setItem("userDetails", JSON.stringify(decodedData));
      localStorage.setItem(
        "pushnotification",
        decodedData?.Pushnotification?.toLowerCase() === "true"
      );

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

    [userRegisterThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [userRegisterThunk.fulfilled]: (state, { payload = {} }) => {},
    [userRegisterThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [verifyOTPThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [verifyOTPThunk.fulfilled]: (state, { payload = {} }) => {},
    [verifyOTPThunk.rejected]: (state, action) => {
      state.error = action.error;
    },

    [userRegisterThunkNew.pending]: (state, { payload }) => {
      state.error = null;
    },
    [userRegisterThunkNew.fulfilled]: (state, { payload = {} }) => {},
    [userRegisterThunkNew.rejected]: (state, action) => {
      state.error = action.error;
    },
    [generateToken.pending]: (state, { payload }) => {
      state.error = null;
    },
    [generateToken.fulfilled]: (state, { payload = {} }) => {},
    [generateToken.rejected]: (state, action) => {
      state.error = action.error;
    },
    [registerCustomer.pending]: (state, { payload }) => {
      state.error = null;
    },
    [registerCustomer.fulfilled]: (state, { payload = {} }) => {
      state.error = null;
    },
    [registerCustomer.rejected]: (state, action) => {
      state.error = action.error;
    },

    [getShareJobDetails.pending]: (state, { payload }) => {
      state.shareJobDetail = [];
    },
    [getShareJobDetails.fulfilled]: (state, { payload = {} }) => {
      let data = [];
      data.push(payload.data);
      state.shareJobDetail = data;
    },
    [getShareJobDetails.rejected]: (state, action) => {
      // do nothing
    },

    [logoutThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [logoutThunk.fulfilled]: (state, { payload = {} }) => {
      state.user = {};
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToekn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("userroleid");
      localStorage.removeItem("pushnotification");
      localStorage.removeItem("userLoginInfoId");
      localStorage.clear();

      history.navigate("/login");
    },
    [logoutThunk.rejected]: (state, action) => {
      // do nothing
    },
  },
});

// Export the actions and reducer
export const authActions = {
  ...authSlice.actions,
  loginThunk, // Export the async login action
  registerThunk, // Export the register action
  forgotPasswordThunk,
  userRegisterThunk,
  verifyOTPThunk,
  userRegisterThunkNew,
  generateToken,
  registerCustomer,
  getShareJobDetails,
  logoutThunk,
};

export const authReducer = authSlice.reducer;
