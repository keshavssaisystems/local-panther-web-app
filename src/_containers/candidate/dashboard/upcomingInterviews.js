import React, { useState } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
  Button,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  getLocationText,
  getTimezoneDateTime,
  getVideoChannelId,
} from "_helpers/helper";

import SweetAlert from "react-bootstrap-sweetalert";
import DataTable from "react-data-table-component";
import scheduleIcon from "../../../assets/utils/images/upcoming-interview.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import videoIcon from "../../../assets/utils/images/camera-video-fill.svg";
import personIcon from "../../../assets/utils/images/person-fill.svg";
import { BsFillTelephoneFill } from "react-icons/bs";
import { InterViewDetailModal } from "../../../_components/modal/interviewdetailmodal";
import { PrescreenModal } from "_components/modal/prescreenmodal";
import { NoDataFound } from "_components/common/nodatafound";
import Loader from "react-loaders";
import { customerCandidateListsActions, candidateListActions } from "_store";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";

import { USPhoneNumber } from "_helpers/helper";
import { useNavigate } from "react-router-dom";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export function UpcomingInterviews() {
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const schedules = useSelector(
    (state) => state.candidateDashboard.dashboardGraphData
  );
  console.log("Upcoming Interviews Data:", schedules);
  const [showInterviewDetails, setDetails] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [link, setLink] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showPSModal, setShowPSModal] = useState(false);
  const [preScreenLoading, setPreScreenLoading] = useState(false);
  const [psJobId, setPsJobId] = useState(null);
  const [completedPreScreenJobIds, setCompletedPreScreenJobIds] = useState([]);
  const prescreenQues = useSelector(
    (state) => state.candidateListReducer.prescreenQues
  );
  const loader = useSelector(
    (state) => state.candidateDashboard.schedulesLoader
  );
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  let settings = {
    ...ToastContainer.defaultProps,
    transition: "bounce",
    type: "success",
    disableAutoClose: true,
  };
  const [showInterview, setShowInterview] = useState(false);
  const [appShowInterview, setAppShowInterview] = useState(false);

  const columns = [
    {
      name: "Job title",
      selector: (row) => <span title={row.jobtitle}>{row.jobtitle}</span>,
      sortable: false,
    },
    {
      name: "Job location",
      selector: (row) => (
        <span title={getLocationText(row)}>{getLocationText(row)}</span>
      ),
      sortable: false,
    },
    {
      name: "Company",
      selector: (row) => <span title={row.companyname}>{row.companyname}</span>,
      sortable: false,
    },
    {
      name: "Scheduled date",
      selector: (row) =>
        getTimezoneDateTime(
          moment(row.scheduledate + " " + row.starttime).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          "MM/DD/YYYY"
        ),
      sortable: false,
    },
    {
      name: "Time",
      selector: (row) => (
        <span title={getStartTime(row)}>{getStartTime(row)}</span>
      ),
      sortable: false,
    },

    {
      name: "Mode",
      cell: (row) => <>{interviewMode(row)}</>,
      sortable: false,
      ignoreRowClick: true,
      button: false,
    },
    {
      name: "Actions",
      cell: (row) => <>{renderMenu(row)}</>,
      sortable: false,
      ignoreRowClick: true,
      button: true,
    },
  ];

  const getStartTime = function (interviewDetail) {
    let startTime = getTimezoneDateTime(
      moment(interviewDetail?.scheduledate).format("MMM D, YYYY") +
      " " +
      interviewDetail?.starttime,
      "hh:mm a"
    );
    let startDate =
      moment(interviewDetail?.scheduledate).format("MMM D, YYYY") +
      " " +
      startTime;
    let durationArr =
      interviewDetail?.duration !== undefined
        ? interviewDetail?.duration.split(" ")
        : [];
    let endTime = getTimezoneDateTime(
      moment(startDate).add(durationArr[0], "m"),
      "hh:mm a"
    );

    return startTime + " to " + endTime;
  };

  const totalRecords = useSelector(
    (state) => state.candidateDashboard?.dashboardGraphData?.length
  );

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const renderPaginationItems = () => {
    const items = [];

    for (let page = 1; page <= Math.round(totalRecords / 5); page++) {
      if (page <= 3 || page > Math.round(totalRecords / 5) - 3) {
        items.push(
          <PaginationItem
            className="middle-page"
            key={page}
            active={pageNo === page}
          >
            <PaginationLink onClick={() => handlePageChange(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  const onInterviewDetails = async (scheduleInterviewId, rowData) => {
    setDetailsLoading(true);
    try {
      let res = await dispatch(
        customerCandidateListsActions.getScheduleIVList(scheduleInterviewId)
      );
      if (res.payload) {
        if (res?.payload?.data?.scheduledInterviewList.length > 0) {
          const detail = res?.payload?.data?.scheduledInterviewList[0];
          setPopupData({
            ...detail,
            isprescreenmandatory: detail?.isprescreenmandatory ?? rowData?.isprescreenmandatory,
            candidateprescreenstatus: detail?.candidateprescreenstatus ?? rowData?.candidateprescreenstatus,
          });
          setDetails(true);
        } else {
          showSweetAlert({
            title: "Something went wrong, please try again later",
            type: "error",
          });
        }
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };

  const onPrescreenClickAction = async (row) => {
    setPsJobId(row.jobid);
    await dispatch(candidateListActions.getJobPrescreenApplicationQues(row.jobid));
    setShowPSModal(true);
  };

  const onSendPrescreenData = async (formData) => {
    setPreScreenLoading(true);
    const candidateid = parseInt(
      JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
    );
    const currentUserId = parseInt(
      JSON.parse(localStorage.getItem("userDetails")).UserId
    );
    const authData = localStorage.getItem("token") || "";
    const authConfig = { headers: { Authorization: `Bearer ${authData}` } };

    const nonFileData = formData
      .filter((d) => !d.iscustomquestion || d.customquestionanswertype === "Text")
      .map((d) => ({
        jobcandidateprescreenapplicationid: 0,
        jobprescreenapplicationid: d.jobprescreenapplicationid,
        jobid: d.jobid,
        candidateid,
        answer: d.answer,
        isactive: d.isactive,
        currentUserId,
      }));

    const fileData = formData
      .filter((d) => d.iscustomquestion && d.customquestionanswertype !== "Text")
      .map((d) => ({
        jobcandidateprescreenapplicationid: 0,
        jobprescreenapplicationid: d.jobprescreenapplicationid,
        jobid: d.jobid,
        candidateid,
        answer: d.answer,
        isactive: d.isactive,
        currentUserId,
      }));

    const firstItem = nonFileData[0] || fileData[0];
    const notifyJobId = firstItem?.jobid;
    const notifyCandidateId = firstItem?.candidateid;

    const res = nonFileData.length > 0
      ? await dispatch(candidateListActions.postJobPrescreenApplication(nonFileData))
      : { payload: { statusCode: 201, message: "Success" } };

    if (res.payload.statusCode === 201) {
      const fileConfig = {
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
          form.append("Candidateid", candidateid);
          form.append("currentUserId", currentUserId);
          form.append("Answerfile", i.answer);
          form.append("Isactive", i.isactive);
          const fileRes = await axios
            .post(
              `${process.env.REACT_APP_MAIN_API_URL}/api/JobCandidatePrescreenApplication/CandidatePrecreenAnswerFileUpload`,
              form,
              fileConfig
            )
            .then((result) => {
              if (result.data.statusCode == 204) {
                if (fileData.length - 1 === index) {
                  axios.post(`${process.env.REACT_APP_MAIN_API_URL}/api/JobCandidatePrescreenApplication/SendPrescreenCompleteEmail?jobId=${notifyJobId}&candidateId=${notifyCandidateId}`, null, authConfig).catch(() => {});
                  setPreScreenLoading(false);
                  setShowPSModal(false);
                  if (psJobId) setCompletedPreScreenJobIds((prev) => [...prev, psJobId]);
                  dispatch(showSnackbar({ message: result.data.message, type: SNACKBAR_TYPES.SUCCESS, position: SNACKBAR_POSITION.TOP_CENTER, autoClose: true, autoCloseDelay: 3000, maxWidth: 500 }));
                }
              } else {
                setPreScreenLoading(false);
                dispatch(showSnackbar({ message: result.data.message || result.data.status, type: SNACKBAR_TYPES.ERROR, position: SNACKBAR_POSITION.TOP_CENTER, autoClose: true, autoCloseDelay: 3000, maxWidth: 500 }));
              }
            })
            .catch(() => { setPreScreenLoading(false); });
        });
      } else {
        axios.post(`${process.env.REACT_APP_MAIN_API_URL}/api/JobCandidatePrescreenApplication/SendPrescreenCompleteEmail?jobId=${notifyJobId}&candidateId=${notifyCandidateId}`, null, authConfig).catch(() => {});
        setPreScreenLoading(false);
        setShowPSModal(false);
        if (psJobId) setCompletedPreScreenJobIds((prev) => [...prev, psJobId]);
        dispatch(showSnackbar({ message: res.payload.message, type: SNACKBAR_TYPES.SUCCESS, position: SNACKBAR_POSITION.TOP_CENTER, autoClose: true, autoCloseDelay: 3000, maxWidth: 500 }));
      }
    } else {
      setPreScreenLoading(false);
      dispatch(showSnackbar({ message: res.payload.message || res.payload.status, type: SNACKBAR_TYPES.ERROR, position: SNACKBAR_POSITION.TOP_CENTER, autoClose: true, autoCloseDelay: 3000, maxWidth: 500 }));
    }
  };

  const checkInterview = function (mode, data) {
    // Block join if pre-screening is mandatory and not yet completed
    if (data?.isprescreenmandatory === true && data?.candidateprescreenstatus === "Pending" && !completedPreScreenJobIds.includes(data?.jobid)) {
      dispatch(showSnackbar({
        message: "You must complete the pre-screening questionnaire before joining this interview.",
        type: SNACKBAR_TYPES.WARNING,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 4000,
        maxWidth: 600,
      }));
      return;
    }

    let id = getVideoChannelId(
      data?.jobid,
      data?.scheduleinterviewid,
      data?.candidateid
    );
    if (mode === "phone") {
      showSweetAlert({
        title: `Please wait, Interviewer will call you on phone - ${USPhoneNumber(
          data.phonenumber
        )}`,
        type: "success",
      });
    } else if (mode === "Video") {
      if (isBefore(data)) {
        dispatch(showSnackbar({
          message: "You can join the interview 15 minutes before the scheduled time.",
          type: SNACKBAR_TYPES.WARNING,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 2000,
          maxWidth: 500,
        }));
        return;
      }
      
      if (isAfter(data)) {
        dispatch(showSnackbar({
          message: "You cannot join the interview after the scheduled time.",
          type: SNACKBAR_TYPES.WARNING,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 2000,
          maxWidth: 500,
        }));
        return;
      }
      
      if (data.isappvideocall) {
        navigateTo(id);
        // setLink(id);
        // setAppShowInterview(true);
      } else {
        setLink(data.videolink);
        setShowInterview(true);
      }
    } else if (mode === "In-person") {
      showSweetAlert({
        title: `Scheduled at - ${data?.interviewaddress === undefined || data?.interviewaddress === ""
          ? "No address provided"
          : data?.interviewaddress
          }`,
        type: "success",
      });
    }
  };

  const isPast = (options) => {
    let scheduledTime = getTimezoneDateTime(
      moment(
        options?.scheduledate + " " + options?.starttime
      ).format("YYYY-MM-DD HH:mm:ss"),

      "MM/DD/YYYY HH:mm:ss"
    );

    let startTime = getTimezoneDateTime(
      moment(options?.scheduledate).format("MMM D, YYYY") +
      " " +
      options?.starttime,
      "hh:mm A"
    );
    let startDate =
      moment(options?.scheduledate).format("MMM D, YYYY") +
      " " +
      startTime;
    let durationArr =
      options?.duration !== undefined
        ? options?.duration.split(" ")
        : [];
    let endTime = getTimezoneDateTime(
      moment(
        options?.scheduledate + " " + options?.starttime
      ).add(durationArr[0], "m").format("YYYY-MM-DD HH:mm:ss"),
      "MM/DD/YYYY HH:mm:ss"
    );


    console.log("scheduledTime", endTime);
    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let minutes = moment(scheduledTime).diff(now, "minutes");
    let revminutes = moment(now).diff(endTime, "minutes");

    return (!(revminutes < 0 && minutes < 15));
  };



  const isBefore = (options) => {
    let scheduledTime = getTimezoneDateTime(moment(options?.scheduledate + " " + options?.starttime).format("YYYY-MM-DD HH:mm:ss"), "MM/DD/YYYY HH:mm:ss");

    let startTime = getTimezoneDateTime(moment(options?.scheduledate).format("MMM D, YYYY") + " " + options?.starttime, "hh:mm A");
    let startDate = moment(options?.scheduledate).format("MMM D, YYYY") + " " + startTime;
    let durationArr = options?.duration !== undefined ? options?.duration.split(" ") : [];

    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let minutes = moment(scheduledTime).diff(now, "minutes");

    return (!(minutes < 15));
  };


  const isAfter = (options) => {
    let durationArr =
      options?.duration !== undefined
        ? options?.duration.split(" ")
        : [];
    let endTime = getTimezoneDateTime(
      moment(
        options?.scheduledate + " " + options?.starttime
      ).add(durationArr[0], "m").format("YYYY-MM-DD HH:mm:ss"),
      "MM/DD/YYYY HH:mm:ss"
    );

    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let revminutes = moment(now).diff(endTime, "minutes");

    return (!(revminutes <= 0));
  };
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const interviewMode = (row) => {
    const isPreScreenBlocked =
      row?.isprescreenmandatory === true &&
      row?.candidateprescreenstatus === "Pending" &&
      !completedPreScreenJobIds.includes(row?.jobid);

    return (
      <div className="d-flex align-items-center" style={{ gap: "6px" }}>
        {row.format === "Video" || row.format === "In-person" ? (
          <div
            className="ellipse d-flex justify-content-center align-items-center"
            onClick={() => checkInterview(row.format, row)}
            title={isPreScreenBlocked ? "Complete pre-screening to join" : ""}
            style={isPreScreenBlocked ? { cursor: "not-allowed", opacity: 0.45 } : {}}
          >
            <img
              style={{ cursor: isPreScreenBlocked ? "not-allowed" : "pointer" }}
              src={row.format === "Video" ? videoIcon : personIcon}
              alt="interview-icon"
            />
          </div>
        ) : (
          <div
            className="ellipse d-flex justify-content-center align-items-center"
            title={isPreScreenBlocked ? "Complete pre-screening to join" : ""}
            style={isPreScreenBlocked ? { cursor: "not-allowed", opacity: 0.45 } : {}}
          >
            <BsFillTelephoneFill
              onClick={() => checkInterview("phone", row)}
              style={{ cursor: isPreScreenBlocked ? "not-allowed" : "pointer" }}
              className="header-icon icon-gradient bg-amy-crisp"
            />
          </div>
        )}
        {isPreScreenBlocked && (
          <Button
            color="link"
            size="sm"
            className="p-0"
            style={{ fontSize: "0.75rem" }}
            onClick={() => onPrescreenClickAction(row)}
          >
            Complete Pre-Screening
          </Button>
        )}
      </div>
    );
  };

  const renderMenu = (row) => {
    return (
      <div className="d-block w-100 text-center">
        <UncontrolledButtonDropdown direction="start">
          <DropdownToggle
            className="btn-icon btn-icon-only btn btn-link"
            color="link"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </DropdownToggle>
          <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
            <DropdownItem disabled={detailsLoading}>
              <i className="dropdown-icon lnr-license"> </i>
              <span
                onClick={() => !detailsLoading && onInterviewDetails(row.scheduleinterviewid, row)}
                style={{ display: "flex", alignItems: "center", gap: "6px", cursor: detailsLoading ? "not-allowed" : "pointer" }}
              >
                {detailsLoading && (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                )}
                Interview details
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  };
  const navigate = useNavigate();
  const navigateTo = (link) => {
    window.open(`/video-screen/${link}`, "_blank");
    // navigate(`/video-screen/${link}`);
  };
  const navigateToThirdPartyLink = (link) => {
    window.open(`${link}`, "_blank", "rel=noopener noreferrer");
  };
  return (
    <>
      <Card className="card-hover-shadow-2x mb-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-md text-capitalize fw-bold">
            <img src={scheduleIcon} alt="schedule-img" className="me-2" />
            Upcoming Interviews
          </div>
        </CardHeader>

        {!loader ? (
          <div>
            {schedules?.length > 0 ? (
              <DataTable
                data={schedules ? schedules : []}
                columns={columns}
                fixedHeader
                fixedHeaderScrollHeight="390px"
              />
            ) : (
              <Row style={{ textAlign: "center" }}>
                <Col>
                  {" "}
                  <NoDataFound imageSize={"25px"} />
                </Col>
              </Row>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center loader">
            <Loader active={loader} type="line-scale-pulse-out-rapid" />
          </div>
        )}
        <CardFooter>
          {totalRecords > 0 ? (
            <div className="mt-2">
              {totalRecords > 5 ? (
                <Pagination className="float-end pagination-cont me-2">
                  <PaginationItem disabled={pageNo === 1}>
                    <PaginationLink
                      previous
                      onClick={() => handlePageChange(pageNo + 1)}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem disabled={pageNo === totalRecords / 5}>
                    <PaginationLink
                      next
                      onClick={() => handlePageChange(pageNo + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
      <>
        {showInterviewDetails ? (
          <>
            <InterViewDetailModal
              data={popupData}
              onClose={() => {
                setDetails(false);
              }}
              isOpen={showInterviewDetails}
            ></InterViewDetailModal>
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {showPSModal && (
          <PrescreenModal
            isOpen={showPSModal}
            onClose={() => setShowPSModal(false)}
            data={prescreenQues}
            sendFormData={(data) => onSendPrescreenData(data)}
            preScreenType="pending"
            loading={preScreenLoading}
          />
        )}
      </>
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

      <div>
        {showInterview && (
          <SweetAlert
            title="Interview started"
            onCancel={() => setShowInterview(false)}
            type="success"
            showConfirm
            onConfirm={(e) => navigateToThirdPartyLink(link)}
            showCancel
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            cancelBtnText="Cancel"
            confirmBtnText="Join interview"
          >
            Click join interview button to proceed with third party link
          </SweetAlert>
        )}
      </div>

      <div>
        {appShowInterview && (
          <SweetAlert
            title="Interview started"
            onCancel={() => setAppShowInterview(false)}
            type="success"
            showConfirm
            onConfirm={(e) => navigateTo(link)}
            showCancel
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            cancelBtnText="Cancel"
            confirmBtnText="Join interview"
          >
            Click join interview button to proceed with in app interview
          </SweetAlert>
        )}
      </div>
    </>
  );
}
