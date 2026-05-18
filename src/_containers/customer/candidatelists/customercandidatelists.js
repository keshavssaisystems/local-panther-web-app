import React, { useState, useEffect, useRef } from "react";

import {
  TabContent,
  TabPane,
  ButtonGroup,
  Button,
  Row,
  Col,
  Input,
  InputGroup,
  Card,
  CardBody
} from "reactstrap";

import { BsSearch } from "react-icons/bs";
import classnames from "classnames";
import { CandidateCardView } from "_components/list/cardview";
import { CustCandidateListView } from "_components/list/custlistview";
import { CardPagination } from "_components/common/cardpagination";
import { useParams, useNavigate } from "react-router-dom";
import { cardPageSize, listPageSize } from "_helpers/constants";
import { useSelector, useDispatch } from "react-redux";
import { customerCandidateListsActions } from "./customercandidatelists.slice";
import Loader from "react-loaders";
import SweetAlert from "react-bootstrap-sweetalert";
import "./customercandidatelist.scss";
import { NoDataFound } from "_components/common/nodatafound";
import { BuildCVModal } from "_components/modal/buildcvmodal";
import { CandidateHistoryModal } from "_components/modal/candidatehistorymodal";
import { CandidateCVModal } from "_components/modal/candidatecvmodal";
import {
  getProfileActions,
  dropdownActions,
  scheduleInterviewActions,
  custJobListActions
} from "_store";
import infoIcon from "assets/utils/images/info-circle-fill.svg";
import { PrescreenModal } from "_components/modal/prescreenmodal";
import { OfferHistory } from "_components/modal/offerhistorymoal";
import { NoCandidateAvailable } from "_components/common/noCandidateAvailable";
import { analytics } from "../../../firebase/index";
import cx from "classnames";
import moment from "moment";
import { getHiringMangerList } from "_store";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, CANDIDATE_MESSAGES, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import NewPageTitle from "../../../_components/common/newpagetitle";
import PageTitle from "../../../_components/common/pagetitle";
import { CommonFilters } from "../../../_components/common/commonFilters";
import { showSnackbar } from "_store/snackbar.slice";
import DatePicker from "react-datepicker";
import { set } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSearch,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { ca, is } from "date-fns/locale";
import { use } from "react";
import {
  setSelectedOpt,
  setSearchText,
  setHiringManagerId,
  setJobStatus,
  setPlaceHolder,
  clearFilters,
  setInterviewFeedbackStatusId,
  setStartDate,
  setEndDate
} from "_store/commonCustFiltersSlice";
import { CandidateInterviewHistoryModal } from "_components/modal/candidateinterviewhistorymodal";
import { ExternalMemberFeedbackModal } from "_components/modal/externalmemberfeedbackmodal";
export default function CustomerCandidateLists(props) {
  const { id, jobPostedbyId, type: typeParam } = useParams();
  const [activeTab, setActiveTab] = useState(props.type || typeParam || "matched");
  const [pageNo, setPageNo] = useState(1);

  const [selectedJobId, setSelectedJobId] = useState(id || "");
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPSModal, setShowPSModal] = useState(false);
  const [preScreenType, setPreScreenType] = useState("");
  const [oHModal, setOHModal] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  // const [searchText, setSearchText] = useState("");
  // const [actionbyId, setActionbyId] = useState();
  // const [actionbyId, setActionbyId] = useState(id && jobPostedbyId || localStorage.getItem("userId"));
  const { selectedOpt, searchText, hiringManagerId, interviewFeedbackStatusId, startDate, endDate, seeAllHiringManagerJobs } = useSelector(
    (state) => state.commonCustFilters
  );

  const isCompanyAdmin = Number(localStorage.getItem("userroleid")) === 4 ||
    localStorage.getItem("isCompanyAdmin") === "true";

  const [candidateHistoryList, setCandidateHistoryList] = useState([]);
  const [interviewFeedbackStatusId1, setInterviewFeedbackStatusId1] = useState(0);
  const [interviewStatusId, setInterviewStatusId] = useState("");

  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCandidateHistoryModal, setShowCandidateHistoryModal] = useState(false);
  const [candidateInterviewList, setCandidateInterviewList] = useState([]);
  const [showCandidateInterviewHistoryModal, setShowCandidateInterviewHistoryModal] = useState(false);
  const [showExternalFeedbackModal, setShowExternalFeedbackModal] = useState(false);
  const [externalMemberFeedbacks, setExternalMemberFeedbacks] = useState([]);
  let [startDate1, setStartDate1] = useState();
  let [endDate1, setEndDate1] = useState();
  let companyList = localStorage.getItem("companyList") ? JSON.parse(localStorage.getItem("companyList")) : [];
  const [isStaffingFirm, setIsStaffingFirm] = useState(companyList.some(company => company.isstaffingfirm === true));
  const [offlineStatuses, setOfflineStatuses] = useState([]);
  const [showInterviewFeedbackStatusFilter, setShowInterviewFeedbackStatusFilter] = useState(false);
  const [showFromToDateFilter, setShowFromToDateFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [showClearButtonAtEnd, setShowClearButtonAtEnd] = useState(true);

  const rejectDrpDwnList = useSelector(
    (state) => state.customerCandidateList.rejectDrpDwnList
  );
  const candidateList = useSelector(
    (state) => state.customerCandidateList.candidateList
  );

  const totalRecords = useSelector(
    (state) => state.customerCandidateList.totalRecords
  );

  const loading = useSelector((state) => state.customerCandidateList.loading);
  const durationOptions = useSelector(
    (state) => state.customerCandidateList.durationOptions
  );

  const prescreenQues = useSelector(
    (state) => state.customerCandidateList.prescreenQues
  );

  const custOfferHistory = useSelector(
    (state) => state.customerCandidateList.custOfferHistory
  );
  // const filteredItems = useSelector((state) => state.dropdown.jobsDropdownList);
  // const hiringManagerDownList = useSelector((state) => state?.customerReportReducer?.hiringmangers);
  const interviewFeedbackStatus = useSelector((state) => state.scheduleInterview.interviewStatus);
  const [interviewStatus, setInterviewStatus] = useState([]);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [candidateDocumentUrl, setCandidateDocumentUrl] = useState("");
  const jobDetail = useSelector((state) => state.custJobListReducer.jobDetail);
  const reportData = useSelector((state) => state.customerCandidateList.reportData);
  const [scoreJson, setScoreJson] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  // // // Set default actionbyId after hiringManagerDownList is loaded
  // useEffect(() => {
  //   if (hiringManagerDownList && hiringManagerDownList.length > 0) {
  //     setActionbyId(localStorage.getItem("userId"));
  //   }
  //   if (id && jobPostedbyId) {
  //     setActionbyId(jobPostedbyId);
  //   }
  // }, [hiringManagerDownList]);

  useEffect(() => {
    dispatch(customerCandidateListsActions.getRejectDropDown());
    dispatch(customerCandidateListsActions.getDurationOptions());
    dispatch(scheduleInterviewActions.getDurationThunk());
    dispatch(dropdownActions.getJobTypeThunk2());
    dispatch(dropdownActions.getWorkScheduleThunk2());
    dispatch(dropdownActions.getShiftThunk2());
    dispatch(scheduleInterviewActions.getInterviewStatusDropDownThunk());
    dispatch(dropdownActions.getInterviewRoundListThunk({ searchText: "interviewRound", commonId: 0, searchBy: "" }));
    getCandidateOfflineStatusesDropdown();
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "employer job list",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  // useEffect(() => {
  //   const currentJobId = id || selectedJobId || null; // Prioritize id, then selectedJobId, then null
  //   const currentUserId = actionbyId;

  //   if (currentUserId) {
  //     dispatch(customerCandidateListsActions.getReportBySP({ jobId: currentJobId, userId: currentUserId, searchText: searchText }));
  //   }
  // }, [id, selectedJobId, actionbyId, dispatch]);

  useEffect(() => {
    if (!id) {
      setPageNo(1);
      let pageno = 1;
      onGetPageList(pageno, props.type || activeTab, "");
    }
  }, [props.type, hiringManagerId, selectedJobId, seeAllHiringManagerJobs]);

  useEffect(() => {
    if (id) {
      // setShowInterviewFeedbackStatusFilter(props.type === "scheduled" || activeTab === "scheduled" ? true : false);
      // setShowFromToDateFilter(props.type === "scheduled" || activeTab === "scheduled" ? true : false);
      setShowSearch(false);
      setShowClearButtonAtEnd(false);
      setPageNo(1);
      // Pass jobPostedbyId directly so the first API call uses the correct userId
      // without waiting for the Redux setHiringManagerId dispatch to settle
      const userId = jobPostedbyId || hiringManagerId || undefined;
      onGetPageList(1, props.type || activeTab, id, false, userId);
    }
  }, [props.type, id, hiringManagerId, selectedJobId, seeAllHiringManagerJobs]);

  useEffect(() => {
    let companyId = Number(localStorage.getItem("companyid"));
    // dispatch(getHiringMangerList(companyId));
    if (id) {
      dispatch(setHiringManagerId(jobPostedbyId));
      dispatch(custJobListActions.getJobDetail({ jobId: id }));
    }
    else {
      dispatch(setSearchText(''));
    }
  }, [dispatch])

  useEffect(() => {
    if (id) {
      dispatch(setSearchText(jobDetail[0]?.jobtitle));
    }
  }, [jobDetail])

  useEffect(() => {
    // setPageNo(1);
    // let pageno = 1;
    // onGetPageList(pageno, props.type || activeTab, "");    
    setActiveTab(props.type || 'matched');
  }, [props.type])

  const returnStatusId = (type) => {
    if (type === "liked") {
      return 1;
    } else if (type === "maybe") {
      return 2;
    } else if (type === "applied") {
      return 3;
    } else if (type === "scheduled") {
      return 4;
    } else if (type === "accepted") {
      return 5;
    } else if (type === "rejected") {
      return 6;
    } else if (type === "offers") {
      return 7;
    } else {
      return "";
    }
  };

  // userId param lets callers bypass the Redux hiringManagerId timing gap
  // (e.g. when jobPostedbyId from URL is known before Redux is updated)
  const onGetCandidatesCount = (id, clearText = false, userId = null) => {
    dispatch(customerCandidateListsActions.getReportBySP({ jobId: id, userId: userId || hiringManagerId, searchText: clearText ? "" : searchText ? searchText : "", searchType: clearText ? "" : selectedOpt, viewAllCompanyJobs: seeAllHiringManagerJobs }));
  }

  const onGetPageList = (pageNo, type, id, clearText = false, userId = null) => {
    const actionbyId = userId || hiringManagerId;
    let candObj = {
      pageNumber: pageNo,
      pageSize: type === "matched" ? cardPageSize : listPageSize,
      customerRecommendedJobStatusId: returnStatusId(type),
      jobId: id || "",
      searchText: clearText ? "" : searchText ? searchText : "",
      searchType: selectedOpt,
      actionbyId,
      viewAllCompanyJobs: seeAllHiringManagerJobs
    };

    if (type === 'scheduled') {
      let fromDate = startDate ? moment(startDate).format("YYYY-MM-DDT00:00:00") : null;
      let toDate = endDate ? moment(endDate).format("YYYY-MM-DDT23:59:59") : null;
      candObj = {
        ...candObj,
        interviewStatusId: interviewFeedbackStatusId ? interviewFeedbackStatusId !== 0 ? Number(interviewFeedbackStatusId) : null : null,
        candidateInterviewStatusId: interviewStatusId ? interviewStatusId !== 0 ? interviewStatusId : null : null,
        interviewScheduleDateStart: startDate ?
          moment(fromDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null,
        interviewScheduleDateEnd: endDate ? moment(toDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null
      };
    }
    if (type === 'presented') {
      dispatch(customerCandidateListsActions.getPresentedCandidateLists(candObj));
      if (pageNo === 1) onGetCandidatesCount(id, clearText, actionbyId);
      return
    }

    dispatch(customerCandidateListsActions.getCandidateLists(candObj));
    if (pageNo === 1) onGetCandidatesCount(id, clearText, actionbyId);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
    onGetPageList(page, props.type || activeTab, id);
  };
  const toggle = (activetab) => {
    const isScheduleTab = activetab === "scheduled";
    clearInterviewFilters();
    setShowInterviewFeedbackStatusFilter(isScheduleTab);
    setShowFromToDateFilter(isScheduleTab);
    if (id) {
      //setSearchText("");
      setPageNo(1);
      setActiveTab(activetab);
      navigate(`/customer-candidate-${activetab}/${id}/${jobPostedbyId}`);
    } else {
      //setSearchText("");
      setPageNo(1);
      setActiveTab(activetab);
      let pageno = 1;
      onGetPageList(pageno, activetab, "", false);
    }
  };

  const onSelectClick = (evt) => {
    setPageNo(1);
    setSelectedJobId(evt.target.value);
    navigate(
      `/customer-candidate-${activeTab}/${parseInt(
        evt.target.value === "" ? 0 : evt.target.value
      )}`
    );
  };
  // let successMessage = CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS;
  const onActionClick = async (evt, type) => {
    if (type === "like") {
      let res = await dispatch(
        customerCandidateListsActions.putLikedCandidate({ id: evt })
      );
      if (res.payload.statusCode === 204) {

        // showSweetAlert({ title: successMessage, type: "success" });
        dispatch(showSnackbar({
          message: CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

        onGetPageList(pageNo, props.type || activeTab, id);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });

        dispatch(showSnackbar({
          message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

      }
    } else if (type === "maybe") {
      let res = await dispatch(
        customerCandidateListsActions.putMayBeCandidate({ id: evt })
      );
      if (res.payload.statusCode === 204) {
        // showSweetAlert({ title: successMessage, type: "success" });
        dispatch(showSnackbar({
          message: CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

        onGetPageList(pageNo, props.type || activeTab, id);
      } else {
        // showSweetAlert({
        //   title: res.payload.message || res.payload.status,
        //   type: "danger",
        // });
        dispatch(showSnackbar({
          message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

      }
    }
    else if (type === "presented") {
      handlePresentClick(evt, type);
    }
    else if (type === "candidatePlaced") {
      handleCandidatePlacedClick(evt, type);
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

  const onUpdateList = () => {
    onGetPageList(pageNo, props.type || activeTab, id);
  };

  const onBuildResumeClick = async (candidateId, scoreJson, jobTitle) => {
    setScoreJson(scoreJson);
    setJobTitle(jobTitle);
    let response = await dispatch(getProfileActions.getCandidate(candidateId));
    if (response?.payload) {
      setShowProfileModal(true);

    }
  };


  const onPrescreenActionClick = async (type, row) => {
    await dispatch(
      customerCandidateListsActions.getPrescreenDetails({
        jobId: row.jobid,
        candidateid: row.candidateid,
      })
    );

    setPreScreenType(type);
    setShowPSModal(true);
  };

  const onShowOHModal = async (row) => {
    let res = await dispatch(
      customerCandidateListsActions.getCustOfferHistory(
        row.candidaterecommendedjobid
      )
    );
    if (res?.payload?.statusCode === 204) {
      setOHModal(true);
      setCandidateName(row.firstname + " " + row.lastname);
    } else {
      // showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    }
  };

  const onClearSearch = async function () {
    dispatch(setSearchText(""));
    setPageNo(1);
    onGetPageList(pageNo, props.type || activeTab, id ? id : "", true);
  };
  const onSearchJob = async () => {
    setPageNo(1);
    onGetPageList(1, props.type || activeTab, id ? id : "");
  };

  const resetPageURL = () => {
    if (id && jobPostedbyId) {
      navigate(`/candidate-list`);
    }
    else {
      onSearchJob();
    }
  }

  const searchCandidate = async () => {
    onSearchJob();
    // if (searchText && actionbyId) {
    //   const currentJobId = selectedJobId || id || null;
    //   dispatch(customerCandidateListsActions.getReportBySP({ jobId: currentJobId, userId: actionbyId, searchText: searchText }));
    // }
  };
  const onCandidateHistoryClick = async (candidateId, row) => {
    setCandidateName(row?.firstname + " " + row?.lastname);
    let response = await dispatch(getProfileActions.getCandidateHistory(row.candidaterecommendedjobid));
    if (response?.payload) {
      setCandidateHistoryList(response?.payload);
      setShowCandidateHistoryModal(true);
    }
    else {
      setCandidateHistoryList([]);
      setShowCandidateHistoryModal(false);
    }
  };

  const onCandidateInterviewHistoryClick = async (candidateId, row) => {
    setCandidateName(row?.firstname + " " + row?.lastname);
    let response = await dispatch(scheduleInterviewActions.getCandidateInterviewListThunk(row.candidaterecommendedjobid));
    if (response?.payload) {
      setCandidateInterviewList(response?.payload?.data?.data || []);
      setShowCandidateInterviewHistoryModal(true);
    }
    else {
      setCandidateInterviewList([]);
      setShowCandidateInterviewHistoryModal(false);
    }
  };

  const onExternalMemberFeedbackClick = async (candidateId, row) => {
    const interviews = row?.scheduledInterviewDtos;
    if (!interviews || interviews.length === 0) return;
    setCandidateName(row?.firstname + " " + row?.lastname);

    // Fetch feedback for every interview round and combine into one flat list
    const requests = interviews
      .map((iv) => iv?.scheduleinterviewid)
      .filter(Boolean)
      .map((sid) =>
        dispatch(scheduleInterviewActions.getExternalMemberFeedbacksByScheduleIdThunk(sid))
      );

    const results = await Promise.all(requests);
    const allFeedbacks = results.flatMap((res) => res?.payload?.data || []);

    setExternalMemberFeedbacks(allFeedbacks);
    setShowExternalFeedbackModal(true);
  };

  const handleInterviewFilters = async () => {
    let fromDate = startDate ? moment(startDate).format("YYYY-MM-DDT00:00:00") : null;
    let toDate = endDate ? moment(endDate).format("YYYY-MM-DDT23:59:59") : null;
    let candObj = {
      pageNumber: pageNo,
      pageSize: activeTab === "matched" ? cardPageSize : listPageSize,
      customerRecommendedJobStatusId: returnStatusId(activeTab),
      jobId: id || "",
      searchText: searchText ? searchText : "",
      searchType: selectedOpt,
      actionbyId: hiringManagerId,
      interviewStatusId: interviewFeedbackStatusId ? interviewFeedbackStatusId !== 0 ? Number(interviewFeedbackStatusId) : null : null,
      candidateInterviewStatusId: interviewStatusId ? interviewStatusId !== 0 ? interviewStatusId : null : null,
      interviewScheduleDateStart: startDate ?
        moment(fromDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null,
      interviewScheduleDateEnd: endDate ? moment(toDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null
    };
    // console.log(candObj)
    getInterviewListByFilters(candObj);
  }

  const getInterviewListByFilters = async (filter) => {
    dispatch(customerCandidateListsActions.getCandidateLists(filter));
  }

  const clearInterviewFilters = () => {
    setInterviewFeedbackStatusId1(0);
    setStartDate1(null);
    setEndDate1(null);
    setInterviewStatusId(0);
  };

  const onInterviewSearchClear = () => {
    clearInterviewFilters();

    let candObj = {
      pageNumber: pageNo,
      pageSize: activeTab === "matched" ? cardPageSize : listPageSize,
      customerRecommendedJobStatusId: returnStatusId(activeTab),
      jobId: id || "",
      searchText: searchText ? searchText : "",
      searchType: selectedOpt,
      actionbyId: hiringManagerId
    };

    getInterviewListByFilters(candObj);
  };

  const searchJobDropdown = async (title) => {
    if (title?.length >= 3) {
      let companyId = Number(localStorage.getItem("companyid"));
      let filter = {
        companyId: companyId,
        isClose: 0,
        searchText: title.replaceAll(" ", "_"),
      }
      let response = await dispatch(dropdownActions.getJobsListThunk(filter));
      if (response?.payload) {
        setFilteredItems(response.payload);
      }
      else {
        setFilteredItems([]);
      }
    }
  }

  const handleSelectJobTitle = (value) => {
    dispatch(setSearchText(value.jobtitle));
    setSelectedJobId(value.jobid);
    setFilteredItems([]); // close suggestions
  };

  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilteredItems([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);



  const onSearchData1 = () => {
    let toDate = endDate ? moment(endDate).format("YYYY-MM-DDT23:59:59") : null;
    let candObj = {
      pageNumber: pageNo,
      pageSize: activeTab === "matched" ? cardPageSize : listPageSize,
      customerRecommendedJobStatusId: returnStatusId(activeTab),
      jobId: id || "",
      searchText: searchText ? searchText : "",
      searchType: selectedOpt,
      actionbyId: hiringManagerId,
      interviewStatusId: interviewFeedbackStatusId ? interviewFeedbackStatusId !== 0 ? Number(interviewFeedbackStatusId) : null : null,
      candidateInterviewStatusId: interviewStatusId ? interviewStatusId !== 0 ? interviewStatusId : null : null,
      interviewScheduleDateStart: startDate ?
        moment(startDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null,
      interviewScheduleDateEnd: endDate ? moment(toDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null
    };
    getInterviewListByFilters(candObj);
  };

  const onSearchData = () => {
    let toDate = endDate ? moment(endDate).format("YYYY-MM-DDT23:59:59") : null;
    let candObj = {
      pageNumber: pageNo,
      pageSize: activeTab === "matched" ? cardPageSize : listPageSize,
      customerRecommendedJobStatusId: returnStatusId(activeTab),
      jobId: id || "",
      searchText: searchText ? searchText : "",
      searchType: selectedOpt,
      actionbyId: hiringManagerId,
      interviewStatusId: interviewFeedbackStatusId ? interviewFeedbackStatusId !== 0 ? Number(interviewFeedbackStatusId) : null : null,
      candidateInterviewStatusId: interviewStatusId ? interviewStatusId !== 0 ? interviewStatusId : null : null,
      interviewScheduleDateStart: startDate ? moment(startDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null,
      interviewScheduleDateEnd: endDate ? moment(toDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null
    };

    if (activeTab === 'presented') {
      dispatch(customerCandidateListsActions.getPresentedCandidateLists(candObj));
      if (pageNo === 1) onGetCandidatesCount(id, false);
      return
    }

    dispatch(customerCandidateListsActions.getCandidateLists(candObj));
    if (pageNo === 1) onGetCandidatesCount(id, false);
  };

  const onCandidateResume = async (candidateId, url) => {
    if (!url) {
      return dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.RESUME_NOT_AVAILABLE,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
    setOpenDocumentModal(true);
    setCandidateDocumentUrl(url);
  }

  const handlePresentClick = async (evt, type) => {
    let res = await dispatch(
      customerCandidateListsActions.putPresentCandidate({ id: evt })
    );
    if (res.payload.statusCode === 204) {
      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      onGetPageList(pageNo, props.type || activeTab, id);
    } else {

      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  }

  const handleCandidatePlacedClick = async (evt, type) => {
    let res = await dispatch(
      customerCandidateListsActions.putCandidatePlaced({ id: evt })
    );
    if (res.payload.statusCode === 204) {
      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      onGetPageList(pageNo, props.type || activeTab, id);
    } else {
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  }
  const getCandidateOfflineStatusesDropdown = async () => {
    let response = await dispatch(dropdownActions.getDropdownListThunk({ searchText: 'RecommendedJobOfflineStatus', commonId: 0, searchBy: '' }));
    if (response?.payload) {
      let statues = response?.payload?.data ||
        response?.payload?.data?.data ||
        response?.payload ||
        [];
      setOfflineStatuses(statues);
    }
  }

  const onClearFilters = async () => {
    if (id && jobPostedbyId) {
      navigate(`/candidate-list`);
    }
    else {
      onClearSearch();
    }
  }

  return (
    <>
      <PageTitle heading="Candidates" />

      <CommonFilters
        showJobStatus={false}
        onSearchData={() => onSearchData()}
        showClearButton={false}
        showOnlyJobTitle={true}
        // placeHolder={placeHolder}
        // setPlaceHolder={setPlaceHolder}
        // selectedOpt={selectedOpt}
        // setSelectedOpt={setSelectedOpt}
        // searchText={searchText}
        // setSearchText={setSearchText}
        // onJobStatusChange={onJobStatusChange}
        // onJobHiringMangerChange={onJobHiringMangerChange}
        // hiringManagerId={hiringManagerId}
        // setHiringMangerId={setHiringMangerId} 
        interviewFeedbackStatus={interviewFeedbackStatus}
        showInterviewFeedbackStatus={showInterviewFeedbackStatusFilter}
        showFromDateToDate={showFromToDateFilter}
        showSearch={showSearch}
        showClearButtonAtEnd={showClearButtonAtEnd}
        onClearFilters={() => onClearFilters()}
        showSeeAllHMToggle={isCompanyAdmin}
      />
      <Row className="customercandidatelist">
        <div
          className="candidate-toolbar-flex"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            marginBottom: 24,
          }}
        >
          <Row className="g-2" style={{ width: '100%' }}>
            <Col xs="12" sm="12" md="12" lg={12}>
              <ButtonGroup size="md" className="cust-btn-tabs" style={{ flexWrap: 'wrap', minWidth: 320, maxWidth: '100%' }}>
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
                  Matched{reportData?.Matched >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Matched}</span>)}
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
                  Maybe{reportData?.Maybe >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Maybe}</span>)}
                </Button>
                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "liked" })
                  }
                  onClick={() => {
                    toggle("liked");
                  }}
                >
                  Liked{reportData?.Like >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Like}</span>)}
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
                  Applied{reportData?.Applied >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Applied}</span>)}
                </Button>

                {isStaffingFirm === true && (<Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "presented" })
                  }
                  onClick={() => {
                    toggle("presented");
                  }}
                >
                  Presented{reportData?.Presented >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Presented}</span>)}
                </Button>
                )}

                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "scheduled" })
                  }
                  onClick={() => {
                    toggle("scheduled");
                  }}
                >
                  Interviews{reportData?.Scheduled >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Scheduled}</span>)}
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
                  Offer{reportData?.Offer >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Offer}</span>)}
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
                  Accepted{reportData?.Accept >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Accept}</span>)}
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
                  Declined{reportData?.Reject >= 0 && (<span className="badge rounded-pill bg-danger count-badge-style">{reportData.Reject}</span>)}
                </Button>


              </ButtonGroup></Col>
            {false && (
              <>
                {/* <Col xs="12" sm="12" md="6" lg="2"><Input
                  type="select"
                  title="Hiring Manger"
                  value={hiringManagerId}
                  name="hiringmanagerId"
                  id="hiringmanagerId"
                  placeholder="Hiring Manger"
                  style={{ minWidth: 200, maxWidth: 220, flex: '0 1 160px' }}
                  onChange={(e) => {
                    //setActionbyId(e.target.value);
                    resetPageURL();
                  }}
                >
                  <option value={""}>Select a Hiring Manger</option>
                  {hiringManagerDownList?.length > 0 ? (
                    hiringManagerDownList.map((data) => (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    ))
                  ) : null}
                </Input>
                </Col> */}
                {/* <Col xs="12" sm="12" md="6" lg={2}>
                  <InputGroup>
                    <div ref={wrapperRef} style={{ position: "relative" }}>
                      <Input
                        type="text"
                        id="search-input"
                        value={searchText}
                        // onInput={(evt) => setSearchText(evt.target.value)}
                        placeholder="Search by Job Title"
                        onInput={(e) => {
                          setSearchText(e.target.value)
                          searchJobDropdown(e.target.value)
                        }}
                        maxLength={50}
                        autoComplete="off"
                      />
                      {filteredItems.length > 0 && (
                        <ul
                          style={{
                            listStyle: "none",
                            margin: 0,
                            padding: "4px",
                            border: "1px solid #ccc",
                            borderTop: "none",
                            position: "absolute",
                            width: "100%",
                            background: "#fff",
                            zIndex: 1000,
                            maxHeight: "150px",
                            overflowY: "auto",
                          }}
                        >
                          {filteredItems.map((item, index) => (
                            <li
                              key={index}
                              style={{ padding: "6px", cursor: "pointer" }}
                              onClick={() => handleSelectJobTitle(item)}
                            >
                              {item.jobtitle}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Button
                      color={"primary"}
                      className="input-group-text"
                      onClick={(evt) => { searchCandidate(); }}
                    >
                      <BsSearch />
                    </Button>
                  </InputGroup> */}
                {/* <div
                className={cx(
                  "candidate-search-wrapper search-wrapper candidate-seacrh-mt",
                  { active: true }
                )}
                style={{ minWidth: 90, maxWidth: 100, flex: '0 1 110px' }}
              >
                <input
                  type="text"
                  className="search-input search-placeholder"
                  id="search-input"
                  value={searchText}
                  onInput={(evt) => setSearchText(evt.target.value)}
                  placeholder="Search by Job Title"
                  style={{ width: '100%' }}
                />
                <button
                  className="btn-close"
                  onClick={(evt) => onClearSearch()}
                />
                <button onClick={(evt) => onSearchJob()} className="search-icon">
                  <span />
                </button>

              </div> */}

                {/* </Col> */}
              </>
            )}


          </Row>



          <style>{`
        @media (max-width: 1100px) {
          .candidate-toolbar-flex {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
        }
      `}</style>
        </div>

        <Col>
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
                  {candidateList?.length > 0 ? (
                    <>
                      <Row xs={1} sm={1} md={2} lg={3} xl={3}>
                        {candidateList.map((data, ind) => {
                          return (
                            <Col
                              key={ind}
                              className="card-col"
                            >
                              <CandidateCardView
                                data={data}
                                rejectDrpDwnList={rejectDrpDwnList}
                                onActionClick={(e, type) =>
                                  onActionClick(e, type)
                                }
                                showSweetAlert={({ title, type }) =>
                                  showSweetAlert({ title, type })
                                }
                                updateList={() => onUpdateList()}
                                durationOptions={durationOptions}
                                onBuildResume={(candidateId, scoreJson, jobTitle) =>
                                  onBuildResumeClick(candidateId, scoreJson, jobTitle)
                                }
                                onCandidateResume={(candidateId, url) =>
                                  onCandidateResume(candidateId, url)
                                }
                                isStaffingFirm={isStaffingFirm}
                              ></CandidateCardView>
                            </Col>
                          );
                        })}
                      </Row>
                      {totalRecords > cardPageSize ? (
                        <CardPagination
                          totalPages={totalRecords / cardPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <>
                      {candidateList.length === 0 && !loading ? (
                        <Row
                          style={{ textAlign: "center" }}
                          className="center-middle-align"
                        >
                          <Col>
                            <NoCandidateAvailable
                              message={"NO CANDIDATES AVAILABLE"}
                            ></NoCandidateAvailable>
                          </Col>
                        </Row>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </>
              )}
            </TabPane>
            <TabPane tabId="liked">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Liked candidates are individuals who have shown interest
                      in a candidate by clicking a button or icon on a matched
                      list. They are saved for later review or comparison and
                      are typically stored in a separate section of the user
                      account, allowing users to easily access them and decide
                      whether to contact them.
                    </span>
                  </Col>
                </Row>
              </div>
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          isStaffingFirm={isStaffingFirm}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
            <TabPane tabId="maybe">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Candidates are individuals unsure about being invited to
                      apply, often marked with a question or doubt. They may
                      also be saved in a separate section of the user account,
                      allowing users to review and change decisions later. This
                      helps make informed decisions about potential candidates.
                    </span>
                  </Col>
                </Row>
              </div>
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          isStaffingFirm={isStaffingFirm}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
            <TabPane tabId="applied">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Applied candidates are those who have submitted their
                      application for a job through the platform. They are
                      stored in a separate section of the user account, allowing
                      users to track their application status, contact them, or
                      reject them.
                    </span>
                  </Col>
                </Row>
              </div>
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          isStaffingFirm={isStaffingFirm}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
            <TabPane tabId="presented">
              {/* <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Candidates are individuals unsure about being invited to
                      apply, often marked with a question or doubt. They may
                      also be saved in a separate section of the user account,
                      allowing users to review and change decisions later. This
                      helps make informed decisions about potential candidates.
                    </span>
                  </Col>
                </Row>
              </div> */}
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          onCandidateInterviewHistory={(candidateId, row) =>
                            onCandidateInterviewHistoryClick(candidateId, row)
                          }
                          onExternalMemberFeedback={(candidateId, row) =>
                            onExternalMemberFeedbackClick(candidateId, row)
                          }
                          isStaffingFirm={isStaffingFirm}
                          offlineStatuses={offlineStatuses}
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
            <TabPane tabId="scheduled">
              <Card className="mb-3" style={{ display: 'none' }}>
                <CardBody>
                  <Row className="g-2" >
                    <Col xs="12" sm="12" md="6" lg="3" style={{ display: 'none' }}>
                      <Input
                        className="w-100"
                        type="select"
                        title="Interview Status"
                        value={interviewStatusId}
                        name="interviewStatusId"
                        id="InterviewStatus"
                        placeholder="Interview Status"
                        style={{ minWidth: '50%', maxWidth: '80%', flex: '0 1 160px' }}
                        onChange={(e) => {
                          setInterviewStatusId(e.target.value);
                        }}                      >
                        <option value={""}>Select Interview Status</option>
                        {interviewStatus?.length > 0 ? (
                          interviewStatus.map((data) => (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          ))
                        ) : null}
                      </Input>
                    </Col>
                    <Col xs="12" sm="12" md="6" lg="3">
                      <Input
                        type="select"
                        title="Interview Status"
                        value={interviewFeedbackStatusId}
                        name="interviewFeedbackStatusId"
                        id="InterviewFeedbackStatus"
                        placeholder="Interview Feedback Status"
                        style={{ minWidth: '50%', maxWidth: '80%', flex: '0 1 160px' }}
                        onChange={(e) => {
                          setInterviewFeedbackStatusId1(e.target.value);
                        }}                      >
                        <option value={""}>Select Interview Feedback Status</option>
                        {interviewFeedbackStatus?.length > 0 ? (
                          interviewFeedbackStatus.map((data) => (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          ))
                        ) : null}
                      </Input>
                    </Col>
                    <Col xs="12" sm="12" md="6" lg="2">
                      <InputGroup style={{ minWidth: '50%', maxWidth: '80%', flex: '0 1 160px' }}>
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <DatePicker
                          name="startDate"
                          id="startDate"
                          placeholderText="From"
                          className="form-control"
                          selected={startDate}
                          maxDate={endDate}
                          showMonthDropdown
                          showYearDropdown

                          onChange={(date) => {
                            // handleDateChange("startDate", date);
                            setStartDate1(date);
                          }}
                        />
                      </InputGroup>
                    </Col>
                    <Col xs="12" sm="12" md="6" lg="2">
                      <InputGroup style={{ minWidth: '50%', maxWidth: '80%', flex: '0 1 160px' }}>
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <DatePicker
                          name="endDate"
                          id="endDate"
                          placeholderText="To"
                          className="form-control"
                          selected={endDate}
                          minDate={startDate}
                          showMonthDropdown
                          showYearDropdown
                          onChange={(date) => {
                            // handleDateChange("startDate", date);
                            setEndDate1(date);
                          }}
                        />
                      </InputGroup>
                    </Col>
                    <Col xs="12" sm="12" md="6" lg="2">
                      <Button
                        color="primary"
                        onClick={() => {
                          handleInterviewFilters()
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} /> Search
                      </Button>

                      <Button
                        // style={{ background: "rgb(47 71 155)" }}
                        color="link"
                        type="button"
                        onClick={() => onInterviewSearchClear()}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <div className="p-3 tab-info">

                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Scheduled interview candidates are selected for an
                      interview and have a scheduled date and time. They move to
                      the next stage of the hiring process, where skills are
                      evaluated. These candidates are stored in a separate
                      section of the user account, where users can view their
                      interview details and prepare for the meeting.
                    </span>
                  </Col>
                </Row>
              </div>
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          isStaffingFirm={isStaffingFirm}
                          onCandidateInterviewHistory={(candidateId, row) =>
                            onCandidateInterviewHistoryClick(candidateId, row)
                          }
                          onExternalMemberFeedback={(candidateId, row) =>
                            onExternalMemberFeedbackClick(candidateId, row)
                          }
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
            <TabPane tabId="offers">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Offer candidates are candidates who have decided to offer
                      a job after interviewing and assessing their
                      qualifications. This means the customer has made a final
                      decision on who to hire and communicated the offer to the
                      candidate, either verbally or in writing. They are
                      typically stored in a separate section of the account,
                      allowing users to track the offer's status, negotiate
                      terms, or withdraw it if needed.
                    </span>
                  </Col>
                </Row>
              </div>
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          isStaffingFirm={isStaffingFirm}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
            <TabPane tabId="accepted">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Accepted candidates are those who have accepted a job
                      offer, either verbally or in writing, indicating that you
                      have successfully hired them and agreed on their
                      employment terms. They are typically stored in a separate
                      section of the user account, providing information on
                      their start date, contract details, and onboarding tasks.
                    </span>
                  </Col>
                </Row>
              </div>
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          isStaffingFirm={isStaffingFirm}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
            <TabPane tabId="rejected">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Declined candidates are those who have been rejected
                      during the hiring process due to non-compliance with
                      requirements, withdrawal of application, or refusal of
                      offer. They are stored in a separate section of the
                      account, where the reason for rejection can be viewed,
                      feedback can be provided, or the candidate may be
                      reconsidered for future opportunities.
                    </span>
                  </Col>
                </Row>
              </div>
              <div>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId, scoreJson, jobTitle) =>
                            onBuildResumeClick(candidateId, scoreJson, jobTitle)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                          showActionInterestColumns={true}
                          onCandidateHistory={(candidateId, row) =>
                            onCandidateHistoryClick(candidateId, row)
                          }
                          onCandidateResume={(candidateId, url) =>
                            onCandidateResume(candidateId, url)
                          }
                          isStaffingFirm={isStaffingFirm}

                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
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
                        {candidateList.length === 0 && !loading ? (
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
              </div>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
      <>
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>

      <>
        {showProfileModal ? (
          <>
            <BuildCVModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
              scoreJson={scoreJson}
              jobTitle={jobTitle}
            />
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
              //sendFormData={(data) => onSendPrescreenData(data)}
              preScreenType={preScreenType}
            ></PrescreenModal>
          </>
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
              setCandidateName("");
            }}
            offerHistory={custOfferHistory}
            name={candidateName}
            activeTab={activeTab}
          ></OfferHistory>
        ) : (
          <></>
        )}
      </>
      <>
        {showCandidateHistoryModal ? (
          <>
            <CandidateHistoryModal
              isOpen={showCandidateHistoryModal}
              onClose={() => setShowCandidateHistoryModal(false)}
              candidateHistoryList={candidateHistoryList}
              candidateName={candidateName}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {openDocumentModal && (
          <CandidateCVModal isOpen={openDocumentModal} onClose={() => setOpenDocumentModal(false)}
            url={candidateDocumentUrl}
          />
        )}
      </>
      <>
        {showCandidateInterviewHistoryModal ? (
          <>
            <CandidateInterviewHistoryModal
              isOpen={showCandidateInterviewHistoryModal}
              onClose={() => setShowCandidateInterviewHistoryModal(false)}
              candidateInterviewList={candidateInterviewList}
              candidateName={candidateName}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {showExternalFeedbackModal && (
          <ExternalMemberFeedbackModal
            isOpen={showExternalFeedbackModal}
            onClose={() => {
              setShowExternalFeedbackModal(false);
              setExternalMemberFeedbacks([]);
            }}
            feedbacks={externalMemberFeedbacks}
            interviewTitle={candidateName}
          />
        )}
      </>
    </>
  );
}
