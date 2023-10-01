import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "../../../_helpers";

// create slice
const name = "candidateList";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const candidateListsActions = { ...slice.actions, ...extraActions };
export const candidateListsReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    loading: false,
    jobLists: [],
    rejectDrpDwnList: [],
    candidateList: [],
    totalRecords: 0,
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
        isCustomerLike,
        isCustomerMaybe,
        isCustomerAccepted,
        isCustomerReject,
        isCustomerScheduled,
        isCandidateApply,
        jobId,
      }) =>
        await fetchWrapper.get(
          `${newUrl}/CandidateRecommendedJob/GetRecommendedJobAndCandidateList?pageSize=${pageSize}&pageNumber=${pageNumber}&isCustomerLike=${isCustomerLike}&isCustomerMaybe=${isCustomerMaybe}&isCustomerAccepted=${isCustomerAccepted}&isCustomerReject=${isCustomerReject}&isCustomerScheduled=${isCustomerScheduled}&isCandidateApply=${isCandidateApply}`
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
  };
}
