import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = "scheduleInterview";

// getDurationThunk thunk
export const getDurationThunk = createAsyncThunk(
  `${name}/getDurationThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=duration`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// getScheduleInterviewThunk thunk
export const getScheduleInterviewThunk = createAsyncThunk(
  `${name}/getScheduleInterviewThunk`,
  async ({ selectedJobId, startdate, enddate }) => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?jobId=${selectedJobId}&isActive=true&isPaginationRequired=false&startDate=${startdate}&endDate=${enddate}`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// postScheduleInterviewThunk thunk
export const postScheduleInterviewThunk = createAsyncThunk(
  `${name}/postScheduleInterviewThunk`,
  async (payload) => {
    const POST_SCHEDULED_INTEVRIEW_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview`;
    return await fetchWrapper.post(POST_SCHEDULED_INTEVRIEW_END_POINT, payload);
  }
);

// getUpcomingInterviewListThunk thunk
export const getUpcomingInterviewListThunk = createAsyncThunk(
  `${name}/getUpcomingInterviewListThunk`,
  async ({ pageNo, start, end }) => {
    const UPCOMING_INTEVRIEW_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?pageSize=5&pageNumber=${pageNo}&isActive=true&startDate=${start}&endDate=${end}`;
    return await fetchWrapper.get(UPCOMING_INTEVRIEW_END_POINT);
  }
);

// getUpcomingInterviewListWOPaginationThunk thunk
export const getUpcomingInterviewListWOPaginationThunk = createAsyncThunk(
  `${name}/getUpcomingInterviewListWOPaginationThunk`,
  async ({ start, end }) => {
    const UPCOMING_INTEVRIEW_END_POINT_V2 = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?pageNumber=1&isActive=true&startDate=${start}&endDate=${end}&isPaginationRequired=false`;
    return await fetchWrapper.get(UPCOMING_INTEVRIEW_END_POINT_V2);
  }
);

// updateInterviewNotesThunk thunk
export const updateInterviewNotesThunk = createAsyncThunk(
  `${name}/updateInterviewNotesThunk`,
  async ({ scheduleinterviewid, notesdata }) => {
    const UPDATE_INTERVIEW_NOTES_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/TakeInterviewNotes/${scheduleinterviewid}`;
    return await fetchWrapper.put(UPDATE_INTERVIEW_NOTES_END_POINT, notesdata);
  }
);

// updateInterviewerListThunk thunk
export const updateInterviewerListThunk = createAsyncThunk(
  `${name}/updateInterviewerListThunk`,
  async ({ scheduleinterviewid, invitedata }) => {
    const UPDATE_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/InviteToInterview/${scheduleinterviewid}`;
    return await fetchWrapper.put(UPDATE_INTERVIEWER_END_POINT, invitedata);
  }
);

// cancelInterviewThunk thunk
export const cancelInterviewThunk = createAsyncThunk(
  `${name}/cancelInterviewThunk`,
  async ({ scheduleinterviewid, payload }) => {
    const CANCEL_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/cancelInterview/${scheduleinterviewid}`;
    return await fetchWrapper.put(CANCEL_INTERVIEWER_END_POINT, payload);
  }
);

// updateScheduledInterviewThunk thunk
export const updateScheduledInterviewThunk = createAsyncThunk(
  `${name}/updateScheduledInterviewThunk`,
  async ({ scheduleinterviewid, formData }) => {
    const UPDATE_SCHEDULED_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/${scheduleinterviewid}`;
    return await fetchWrapper.put(
      UPDATE_SCHEDULED_INTERVIEWER_END_POINT,
      formData
    );
  }
);

// getUpcomingInterviewListWOPaginationThunk thunk
export const getAllInterviewThunk = createAsyncThunk(
  `${name}/getAllInterviewThunk`,
  async () => {
    const UPCOMING_INTEVRIEW_END_POINT_V3 = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?pageNumber=1&isActive=true&isPaginationRequired=false`;
    return await fetchWrapper.get(UPCOMING_INTEVRIEW_END_POINT_V3);
  }
);
// getSchedulesByCandidateId thunk
export const getSchedulesByCandidateId = createAsyncThunk(
  `${name}/getSchedulesByCandidateId`,
  async ({ candidateId, start, end }) => {
    const UPCOMING_INTEVRIEW_END_POINT_V2 = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview?pageSize=10&pageNumber=1&candidateId=${candidateId}&startDate=${start}&endDate=${end}&isActive=true&isPaginationRequired=false`;
    return await fetchWrapper.get(UPCOMING_INTEVRIEW_END_POINT_V2);
  }
);

// acceptInterviewThunk thunk
export const acceptInterviewThunk = createAsyncThunk(
  `${name}/acceptInterviewThunk`,
  async ({ scheduleinterviewid }) => {
    const ACCEPT_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/candidateAcceptInterview/${scheduleinterviewid}`;
    return await fetchWrapper.put(ACCEPT_INTERVIEWER_END_POINT);
  }
);

// rejectInterviewThunk thunk
export const rejectInterviewThunk = createAsyncThunk(
  `${name}/rejectInterviewThunk`,
  async ({ scheduleinterviewid, payload }) => {
    const REJECT_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/candidateRejectInterview/${scheduleinterviewid}`;
    return await fetchWrapper.put(REJECT_INTERVIEWER_END_POINT, payload);
  }
);

// getPreScreenQuestionsThunk thunk
export const getPreScreenQuestionsThunk = createAsyncThunk(
  `${name}/getPreScreenQuestionsThunk`,
  async (jobId) => {
    const PRESCREEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/JobPrescreenApplication?pageSize=10&pageNumber=1&jobId=${jobId}`;
    return await fetchWrapper.get(PRESCREEN_END_POINT);
  }
);

// getInterviewStatusDropDownThunk thunk
export const getInterviewStatusDropDownThunk = createAsyncThunk(
  `${name}/getInterviewStatusDropDownThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=interviewstatus`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// interviewFeedbackThunk thunk
export const interviewFeedbackThunk = createAsyncThunk(
  `${name}/interviewFeedbackThunk`,
  async ({ scheduleinterviewid, payload }) => {
    const FEEDBACK_INTERVIEWER_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ScheduledInterview/AddInterviewFeedback/${scheduleinterviewid}`;
    return await fetchWrapper.put(FEEDBACK_INTERVIEWER_END_POINT, payload);
  }
);

// getInterviewGuideListThunk thunk
export const getInterviewGuideListThunk = createAsyncThunk(
  `${name}/getInterviewGuideListThunk`,
  async () => {
    const DROPDOWN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Common/GetCommonDropdown?searchText=Interview Guide`;
    return await fetchWrapper.get(DROPDOWN_END_POINT);
  }
);

// Create the slice
const scheduleInterviewSlice = createSlice({
  name,
  initialState: {
    duration: [],
    scheduleInterview: [],
    upcomingInterview: [],
    upcomingInterviewLoading: false,
    upcomingInterviewWOPagination: [],
    allInterview: [],
    candidateSchedules: [],
    prescreenQuestions: [],
    interviewStatus: [],
    interviewGuideList: [],
    loading: false,
  },
  reducers: {
    feedback: (state, action) => {
      let modifyScheduled = [];
      let modifyUpcoming = [];
      let modifyAllInterview = [];
      action?.payload?.scheduleInterviewList.forEach((element) => {
        let elementObject = {};
        if (
          element.scheduleinterviewid === action?.payload?.scheduleinterviewid
        ) {
          elementObject = element;
          let interviewstatusid = {
            interviewstatusid: action?.payload?.interviewstatusid,
            interviewfeedback: action?.payload?.interviewfeedback,
          };
          elementObject = {
            ...elementObject,
            ...interviewstatusid,
          };
        } else {
          elementObject = element;
        }
        modifyScheduled?.push(elementObject);
      });
      action?.payload?.upcomingInterviewList?.forEach((element) => {
        let elementObject = {};
        if (
          element.scheduleinterviewid === action?.payload?.scheduleinterviewid
        ) {
          elementObject = element;
          let interviewstatusid = {
            interviewstatusid: action?.payload?.interviewstatusid,
            interviewfeedback: action?.payload?.interviewfeedback,
          };
          elementObject = {
            ...elementObject,
            ...interviewstatusid,
          };
        } else {
          elementObject = element;
        }
        modifyUpcoming?.push(elementObject);
      });
      action?.payload?.allInterviewList.forEach((element) => {
        let elementObject = {};
        if (
          element.scheduleinterviewid === action?.payload?.scheduleinterviewid
        ) {
          elementObject = element;
          let interviewstatusid = {
            interviewstatusid: action?.payload?.interviewstatusid,
            interviewfeedback: action?.payload?.interviewfeedback,
          };
          elementObject = {
            ...elementObject,
            ...interviewstatusid,
          };
        } else {
          elementObject = element;
        }
        modifyAllInterview?.push(elementObject);
      });
      state.scheduleInterview.scheduledInterviewList = modifyScheduled;
      state.upcomingInterview.scheduledInterviewList = modifyUpcoming;
      state.allInterview.scheduledInterviewList = modifyAllInterview;
    },
  },

  extraReducers: {
    [getDurationThunk.pending]: (state) => {
      state.loading = true;
    },
    [getDurationThunk.fulfilled]: (state, action) => {
      state.duration = action.payload.data;
      state.loading = false;
    },
    [getDurationThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getScheduleInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [getScheduleInterviewThunk.fulfilled]: (state, action) => {
      state.scheduleInterview = action.payload.data;
      state.loading = false;
    },
    [getScheduleInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [postScheduleInterviewThunk.pending]: (state, action) => {
      state.error = null;
    },
    [postScheduleInterviewThunk.fulfilled]: (state, action) => {
      state.error = null;
    },
    [postScheduleInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
    },
    [getUpcomingInterviewListThunk.pending]: (state) => {
      state.upcomingInterviewLoading = true;
    },
    [getUpcomingInterviewListThunk.fulfilled]: (state, action) => {
      state.upcomingInterview = action.payload.data;
      state.upcomingInterviewLoading = false;
    },
    [getUpcomingInterviewListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.upcomingInterviewLoading = true;
    },
    [getUpcomingInterviewListWOPaginationThunk.pending]: (state) => {
      state.loading = true;
    },
    [getUpcomingInterviewListWOPaginationThunk.fulfilled]: (state, action) => {
      state.upcomingInterviewWOPagination = action.payload.data;
      state.loading = false;
    },
    [getUpcomingInterviewListWOPaginationThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [updateInterviewNotesThunk.pending]: (state) => {
      state.loading = true;
    },
    [updateInterviewNotesThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [updateInterviewNotesThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [updateInterviewerListThunk.pending]: (state) => {
      state.loading = true;
    },
    [updateInterviewerListThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [updateInterviewerListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [cancelInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [cancelInterviewThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [cancelInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [updateScheduledInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [updateScheduledInterviewThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [updateScheduledInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getAllInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [getAllInterviewThunk.fulfilled]: (state, action) => {
      state.allInterview = action.payload.data;
      state.loading = false;
    },
    [getAllInterviewThunk.rejected]: (state, action) => {},
    [getSchedulesByCandidateId.pending]: (state) => {
      state.loading = true;
    },
    [getSchedulesByCandidateId.fulfilled]: (state, action) => {
      state.candidateSchedules = action.payload.data;
      state.loading = false;
    },
    [getSchedulesByCandidateId.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [acceptInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [acceptInterviewThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [acceptInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [rejectInterviewThunk.pending]: (state) => {
      state.loading = true;
    },
    [rejectInterviewThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [rejectInterviewThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getPreScreenQuestionsThunk.pending]: (state) => {
      state.loading = true;
    },
    [getPreScreenQuestionsThunk.fulfilled]: (state, action) => {
      state.prescreenQuestions = action.payload.data;
      state.loading = false;
    },
    [getPreScreenQuestionsThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getInterviewStatusDropDownThunk.pending]: (state) => {
      state.loading = true;
    },
    [getInterviewStatusDropDownThunk.fulfilled]: (state, action) => {
      state.interviewStatus = action.payload.data;
      state.loading = false;
    },
    [getInterviewStatusDropDownThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [interviewFeedbackThunk.pending]: (state) => {
      state.loading = true;
    },
    [interviewFeedbackThunk.fulfilled]: (state, action) => {
      state.error = null;
      state.loading = false;
    },
    [interviewFeedbackThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
    [getInterviewGuideListThunk.pending]: (state) => {
      state.loading = true;
    },
    [getInterviewGuideListThunk.fulfilled]: (state, action) => {
      state.interviewGuideList = action.payload.data;
      state.loading = false;
    },
    [getInterviewGuideListThunk.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Export the actions and reducer
export const scheduleInterviewActions = {
  ...scheduleInterviewSlice.actions,
  getScheduleInterviewThunk,
  postScheduleInterviewThunk,
  getUpcomingInterviewListThunk,
  getUpcomingInterviewListWOPaginationThunk,
  getDurationThunk,
  updateInterviewNotesThunk,
  updateInterviewerListThunk,
  cancelInterviewThunk,
  updateScheduledInterviewThunk,
  getAllInterviewThunk,
  getSchedulesByCandidateId,
  acceptInterviewThunk,
  rejectInterviewThunk,
  getPreScreenQuestionsThunk,
  getInterviewStatusDropDownThunk,
  interviewFeedbackThunk,
  getInterviewGuideListThunk,
};

export const scheduleInterviewReducer = scheduleInterviewSlice.reducer;
