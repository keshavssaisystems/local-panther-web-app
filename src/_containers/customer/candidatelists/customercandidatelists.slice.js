import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "../../../_helpers";
import { get } from "lodash";

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
    prescreenQues: [],
    custOfferHistory: [],
    offerLetterTemplates: [],
    reportData: null, // New state variable to store report data
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
    getPrescreenDetails: getPrescreenDetails(),
    getCustOfferHistory: getCustOfferHistory(),
    getofferLetterTemplate: getofferLetterTemplate(),
    getInterviewSlots: getInterviewSlots(),
    getReportBySP: getCandidateCardCount(), // New action for fetching report
    getPresentedCandidateLists: getPresentedCandidateLists(),
    putPresentCandidate: putPresentCandidate(),
    putCandidatePlaced: putCandidatePlaced()

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
        searchText,
        actionbyId = "",
        interviewStatusId,
        candidateInterviewStatusId,
        interviewScheduleDateStart,
        interviewScheduleDateEnd
      }) => {
        let recommendedStatus = "";
        let isCandidate = "";
        let actionBy = "";
        // actionBy = customerRecommendedJobStatusId == "" ? `&jobPostedBy=${actionbyId}` ://matched section- blank
        // customerRecommendedJobStatusId == 1 ? `&customerLikeBy=${actionbyId}` : //liked section-1
        // customerRecommendedJobStatusId == 2 ? `&customerMaybeBy=${actionbyId}` : //maybe section-2
        // customerRecommendedJobStatusId == 3 ? `&jobPostedBy=${actionbyId}` : //applied section-3
        // customerRecommendedJobStatusId == 4 ? `&customerScheduledBy=${actionbyId}` :   //interview section
        // customerRecommendedJobStatusId == 5 ? `&jobPostedBy=${actionbyId}` :   ////Accespted section-5 Candidate accepts, so added job posted by field for filtering
        // customerRecommendedJobStatusId == 6 ? `&customerRejectedBy=${actionbyId}` : //rejected section-6
        // customerRecommendedJobStatusId == 7 ? `&customerOfferedBy=${actionbyId}` : "";  //offered section- 7
        actionBy = `&jobPostedBy=${actionbyId}`;
        // let interviewFilters=`&interviewStatusId=${interviewStatusId}&candidateInterviewStatusId=${candidateInterviewStatusId}&interviewScheduleDateStart=${interviewScheduleDateStart}&interviewScheduleDateEnd=${interviewScheduleDateEnd}`;
        // let interviewFilters = interviewStatusId ? "&interviewStatusId=${interviewStatusId}" ;//interviewStatusId=${interviewStatusId}&candidateInterviewStatusId=${candidateInterviewStatusId}&interviewScheduleDateStart=${interviewScheduleDateStart}&interviewScheduleDateEnd=${interviewScheduleDateEnd}`;
        switch (customerRecommendedJobStatusId) {
          case 4:
            isCandidate = false;
            recommendedStatus = `&customerRecommendedJobStatusId=${customerRecommendedJobStatusId}&candidateRecommendedJobStatusId=${customerRecommendedJobStatusId}${interviewStatusId ? "&interviewStatusId=" + interviewStatusId : ""}${interviewScheduleDateStart ? "&interviewScheduleDateStart=" + interviewScheduleDateStart : ""}${interviewScheduleDateEnd ? "&interviewScheduleDateEnd=" + interviewScheduleDateEnd : ""}`;
            break;
          case 3:
            isCandidate = true;
            recommendedStatus = `&candidateRecommendedJobStatusId=${customerRecommendedJobStatusId}`;
            break;
          case 5:
            isCandidate = true;
            recommendedStatus = `&customerRecommendedJobStatusId=${customerRecommendedJobStatusId}&candidateRecommendedJobStatusId=${customerRecommendedJobStatusId}`;
            break;
          case 7:
            isCandidate = false;
            recommendedStatus = `&customerRecommendedJobStatusId=5`;
            break;
          case 6:
            isCandidate = false;
            recommendedStatus = `&customerRecommendedJobStatusId=${customerRecommendedJobStatusId}&candidateRecommendedJobStatusId=${customerRecommendedJobStatusId}`;
            break;
          default:
            isCandidate = false;
            recommendedStatus = `&customerRecommendedJobStatusId=${customerRecommendedJobStatusId}`;
            break;
        }
        if (jobId !== undefined) {
          return await fetchWrapper.get(
            `${newUrl}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?isCandidate=${isCandidate}&pageSize=${pageSize}&pageNumber=${pageNumber}${recommendedStatus}&jobId=${jobId}&isActive=true&searchText=${searchText}${actionBy}`
          );
        } else {
          return await fetchWrapper.get(
            `${newUrl}/CandidateRecommendedJob/GetFilterRecommendedJobAndCandidateList?isCandidate=${isCandidate}&pageSize=${pageSize}&pageNumber=${pageNumber}${recommendedStatus}&isActive=true&searchText=${searchText}${actionBy}`
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

  // get completed JobPrescreenApplication thunk
  function getPrescreenDetails() {
    return createAsyncThunk(
      `${name}/getPrescreenDetails`,
      async ({ jobId, candidateid }) => {
        const GET_PRESCREEN_END_POINT = `${newUrl}/JobCandidatePrescreenApplication?pageSize=10&pageNumber=1&jobId=${jobId}&isActive=true&candidateId=${candidateid}`;
        return await fetchWrapper.get(GET_PRESCREEN_END_POINT);
      }
    );
  }

  // get customer offer history thunk
  function getCustOfferHistory() {
    return createAsyncThunk(`${name}/getCustOfferHistory`, async (id) => {
      const GET_CUST_OH_END_POINT = `${newUrl}/JobOffer/GetByCandidateId/${id}`;
      return await fetchWrapper.get(GET_CUST_OH_END_POINT);
    });
  }

  // get offer letter template
  function getofferLetterTemplate() {
    return createAsyncThunk(`${name}/getofferLetterTemplate`, async (id) => {
      const GET_OLT_EP = `${newUrl}/OfferLetterTemplates/GetList?pageSize=100&pageNumber=1`;
      return await fetchWrapper.get(GET_OLT_EP);
    });
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
  function getInterviewSlots() {

    return createAsyncThunk(
      `${name}/getInterviewSlots`,
      async (data) => {
        let id = parseInt(localStorage.getItem("userId"));
        console.log(id);
        return await fetchWrapper.get(
          `${newUrl}/ScheduledInterview/GetInterviewSlots?scheduleDate=${data.scheduleDateUTC}&userId=${id}&scheduleInterviewId=${data.scheduleInterviewId}`
        )
      }

    );
  }

  function getCandidateCardCount() {
    return createAsyncThunk(
      `${name}/getReportBySP`,
      async ({ jobId, userId, searchText }) => {
        const jobIdToUse = (jobId === undefined || jobId === null || jobId === "") ? null : jobId;

        const REPORT_API_URL = `${newUrl}/Report/GetReportBySP?storedProcedure=Fetch_CandidateCardCount&parameter=@jobId=${jobIdToUse},@userId=${userId},@searchText='${searchText}'`;
        return await fetchWrapper.get(REPORT_API_URL);
      }
    );
  }

  function getPresentedCandidateLists() {
    return createAsyncThunk(
      `${name}/getPresentedCandidateLists`,

      async ({
        pageNumber,
        pageSize,
        jobId,
        searchText,
        actionbyId = ""
      }) => {
        let parameters = "";
        let actionBy = "";
        actionBy = `@userid=${actionbyId}`;
        parameters += actionBy;
        parameters += `,@isactive=1`;
        parameters += `,@pagesize=${pageSize}`;
        parameters += `,@currentpage=${pageNumber}`;
        if (searchText) parameters += `,@searchtext='${searchText}'`;
        if (jobId) parameters += `,@jobid=${jobId}`;

        return await fetchWrapper.get(`${newUrl}/V2/Get_Presented_candidate_list?parameter=${parameters}`);

      }
    );
  }

  function putPresentCandidate() {
    return createAsyncThunk(
      `${name}/putPresentCandidate`,

      async ({ id }) =>
        await fetchWrapper.put(
          `${newUrl}/CandidateRecommendedJob/customerPresented/${id}`
        )
    );
  }

  function putCandidatePlaced() {
    return createAsyncThunk(
      `${name}/putCandidatePlaced`,

      async ({ id }) =>
        await fetchWrapper.put(
          `${newUrl}/CandidateRecommendedJob/staffingfirmcandidateaccepted/${id}`
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
    getPrescreenDetails();
    getCustOfferHistory();
    getofferLetterTemplate();
    getInterviewSlots();
    getCandidateCardCount(); // Register the new report action
    getPresentedCandidateLists();
    putPresentCandidate();
    putCandidatePlaced();
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
        .addCase(rejected, (state, action) => { });
    }

    function getPrescreenDetails() {
      let { pending, fulfilled, rejected } = extraActions.getPrescreenDetails;
      builder
        .addCase(pending, (state) => {
          state.prescreenQues = [];
        })
        .addCase(fulfilled, (state, action) => {
          if (
            action?.payload?.data?.jobCandidatePrescreenApplicationList
              ?.length > 0
          ) {
            let newData =
              action?.payload?.data?.jobCandidatePrescreenApplicationList.map(
                (data) => {
                  return {
                    isactive: data.isactive,
                    iscustomquestion: data.iscustomquestion,
                    jobid: data.jobid,
                    jobprescreenapplicationid: data.jobprescreenapplicationid,
                    prescreenquestion: data.prescreenquestion,
                    prescreenquestionid: data.prescreenquestionid,
                    error: false,
                    answer: data.answer,
                    customquestionanswertype: data?.customquestionanswertype
                      ? data.customquestionanswertype
                      : "",
                  };
                }
              );
            state.prescreenQues = newData;
          }
        })
        .addCase(rejected, (state, action) => { });
    }

    function getCustOfferHistory() {
      let { pending, fulfilled, rejected } = extraActions.getCustOfferHistory;
      builder
        .addCase(pending, (state) => {
          state.custOfferHistory = [];
        })
        .addCase(fulfilled, (state, action) => {
          state.custOfferHistory = action?.payload?.data;
        })
        .addCase(rejected, (state, action) => { });
    }

    function getofferLetterTemplate() {
      let { pending, fulfilled, rejected } =
        extraActions.getofferLetterTemplate;
      builder
        .addCase(pending, (state) => {
          state.offerLetterTemplates = [];
        })
        .addCase(fulfilled, (state, action) => {
          state.offerLetterTemplates = action?.payload?.data;
        })
        .addCase(rejected, (state, action) => {
          state.offerLetterTemplates = [];
        });
    }

    function getInterviewSlots() {
      let { pending, fulfilled, rejected } = extraActions.getInterviewSlots;
      builder
        .addCase(pending, (state) => {
          state.interviewSlots = [];
        })
        .addCase(fulfilled, (state, action) => {
          state.interviewSlots = action?.payload?.data;
        })
        .addCase(rejected, (state, action) => {
          state.interviewSlots = [];
        });
    }

    function getCandidateCardCount() {
      let { pending, fulfilled, rejected } = extraActions.getReportBySP;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
          //state.reportData = null;
        })
        .addCase(fulfilled, (state, action) => {
          state.reportData = action?.payload?.data?.[0] ? action.payload.data[0] : null;
          state.loading = false;
        })
        .addCase(rejected, (state, action) => {
          state.loading = false;
          state.reportData = null;
        });
    }


    function getPresentedCandidateLists() {
      let { pending, fulfilled, rejected } = extraActions.getPresentedCandidateLists;
      builder
        .addCase(pending, (state) => {
          state.loading = true;
          state.candidateList = [];
          state.totalRecords = 0;
        })
        .addCase(fulfilled, (state, action) => {
          state.candidateList = action?.payload?.data?.data ? action?.payload?.data?.data
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

    function putPresentCandidate() {
      let { pending, fulfilled, rejected } = extraActions.putPresentCandidate;
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

    function putCandidatePlaced() {
      let { pending, fulfilled, rejected } = extraActions.putCandidatePlaced;
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
