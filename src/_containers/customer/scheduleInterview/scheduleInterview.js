import React, { useState, useEffect, useCallback } from "react";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import {
  Row,
  Col,
  Card,
  Container,
  ButtonGroup,
  Button,
  CardBody,
  Input,
} from "reactstrap";
import { NoDataFound } from "_components/common/nodatafound";
import "./scheduleInterview.scss";
import { ScheduleInterviewList } from "_components/scheduleInterview/scheduleInterviewList";
import { UpcomingCard } from "_components/scheduleInterview/upcomingCard";
import { UpcomingDetail } from "_components/scheduleInterview/upcomingDetail";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import Loader from "react-loaders";
import {
  customerCandidateListsActions,
  scheduleInterviewActions,
  graphActions,
  getJobDetail,
  getHiringMangersList,
  dropdownActions
} from "_store";
import { UpdateScheduleInterviewModal } from "_components/scheduleInterview/updateScheduleInterviewModal";
import { getTimezoneDateTime } from "_helpers/helper";
import SweetAlert from "react-bootstrap-sweetalert";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import { Login } from "@microsoft/mgt-react";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES, CANDIDATE_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

import { hiringManagerActions } from "_store/dropDownHiringManager.slice";
import { use, useRef } from "react";
import { CustomerUploadOffer } from "_components/modal/custuploadoffer";
import axios from "axios";
import { toast } from "react-toastify";
import { setSeeAllHiringManagerJobs } from "_store/commonCustFiltersSlice";
import SafeUncontrolledTooltip from "_components/common/SafeUncontrolledTooltip";

Providers.globalProvider = new Msal2Provider({
  clientId: process.env.REACT_APP_API_KEY,
  scopes: ["Calendars.Read"],
});

export function ScheduleInterview({ fromDashboard }) {
  const dispatch = useDispatch();
  const localizer = momentLocalizer(moment);
  const [msLogin, setMsLogin] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(0);
  const [updateSuccessPopup, setUpdateSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [popupType, setPopupType] = useState("Video");
  const [hiringManagerId, setHiringManagerId] = useState(Number(localStorage.getItem("userId")));
  const [showUploadOfferModal, setShowUploadOfferModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState("");
  const [offerUploadLoading, setOfferUploadLoading] = useState(false);

  const views = {
    month: true,
    week: true,
    day: true,
    agenda: true, // Add or modify views as needed
  };
  const messages = {
    agenda: "Schedule", // Change the label for Agenda to Schedule
  };
  useEffect(() => {
    getGraphData();
  }, [msLogin]);
  useEffect(() => {
    if (msLogin === true) {
      getGraphData();
    }
    getUpdatedScheduleList();
    dispatch(scheduleInterviewActions.getInterviewGuideListThunk());
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
    dispatch(getHiringMangersList({ companyId: Number(localStorage.getItem("companyid")), endpoint: 'assignUserListByCompany' }));
    dispatch(dropdownActions.getInterviewRoundListThunk({ searchText: "interviewRound", commonId: 0, searchBy: "" }));

  }, []);
  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    getCandidateList(
      evt.target.value,
      moment().format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("1", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };
  const getCandidateList = async function (selectedJobId, startdate, enddate) {
    await dispatch(
      scheduleInterviewActions.getScheduleInterviewThunk({
        selectedJobId,
        startdate,
        enddate,
      })
    );
  };

  const getGraphData = async function () {
    let startDate =
      moment().weekday(Number(0)).format("YYYY-MM-DD") + "T00:00:00Z";
    let endDate =
      moment().weekday(Number(6)).format("YYYY-MM-DD") + "T00:00:00Z";
    await dispatch(graphActions.getgraphThunk({ startDate, endDate }));
  };
  const microsoftCalenderData = useSelector((state) => state.graph.graph.value);
  const hiringManagerDownList = useSelector(
    (state) => state?.customerReportReducer?.assignHiringManagers
  );
  const allCompanyHiringManagers = useSelector(
    (state) => state?.customerReportReducer?.companyHiringManagers || []
  );
  const seeAllHiringManagerJobs = useSelector(
    (state) => state?.commonCustFilters?.seeAllHiringManagerJobs
  );
  const isCompanyAdmin = Number(localStorage.getItem("userroleid")) === 4 ||
    localStorage.getItem("isCompanyAdmin") === "true";

  const activeHiringManagerList = seeAllHiringManagerJobs
    ? allCompanyHiringManagers
    : hiringManagerDownList;
  const getUpdatedScheduleList = () => {
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
    dispatch(scheduleInterviewActions.getDurationThunk());
    dispatch(scheduleInterviewActions.getInterviewStatusDropDownThunk());
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
      userList: hiringManagerId === undefined ? '' : hiringManagerId.toString(),
      viewAllCompanyJobs: seeAllHiringManagerJobs,
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").utc().format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };

  const handleSeeAllToggle = (e) => {
    const isOn = e.target.checked;
    const companyId = Number(localStorage.getItem("companyid"));
    dispatch(setSeeAllHiringManagerJobs(isOn));
    setHiringManagerId(Number(localStorage.getItem("userId")));
    if (isOn) {
      dispatch(getHiringMangersList({ companyId, endpoint: 'allUserListByCompany' }));
    }
  };

  const getUpcomingData = async function (filterdata) {
    await dispatch(
      scheduleInterviewActions.getUpcomingInterviewListThunk(filterdata)
    );
  };
  const candidateList = useSelector(
    (state) => state.scheduleInterview.scheduleInterview.scheduledInterviewList
  );

  const jobList = useSelector((state) => state.customerCandidateList.jobLists);
  const durationOptions = useSelector(
    (state) => state.scheduleInterview.duration
  );
  const upcomingInterviews = useSelector(
    (state) => state.scheduleInterview.upcomingInterview
  );
  const upcomingInterviewLoading = useSelector(
    (state) => state.scheduleInterview.upcomingInterviewLoading
  );
  const allInterviews = useSelector(
    (state) => state.scheduleInterview.allInterview.scheduledInterviewList
  );

  let upData = [];
  if (allInterviews !== undefined && allInterviews.length > 0) {
    upData = [];
    allInterviews.forEach((upcomingInterview) => {
      let startDate = getTimezoneDateTime(
        moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
        " " +
        upcomingInterview.starttime,
        "YYYY-MM-DD HH:mm:ss"
      );
      let durationArr =
        upcomingInterview.duration !== undefined
          ? upcomingInterview.duration.split(" ")
          : [];
      let endDate = getTimezoneDateTime(
        moment(startDate).add(durationArr[0], "m"),
        "YYYY-MM-DD HH:mm:ss"
      );

      if (Number(localStorage.getItem("userId")) === hiringManagerId || hiringManagerId === '') {

        let interviewData = {
          id: upcomingInterview.scheduleinterviewid,
          data: upcomingInterview,
          format: upcomingInterview.format,
          title:
            upcomingInterview.candidatename + " (" + upcomingInterview.jobtitle + " - " + upcomingInterview.roundname + ")",
          start: new Date(startDate),
          end: new Date(endDate),
          color:
            upcomingInterview?.isreschedulerequested === true
              ? "rgb(215 174 255 / 50%)"
              : upcomingInterview?.interviewstatusid !== 0
                ? upcomingInterview?.interviewstatusid === 3  //Candidate not selected for an offer
                  ? "rgb(143 208 255 / 50%)"
                  : upcomingInterview?.interviewstatusid === 4  //On Hold
                    ? "rgb(211 152 45 / 91%)"
                    : upcomingInterview?.interviewstatusid === 1   //Selected for Offer
                      ? "rgb(12 237 46 / 64%)"
                      : "rgb(202 202 202 / 50%)" //Candidate missed interview 
                : upcomingInterview.isaccepted === true &&
                  upcomingInterview.isrejected === false
                  ? "rgb(137 222 178 / 50%)"
                  : upcomingInterview.isrejected === true
                    ? "rgb(255 143 143 / 50%)"
                    : "rgb(250 219 145 / 50%)",
          textcolor:
            upcomingInterview?.isreschedulerequested === true
              ? "#2D0059"
              : upcomingInterview?.interviewstatusid !== 0
                ? upcomingInterview?.interviewstatusid === 1
                  ? "#004271"
                  : "#2D2D2D"
                : upcomingInterview.isaccepted === true &&
                  upcomingInterview.isrejected === false
                  ? "#005027"
                  : upcomingInterview.isrejected === true
                    ? "#520000"
                    : "#5C4100",
        };
        upData.push(interviewData);
      } else {
        let interviewData = {
          id: upcomingInterview.scheduleinterviewid,
          data: upcomingInterview,
          format: null,
          title:
            upcomingInterview.candidatename +
            " (" +
            upcomingInterview.jobtitle +
            ") " + getTimezoneDateTime(
              moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
              " " +
              upcomingInterview.starttime,
              "hh:mm"
            ) + " - " + getTimezoneDateTime(
              moment(startDate).add(durationArr[0], "m"),
              "hh:mm"
            ),
          start: new Date(startDate),
          end: new Date(endDate),
          color:
            upcomingInterview?.isreschedulerequested === true
              ? "rgb(215 174 255 / 50%)"
              : upcomingInterview?.interviewstatusid !== 0
                ? upcomingInterview?.interviewstatusid === 3  //Candidate not selected for an offer
                  ? "rgb(143 208 255 / 50%)"
                  : upcomingInterview?.interviewstatusid === 4  //On Hold
                    ? "rgb(211 152 45 / 91%)"
                    : upcomingInterview?.interviewstatusid === 1   //Selected for Offer
                      ? "rgb(12 237 46 / 64%)"
                      : "rgb(202 202 202 / 50%)" //Candidate missed interview
                : upcomingInterview.isaccepted === true &&
                  upcomingInterview.isrejected === false
                  ? "rgb(137 222 178 / 50%)"
                  : upcomingInterview.isrejected === true
                    ? "rgb(255 143 143 / 50%)"
                    : "rgb(250 219 145 / 50%)",
          textcolor:
            upcomingInterview?.isreschedulerequested === true
              ? "#2D0059"
              : upcomingInterview?.interviewstatusid !== 0
                ? upcomingInterview?.interviewstatusid === 1
                  ? "#004271"
                  : "#2D2D2D"
                : upcomingInterview.isaccepted === true &&
                  upcomingInterview.isrejected === false
                  ? "#005027"
                  : upcomingInterview.isrejected === true
                    ? "#520000"
                    : "#5C4100",
        };
        upData.push(interviewData);
      }
    });
  }
  const getFormData = (formData) => {
    updateScheduledInterview(formData);
  };
  const updateScheduledInterview = async function (formData) {
    let scheduleinterviewid = formData.scheduleinterviewid;
    let res = await dispatch(
      scheduleInterviewActions.updateScheduledInterviewThunk({
        scheduleinterviewid,
        formData,
      })
    );
    if (res?.payload?.statusCode === 204) {
      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.INTERVIEW_UPDATED_SUCCESS,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 2000,
        maxWidth: 500,
      }));
      dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
    }
    // setUpdateSuccess(true);

  };
  const [toggleVar, setToggleVar] = useState(fromDashboard);
  const toggle = (tab) => {
    if (toggleVar !== tab) {
      setToggleVar(tab);
    }
  };
  const [selectedClass, setSelectedClass] = useState(
    upcomingInterviews.scheduledInterviewList !== undefined &&
      upcomingInterviews.scheduledInterviewList.length > 0
      ? upcomingInterviews.scheduledInterviewList[0].scheduleinterviewid
      : null
  );
  const [selectedJobData, setSelectedJobData] = useState(
    upcomingInterviews.scheduledInterviewList !== undefined &&
      upcomingInterviews.scheduledInterviewList.length > 0
      ? upcomingInterviews.scheduledInterviewList[0]
      : []
  );
  let selectedJobDetails =
    upcomingInterviews.scheduledInterviewList !== undefined &&
      upcomingInterviews.scheduledInterviewList.length > 0
      ? upcomingInterviews.scheduledInterviewList[0]
      : [];
  const getSelectedInterview = (scheduleinterviewid) => {
    selectedJobDetails = upcomingInterviews.scheduledInterviewList.filter(
      (element) => {
        return element.scheduleinterviewid === scheduleinterviewid;
      }
    );
    setSelectedJobData(selectedJobDetails[0]);
    setSelectedClass(scheduleinterviewid);
  };

  const onPageChange = (page) => {
    let filterOnPageChange = {
      pageNo: page,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
      userList: hiringManagerId === undefined ? '' : hiringManagerId.toString(),
      viewAllCompanyJobs: seeAllHiringManagerJobs,
    };
    getUpcomingData(filterOnPageChange);
    setSelectedJobData({});
  };

  const onCloseIdModal = () => {
    setOpenModal(false);
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
  };
  const handleSelectEvent = useCallback((event) => {
    if (event.data.isclosed === false) {
      setPopupData(event.data);
      setOpenModal(true);
      setPopupType(event.format);
    } else if (event.data.isclosed === true) {
      toast(<Row>
        <p>
          <b>Job has been closed. </b>
        </p>
      </Row>,
        {
          position: "bottom-center",
          autoClose: 2000,
          style: { zIndex: 9999 },
        }
      );
    }
  }, []);

  const postNotesData = (notesData) => {
    updateNotesData(notesData);
    getUpdatedScheduleList();
  };
  const updateNotesData = async function (notesdata) {
    let scheduleinterviewid = notesdata.scheduleinterviewid;
    await dispatch(
      scheduleInterviewActions.updateInterviewNotesThunk({
        scheduleinterviewid,
        notesdata,
      })
    );
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
      userList: "",
      viewAllCompanyJobs: seeAllHiringManagerJobs,
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").utc().format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };

  const postInviteData = (inviteData) => {
    updateInterviewerData(inviteData);
    getUpdatedScheduleList();
  };

  const updateInterviewerData = async function (invitedata) {
    let scheduleinterviewid = invitedata.scheduleinterviewid;
    await dispatch(
      scheduleInterviewActions.updateInterviewerListThunk({
        scheduleinterviewid,
        invitedata,
      })
    );
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
      viewAllCompanyJobs: seeAllHiringManagerJobs,
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").utc().format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };

  const cancelScheduleData = (cancelData) => {
    cancelInterview(cancelData);
    getUpdatedScheduleList();
  };

  const cancelInterview = async function (cancelData) {
    let scheduleinterviewid = cancelData.scheduledInterviewId;
    let payload = {
      currentUserId: cancelData.currentUserId,
    };
    await dispatch(
      scheduleInterviewActions.cancelInterviewThunk({
        scheduleinterviewid,
        payload,
      })
    );
    onCloseIdModal();
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
      viewAllCompanyJobs: seeAllHiringManagerJobs,
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").utc().format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const editScheduledInterview = (editStatus) => {
    setOpenModal(false);
    setShowEditScheduleModal(editStatus);
  };

  let weekfirstday = getTimezoneDateTime(
    moment().weekday(Number(0)).format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  let weeklastday = getTimezoneDateTime(
    moment().weekday(Number(6)).format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  const availableInterview = allInterviews?.filter(
    (value) =>
      value.scheduledate >= weekfirstday && value.scheduledate <= weeklastday
  );
  let syncData = microsoftCalenderData;
  let overallData = [];
  let availData = [];
  let msBlockData = [];
  if (syncData?.length > 0) {
    syncData.forEach((syncDataElement) => {
      if (
        weekfirstday <
        getTimezoneDateTime(
          moment(syncDataElement.start.dateTime).format("YYYY-MM-DD"),
          "YYYY-MM-DD"
        ) &&
        weeklastday >
        getTimezoneDateTime(
          moment(syncDataElement.start.dateTime).format("YYYY-MM-DD"),
          "YYYY-MM-DD"
        )
      ) {
        let startDate = getTimezoneDateTime(
          syncDataElement.start.dateTime,
          "YYYY-MM-DD HH:mm:ss"
        );
        let endDate = getTimezoneDateTime(
          syncDataElement.end.dateTime,
          "YYYY-MM-DD HH:mm:ss"
        );
        let interviewData = {
          id: syncDataElement.id,
          data: syncDataElement.location,
          format: "Video",
          title: "",
          start: new Date(startDate),
          end: new Date(endDate),
          color: "#2F479B",
        };
        msBlockData.push(interviewData);
      }
    });
  }
  if (availableInterview?.length > 0) {
    availableInterview.forEach((blockedData) => {
      if (
        weekfirstday <
        getTimezoneDateTime(
          moment(blockedData.scheduledate).format("YYYY-MM-DD"),
          "YYYY-MM-DD"
        ) &&
        weeklastday >
        getTimezoneDateTime(
          moment(blockedData.scheduledate).format("YYYY-MM-DD"),
          "YYYY-MM-DD"
        )
      ) {
        let startDate = getTimezoneDateTime(
          moment(blockedData.scheduledate).format("MMM D, YYYY") +
          " " +
          blockedData.starttime,
          "YYYY-MM-DD HH:mm:ss"
        );
        let durationArr =
          blockedData.duration !== undefined
            ? blockedData.duration.split(" ")
            : [];
        let endDate = getTimezoneDateTime(
          moment(startDate).add(durationArr[0], "m"),
          "YYYY-MM-DD HH:mm:ss"
        );
        let interviewData = {
          id: blockedData.scheduleinterviewid,
          data: blockedData,
          format: blockedData.format,
          title: "",
          start: new Date(startDate),
          end: new Date(endDate),
          color: "#2F479B",
        };
        availData.push(interviewData);
      }
    });
  }
  overallData = availData.concat(msBlockData);

  const postMessageData = (formData) => { };
  const rejectScheduleData = (scheduledInterviewId) => {
    rejectInterview(scheduledInterviewId);
    getUpdatedScheduleList();
  };

  const rejectInterview = async function (scheduledInterviewId) {
    let scheduleinterviewid = scheduledInterviewId;
    let payload = {
      rejectionreason: "",
    };
    await dispatch(
      scheduleInterviewActions.rejectInterviewThunk({
        scheduleinterviewid,
        payload,
      })
    );
    onCloseIdModal();
  };
  const acceptScheduleData = (scheduledInterviewId) => {
    acceptInterview(scheduledInterviewId);
    getUpdatedScheduleList();
  };

  const acceptInterview = async function (scheduledInterviewId) {
    let scheduleinterviewid = scheduledInterviewId;
    await dispatch(
      scheduleInterviewActions.acceptInterviewThunk({
        scheduleinterviewid,
      })
    );
    onCloseIdModal();
  };
  const postFeedbackData = async (event) => {
    let scheduleinterviewid = event.scheduleinterviewid;

    // Detect external-member feedback by presence of name/email or explicit flag
    const isExternalSubmission = !!(
      event?.Name || event?.name || event?.Email || event?.email || event?.isExternal
    );

    if (isExternalSubmission) {
      const name = event?.Name || event?.name || localStorage.getItem("externalMemberName") || localStorage.getItem("externalName") || "";
      const email = event?.Email || event?.email || localStorage.getItem("externalMemberEmail") || localStorage.getItem("externalEmail") || "";
      const feedbackText = event?.interviewfeedback || event?.interviewFeedback || event?.interviewfeedbacktext || "";

      const externalPayload = {
        Scheduleinterviewid: Number(scheduleinterviewid),
        Interviewstatusid: event?.interviewstatusid || null,
        Name: name,
        Email: email,
        Feedback: feedbackText,
      };

      await dispatch(
        scheduleInterviewActions.postExternalMemberInterviewFeedbackThunk(externalPayload)
      );

      await dispatch(
        scheduleInterviewActions.feedback({
          scheduleInterviewList: candidateList,
          upcomingInterviewList: upcomingInterviews?.scheduledInterviewList,
          allInterviewList: allInterviews,
          scheduleinterviewid: scheduleinterviewid,
          interviewstatusid: event.interviewstatusid,
          interviewfeedback: feedbackText,
        })
      );
    } else {
      let payload = event;
      await dispatch(
        scheduleInterviewActions.interviewFeedbackThunk({
          scheduleinterviewid,
          payload,
        })
      );
      await dispatch(
        scheduleInterviewActions.feedback({
          scheduleInterviewList: candidateList,
          upcomingInterviewList: upcomingInterviews?.scheduledInterviewList,
          allInterviewList: allInterviews,
          scheduleinterviewid: scheduleinterviewid,
          interviewstatusid: event.interviewstatusid,
          interviewfeedback: event.interviewfeedback,
        })
      );
    }
  };

  useEffect(() => {
    upData = [];
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
  }, [dispatch, hiringManagerId, seeAllHiringManagerJobs]);

  const hiringManagerIdRef = useRef(hiringManagerId);
  useEffect(() => {
    hiringManagerIdRef.current = hiringManagerId;
  }, [hiringManagerId]);

  const onAcceptClick = async (row) => {
    // if (row.iscustomeroffered === true) {
    //   dispatch(showSnackbar({
    //     message: GENERAL_MESSAGES.OFFER_ALREADY_SENT,
    //   }));
    //   return; // Stop further processing if offer is already sent
    // }
    //Enable upload offer modal from here
    let response = await dispatch(getJobDetail({ jobId: Number(row.jobid) }));
    if (response?.payload?.statusCode === 200) {
      row = { ...row, jobPaymentBenefitDtos: response?.payload?.data?.jobPaymentBenefitDtos };
    } else if (response?.payload?.data?.length > 0) {
    }
    setSelectedRowData(row);
    setShowUploadOfferModal(true);
    onCloseIdModal();
  };
  const onUploadOfferDoc = (
    file,
    startdate,
    pay,
    finaloffer,
    payType,
    selectedTemplate,
    generatedHtml
  ) => {
    setOfferUploadLoading(true);
    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${authData}`,
      },
    };

    const form = new FormData();
    form.append(
      "Candidaterecommendedjobid",
      selectedRowData.candidaterecommendedjobid
    );
    form.append("Offerfile", file[0]);
    form.append(
      "CurrentUserId",
      JSON.parse(localStorage.getItem("userDetails")).UserId
    );
    form.append("Isfinaloffer", finaloffer);
    form.append("Salary", pay);
    form.append("Payperiodtype", payType);
    form.append(
      "Startdate",
      moment(startdate).tz("Etc/UTC").format("YYYY-MM-DD")
    );
    if (selectedTemplate && generatedHtml) {
      form.append("Offerlettertemplateid", selectedTemplate);
      form.append("Offerlettertemplatefinaltext", generatedHtml);
    }
    axios
      .post(
        `${process.env.REACT_APP_MAIN_API_URL}/api/JobOffer/MakeJobOffer`,
        form,
        config
      )
      .then((result) => {
        setOfferUploadLoading(false);
        if (result.data.statusCode === 200) {
          setShowUploadOfferModal(false);
          dispatch(showSnackbar({
            message: result.data.message,
            type: SNACKBAR_TYPES.SUCCESS,
            position: SNACKBAR_POSITION.TOP_CENTER,
            autoClose: true,
            autoCloseDelay: 3000,
            maxWidth: 500,
          }));
          dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
          //props.updateList();
        } else {
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
      .catch((error) => {
        setOfferUploadLoading(false);
      });
  };

  const onOfferUploading = (data) => {
    setOfferUploadLoading(data);
  };

  const closeOfferModal = () => {
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: hiringManagerId, viewAllCompanyJobs: seeAllHiringManagerJobs }));
  }

  return (
    <>
      <PageTitle heading="Calendar" icon={titlelogo} />
      <Container fluid className="card-schedule-interview">
        <Row>
          <Col md="12">
            <Row>
              <Col
                xs={12}
                sm={12}
                md={8}
                lg={8}
                xl={8}
                className="mb-3 tab-selection-text"
              >
                <ButtonGroup size="lg">
                  <Button
                    color={toggleVar === "availabilty" ? "success" : "primary"}
                    className={"btn-shadow "}
                    onClick={() => {
                      toggle("availabilty");
                    }}
                  >
                    Availabilty
                  </Button>
                  <Button
                    color={toggleVar === "upcoming" ? "success" : "primary"}
                    className={"btn-shadow"}
                    onClick={() => {
                      toggle("upcoming");
                    }}
                  >
                    Upcoming
                  </Button>
                  <Button
                    color={toggleVar === "calendar" ? "success" : "primary"}
                    className={"btn-shadow "}
                    onClick={() => {
                      toggle("calendar");
                    }}
                  >
                    Calendar
                  </Button>
                  <Button
                    color={toggleVar === "schedule" ? "success" : "primary"}
                    className={"btn-shadow "}
                    onClick={() => {
                      toggle("schedule");
                    }}
                  >
                    Schedule
                  </Button>
                </ButtonGroup>
              </Col>
              {toggleVar === "schedule" && (
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  className="mb-3 right-align"
                >
                  {jobList !== undefined && jobList?.length > 0 ? (
                    <Input
                      value={selectedJobId}
                      onChange={(evt) => onSelectClick(evt)}
                      type="select"
                      id="customerJobList"
                      name="customerJobList"
                    >
                      <option key={0} value={0}>
                        All jobs
                      </option>
                      {jobList.map((data) => {
                        return (
                          <option value={data.jobid} key={data.jobid}>
                            {data.jobtitle +
                              ", " +
                              data?.cityname +
                              ", " +
                              data?.statename}
                          </option>
                        );
                      })}
                    </Input>
                  ) : (
                    <></>
                  )}
                </Col>
              )}
              {toggleVar === "availabilty" && (
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  className="mb-3 right-align" style={{ display: "none" }}
                >
                  <div>
                    <Row >
                      <Col md={7} className="mt-1 right-align">
                        <span className="right-align">
                          Connect microsoft calendar using
                        </span>
                      </Col>
                      <Col md={5}>
                        <div className="text-start">
                          <Login
                            loginCompleted={(e) => setMsLogin(true)}
                          ></Login>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              )}

              {(toggleVar === "calendar" || toggleVar === "availabilty") && (<Col
                xs={12}
                sm={12}
                md={4}
                lg={4}
                xl={4}
                className="mb-3"
              >
                <div className="d-flex align-items-center justify-content-end gap-2">
                  {isCompanyAdmin && (
                    <div className="form-check form-switch mb-0 form-switch-lg me-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="seeAllHMToggleCalendar"
                        checked={seeAllHiringManagerJobs}
                        onChange={handleSeeAllToggle}
                      />
                      <SafeUncontrolledTooltip
                        placement="top"
                        target="seeAllHMToggleCalendar"
                      >
                        See all hiring managers jobs
                      </SafeUncontrolledTooltip>
                    </div>
                  )}
                  <Input
                    type="select"
                    title="Hiring Manger"
                    value={hiringManagerId}
                    name="hiringmanagerId"
                    id="hiringmanagerId"
                    placeholder="Hiring Manger"
                    style={{ minWidth: 200, maxWidth: 220 }}
                    onChange={(e) => {
                      setHiringManagerId(Number(e.target.value));
                    }}
                  >
                    <option value={""}>Select a Hiring Manger</option>
                    {activeHiringManagerList?.length > 0 ? (
                      activeHiringManagerList.map((data) => (
                        <option value={data.id} key={data.id}>
                          {data.name}
                        </option>
                      ))
                    ) : null}
                  </Input>
                </div>
              </Col>)}
            </Row>

            {toggleVar === "availabilty" && (
              <Card>
                <CardBody className="scheduled-calender">
                  <div className="text-end">
                    <div className="mb-3 me-1 badge badge-color-white">P</div>
                    Available{" "}
                    <div className="ms-3 mb-3 me-0 badge badge-color-blue">
                      P
                    </div>{" "}
                    Not available
                  </div>
                  <Calendar
                    defaultView="week"
                    localizer={localizer}
                    step={30}
                    timeslots={1}
                    events={overallData}
                    startAccessor="start"
                    endAccessor="end"
                    popup
                    formats={{
                      dayFormat: "dddd",
                    }}
                    toolbar={false}
                    today={false}
                    views={{ week: true }}
                    // onSelectEvent={handleSelectEvent}
                    eventPropGetter={(overallData) => {
                      const backgroundColor = overallData.color
                        ? overallData.color
                        : "blue";
                      const borderColor = overallData.color
                        ? overallData.color
                        : "blue";
                      const fontSize = "0.8rem";
                      return {
                        style: { backgroundColor, fontSize, borderColor },
                      };
                    }}
                  />
                </CardBody>
              </Card>
            )}
            {toggleVar === "upcoming" && (
              <Row>
                {upcomingInterviewLoading === false ? (
                  <>
                    {upcomingInterviews.scheduledInterviewList.length > 0 ? (
                      <>
                        <Col md={4} lg="4">
                          <UpcomingCard
                            upcomingList={
                              upcomingInterviews.scheduledInterviewList
                            }
                            selectedInterview={selectedClass}
                            getSelectedInterviewId={(e) =>
                              getSelectedInterview(e)
                            }
                            totalRows={upcomingInterviews.totalRows}
                            pageSize={5}
                            page={page}
                            setPage={setPage}
                            onPageChange={onPageChange}
                          />
                        </Col>
                        <Col md={8} lg="8">
                          <UpcomingDetail
                            interviewDetails={
                              selectedJobData.scheduleinterviewid === undefined
                                ? upcomingInterviews?.scheduledInterviewList
                                  ?.length > 0
                                  ? upcomingInterviews
                                    ?.scheduledInterviewList[0]
                                  : []
                                : selectedJobData
                            }
                            cancelScheduleData={(e) => cancelScheduleData(e)}
                            postNotesData={(e) => postNotesData(e)}
                            postInviteData={(e) => postInviteData(e)}
                            acceptInterview={(e) => acceptScheduleData(e)}
                            rejectInterview={(e) => rejectScheduleData(e)}
                            getUpdatedFormData={(e) => getFormData(e)}
                            postFeedbackData={(e) => postFeedbackData(e)}
                          />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Row
                          style={{ textAlign: "center", minHeight: "40vh" }}
                          className="center-middle-align"
                        >
                          <Col>
                            {" "}
                            <NoDataFound></NoDataFound>
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                ) : (
                  <Loader
                    type="line-scale-pulse-out-rapid"
                    className="d-flex justify-content-center"
                  />
                )}
              </Row>
            )}
            {toggleVar === "calendar" && (
              <Card>
                <CardBody className="scheduled-calender">
                  <div className="text-end">
                    <span className="legend">
                      <div className="mb-3 me-0 badge badge-color-yellow">
                        ..
                      </div>{" "}
                      No response
                    </span>
                    <span className="legend">
                      <div className="ms-3 mb-3 me-1 badge badge-color-green">
                        ..
                      </div>
                      Accepted interview{" "}
                    </span>
                    <span className="legend">
                      <div className="ms-3 mb-3 me-0 badge badge-color-red">
                        ..
                      </div>{" "}
                      Declined interview
                    </span>
                    <span className="legend">
                      <div className="ms-3 mb-3 me-0 badge badge-color-lime-green">
                        ..
                      </div>{" "}
                      Selected for Offer
                    </span>
                    <span className="legend">
                      <div className="ms-3 mb-3 me-0 badge badge-color-skyblue">
                        ..
                      </div>{" "}
                      Not selected for Offer
                    </span>
                    <span className="legend">
                      <div className="ms-3 mb-3 me-0 badge badge-color-grey">
                        ..
                      </div>{" "}
                      Not joined
                    </span>

                    <span className="legend">
                      <div className="ms-3 mb-3 me-0 badge badge-color-goldenrod">
                        ..
                      </div>{" "}
                      Hold
                    </span>

                    <span className="legend">
                      <div className="ms-3 mb-3 me-0 badge badge-color-darkblue">
                        ..
                      </div>{" "}
                      Reschedule Requested
                    </span>
                  </div>
                  <Calendar
                    localizer={localizer}
                    events={upData}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={(upData) => {
                      const backgroundColor = upData.color
                        ? upData.color
                        : "blue";
                      const color = upData.textcolor;
                      const fontSize = "0.8rem";
                      return {
                        style: {
                          backgroundColor,
                          fontSize,
                          color,
                        },
                      };
                    }}
                    onSelectEvent={handleSelectEvent}
                    views={views}
                    messages={messages}
                    step={30}
                    timeslots={1}
                  />
                </CardBody>
              </Card>
            )}
            {toggleVar === "schedule" && (
              <>
                <Card>
                  <CardBody>
                    <ScheduleInterviewList
                      candidateList={candidateList}
                      postNotesData={(e) => postNotesData(e)}
                      postInviteData={(e) => postInviteData(e)}
                      cancelScheduleData={(e) => cancelScheduleData(e)}
                      postMessageData={(e) => postMessageData(e)}
                      acceptInterview={(e) => acceptScheduleData(e)}
                      rejectInterview={(e) => rejectScheduleData(e)}
                      getUpdatedFormData={(e) => getFormData(e)}
                      postFeedbackData={(e) => postFeedbackData(e)}
                    />
                  </CardBody>
                </Card>
              </>
            )}
          </Col>
        </Row>
        <InterviewDetailsModal
          isOpen={openModal}
          type={popupType}
          onClose={() => onCloseIdModal()}
          interviewDetail={popupData}
          postNotesData={(e) => postNotesData(e)}
          postInviteData={(e) => postInviteData(e)}
          cancelScheduleData={(e) => cancelScheduleData(e)}
          editScheduledInterview={(e) => editScheduledInterview(e)}
          postMessageData={(e) => postMessageData(e)}
          acceptInterview={(e) => acceptScheduleData(e)}
          rejectInterview={(e) => rejectScheduleData(e)}
          postFeedbackData={(e) => postFeedbackData(e)}
          onAcceptClick={() => onAcceptClick(popupData)}
        />
        <UpdateScheduleInterviewModal
          interviewData={popupData}
          durationOptions={durationOptions}
          postData={(e) => {
            getFormData(e);
          }}
          isOpen={showEditScheduleModal}
          onClose={() => setShowEditScheduleModal(false)}
        />
      </Container>
      {updateSuccessPopup === true && (
        <SweetAlert
          success
          title="Success."
          onConfirm={(e) => setUpdateSuccess(false)}
        ></SweetAlert>
      )}
      <>
        {showUploadOfferModal ? (
          <CustomerUploadOffer
            isOpen={showUploadOfferModal}
            onClose={() => {
              setShowUploadOfferModal(false);
              closeOfferModal();
            }}
            uploadOfferDoc={(
              file,
              startdate,
              pay,
              finaloffer,
              payType,
              selectedTemplate,
              generatedHtml
            ) =>
              onUploadOfferDoc(
                file,
                startdate,
                pay,
                finaloffer,
                payType,
                selectedTemplate,
                generatedHtml
              )
            }
            loading={offerUploadLoading}
            updateLoading={(data) => onOfferUploading(data)}
            data={selectedRowData}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
}
