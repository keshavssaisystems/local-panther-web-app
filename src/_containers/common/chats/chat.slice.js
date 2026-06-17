import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "chat";

// getCustomerListThunk thunk
export const getCustomerListThunk = createAsyncThunk(
  `${name}/getCustomerListThunk`,
  async () => {
    let userId = Number(localStorage.getItem("userId"));
    const CUSTOMER_LIST = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=ScheduledCustomerListByUserId&commonId=${userId}`;
    return await fetchWrapper.get(CUSTOMER_LIST);
  }
);

// getCandidateListThunk thunk
export const getCandidateListThunk = createAsyncThunk(
  `${name}/getCandidateListThunk`,
  async () => {
    let userId = Number(localStorage.getItem("userId"));
    const CANDIDATE_LIST = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=ScheduledCandidateListByUserId&commonId=${userId}`;
    return await fetchWrapper.get(CANDIDATE_LIST);
  }
);

// getCompletedCustomerListThunk thunk
export const getCompletedCustomerListThunk = createAsyncThunk(
  `${name}/getCompletedCustomerListThunk`,
  async () => {
    let userId = Number(localStorage.getItem("userId"));
    const CUSTOMER_LIST = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=GetCompletedInterviewCustomerList&commonId=${userId}`;
    return await fetchWrapper.get(CUSTOMER_LIST);
  }
);

// sendChatNotification thunk - posts chat notification metadata to backend
export const sendChatNotification = createAsyncThunk(
  `${name}/sendChatNotification`,
  async ({ receiverId, groupId, messagePreview, redirectUrl }, { rejectWithValue }) => {
    const END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Notification/SendChatNotification`;
    const payload = {
      ReceiverId: Number(receiverId),
      GroupId: groupId,
      MessagePreview: messagePreview,
      RedirectUrl: redirectUrl,
    };
    try {
      const response = await fetchWrapper.post(END_POINT, payload);
      return response;
    } catch (err) {
      const message = err?.message || err || "SendChatNotification failed";
      return rejectWithValue({ status: "Failed", message });
    }
  }
);

// trackChatMessage thunk - registers or refreshes a delayed-email tracking row
export const trackChatMessage = createAsyncThunk(
  `${name}/trackChatMessage`,
  async ({ groupId, receiverUserId, redirectUrl }, { rejectWithValue }) => {
    const END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ChatMessageNotificationTracking`;
    const payload = {
      GroupId: groupId,
      ReceiverUserId: Number(receiverUserId),
      RedirectUrl: redirectUrl,
    };
    try {
      return await fetchWrapper.post(END_POINT, payload);
    } catch (err) {
      return rejectWithValue({ status: "Failed", message: err?.message || "trackChatMessage failed" });
    }
  }
);

// markChatAsRead thunk - cancels a pending delayed email for this chat room.
export const markChatAsRead = createAsyncThunk(
  `${name}/markChatAsRead`,
  async (groupId, { rejectWithValue }) => {
    const END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ChatMessageNotificationTracking/MarkAsRead?groupId=${encodeURIComponent(groupId)}`;
    try {
      return await fetchWrapper.patch(END_POINT);
    } catch (err) {
      return rejectWithValue({ status: "Failed", message: err?.message || "markChatAsRead failed" });
    }
  }
);
// Create the slice
const chatSlice = createSlice({
  name,
  initialState: {
    customerList: [],
    candidateList: [],
    completedCustomerList: [],
    loading: false,
  },
  reducers: {},

  extraReducers: {
    [getCustomerListThunk.pending]: (state) => {
      state.loading = true;
      state.customerList = [];
    },
    [getCustomerListThunk.fulfilled]: (state, action) => {
      state.customerList = action.payload.data;
      state.loading = false;
    },
    [getCustomerListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getCandidateListThunk.pending]: (state) => {
      state.loading = true;
      state.candidateList = [];
    },
    [getCandidateListThunk.fulfilled]: (state, action) => {
      state.candidateList = action.payload.data;
      state.loading = false;
    },
    [getCandidateListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getCompletedCustomerListThunk.pending]: (state) => {
      state.loading = true;
      state.completedCustomerList = [];
    },
    [getCompletedCustomerListThunk.fulfilled]: (state, action) => {
      state.completedCustomerList = action.payload.data;
      state.loading = false;
    },
    [getCompletedCustomerListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const chatActions = {
  ...chatSlice.actions,
  getCustomerListThunk,
  getCandidateListThunk,
  getCompletedCustomerListThunk,
  sendChatNotification,
  trackChatMessage,
  markChatAsRead,
};

export const chatReducer = chatSlice.reducer;
