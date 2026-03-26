import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";


const name = "feedback";

export const addFeedbackThunk = createAsyncThunk(
  `${name}/addFeedbackThunk`,
  async (feedback_data) => {
    const END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/RatingsAndFeedback`;

    const formData = new FormData();

    formData.append("FeedbackTypeId", feedback_data.feedbackTypeId);
    formData.append("FeedbackStatusId", feedback_data.feedbackStatusId);
    formData.append("Subject", feedback_data.subject);
    formData.append("Feedback", feedback_data.feedback);
    formData.append("CreatedBy", feedback_data.createdBy);

    if (feedback_data.file) {
      formData.append("File", feedback_data.file);
    }

    return fetchWrapper.postForm(END_POINT, formData);
  }
);

export const updateFeedbackThunk = createAsyncThunk(
  `${name}/updateFeedbackThunk`,
  async ({ id, feedback_data }) => {
    const END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/RatingsAndFeedback/UpdateFeedbackByAdmin/${id}`;

    const formData = new FormData();

    formData.append("FeedbackStatusId", feedback_data.feedbackStatusId);
    formData.append("Response", feedback_data.response);
    formData.append("ModifiedBy", feedback_data.modifiedBy);

    if (feedback_data.responseFile) {
      formData.append("ResponseFile", feedback_data.responseFile);
    }

    return fetchWrapper.putForm(END_POINT, formData);
  }
);

export const getFeedbackListThunk = createAsyncThunk(
  `${name}/getFeedbackListThunk`,
  async ({ pageNumber = 1, pageSize = 10 }) => {
    const END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/Fetch_RatingsAndFeedback_List?parameter=@currentpage=${pageNumber},@pagesize=${pageSize}`;

    return await fetchWrapper.get(END_POINT);
  }
);

// Get FeedbackType list
export const getFeedbackTypeList = createAsyncThunk(`${name}/getFeedbackTypeList`, async () => {
  return await fetchWrapper.get(
    `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=FeedbackTypes`
  );
});



const feedbackSlice = createSlice({
  name,
  initialState: {
    feedback_data_profile: [],
      loading: false,
      typeLoading: false,
      error: null,
      totalRows: 0,
      feedbackTypeList: [],
  },
  reducers: {},

  extraReducers: {
    [addFeedbackThunk.pending]: (state) => {
      state.error = null;
    },
    [addFeedbackThunk.fulfilled]: (state, action) => {
        state.response = action.payload;   
        state.error = null;
    },
    [addFeedbackThunk.rejected]: (state, action) => {
      state.error = action.error?.message;
    },

    [updateFeedbackThunk.pending]: (state) => {
      state.error = null;
    },
    [updateFeedbackThunk.fulfilled]: (state, payload) => {},
    [updateFeedbackThunk.rejected]: (state, action) => {
      state.error = action.error?.message;
    },
    [getFeedbackListThunk.pending]: (state) => {
        state.loading = true;
        state.error = null;
    },

    [getFeedbackListThunk.fulfilled]: (state, action) => {
     state.loading = false;
     const res = action.payload;
     state.feedback_data_profile = res?.data?.data || [];
     state.totalRows = res?.data?.totalRows || 0;
    },

    [getFeedbackListThunk.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
    },
   [getFeedbackTypeList.pending]: (state) => {
         state.typeLoading = true;
         state.error = null;
    },
    [getFeedbackTypeList.fulfilled]: (state, { payload = {} }) => {
         const { data } = payload;
         state.typeLoading = false;
         state.feedbackTypeList = data;
    },
    [getFeedbackTypeList.rejected]: (state, action) => {
         state.typeLoading = false;
         state.error = action.error?.message;
    }, 
  },
});



export const feedbackActions = {
  ...feedbackSlice.actions,
  addFeedbackThunk,
  updateFeedbackThunk,
  getFeedbackListThunk,
  getFeedbackTypeList,
};

export const feedbackReducer = feedbackSlice.reducer;