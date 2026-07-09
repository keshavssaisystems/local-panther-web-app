import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";
import jwtDecode from "jwt-decode";
import { appLogout } from "./app.actions";
// create slice name
const name = "auth";

// Helper function to handle login success
const handleLoginSuccess = (state, data) => {
  const { token, refreshToken, menuDtoList = [], userLoginInfoId, companyList = [] } = data;
  state.menuList = menuDtoList;
  state.user = data;
  state.token = token;

  const companyLogo = data.appConfigurationDtoList?.filter(d => d?.appconfigurationkey === "CompanyLogo") || "";
  const defLogo = data.appConfigurationDtoList?.filter(d => d?.appconfigurationkey === "DefaultLogo") || "";
  const cmpLogo = data?.companyList?.length > 0 ? data.companyList[0].logourl : "";

  localStorage.setItem("menuList", JSON.stringify(menuDtoList)); // temp fix
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  const decodedData = jwtDecode(token);
  localStorage.setItem("userId", decodedData.UserId);
  localStorage.setItem("profileImage", decodedData.Profilephotopath);
  localStorage.setItem("userLoginInfoId", userLoginInfoId);
  localStorage.setItem("userroleid", parseInt(decodedData.UserroleId));
  state.userroleid = parseInt(decodedData.UserroleId);
  localStorage.setItem("userDetails", JSON.stringify(decodedData));
  localStorage.setItem("pushnotification", decodedData?.Pushnotification?.toLowerCase() === "true");
  localStorage.setItem("logo", decodedData?.role?.toLowerCase() === "candidate" ? "" : cmpLogo?.length > 0 ? cmpLogo
    : companyLogo?.length > 0 ? companyLogo[0]?.appconfigurationvalue : defLogo?.length > 0 ? defLogo[0]?.appconfigurationvalue : "");
  localStorage.setItem("emailnotification", decodedData?.Emailnotification?.toLowerCase() === "true");
  if (decodedData?.UserroleId === "4") {
    localStorage.setItem("isCompanyAdmin", "true");
    state.isCompanyAdmin = true;
  } else if (decodedData?.UserroleId === "2") {
    localStorage.setItem("isCompanyAdmin", data?.isCompanyAdmin === true ? "true" : "false");
    state.isCompanyAdmin = data?.isCompanyAdmin === true;
  } else {
    state.isCompanyAdmin = false;
  }
  localStorage.setItem("emailnotification", decodedData?.Emailnotification?.toLowerCase() === "true");
  // get return url from location state or default to home page
  const { from } = history.location.state || { from: { pathname: "/" }, };

  if (companyList && companyList.length > 0) {
    localStorage.setItem("companyList", JSON.stringify(companyList));
  }
  // Always reset switch context on login so a new user starts with no active HM switch
  localStorage.removeItem("selectedHiringManagerId");
  localStorage.removeItem("selectedHiringManagerName");
  localStorage.removeItem("adminOriginalUserId");
  localStorage.removeItem("adminOriginalToken");
  localStorage.removeItem("adminOriginalRefreshToken");
  localStorage.removeItem("adminOriginalUserDetails");
  localStorage.removeItem("adminOriginalUserLoginInfoId");
  localStorage.removeItem("adminOriginalIsCompanyAdmin");
  state.selectedHiringManagerId = null;
  state.isSwitching = false;
  state.switchError = null;
  state.loader = false;
  history.navigate(from);
}

const handleLogoutSuccess = (state) => {
  state.user = {};
  state.token = null;
  state.loader = false;
  state.selectedHiringManagerId = null;
  state.isSwitching = false;
  state.switchError = null;
  state.isCompanyAdmin = false;
  let logo = localStorage.getItem("logo");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToekn");
  localStorage.removeItem("userId");
  localStorage.removeItem("userDetails");
  localStorage.removeItem("userroleid");
  localStorage.removeItem("pushnotification");
  localStorage.removeItem("userLoginInfoId");
  localStorage.removeItem("emailnotification");
  localStorage.clear();
  localStorage.setItem("logo", logo);
  history.navigate("/login");
}

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
  async (userLoginInfoId, thunkAPI) => {
    try {
      const LOGOUT_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Auth/Logout/${userLoginInfoId}`;
      await fetchWrapper.put(LOGOUT_END_POINT);
    } catch (error) {
      // even if API fails, we still logout locally
    }

    // ✅ CLEAR redux store
    thunkAPI.dispatch(appLogout());

    // optional: return something
    return true;
  }
);

export const putRegisterCustomer = createAsyncThunk(
  `${name}/putRegisterCustomer`,
  async ({ payload, userRegistrationId }) => {
    const PUT_REG_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/RegisterCustomer/${userRegistrationId}`;
    return await fetchWrapper.put(PUT_REG_END_POINT, payload);
  }
);

export const postAddAuditLogs = createAsyncThunk(
  `${name}/postAddAuditLogs`,
  async (payload) => {
    const POST_ADD_AUDIT_LOG = `${process.env.REACT_APP_MAIN_API_URL}/api/AuditLogs/AddLog`;
    return await fetchWrapper.post(POST_ADD_AUDIT_LOG, payload);
  }
);

// login thunk
export const loginWithOTP = createAsyncThunk(
  `${name}/loginWithOTP`,
  async (payload) => {
    const LOGIN_OTP_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Auth/OTPLogin`;
    return await fetchWrapper.post(LOGIN_OTP_END_POINT, payload);
  }
);

// cand registration using otp thunk
export const candRegisterOTPThunk = createAsyncThunk(
  `${name}/candRegisterOTPThunk`,
  async (payload) => {
    const REGISTRATION_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/RegisterCandidate`;
    return await fetchWrapper.post(REGISTRATION_END_POINT, payload);
  }
);

export const postCompanyReferralLogs = createAsyncThunk(
  `${name}/postCompanyReferralLogs`,
  async (payload) => {
    const CMPREFFLOGS_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/CompanyReferralLogs`;
    return await fetchWrapper.post(CMPREFFLOGS_END_POINT, payload);
  }
);

export const putCompanyReferralLogs = createAsyncThunk(
  `${name}/putCompanyReferralLogs`,
  async ({ id, payload }) => {
    const CMPREFFLOGS_END_POINT_PT =
      `${process.env.REACT_APP_MAIN_API_URL}/api/CompanyReferralLogs/Patch/` +
      id;
    return await fetchWrapper.put(CMPREFFLOGS_END_POINT_PT, payload);
  }
);

export const postInterviewSessionAccess = createAsyncThunk(
  `${name}/postInterviewSessionAccess`,
  async (payload) => {
    const Session_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/User/InterviewSessionAccess`;
    return await fetchWrapper.post(Session_END_POINT, payload);
  }
);

// Helper: always call SwitchToHiringManager using the original admin's token.
// This guarantees A→B→C→D chains always use A's authorization regardless of
// which switched token is currently active in localStorage.
const callSwitchAPI = async (hiringManagerUserId) => {
  const SWITCH_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Auth/SwitchToHiringManager`;
  // adminOriginalToken is set on first switch and never changes until logout.
  // Falls back to current token only on the very first switch (before it is saved).
  const token = localStorage.getItem("adminOriginalToken") || localStorage.getItem("token");
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(SWITCH_END_POINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hiringManagerUserId }),
  });

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`SwitchToHiringManager: invalid JSON response (HTTP ${response.status})`);
  }

  // Validate both HTTP status and API-level status code
  if (!response.ok || body?.statusCode !== 200 || !body?.data?.token) {
    throw new Error(body?.message || `SwitchToHiringManager failed (HTTP ${response.status})`);
  }

  return body;
};

// Switch to a specific hiring manager's context (Company Admin only)
export const switchToHiringManagerThunk = createAsyncThunk(
  `${name}/switchToHiringManagerThunk`,
  async (hiringManagerUserId, { rejectWithValue }) => {
    try {
      return await callSwitchAPI(hiringManagerUserId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Switch back to the original admin context
export const switchBackToAdminThunk = createAsyncThunk(
  `${name}/switchBackToAdminThunk`,
  async (_, { rejectWithValue }) => {
    const originalAdminUserId = localStorage.getItem("adminOriginalUserId");
    if (!originalAdminUserId) return rejectWithValue("No original admin session found");
    try {
      return await callSwitchAPI(parseInt(originalAdminUserId));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Helper to apply a switch-context response to state and localStorage
const handleSwitchContext = (state, data) => {
  const { token, refreshToken, menuDtoList = [], userLoginInfoId, companyList = [] } = data;
  state.menuList = menuDtoList;
  state.user = data;
  state.token = token;
  const companyLogo = data.appConfigurationDtoList?.filter(d => d?.appconfigurationkey === "CompanyLogo") || "";
  const defLogo = data.appConfigurationDtoList?.filter(d => d?.appconfigurationkey === "DefaultLogo") || "";
  const cmpLogo = data?.companyList?.length > 0 ? data.companyList[0].logourl : "";
  localStorage.setItem("menuList", JSON.stringify(menuDtoList));
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  const decodedData = jwtDecode(token);
  localStorage.setItem("userId", decodedData.UserId);
  localStorage.setItem("profileImage", decodedData.Profilephotopath);
  localStorage.setItem("userLoginInfoId", userLoginInfoId);
  localStorage.setItem("userroleid", parseInt(decodedData.UserroleId));
  state.userroleid = parseInt(decodedData.UserroleId);
  localStorage.setItem("userDetails", JSON.stringify(decodedData));
  localStorage.setItem("pushnotification", decodedData?.Pushnotification?.toLowerCase() === "true");
  localStorage.setItem("logo", decodedData?.role?.toLowerCase() === "candidate" ? "" : cmpLogo?.length > 0 ? cmpLogo
    : companyLogo?.length > 0 ? companyLogo[0]?.appconfigurationvalue : defLogo?.length > 0 ? defLogo[0]?.appconfigurationvalue : "");
  localStorage.setItem("emailnotification", decodedData?.Emailnotification?.toLowerCase() === "true");
  // Note: isCompanyAdmin is intentionally NOT updated here.
  // switchToHiringManagerThunk and switchBackToAdminThunk manage it explicitly.
  if (companyList && companyList.length > 0) {
    localStorage.setItem("companyList", JSON.stringify(companyList));
  }
  state.loader = false;
};

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
    loader: false,
    interviewSessionAccess: null,
    selectedHiringManagerId: localStorage.getItem("selectedHiringManagerId")
      ? parseInt(localStorage.getItem("selectedHiringManagerId"))
      : null,
    isSwitching: false,
    switchError: null,
    isCompanyAdmin: localStorage.getItem("adminOriginalIsCompanyAdmin") !== null
      ? localStorage.getItem("adminOriginalIsCompanyAdmin") === "true"
      : localStorage.getItem("isCompanyAdmin") === "true",
  },
  reducers: {
    logout: (state) => {
      handleLogoutSuccess(state);
    },
  },

  extraReducers: {
    [loginThunk.pending]: (state, { payload }) => {
      state.error = null;
      state.loader = true;
    },
    [loginThunk.fulfilled]: (state, { payload: { data = {} } = {} }) => {
      handleLoginSuccess(state, data);
    },
    [loginThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loader = false;
    },
    [registerThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [registerThunk.fulfilled]: (state, { payload = {} }) => {
      history.navigate("/registration-success");
    },
    [registerThunk.rejected]: (state, action) => {
      state.error = null;
    },

    [forgotPasswordThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [forgotPasswordThunk.fulfilled]: (state, { payload = {} }) => { },
    [forgotPasswordThunk.rejected]: (state, action) => {
      state.error = null;
    },

    [userRegisterThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [userRegisterThunk.fulfilled]: (state, { payload = {} }) => { },
    [userRegisterThunk.rejected]: (state, action) => {
      state.error = null;
    },
    [verifyOTPThunk.pending]: (state, { payload }) => {
      state.error = null;
    },
    [verifyOTPThunk.fulfilled]: (state, { payload = {} }) => { },
    [verifyOTPThunk.rejected]: (state, action) => {
      state.error = null;
    },

    [userRegisterThunkNew.pending]: (state, { payload }) => {
      state.error = null;
    },
    [userRegisterThunkNew.fulfilled]: (state, { payload = {} }) => { },
    [userRegisterThunkNew.rejected]: (state, action) => {
      state.error = null;
    },
    [generateToken.pending]: (state, { payload }) => {
      state.error = null;
    },
    [generateToken.fulfilled]: (state, { payload = {} }) => { },
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
      state.error = null;
    },

    [putRegisterCustomer.pending]: (state, { payload }) => {
      state.error = null;
    },
    [putRegisterCustomer.fulfilled]: (state, { payload = {} }) => {
      localStorage.setItem("iscustomerreg", payload?.data?.customerid);
      state.error = null;

      if (payload?.data?.token) {
        let data = payload.data;
        const { token, refreshToken, menuDtoList = [], userLoginInfoId, companyList = [] } = data;
        state.menuList = menuDtoList;
        state.user = data;
        state.token = token;
        let companyLogo = data.appConfigurationDtoList.filter((d) => {
          return d?.appconfigurationkey === "CompanyLogo";
        });
        let defLogo = data.appConfigurationDtoList.filter((d) => {
          return d?.appconfigurationkey === "DefaultLogo";
        });
        let cmpLogo =
          data?.companyList?.length > 0 ? data.companyList[0].logourl : "";
        localStorage.setItem("menuList", JSON.stringify(menuDtoList)); // temp fix
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        const decodedData = jwtDecode(token);
        localStorage.setItem("userId", decodedData.UserId);
        localStorage.setItem("profileImage", decodedData.Profilephotopath);
        localStorage.setItem("userLoginInfoId", userLoginInfoId);
        // localStorage.setItem(
        //   "userroleid",
        //   decodedData.role.toLowerCase() === "admin"
        //     ? 1
        //     : decodedData.role.toLowerCase() === "employer" ||
        //       decodedData.role.toLowerCase() === "hiring manager"
        //       ? 2
        //       : 3
        // );
        // state.userroleid =
        //   decodedData.role.toLowerCase() === "admin"
        //     ? 1
        //     : decodedData.role.toLowerCase() === "employer" ||
        //       decodedData.role.toLowerCase() === "hiring manager"
        //       ? 2
        //       : 3;
        localStorage.setItem("userroleid", parseInt(decodedData.UserroleId));
        state.userroleid = parseInt(decodedData.UserroleId);
        localStorage.setItem("userDetails", JSON.stringify(decodedData));
        localStorage.setItem(
          "pushnotification",
          decodedData?.Pushnotification?.toLowerCase() === "true"
        );
        localStorage.setItem(
          "logo",
          decodedData?.role?.toLowerCase() === "candidate"
            ? ""
            : cmpLogo?.length > 0
              ? cmpLogo
              : companyLogo?.length > 0
                ? companyLogo[0]?.appconfigurationvalue
                : defLogo?.length > 0
                  ? defLogo[0]?.appconfigurationvalue
                  : ""
        );
        localStorage.setItem(
          "emailnotification",
          decodedData?.Emailnotification?.toLowerCase() === "true"
        );
        if (decodedData?.UserroleId === "4") {
          localStorage.setItem("isCompanyAdmin", "true");
        } else if (decodedData?.UserroleId === "2") {
          localStorage.setItem("isCompanyAdmin", data?.isCompanyAdmin);
        }
        localStorage.setItem(
          "emailnotification",
          decodedData?.Emailnotification?.toLowerCase() === "true"
        );
        // get return url from location state or default to home page
        const { from } = history.location.state || {
          from: { pathname: "/" },
        };

        if (companyList && companyList.length > 0) {
          localStorage.setItem("companyList", JSON.stringify(companyList));
        }

        state.loader = false;
        history.navigate(from);
      }
    },
    [putRegisterCustomer.rejected]: (state, action) => {
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
      handleLogoutSuccess(state);
    },
    [logoutThunk.rejected]: (state, action) => {
      // API call failed — still clear local session so the user isn't stuck
      handleLogoutSuccess(state);
    },
    [postAddAuditLogs.pending]: (state, { payload }) => {
      // do nothing
    },
    [postAddAuditLogs.fulfilled]: (state, { payload = {} }) => {
      // do nothing
    },
    [postAddAuditLogs.rejected]: (state, action) => {
      // do nothing
    },
    [loginWithOTP.pending]: (state, { payload }) => {
      // do nothing
    },
    [loginWithOTP.fulfilled]: (state, { payload: { data = {} } = {} }) => {
      if (data?.token) {
        handleLoginSuccess(state, data);
      }
    },
    [loginWithOTP.rejected]: (state, action) => {
      // do nothing
    },

    [candRegisterOTPThunk.pending]: (state, { payload }) => {
      // do nothing
    },
    [candRegisterOTPThunk.fulfilled]: (
      state,
      { payload: { data = {} } = {} }
    ) => {
      if (data?.token) {
        const { token, refreshToken, menuDtoList = [], userLoginInfoId, companyList = [] } = data;
        state.menuList = menuDtoList;
        state.user = data;
        state.token = token;
        let companyLogo = data.appConfigurationDtoList.filter((d) => {
          return d?.appconfigurationkey === "CompanyLogo";
        });
        let defLogo = data.appConfigurationDtoList.filter((d) => {
          return d?.appconfigurationkey === "DefaultLogo";
        });
        let cmpLogo =
          data?.companyList?.length > 0 ? data.companyList[0].logourl : "";
        localStorage.setItem("menuList", JSON.stringify(menuDtoList)); // temp fix
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        const decodedData = jwtDecode(token);
        localStorage.setItem("userId", decodedData.UserId);
        localStorage.setItem("profileImage", decodedData.Profilephotopath);
        localStorage.setItem("userLoginInfoId", userLoginInfoId);
        // localStorage.setItem(
        //   "userroleid",
        //   decodedData.role.toLowerCase() === "admin"
        //     ? 1
        //     : decodedData.role.toLowerCase() === "employer" ||
        //       decodedData.role.toLowerCase() === "hiring manager"
        //       ? 2
        //       : 3
        // );
        // state.userroleid =
        //   decodedData.role.toLowerCase() === "admin"
        //     ? 1
        //     : decodedData.role.toLowerCase() === "employer" ||
        //       decodedData.role.toLowerCase() === "hiring manager"
        //       ? 2
        //       : 3;
        localStorage.setItem("userroleid", parseInt(decodedData.UserroleId));
        state.userroleid = parseInt(decodedData.UserroleId);
        localStorage.setItem("userDetails", JSON.stringify(decodedData));
        localStorage.setItem(
          "pushnotification",
          decodedData?.Pushnotification?.toLowerCase() === "true"
        );
        localStorage.setItem(
          "logo",
          decodedData?.role?.toLowerCase() === "candidate"
            ? ""
            : cmpLogo?.length > 0
              ? cmpLogo
              : companyLogo?.length > 0
                ? companyLogo[0]?.appconfigurationvalue
                : defLogo?.length > 0
                  ? defLogo[0]?.appconfigurationvalue
                  : ""
        );
        localStorage.setItem(
          "emailnotification",
          decodedData?.Emailnotification?.toLowerCase() === "true"
        );
        // get return url from location state or default to home page
        const { from } = history.location.state || {
          from: { pathname: "/" },
        };
        if (companyList && companyList.length > 0) {
          localStorage.setItem("companyList", JSON.stringify(companyList));
        }
        state.loader = false;
        history.navigate(from);
      }
    },
    [candRegisterOTPThunk.rejected]: (state, action) => {
      // do nothing
    },
    [postCompanyReferralLogs.pending]: (state, { payload }) => { },
    [postCompanyReferralLogs.fulfilled]: (state, { payload }) => { },
    [postCompanyReferralLogs.rejected]: (state, action) => { },
    [putCompanyReferralLogs.pending]: (state, { payload }) => { },
    [putCompanyReferralLogs.fulfilled]: (state, { payload }) => { },
    [putCompanyReferralLogs.rejected]: (state, action) => { },
    [postInterviewSessionAccess.pending]: (state, { payload }) => {
      state.interviewSessionAccess = null;
    },
    [postInterviewSessionAccess.fulfilled]: (state, { payload }) => {
      state.interviewSessionAccess = payload.data;
    },
    [postInterviewSessionAccess.rejected]: (state, action) => { },
    [switchToHiringManagerThunk.pending]: (state) => {
      state.isSwitching = true;
      state.switchError = null;
    },
    [switchToHiringManagerThunk.fulfilled]: (state, action) => {
      const { data = {} } = action.payload || {};
      // action.meta.arg is the hiringManagerUserId passed to the thunk —
      // safer than decoding the JWT inside a reducer.
      const hiringManagerUserId = action.meta.arg;

      // Persist the original admin session on the FIRST switch only.
      // These keys are immutable until logout — every subsequent switch
      // still uses adminOriginalToken for the API call via callSwitchAPI.
      if (!localStorage.getItem("adminOriginalUserId")) {
        localStorage.setItem("adminOriginalUserId", localStorage.getItem("userId"));
        localStorage.setItem("adminOriginalToken", localStorage.getItem("token"));
        localStorage.setItem("adminOriginalRefreshToken", localStorage.getItem("refreshToken"));
        localStorage.setItem("adminOriginalUserDetails", localStorage.getItem("userDetails"));
        localStorage.setItem("adminOriginalUserLoginInfoId", localStorage.getItem("userLoginInfoId"));
        // Freeze isCompanyAdmin — the admin flag belongs to the original user,
        // not to whoever is currently being impersonated.
        localStorage.setItem("adminOriginalIsCompanyAdmin", localStorage.getItem("isCompanyAdmin"));
        // Freeze the full menu list so admin-only items (Master, ATS Master) are
        // restored when switching back — the SwitchToHiringManager API never
        // returns those menus even on reset. Only save if a value actually exists.
        const currentMenuList = localStorage.getItem("menuList");
        if (currentMenuList) {
          localStorage.setItem("adminOriginalMenuList", currentMenuList);
        }
      }

      localStorage.setItem("selectedHiringManagerId", String(hiringManagerUserId));
      state.selectedHiringManagerId = hiringManagerUserId;
      handleSwitchContext(state, data);

      // Restore isCompanyAdmin to the original admin's value — handleSwitchContext
      // would otherwise reflect the switched user's value.
      const originalIsCompanyAdmin = localStorage.getItem("adminOriginalIsCompanyAdmin");
      localStorage.setItem("isCompanyAdmin", originalIsCompanyAdmin);
      state.isCompanyAdmin = originalIsCompanyAdmin === "true";

      state.isSwitching = false;
    },
    [switchToHiringManagerThunk.rejected]: (state, action) => {
      state.isSwitching = false;
      state.switchError = action.payload || action.error?.message;
    },
    [switchBackToAdminThunk.pending]: (state) => {
      state.isSwitching = true;
      state.switchError = null;
    },
    [switchBackToAdminThunk.fulfilled]: (state, action) => {
      const { data = {} } = action.payload || {};

      // Only apply the context update if we received a valid token.
      // If not, we still clear the switch state so the UI isn't stuck.
      if (data?.token) {
        handleSwitchContext(state, data);
        // Restore the original admin menu list — the SwitchToHiringManager API
        // never returns admin-only menus (Master, ATS Master) even on reset.
        const originalMenuList = localStorage.getItem("adminOriginalMenuList");
        if (originalMenuList) {
          try {
            const parsed = JSON.parse(originalMenuList);
            // Only apply if it's a valid array — guards against "null" or corrupted values
            if (Array.isArray(parsed)) {
              state.menuList = parsed;
              localStorage.setItem("menuList", originalMenuList);
            }
          } catch (e) {
            // Malformed JSON — leave state.menuList as set by handleSwitchContext
          }
        }
      }

      // Always clean up switch context — admin is back to their own session.
      localStorage.removeItem("adminOriginalUserId");
      localStorage.removeItem("adminOriginalToken");
      localStorage.removeItem("adminOriginalRefreshToken");
      localStorage.removeItem("adminOriginalUserDetails");
      localStorage.removeItem("adminOriginalUserLoginInfoId");
      localStorage.removeItem("adminOriginalIsCompanyAdmin");
      localStorage.removeItem("adminOriginalMenuList");
      localStorage.removeItem("selectedHiringManagerId");
      localStorage.removeItem("selectedHiringManagerName");

      state.selectedHiringManagerId = null;
      // isCompanyAdmin is now read from the restored localStorage value set
      // by handleSwitchContext (admin's own data) or preserved from login.
      state.isCompanyAdmin = localStorage.getItem("isCompanyAdmin") === "true";
      state.isSwitching = false;
    },
    [switchBackToAdminThunk.rejected]: (state, action) => {
      state.isSwitching = false;
      state.switchError = action.payload || action.error?.message;
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
  putRegisterCustomer,
  postAddAuditLogs,
  loginWithOTP,
  candRegisterOTPThunk,
  postCompanyReferralLogs,
  putCompanyReferralLogs,
  postInterviewSessionAccess,
  switchToHiringManagerThunk,
  switchBackToAdminThunk,
};

export const authReducer = authSlice.reducer;
