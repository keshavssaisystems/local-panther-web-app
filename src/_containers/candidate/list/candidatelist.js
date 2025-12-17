import React, { useState, useEffect } from "react";
import { TabContent, TabPane, ButtonGroup, Button, Row, Col } from "reactstrap";
import classnames from "classnames";
import { CardPagination } from "_components/common/cardpagination";
import { useSelector, useDispatch } from "react-redux";
import { candCPSize, candLPSize } from "_helpers/constants";
import Loader from "react-loaders";
import { candidateListActions } from "./candidatelist.slice";
import { CandCardView } from "./candcardview";
import { CandJobDetail } from "./candjobcard";
import SweetAlert from "react-bootstrap-sweetalert";
import { CandListView } from "./candlistview";
import { JobDetailModal } from "_components/modal/jobdetailmodal";
import { InterViewDetailModal } from "_components/modal/interviewdetailmodal";
import { NoDataFound } from "_components/common/nodatafound";
import { PrescreenModal } from "_components/modal/prescreenmodal";
import axios from "axios";
import "./candidatelist.scss";
import {
  customerCandidateListsActions,
  scheduleInterviewActions,
  custJobListActions,
} from "_store";
import infoIcon from "assets/utils/images/info-circle-fill.svg";
import { DeactivateReasonModal } from "_components/modal/deactivateReason";
import { OfferHistory } from "_components/modal/offerhistorymoal";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES, CANDIDATE_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export default function CandidateList(props) {
  const [activeTab, setActiveTab] = useState(props.type || "matched");
  const internalUserId =
    JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId ?? 0;
  const [showJDModal, setShowJDModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [showIDModal, setShowIDModal] = useState(false);
  const [selectedIDData, setSelectedIDData] = useState([]);
  const [showPSModal, setShowPSModal] = useState(false);
  const [preScreenType, setPreScreenType] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleId, setRescheduleId] = useState("");
  const [preScreenLoading, setPreScreenLoading] = useState(false);
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [oHModal, setOHModal] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const candidateJobList = useSelector(
    (state) => state.candidateListReducer.candidateJobList
  );
  const totalRecords = useSelector(
    (state) => state.candidateListReducer.totalRecords
  );

  const jobDetail = useSelector(
    (state) => state.candidateListReducer.jobDetail
  );
  const loading = useSelector((state) => state.candidateListReducer.loading);
  const jdLoading = useSelector(
    (state) => state.candidateListReducer.jdLoading
  );

  const prescreenQues = useSelector(
    (state) => state.candidateListReducer.prescreenQues
  );

  const offerHistory = useSelector(
    (state) => state.candidateListReducer.offerHistory
  );
  const reportData = useSelector((state) => state.customerCandidateList.reportData);

  const handlePageChange = (page) => {
    setPageNo(page);
    toggle(activeTab, page);
  };

  useEffect(() => {
    toggle(activeTab, pageNo);
  }, []);

  useEffect(() => {
    if (candidateJobList?.length > 0 && activeTab === "matched") {
      getJobDetails(candidateJobList[0].jobid);
    }
    if (candidateJobList?.length > 0 && activeTab === "offers") {
      dispatch(candidateListActions.getAcceptedJobListThunk(internalUserId));
    }

    //make api call for first selected
  }, [candidateJobList]);

  const getJobDetails = (jobId) => {
    dispatch(candidateListActions.getJobDetails({ jobId }));
  };
  const toggle = (val, pageNo) => {
    if (pageNo === undefined) {
      setPageNo(1);
    }
    setActiveTab(val);

    let candidateRecommendedJobStatusId;

    switch (val) {
      case "liked":
        candidateRecommendedJobStatusId = 1;
        break;
      case "maybe":
        candidateRecommendedJobStatusId = 2;
        break;
      case "applied":
        candidateRecommendedJobStatusId = 3;
        break;
      case "accepted":
        candidateRecommendedJobStatusId = 5;
        break;
      case "interview":
        candidateRecommendedJobStatusId = 4;
        break;
      case "rejected":
        candidateRecommendedJobStatusId = 6;
        break;
      case "offers":
        candidateRecommendedJobStatusId = 7; // added for offers
        break;
      default:
        break;
    }
    let candidateId = JSON.parse(
      localStorage.getItem("userDetails")
    )?.InternalUserId;
    let isCandidate = val === "rejected" ? false : true;
    let candObj = {
      isCandidate,
      candidateId,
      pageNumber: pageNo ? pageNo : 1,
      pageSize: val === "matched" ? candCPSize : candLPSize,
      ...(candidateRecommendedJobStatusId && {
        candidateRecommendedJobStatusId,
      }),
    };

    dispatch(candidateListActions.getRecommendedJobList(candObj));
    if (candidateRecommendedJobStatusId === 7) {
      dispatch(candidateListActions.getAcceptedJobListThunk(internalUserId));
    }
    onGetCandidatesCount();
  };

  const getSelectedJob = (e) => {
    getJobDetails(e);
  };

  const onApplyClickBtn = (eventData) => {
    let rec = candidateJobList.find(
      (data) => data.jobid === jobDetail[0].jobid
    );
    if (rec?.candidaterecommendedjobid) {
      onCandidateCardActions("applied", rec?.candidaterecommendedjobid);
    }
  };
  // let successMessage = "Job status updated successfully!";
  let successMessage = CANDIDATE_MESSAGES.JOB_STATUS_UPDATED_SUCCESS;

  const onCandidateCardActions = async (
    type,
    candidaterecommendedjobid,
    reason
  ) => {
    if (type === "liked") {
      let res = await dispatch(
        candidateListActions.candidateLike(candidaterecommendedjobid)
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({
        //   title: successMessage,
        //   type: "success",
        // });

        dispatch(showSnackbar({
          message: successMessage,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    } else if (type === "rejected") {
      let payload = {
        candidaterejectedcomment: reason,
        candidaterejectedreasonid: 0,
      };

      let res = await dispatch(
        candidateListActions.candidateReject({
          candidaterecommendedjobid,
          payload,
        })
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: successMessage, type: "success" });
        dispatch(showSnackbar({
          message: successMessage,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    } else if (type === "maybe") {
      let res = await dispatch(
        candidateListActions.candidateMayBe(candidaterecommendedjobid)
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: successMessage, type: "success" });
        dispatch(showSnackbar({
          message: successMessage,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    } else if (type === "applied") {
      let res = await dispatch(
        candidateListActions.candidateApply(candidaterecommendedjobid)
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: successMessage, type: "success" });
        dispatch(showSnackbar({
          message: successMessage,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    } else if (type === "accepted") {
      let res = await dispatch(
        candidateListActions.candidateAccept(candidaterecommendedjobid)
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: successMessage, type: "success" });
        dispatch(showSnackbar({
          message: successMessage,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    } else if (type === "acceptInterview") {
      let res = await dispatch(
        scheduleInterviewActions.acceptInterviewThunk({
          scheduleinterviewid: candidaterecommendedjobid,
        })
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: res.payload.message, type: "success" });
        dispatch(showSnackbar({
          message: res.payload.message,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    } else if (type === "rejectInterview") {
      let payload = {
        rejectionreason: reason,
      };
      let res = await dispatch(
        scheduleInterviewActions.rejectInterviewThunk({
          scheduleinterviewid: candidaterecommendedjobid,
          payload: payload,
        })
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: res.payload.message, type: "success" });
        dispatch(showSnackbar({
          message: res.payload.message,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    } else if (type === "rescheduleInterview") {
      setShowRescheduleModal(true);
      setRescheduleId(candidaterecommendedjobid);
    } else if (type === "reaccepted") {
      let payload = {
        candidateacceptedcomment: reason,
      };
      let res = await dispatch(
        candidateListActions.candidateAcceptAgain({
          candidaterecommendedjobid,
          payload: payload,
        })
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: successMessage, type: "success" });
        dispatch(showSnackbar({
          message: successMessage,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
        toggle(activeTab, pageNo);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: res.payload.message || res.payload.status,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));
      }
    }
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };

  const onShowModal = async (row, type) => {
    if (type === "jd") {
      let response = await dispatch(
        custJobListActions.getJobDetail({ jobId: row.jobid })
      );
      if (response.payload) {
        setSelectedRow(response.payload.data);
      } else {
        setSelectedRow(row);
      }
      setShowJDModal(true);
    } else if (type === "id") {
      let res = await dispatch(
        customerCandidateListsActions.getScheduleIVList(
          row.scheduledInterviewDtos[0].scheduleinterviewid
        )
      );

      if (res.payload?.statusCode === 200) {
        setSelectedIDData(res?.payload?.data?.scheduledInterviewList[0]);
        setShowIDModal(true);
      } else {
        //do nothing
      }

      // let obj = {
      //   scheduledate:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].scheduledate
      //       : null,
      //   starttime:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].starttime
      //       : null,
      //   duration:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].duration
      //       : null,

      //   jobtitle:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].jobtitle
      //       : null,
      //   format:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].format
      //       : null,
      //   interviewername:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].interviewername
      //       : null,
      //   videolink:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].videolink
      //       : null,
      //   isappvideocall:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].isappvideocall
      //       : null,
      //   interviewaddress:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].interviewaddress
      //       : null,
      //   textremaindernumbers:
      //     row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
      //       ? row.scheduledInterviewDtos[0].textremaindernumbers
      //       : null,
      // };

      // setSelectedIDData(obj);
      // setShowIDModal(true);
    }
  };

  const onPrescreenClickAction = async (type, row) => {
    if (type === "pending") {
      await dispatch(
        candidateListActions.getJobPrescreenApplicationQues(row.jobid)
      );
    } else {
      await dispatch(
        candidateListActions.getCompJobPrescreenApplication(row.jobid)
      );
    }

    setPreScreenType(type);
    setShowPSModal(true);
  };

  const onSendPrescreenData = async (formData) => {
    setPreScreenLoading(true);
    let nonFileData = formData
      .filter((data) => {
        return (
          !data.iscustomquestion || data.customquestionanswertype === "Text"
        );
      })
      .map((data) => {
        return {
          jobcandidateprescreenapplicationid: 0,
          jobprescreenapplicationid: data.jobprescreenapplicationid,
          jobid: data.jobid,
          candidateid: parseInt(
            JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
          ),
          answer: data.answer,
          isactive: data.isactive,
          currentUserId: parseInt(
            JSON.parse(localStorage.getItem("userDetails")).UserId
          ),
        };
      });

    let fileData = formData
      .filter((data) => {
        return (
          data.iscustomquestion && data.customquestionanswertype !== "Text"
        );
      })
      .map((data) => {
        return {
          jobcandidateprescreenapplicationid: 0,
          jobprescreenapplicationid: data.jobprescreenapplicationid,
          jobid: data.jobid,
          candidateid: parseInt(
            JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
          ),
          answer: data.answer,
          isactive: data.isactive,
          currentUserId: parseInt(
            JSON.parse(localStorage.getItem("userDetails")).UserId
          ),
        };
      });

    let res = await dispatch(
      candidateListActions.postJobPrescreenApplication(nonFileData)
    );

    if (res.payload.statusCode === 201) {
      const authData = localStorage.getItem("token")
        ? localStorage.getItem("token")
        : "";
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${authData}`,
        },
      };
      if (fileData?.length > 0) {
        fileData.forEach(async (i, index) => {
          const form = new FormData();
          form.append("jobcandidateprescreenapplicationid", 0);
          form.append("jobprescreenapplicationid", i.jobprescreenapplicationid);
          form.append("Jobid", i.jobid);
          form.append(
            "Candidateid",
            parseInt(
              JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
            )
          );
          form.append(
            "currentUserId",
            JSON.parse(localStorage.getItem("userDetails")).UserId
          );
          form.append("Answerfile", i.answer);
          form.append("Isactive", i.isactive);

          const res = await axios
            .post(
              `${process.env.REACT_APP_MAIN_API_URL}/api/JobCandidatePrescreenApplication/CandidatePrecreenAnswerFileUpload`,
              form,
              config
            )
            .then((result) => {
              if (result.data.statusCode == 204) {
                if (fileData.length - 1 === index) {
                  setPreScreenLoading(false);
                  setShowPSModal(false);
                  // showSweetAlert({
                  //   title: result.data.message,
                  //   type: "success",
                  // });
                  dispatch(showSnackbar({
                    message: result.data.message,
                    type: SNACKBAR_TYPES.SUCCESS,
                    position: SNACKBAR_POSITION.TOP_CENTER,
                    autoClose: true,
                    autoCloseDelay: 3000,
                    maxWidth: 500,
                  }));
                }
              } else {
                setPreScreenLoading(false);
                // showSweetAlert({
                //   title: result.data.message || result.data.status,
                //   type: "danger",
                // });
                dispatch(showSnackbar({
                  message: result.data.message || result.data.status,
                  type: SNACKBAR_TYPES.ERROR,
                  position: SNACKBAR_POSITION.TOP_CENTER,
                  autoClose: true,
                  autoCloseDelay: 3000,
                  maxWidth: 500,
                }));
              }
            })
            .catch((error) => { });
        });
      } else {
        setPreScreenLoading(false);
        setShowPSModal(false);
        // showSweetAlert({ title: res.payload.message, type: "success" });
        dispatch(showSnackbar({
          message: res.payload.message,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

      }
    } else {
      setPreScreenLoading(false);
      // showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });
      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  };

  const onSendRescheduleData = async (data) => {
    let res = await dispatch(
      candidateListActions.updateRescheduleReason({
        scheduleinterviewid: rescheduleId,
        reschedulerequestedreason: data,
      })
    );

    if (res?.payload?.statusCode === 204) {
      setShowRescheduleModal(false);
      // showSweetAlert({ title: res.payload.message, type: "success" });
      dispatch(showSnackbar({
        message: res.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

      toggle(activeTab, pageNo);
    } else {
      // showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });
      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  };
  const onShowOHModal = async (row) => {
    let res = await dispatch(
      candidateListActions.getCandidateOfferHistory(
        row.candidaterecommendedjobid
      )
    );

    if (res?.payload?.statusCode === 204) {
      setOHModal(true);
      setCompanyName(row.companyname);
    } else {
      // showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });
      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  };
  const onGetCandidatesCount = () => {
    dispatch(customerCandidateListsActions.getReportBySP({ userId: JSON.parse(localStorage.getItem("userDetails"))?.UserId, searchTex: null }));
  }
  return (
    <>
      <Row className="cand-list-cont">
        <Col
          xs={12}
          sm={12}
          md={10}
          lg={10}
          xl={10}
          className="mb-3 tab-selection-text"
        >
          <ButtonGroup size="lg" className="cust-btn-tabs">
            <Button
              color="primary"
              disabled={loading}
              className={
                "border-0 btn-transition  " +
                classnames({ active: activeTab === "matched" })
              }
              onClick={() => {
                toggle("matched");
              }}
            >
              Matched{reportData?.Matched > 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Matched}</span>)}
            </Button>
            <Button
              color="primary"
              disabled={loading}
              className={
                "border-0 btn-transition " +
                classnames({ active: activeTab === "maybe" })
              }
              onClick={() => {
                toggle("maybe");
              }}
            >
              Maybe
            </Button>
            <Button
              color="primary"
              disabled={loading}
              className={
                "border-0 btn-transition  " +
                classnames({ active: activeTab === "applied" })
              }
              onClick={() => {
                toggle("applied");
              }}
            >
              Applied{reportData?.Applied > 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Applied}</span>)}
            </Button>
            <Button
              color="primary"
              disabled={loading}
              className={
                "border-0 btn-transition  " +
                classnames({ active: activeTab === "interview" })
              }
              onClick={() => {
                toggle("interview");
              }}
            >
              Interview{reportData?.Scheduled > 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Scheduled}</span>)}
            </Button>
            <Button
              color="primary"
              disabled={loading}
              className={
                "border-0 btn-transition  " +
                classnames({ active: activeTab === "offers" })
              }
              onClick={() => {
                toggle("offers");
              }}
            >
              Offer{reportData?.Offer > 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Offer}</span>)}
            </Button>
            <Button
              color="primary"
              disabled={loading}
              className={
                "border-0 btn-transition  " +
                classnames({ active: activeTab === "accepted" })
              }
              onClick={() => {
                toggle("accepted");
              }}
            >
              Accepted{reportData?.Accept > 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Accept}</span>)}
            </Button>
            <Button
              color="primary"
              disabled={loading}
              className={
                "border-0 btn-transition  " +
                classnames({ active: activeTab === "rejected" })
              }
              onClick={() => {
                toggle("rejected");
              }}
            >
              Declined{reportData?.Reject > 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Reject}</span>)}
            </Button>
          </ButtonGroup>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-3">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="matched">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Our advanced AI matching system efficiently reviews
                      candidate profiles and job requirements to connect
                      candidates with the best job opportunities. By using this
                      system, we streamline the application process and ensure a
                      fair evaluation for all applicants. However, it's
                      important to note that the AI system may not capture every
                      detail or subtlety of a candidate's profile or job
                      description.
                    </span>
                  </Col>
                </Row>
              </div>
              {loading ? (
                <>
                  <Loader
                    type="line-scale-pulse-out-rapid"
                    className="d-flex justify-content-center"
                  />
                </>
              ) : (
                <>
                  <Row>
                    <p className="mb-1 row-count">
                      {totalRecords > 0 ? `${totalRecords} jobs` : ""}{" "}
                    </p>
                    <Col xs="12" sm="12" md="12" lg="4" xl="4" xxl="4">
                      {candidateJobList?.length > 0 ? (
                        candidateJobList.map((data) => {
                          return (
                            <CandCardView
                              key={data.jobid}
                              name={data.jobtitle}
                              customer={data.companyname}
                              minExperience={data.minexperience}
                              maxExperience={data.maxexperience}
                              location={data.cityname + ", " + data.statename}
                              description={data.description}
                              role={data.jobrole}
                              jobId={data.jobid}
                              createdDate={data.jobcreatedatetime}
                              type={"Open"}
                              selectedJob={
                                jobDetail?.length > 0 ? jobDetail[0].jobid : ""
                              }
                              getSelectedJobId={(e) => getSelectedJob(e)}
                              additionalData={data}
                              onCandidateActions={(
                                type,
                                candidaterecommendedjobid,
                                reason
                              ) =>
                                onCandidateCardActions(
                                  type,
                                  candidaterecommendedjobid,
                                  reason
                                )
                              }
                            />
                          );
                        })
                      ) : (
                        <></>
                      )}
                      {totalRecords > candCPSize ? (
                        <CardPagination
                          totalPages={totalRecords / candCPSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      ) : (
                        <></>
                      )}
                    </Col>
                    <Col xs="12" sm="12" md="12" lg="8" xl="8" xxl="8">
                      {!jdLoading ? (
                        <>
                          {jobDetail?.length > 0 &&
                            candidateJobList?.length > 0 ? (
                            <>
                              <CandJobDetail
                                jobDetails={jobDetail}
                                type={"Open"}
                                onApplyClick={(candidaterecommendedjobid) =>
                                  onApplyClickBtn(candidaterecommendedjobid)
                                }
                              ></CandJobDetail>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <>
                          <Loader
                            type="line-scale-pulse-out-rapid"
                            className="d-flex justify-content-center"
                          />
                        </>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    {candidateJobList.length === 0 && !loading ? (
                      <Row
                        style={{ textAlign: "center" }}
                        className="center-middle-align"
                      >
                        <Col xs="12" sm="12" md="8" lg="6" xl="6">
                          <NoDataFound text="Thanks for signing up with OpenWorX! While there isn't a perfect match right now, your profile stays active and will automatically be considered as new jobs are added. We'll reach out as soon as the right opportunity aligns with your experience and qualifications."></NoDataFound>
                        </Col>
                      </Row>
                    ) : (
                      ""
                    )}
                  </Row>
                </>
              )}
            </TabPane>
            <TabPane tabId="maybe">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      A job record may be marked with questions or doubts,
                      indicating uncertain applications due to a lack of
                      information, qualifications, and locations. These jobs may
                      also be saved in a separate section of the user profile,
                      allowing the user to review and change their decisions
                      later.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateJobList?.length > 0 ? (
                      <>
                        <CandListView
                          type={activeTab}
                          data={candidateJobList}
                          onCandidateActions={(
                            type,
                            candidaterecommendedjobid,
                            reason
                          ) =>
                            onCandidateCardActions(
                              type,
                              candidaterecommendedjobid,
                              reason
                            )
                          }
                          showModal={(e, type) => onShowModal(e, type)}
                          onPrescreenClick={(type, row) =>
                            onPrescreenClickAction(type, row)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > candLPSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / candLPSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateJobList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="applied">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Applied jobs are those that users submit applications for
                      through the platform. They are marked as applied and are
                      stored in a separate section of the profile. The user can
                      track the status and withdraw the application.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateJobList?.length > 0 ? (
                      <>
                        <CandListView
                          type={activeTab}
                          data={candidateJobList}
                          onCandidateActions={(
                            type,
                            candidaterecommendedjobid,
                            reason
                          ) =>
                            onCandidateCardActions(
                              type,
                              candidaterecommendedjobid,
                              reason
                            )
                          }
                          showModal={(e, type) => onShowModal(e, type)}
                          onPrescreenClick={(type, row) =>
                            onPrescreenClickAction(type, row)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > candLPSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / candLPSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateJobList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="interview">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      A scheduled interview is an appointment with a customer to
                      discuss qualifications for a job, typically in person, by
                      phone, or video, after the initial screening process.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateJobList?.length > 0 ? (
                      <>
                        <CandListView
                          type={activeTab}
                          data={candidateJobList}
                          onCandidateActions={(
                            type,
                            candidaterecommendedjobid,
                            reason
                          ) =>
                            onCandidateCardActions(
                              type,
                              candidaterecommendedjobid,
                              reason
                            )
                          }
                          showModal={(e, type) => onShowModal(e, type)}
                          onPrescreenClick={(type, row) =>
                            onPrescreenClickAction(type, row)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > candLPSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / candLPSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateJobList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="accepted">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      An accepted job is when candidates agree to the terms of
                      the offer and confirm their intention to work for the
                      customer, securing the job and preparing to start working.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateJobList?.length > 0 ? (
                      <>
                        <CandListView
                          type={activeTab}
                          data={candidateJobList}
                          onCandidateActions={(
                            type,
                            candidaterecommendedjobid,
                            reason
                          ) =>
                            onCandidateCardActions(
                              type,
                              candidaterecommendedjobid,
                              reason
                            )
                          }
                          showModal={(e, type) => onShowModal(e, type)}
                          onPrescreenClick={(type, row) =>
                            onPrescreenClickAction(type, row)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > candLPSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / candLPSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateJobList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="rejected">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      A declined job refers to a decision to decline an offer or
                      a customer rescinding it, indicating that the individual
                      has decided not to work for the customer or has changed
                      their hiring decision.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateJobList?.length > 0 ? (
                      <>
                        <CandListView
                          type={activeTab}
                          data={candidateJobList}
                          onCandidateActions={(
                            type,
                            candidaterecommendedjobid,
                            reason
                          ) =>
                            onCandidateCardActions(
                              type,
                              candidaterecommendedjobid,
                              reason
                            )
                          }
                          showModal={(e, type) => onShowModal(e, type)}
                          onPrescreenClick={(type, row) =>
                            onPrescreenClickAction(type, row)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > candLPSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / candLPSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateJobList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="offers">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      An offer is a formal proposal from a customer, detailing
                      job details, salary, benefits, start date, and work hours,
                      indicating successful completion of the interview process.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateJobList?.length > 0 ? (
                      <>
                        <CandListView
                          type={activeTab}
                          data={candidateJobList}
                          onCandidateActions={(
                            type,
                            candidaterecommendedjobid,
                            reason
                          ) =>
                            onCandidateCardActions(
                              type,
                              candidaterecommendedjobid,
                              reason
                            )
                          }
                          showModal={(e, type) => onShowModal(e, type)}
                          onPrescreenClick={(type, row) =>
                            onPrescreenClickAction(type, row)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > candLPSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / candLPSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateJobList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
          </TabContent>
        </Col>
        <>
          {" "}
          <SweetAlert
            title={showAlert.title}
            show={showAlert.show}
            type={showAlert.type}
            onConfirm={() => closeSweetAlert()}
          />
          {showAlert.description}
        </>
        <>
          {showJDModal ? (
            <>
              <JobDetailModal
                jobDetail={selectedRow}
                isOpen={showJDModal}
                onClose={() => {
                  setShowJDModal(false);
                }}
              ></JobDetailModal>
            </>
          ) : (
            <></>
          )}
        </>
        <>
          {showIDModal ? (
            <>
              <InterViewDetailModal
                data={selectedIDData}
                isOpen={showIDModal}
                onClose={() => {
                  setShowIDModal(false);
                }}
              ></InterViewDetailModal>
            </>
          ) : (
            <></>
          )}
        </>
        <>
          {showPSModal ? (
            <>
              <PrescreenModal
                isOpen={showPSModal}
                onClose={() => {
                  setShowPSModal(false);
                }}
                data={prescreenQues}
                sendFormData={(data) => onSendPrescreenData(data)}
                preScreenType={preScreenType}
                loading={preScreenLoading}
              ></PrescreenModal>
            </>
          ) : (
            <></>
          )}
        </>
        <>
          {showRescheduleModal ? (
            <DeactivateReasonModal
              isRMOpen={showRescheduleModal}
              callBack={(data) => onSendRescheduleData(data)}
              callBackError={() => setShowRescheduleModal()}
              title={"rescheduling"}
            ></DeactivateReasonModal>
          ) : (
            <></>
          )}
        </>
        <>
          {oHModal ? (
            <OfferHistory
              isOpen={oHModal}
              onClose={() => {
                setOHModal(false);
                setCompanyName("");
              }}
              offerHistory={offerHistory}
              name={companyName}
              activeTab={activeTab}
            ></OfferHistory>
          ) : (
            <></>
          )}
        </>
      </Row>
    </>
  );
}
