import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "../../../_helpers";

// create slice
const name = "customerCandidateList";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const customerCandidateListsActions = {
  ...slice.actions,
  ...extraActions,
};
export const customerCandidateListsReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    loading: false,
    jobLists: [],
    rejectDrpDwnList: [],
    candidateList: [],
    totalRecords: 0,
    durationOptions: [],
  };
}

function createExtraActions() {
  const newUrl = `${process.env.REACT_APP_NEW_API_URL}`;
  return {
    getDrpDwnJobLists: getDrpDwnJobLists(),
    getRejectDropDown: getRejectDropDown(),
    getCandidateLists: getCandidateLists(),
    putLikedCandidate: putLikedCandidate(),
    putMayBeCandidate: putMayBeCandidate(),
    putRejectCandidate: putRejectCandidate(),
    putAcceptedCandidate: putAcceptedCandidate(),
    getDurationOptions: getDurationOptions(),
    postScheduleInterview: postScheduleInterview(),
  };

  function getDrpDwnJobLists() {
    return createAsyncThunk(
      `${name}/getDrpDwnJobLists`,

      async () => await fetchWrapper.get(`${newUrl}/Job/GetJobDropdown`)
    );
  }

  function getRejectDropDown() {
    return createAsyncThunk(
      `${name}/getRejectDropDown`,

      async () =>
        await fetchWrapper.get(
          `${newUrl}/RejectionReason/GetRejectionReasonDropdown`
        )
    );
  }

  function getCandidateLists() {
    return createAsyncThunk(
      `${name}/getCandidateLists`,

      async ({
        pageNumber,
        pageSize,
        // isCustomerLike,
        // isCustomerMaybe,
        // isCustomerAccepted,
        // isCustomerReject,
        // isCustomerScheduled,
        // isCandidateApply,
        customerRecommendedJobStatusId,
        jobId,
      }) =>
        await fetchWrapper.get(
          `${newUrl}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?pageSize=${pageSize}&pageNumber=${pageNumber}&customerRecommendedJobStatusId=${customerRecommendedJobStatusId}&jobId=${jobId}&isActive=true`
        )
    );
  }

  function putLikedCandidate() {
    return createAsyncThunk(
      `${name}/putLikedCandidate`,

      async ({ id }) =>
        await fetchWrapper.put(
          `${newUrl}/CandidateRecommendedJob/customerLiked/${id}`
        )
    );
  }

  function putMayBeCandidate() {
    return createAsyncThunk(
      `${name}/putMayBeCandidate`,

      async ({ id }) =>
        await fetchWrapper.put(
          `${newUrl}/CandidateRecommendedJob/customerMaybe/${id}`
        )
    );
  }

  function putRejectCandidate() {
    return createAsyncThunk(
      `${name}/putRejectCandidate`,

      async ({
        id,
        customerrejectedcomment,
        customerrejectedreasonid,
        currentUserId,
      }) =>
        await fetchWrapper.put(
          `${newUrl}/CandidateRecommendedJob/customerRejected/${id}`,
          { customerrejectedcomment, customerrejectedreasonid, currentUserId }
        )
    );
  }

  function putAcceptedCandidate() {
    return createAsyncThunk(
      `${name}/putAcceptedCandidate`,

      async ({ id }) =>
        await fetchWrapper.put(
          `${newUrl}/CandidateRecommendedJob/customerAccepted/${id}`
        )
    );
  }
  function getDurationOptions() {
    return createAsyncThunk(
      `${name}/getDurationOptions`,

      async () =>
        await fetchWrapper.get(
          `${newUrl}/Common/GetCommonDropdown?searchText=duration`
        )
    );
  }

  function postScheduleInterview() {
    return createAsyncThunk(
      `${name}/postScheduleInterview`,

      async (payload) =>
        await fetchWrapper.post(`${newUrl}/ScheduledInterview`, payload)
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getDrpDwnJobLists();
    getRejectDropDown();
    getCandidateLists();
    putLikedCandidate();
    putMayBeCandidate();
    putRejectCandidate();
    putAcceptedCandidate();
    getDurationOptions();
    postScheduleInterview();

    function getDrpDwnJobLists() {
      let { pending, fulfilled, rejected } = extraActions.getDrpDwnJobLists;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.loading = false;
          state.jobLists = action?.payload?.data ? action.payload.data : [];
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
        });
    }

    function getRejectDropDown() {
      let { pending, fulfilled, rejected } = extraActions.getRejectDropDown;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.loading = false;
          state.rejectDrpDwnList = action?.payload?.data
            ? action?.payload?.data
            : [];
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
        });
    }

    function getCandidateLists() {
      let { pending, fulfilled, rejected } = extraActions.getCandidateLists;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.loading = false;
          state.candidateList = action?.payload?.data
            ?.candidateRecommendedJobDtoList
            ? action?.payload?.data?.candidateRecommendedJobDtoList
            : [];

          state.totalRecords = action?.payload?.data?.totalRows
            ? action?.payload?.data?.totalRows
            : 0;
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
        });
    }

    function putLikedCandidate() {
      let { pending, fulfilled, rejected } = extraActions.putLikedCandidate;
      builder
        .addCase(pending, (state) => {
          //no action
        })
        .addCase(fulfilled, (state, action) => {
          //no action
        })
        .addCase(rejected, (state, action) => {
          //no action
        });
    }

    function putMayBeCandidate() {
      let { pending, fulfilled, rejected } = extraActions.putMayBeCandidate;
      builder
        .addCase(pending, (state) => {
          //no action
        })
        .addCase(fulfilled, (state, action) => {
          //no action
        })
        .addCase(rejected, (state, action) => {
          //no action
        });
    }

    function putRejectCandidate() {
      let { pending, fulfilled, rejected } = extraActions.putRejectCandidate;
      builder
        .addCase(pending, (state) => {
          //no action
        })
        .addCase(fulfilled, (state, action) => {
          //no action
        })
        .addCase(rejected, (state, action) => {
          //no action
        });
    }

    function putAcceptedCandidate() {
      let { pending, fulfilled, rejected } = extraActions.putAcceptedCandidate;
      builder
        .addCase(pending, (state) => {
          //no action
        })
        .addCase(fulfilled, (state, action) => {
          //no action
        })
        .addCase(rejected, (state, action) => {
          //no action
        });
    }

    function getDurationOptions() {
      let { pending, fulfilled, rejected } = extraActions.getDurationOptions;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.loading = false;
          state.durationOptions = action?.payload?.data
            ? action.payload.data
            : [];
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
        });
    }

    function postScheduleInterview() {
      let { pending, fulfilled, rejected } = extraActions.postScheduleInterview;
      builder
        .addCase(pending, (state) => {
          //No action
        })
        .addCase(fulfilled, (state, action) => {
          //No action
        })
        .addCase(rejected, (state, action) => {
          //No action
        });
    }
  };
}
