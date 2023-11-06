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
    scheduledInterviewList: [],
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
    getScheduleListData: getScheduleListData(),
    getScheduleIVList: getScheduleIVList(),
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
      }) => {
        const recommendedStatus =
          customerRecommendedJobStatusId === 4
            ? `&customerRecommendedJobStatusId=${customerRecommendedJobStatusId}&candidateRecommendedJobStatusId=${customerRecommendedJobStatusId}`
            : customerRecommendedJobStatusId === 3
            ? `&candidateRecommendedJobStatusId=${customerRecommendedJobStatusId}`
            : `&customerRecommendedJobStatusId=${customerRecommendedJobStatusId}`;
        if (jobId !== undefined) {
          return await fetchWrapper.get(
            `${newUrl}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?isCandidate=false&pageSize=${pageSize}&pageNumber=${pageNumber}${recommendedStatus}&jobId=${jobId}&isActive=true`
          );
        } else {
          return await fetchWrapper.get(
            `${newUrl}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?isCandidate=false&pageSize=${pageSize}&pageNumber=${pageNumber}${recommendedStatus}&isActive=true`
          );
        }
      }
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

  function getScheduleListData() {
    return createAsyncThunk(
      `${name}/getScheduleListData`,

      async ({ jobId, pageNumber, pageSize }) =>
        await fetchWrapper.get(
          `${newUrl}/ScheduledInterview?jobId=${jobId}&isActive=true&pageNumber=${pageNumber}&pageSize=${pageSize}`
        )
    );
  }

  function getScheduleIVList() {
    return createAsyncThunk(
      `${name}/getScheduleIVList`,

      async (scheduleInterviewId) =>
        await fetchWrapper.get(
          `${newUrl}/ScheduledInterview?pageSize=10&pageNumber=1&scheduleInterviewId=${scheduleInterviewId}&isActive=true&isPaginationRequired=true`
        )
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
    getScheduleListData();
    getScheduleIVList();

    function getDrpDwnJobLists() {
      let { pending, fulfilled, rejected } = extraActions.getDrpDwnJobLists;
      builder
        .addCase(pending, (state) => {
          // state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.jobLists = action?.payload?.data ? action.payload.data : [];
          // state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          // state.loading = false;
        });
    }

    function getRejectDropDown() {
      let { pending, fulfilled, rejected } = extraActions.getRejectDropDown;
      builder
        .addCase(pending, (state) => {
          // state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.rejectDrpDwnList = action?.payload?.data
            ? action?.payload?.data
            : [];
          // state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          // state.loading = false;
        });
    }

    function getCandidateLists() {
      let { pending, fulfilled, rejected } = extraActions.getCandidateLists;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
          state.candidateList = [];
          state.totalRecords = 0;
        })
        .addCase(fulfilled, (state, action) => {
          state.candidateList = action?.payload?.data
            ?.candidateRecommendedJobDtoList
            ? action?.payload?.data?.candidateRecommendedJobDtoList
            : [];

          state.totalRecords = action?.payload?.data?.totalRows
            ? action?.payload?.data?.totalRows
            : 0;
          state.loading = false;
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
          // state.loading = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.durationOptions = action?.payload?.data
            ? action.payload.data
            : [];
          // state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          // state.loading = false;
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

    function getScheduleListData() {
      let { pending, fulfilled, rejected } = extraActions.getScheduleListData;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
          state.candidateList = [];
          state.totalRecords = 0;
        })
        .addCase(fulfilled, (state, action) => {
          state.candidateList = action?.payload?.data?.scheduledInterviewList
            ? action?.payload?.data?.scheduledInterviewList
            : [];

          state.totalRecords = action?.payload?.data?.totalRows
            ? action?.payload?.data?.totalRows
            : 0;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
        });
    }

    function getScheduleIVList() {
      let { pending, fulfilled, rejected } = extraActions.getScheduleIVList;
      builder
        .addCase(pending, (state) => {
          state.scheduledInterviewList = [];
        })
        .addCase(fulfilled, (state, action) => {
          state.scheduledInterviewList = action?.payload?.data
            ?.scheduledInterviewList
            ? action?.payload?.data?.scheduledInterviewList
            : [];
        })
        .addCase(rejected, (state, action) => {});
    }
  };
}
