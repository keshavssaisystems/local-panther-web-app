import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  ButtonGroup,
  UncontrolledPopover,
} from "reactstrap";
import { AcceptModal } from "_components/modal/acceptmodal";
import { RejectModal } from "_components/modal/rejectmodal";
import { FiMapPin } from "react-icons/fi";
import Alert from 'react-bootstrap/Alert';
import {
  BsBriefcase,
  BsAward,
  BsHandThumbsUp,
  BsStar,
  BsQuestionCircle,
  BsXCircle,
  BsClock,
  BsMortarboard,
  BsFileEarmark,
  BsBuildings,
  BsCheckCircle,
  BsPerson,
  BsPencil
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { customerCandidateListsActions } from "../../_containers/customer/candidatelists/customercandidatelists.slice";
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import "./cardview.scss";
import { ProgressCircle } from "_components/common/progress";
import moment from "moment";
import customerIcons from "assets/utils/images/customer";
import { getTimezoneDateTime, getExperienceDuration } from "_helpers/helper";
import { ScorePopup } from "./scorePopup";
import SweetAlert from "react-bootstrap-sweetalert";
import AssigneeAtsCandidate from "_containers/customer/atscustomercandidatelist/AssigneeAtsCandidate";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, CANDIDATE_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import { fetchWrapper } from "_helpers/fetch-wrapper";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import ComposeEmailModal from "_components/modal/composeEmailModal";

export const CandidateCardView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const [showSchdIntModal, setShowSchdIntSModal] = useState(false);
  const [openBDModal, setOpenBDModal] = useState(false);
  const [atsCandidateId, setAtsCandidateId] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [assignedCompanyId, setAssignedCompanyId] = useState(null);
  const [assignmentStartDate, setAssignmentStartDate] = useState(null);
  const [assignmentEndDate, setAssignmentEndDate] = useState(null);
  const [assignedCompanyName, setAssignedCompanyName] = useState(null);
  const [candidateType, setCandidateType] = useState("ATS");
  const [candidateId, setCandidateId] = useState(null);
  const [assignmentId, setAssignmentId] = useState(null);
  const [showJDModal, setShowJDModal] = useState(false);
  const [jobDetail, setJobDetail] = useState([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [isConnectingOAuth, setIsConnectingOAuth] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState("");
  const isStaffingFirm = props.isStaffingFirm;
  const isCandidateResumeVisible = props?.data?.iscandidateresumevisible;
  console.log("[CandidateCardView] isStaffingFirm:", isStaffingFirm, "isCandidateResumeVisible (from row):", isCandidateResumeVisible, "resumepath:", props?.data?.candidateResumeDto?.resumepath);
  const dispatch = useDispatch();

  const API_BASE = process.env.REACT_APP_NEW_API_URL;

  /* ── DISABLED: Compose email / OAuth flow (re-enable when PO approves) ────────

  const openOAuthPopup = (authUrl) =>
    new Promise((resolve, reject) => {
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        authUrl,
        "oauth-popup",
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        reject(new Error("Popup blocked. Please allow popups for this site."));
        return;
      }

      let resolved = false;

      const finish = async () => {
        if (resolved) return;
        resolved = true;
        clearInterval(watchClose);
        clearInterval(checkStatus);
        try {
          const res = await fetchWrapper.get(`${API_BASE}/OAuth/status`);
          if (res?.statusCode === 200 && res.data?.connected) {
            if (!popup.closed) popup.close();
            resolve(res.data);
          } else {
            if (!popup.closed) popup.close();
            reject(new Error("Authentication window was closed before completing."));
          }
        } catch (_) {
          reject(new Error("Authentication window was closed before completing."));
        }
      };

      // Watch for user manually closing popup
      const watchClose = setInterval(() => {
        if (popup.closed) finish();
      }, 500);

      // Every 5s check status from parent side and close popup if connected
      const checkStatus = setInterval(async () => {
        if (resolved) return;
        try {
          const res = await fetchWrapper.get(`${API_BASE}/OAuth/status`);
          if (res?.statusCode === 200 && res.data?.connected) {
            finish();
          }
        } catch (_) {}
      }, 5000);
    });

  // Checks OAuth connection status. Returns { connected, connectedEmail } or null on error.
  const checkOAuthStatus = async () => {
    try {
      const res = await fetchWrapper.get(`${API_BASE}/OAuth/status`);
      if (res?.statusCode === 200) {
        if (res.data?.connected && res.data?.connectedEmail) {
          setConnectedEmail(res.data.connectedEmail);
        }
        return res.data;
      }
    } catch (_) {}
    return null;
  };

  // Fetches the Microsoft OAuth auth URL from the API.
  const getOAuthConnectUrl = async () => {
    try {
      const res = await fetchWrapper.get(`${API_BASE}/OAuth/connect?provider=outlook`);
      if (res?.statusCode === 200) return res.data?.authUrl ?? null;
    } catch (_) {}
    return null;
  };

  // Handles the full Present button click:
  // 1. Check OAuth status
  // 2. If not connected -> open consent popup
  // 3. Open compose email modal
  const handlePresentButtonClick = async () => {
    setIsConnectingOAuth(true);
    try {
      const status = await checkOAuthStatus();

      if (!status?.connected) {
        const authUrl = await getOAuthConnectUrl();
        if (!authUrl) {
          dispatch(
            showSnackbar({
              message: "Unable to get email authentication URL. Please try again.",
              type: SNACKBAR_TYPES.ERROR,
              position: SNACKBAR_POSITION.TOP_CENTER,
              autoClose: true,
              autoCloseDelay: 4000,
              maxWidth: 500,
            })
          );
          return;
        }

        try {
          await openOAuthPopup(authUrl);
        } catch (err) {
          dispatch(
            showSnackbar({
              message: err.message || "Email authentication failed. Please try again.",
              type: SNACKBAR_TYPES.ERROR,
              position: SNACKBAR_POSITION.TOP_CENTER,
              autoClose: true,
              autoCloseDelay: 4000,
              maxWidth: 500,
            })
          );
          return;
        }
      }

      // OAuth is connected – open the compose email modal
      setShowComposeModal(true);
    } finally {
      setIsConnectingOAuth(false);
    }
  };

  const handleEmailSendSuccess = () => {
    onActionClick("presented");
  };

  ── END DISABLED ──────────────────────────────────────────────────────────── */

  const openJobDetails = async (jobId) => {
    const res = await fetchWrapper.get(`${process.env.REACT_APP_NEW_API_URL}/Job/GetJobDetails/${jobId}`);
    if (res?.statusCode === 200) {
      setJobDetail([res.data]);
      setShowJDModal(true);
    }
  };
  const onRejectClick = () => {
    setShowReModal(true);
  };

  const onSubmitRejectModal = async (comment, reasonid) => {
    let userId = localStorage.getItem("userId");
    let res = await dispatch(
      customerCandidateListsActions.putRejectCandidate({
        id: props?.data?.candidaterecommendedjobid,
        customerrejectedcomment: comment,
        customerrejectedreasonid: reasonid,
        currentUserId: userId,
      })
    );
    setShowReModal(false);
    if (res.payload.statusCode === 204) {
      // setShowRejSModal(true);    
      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    } else {
      // props.showSweetAlert({
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

  const onActionClick = (type) => {
    props.onActionClick(props?.data?.candidaterecommendedjobid, type);
  };

  const onCloseRejSModal = () => {
    setShowRejSModal(false);
    props.updateList();
  };

  const onScheduleInterview = () => {
    setShowSchdIntSModal(true);
  };

  const getFormData = (formData) => {
    postScheduledInterview(formData);
  };
  const postScheduledInterview = async function (formData) {
    let res = await dispatch(
      customerCandidateListsActions.postScheduleInterview(formData)
    );
    if (res.payload.statusCode === 201) {
      setShowSchdIntSModal(false);
      // props.showSweetAlert({
      //   title: "Interview scheduled successfully!",
      //   type: "success",
      // });
      props.updateList();

      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.INTERVIEW_SCHEDULED_SUCCESSFULLY,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    } else {
      // props.showSweetAlert({
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

  const returnSkills = () => {
    if (
      props?.data?.candidateSkillDtos &&
      props?.data?.candidateSkillDtos?.length > 0
    ) {
      return props?.data?.candidateSkillDtos
        .map((element) => element.skillname)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnEducation = () => {
    if (
      props?.data?.candidateEducationDtos &&
      props?.data?.candidateEducationDtos?.length > 0
    ) {
      return props?.data?.candidateEducationDtos
        .map((element) => element.levelofeducation)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnCert = () => {
    if (
      props?.data?.candidateCertificationDtos &&
      props?.data?.candidateCertificationDtos?.length > 0
    ) {
      return props?.data?.candidateCertificationDtos
        .map((element) => element.certificationname)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnWorkExperince = () => {
    if (
      props?.data?.candidateQualificationsDtos &&
      props?.data?.candidateQualificationsDtos?.length > 0
    ) {
      return (
        <Row>
          {props.data.candidateQualificationsDtos.map((data, index) => {
            const hasStartDate = !!data.startdate;
            const yearRange = hasStartDate
              ? data.iscurrentlyworking
                ? `${moment(data.startdate).format("YYYY")} - Present`
                : `${moment(data.startdate).format("YYYY")} - ${
                    data.enddate === null
                      ? index === 0
                        ? "Present"
                        : "NA"
                      : moment(data.enddate).format("YYYY")
                  }`
              : null;
            const duration = getExperienceDuration(data.startdate, data.enddate, data.iscurrentlyworking, index);
            const hasCompany = !!data.company;
            const dateSpan = (yearRange || duration) ? (
              <span className="card-details-op" style={{ whiteSpace: "nowrap", flex: "0 0 auto" }}>
                {yearRange}
                {duration ? ` · ${duration}` : ""}
              </span>
            ) : null;
            return (
              <React.Fragment key={data.candidatequalificationid ?? index}>
                <Col sm={12} md={12} lg={12} xl={12} className="card-details">
                  <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ flex: "1 1 auto", minWidth: 0, wordBreak: "break-word" }}>
                      {data.jobtitle ? data.jobtitle : "-"}
                    </span>
                    {!hasCompany && dateSpan}
                  </span>
                </Col>
                {hasCompany && (
                  <Col sm={12} md={12} lg={12} xl={12} className="card-details-op"
                    style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}
                  >
                    <span style={{ flex: "1 1 auto", minWidth: 0, wordBreak: "break-word" }}>
                      {data.company}
                    </span>
                    {dateSpan}
                  </Col>
                )}
              </React.Fragment>
            );
          })}
        </Row>
      );
    } else {
      return "-";
    }
  };

  const returnResume = () => {
    return (
      <Row>
        <Col sm={6} md={6} lg={6} xl={6} className="card-details-op">
          <p>  <span style={{ cursor: "pointer", marginLeft: "3px" }} onClick={() => onBuildResume()}>OpenWorX CV</span>
            <img
              style={{ float: "left", cursor: "pointer" }}
              src={customerIcons.view_cv_icon}
              alt="view cv icon"
              onClick={() => onBuildResume()}
            ></img></p>
        </Col>
        {(isStaffingFirm || isCandidateResumeVisible) && (
          <Col sm={5} md={5} lg={5} xl={5} className="card-details-op">
            {props?.data?.candidateResumeDto?.resumepath && (
              <p>
                <span style={{ cursor: "pointer", marginLeft: "3px" }} onClick={() => onCandidateResume()}>
                  Candidate CV
                </span>
                <img
                  style={{ float: "left", cursor: "pointer" }}
                  src={customerIcons.view_cv_icon}
                  alt="view cv icon"
                  onClick={() => onCandidateResume()}
                ></img></p>
            )}
          </Col>
        )}
      </Row>)
  };

  const onBuildResume = () => {
    if (props?.data?.recommendedationCandidateShortList?.length > 0) {
      props.onBuildResume(
        props?.data?.recommendedationCandidateShortList[0].candidateid,
        props?.data?.scorejson?.replace(/'/g, '"').replace(/candidate"s/g, "candidate's"),
        props?.data?.jobtitle ? props?.data?.jobtitle : "",
      );
    }
  };

  const onCandidateResume = () => {
    if (props?.data?.recommendedationCandidateShortList?.length > 0) {
      props.onCandidateResume(
        props?.data?.recommendedationCandidateShortList[0].candidateid,
        props?.data?.candidateResumeDto?.resumepath
      );
    }
  };

  const onPresentClick = () => {
    props.onPresentClick(props?.data?.candidaterecommendedjobid);
  };

  const handleRefreshData = () => {
    if (props.updateList && typeof props.updateList === "function") {
      props.updateList();
    }
  };

  const updateAssignedDetail = (type, candId, atsId, assignId, isAssigned, assignedCompanyId, assignedCompanyName, assignmentStartDate, assignmentEndDate) => {
    setCandidateType(type);
    setCandidateId(candId);
    setAtsCandidateId(atsId);
    setAssignmentId(assignId);
    setIsAssigned(isAssigned);
    setAssignedCompanyId(assignedCompanyId);
    setAssignedCompanyName(assignedCompanyName);
    setAssignmentStartDate(assignmentStartDate);
    setAssignmentEndDate(assignmentEndDate);
    setOpenBDModal(true);
  };

  const onCloseBDModal = () => {
    setOpenBDModal(false);
    setAtsCandidateId(null);
    setCandidateId(null);
    setAssignmentId(null);
  };

  return (
    <>
      <Card className="main-card mb-3 cust-cand-card">
        <CardBody>
          <Row>
            <Col className="col-12">
              <Row>
                <Col xs={7} sm={7} md={7} lg={7} xl={8} xxl={9}>
                  <div className="card-title">
                    {props?.data?.candidateQualificationsDtos &&
                      props?.data?.candidateQualificationsDtos.length > 0
                      ? props?.data?.candidateQualificationsDtos[0]?.jobtitle
                      : "-"}
                  </div>
                  <p className="card-details-op">
                    <span>
                      <FiMapPin size={"16px"} />
                    </span>{" "}
                    {props?.data?.recommendedationCandidateShortList &&
                      props?.data?.recommendedationCandidateShortList.length > 0
                      ? (props?.data?.recommendedationCandidateShortList[0]
                        ?.cityname
                        ? `${props?.data?.recommendedationCandidateShortList[0]?.cityname}, `
                        : "") +
                      "" +
                      (props?.data?.recommendedationCandidateShortList[0]
                        ?.statename
                        ? props?.data?.recommendedationCandidateShortList[0]
                          ?.statename
                        : "")
                      : ""}
                  </p>
                </Col>
                <Col xs={5} sm={5} md={5} lg={5} xl={4} xxl={3}>
                  <div className="card-title right-align">
                    {props?.data?.avgscore ? (
                      <>
                        <Button
                          className="me-2 mb-2"
                          color="link"
                          id={
                            "PopoverCustom-" +
                            props?.data?.candidaterecommendedjobid
                          }
                        >
                          <ProgressCircle avgscore={props?.data?.avgscore} />
                        </Button>
                        <UncontrolledPopover
                          className="popover-custom"
                          placement={"bottom"}
                          trigger="legacy"
                          fade={false}
                          target={
                            "PopoverCustom-" +
                            props?.data?.candidaterecommendedjobid
                          }
                        >
                          <ScorePopup
                            scoreJson={props?.data?.scorejson
                              ?.replace(/'/g, '"')
                              .replace(/candidate"s/g, "candidate's")}
                          />
                        </UncontrolledPopover>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>

            {isStaffingFirm && props?.data?.clientcompanyname && (
              <Col className="col-12">
                <p className="card-details">
                  <Row>
                    <Col md="1" lg="1">
                      <span className="pe-2">
                        <BsBuildings size={"16px"} />
                      </span>
                    </Col>
                    <Col md="11" lg="11">
                      <b>Client Company </b>
                      <p> {props?.data?.clientcompanyname}</p>
                    </Col>
                  </Row>
                </p>
              </Col>
            )}

            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <img
                        src={customerIcons.person_vcard}
                        alt="job title"
                        width="16"
                        height="auto"
                        style={{ verticalAlign: "middle", objectFit: "contain" }}
                      />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <b>Job Title </b>
                    <p>
                      {props?.data?.jobid ? (
                        <Button
                          color="link"
                          className="p-0"
                          style={{ fontWeight: "normal" }}
                          onClick={() => openJobDetails(props?.data?.jobid)}
                        >
                          {props?.data?.jobtitle || "-"}
                        </Button>
                      ) : (
                        props?.data?.jobtitle || "-"
                      )}
                    </p>
                  </Col>
                </Row>
              </p>
            </Col>

            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsBriefcase size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      gap: "8px" 
                      }}>
                      <div 
                      style={{ 
                        display: "flex",
                        alignItems: "center",
                        gap: "8px" }}>
                        <b>Work Experience</b>
                      </div>
                       {localStorage.getItem("atsEnableStatus") === "true" && props?.data?.isatscandidate === false && (
                        <div
                          style={{
                            backgroundColor: "#E3F3FE",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                          }}
                        >
                          <span
                            style={{
                              color: "#2f5fa3",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            OpenWorX Candidate
                          </span>
                        </div>
                      )}
                      {localStorage.getItem("atsEnableStatus") === "true" && props?.data?.isatscandidate === true && (
                        <div
                          style={{
                            backgroundColor: "#FED7AA",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                          }}
                        >
                          <span
                            style={{
                              color: "#C2410C",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            ATS
                          </span>
                        </div>
                      )}
                    </div>
                    <p>{returnWorkExperince()}</p>
                  </Col>
                 
                  </Row>
              </p>
            </Col>

            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsMortarboard size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <b>Education </b> <p>{returnEducation()}</p>
                  </Col>
                </Row>
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsStar size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <b>Skills </b>
                    <p> {returnSkills()}</p>
                  </Col>
                </Row>
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsAward size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <b>Certfications/Licences </b>{" "}
                    <div>
                      <p style={{ overflow: "visible" }}>{returnCert()}</p>
                    </div>
                  </Col>
                </Row>
              </p>
            </Col>
            <>
                <Col className="col-12">
                  <p className="card-details">
                    <Row>
                      <Col md="1" lg="1">
                        <span className="pe-2">
                          <BsFileEarmark size={"16px"} />
                        </span>
                      </Col>
                      <Col md="11" lg="11">
                        <b>Resume </b>
                        <p>{returnResume()}</p>

                      </Col>
                    </Row>
                  </p>
                </Col>
                {isStaffingFirm && (
                <Col className="col-12">
                  <p className="card-details">
                    <Row>
                      <Col md="1" lg="1">
                        <span className="pe-2">
                          <BsPerson size={"16px"} />
                        </span>
                      </Col>
                      <Col md="11" lg="11">
                        <b>Candidate Name</b>
                        <p>{`${props?.data?.firstname} ${props?.data?.lastname}`}</p>
                      </Col>
                    </Row>
                  </p>
                </Col>
                )}
                {isStaffingFirm && props.data?.isatscandidate === true && 
                (<Col className="col-12"> 
                    <div className="card-details"> 
                      <Row> 
                        <Col md="1" lg="1"> 
                        <span className="pe-2">
                          <img
                            src={customerIcons.On_Assignment}
                            alt="On assignment"
                            width="16"
                            height="auto"
                            style={{ verticalAlign: "middle", objectFit: "contain" }}
                          />
                        </span>
                          
                        </Col> 
                        <Col md="11" lg="11">
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
                            <div>
                              <b>Assignment Status</b>
                              {props.data.assignedInfoDTO?.[0]?.isassigned === true ? (
                                <>
                                  <div>On Assignment / Already Working</div>
                                  <div className="d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center">
                                      <span>
                                        {props.data.assignedInfoDTO?.[0]?.assignmentstartdate
                                          ? 
                                          moment.utc(props.data.assignedInfoDTO?.[0]?.assignmentstartdate ).format("MM/DD/YYYY")
                                           : "-"}
                                      </span>
                                         {" - "}
                                      <span>
                                        {props.data.assignedInfoDTO?.[0]?.assignmentenddate
                                          ? moment.utc(props.data.assignedInfoDTO?.[0]?.assignmentenddate ).format("MM/DD/YYYY")
                                           : "-"}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div>Update Assignment</div>
                              )}
                            </div>
                            <div className="me-3 float-end">
                                <BsPencil
                                    className="edit-icon"
                                    size={16}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      const atsDetail = props.data.assignedInfoDTO?.[0];
                                      updateAssignedDetail(
                                          "ATS",
                                          null,
                                          atsDetail?.atscandidateid,
                                          null,
                                          atsDetail?.isassigned,
                                          atsDetail?.assignedcompanyid,
                                          atsDetail?.assignedcompanyname,
                                          atsDetail?.assignmentstartdate,
                                          atsDetail?.assignmentenddate
                                      );
                                    }}
                                />
                              </div>
                          </div>
                        </Col> 
                      </Row> 
                    </div> 
                </Col> )}
                {isStaffingFirm && props.data?.isatscandidate === false && (
                  <Col className="col-12">
                    <div className="card-details">
                      <Row>
                        <Col md="1" lg="1">
                          <span className="pe-2">
                            <img
                              src={customerIcons.On_Assignment}
                              alt="On assignment"
                              width="16"
                              height="auto"
                              style={{ verticalAlign: "middle", objectFit: "contain" }}
                            />
                          </span>
                        </Col>
                        <Col md="11" lg="11">
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
                            <div>
                              <b>Assignment Status</b>
                              {props.data.openworxCandidateAssignedInfoDTO?.[0]?.isassigned === true ? (
                                <>
                                  <div>On Assignment / Already Working</div>
                                  <div className="d-flex flex-column gap-1">
                                    <div className="d-flex align-items-center">
                                      <span>
                                        {props.data.openworxCandidateAssignedInfoDTO?.[0]?.assignmentstartdate
                                          ? moment.utc(props.data.openworxCandidateAssignedInfoDTO?.[0]?.assignmentstartdate).format("MM/DD/YYYY")
                                          : "-"}
                                      </span>
                                      {" - "}
                                      <span>
                                        {props.data.openworxCandidateAssignedInfoDTO?.[0]?.assignmentenddate
                                          ? moment.utc(props.data.openworxCandidateAssignedInfoDTO?.[0]?.assignmentenddate).format("MM/DD/YYYY")
                                          : "-"}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div>Update Assignment</div>
                              )}
                            </div>
                            <div className="me-3 float-end">
                              <BsPencil
                                className="edit-icon"
                                size={16}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  const owDetail = props.data.openworxCandidateAssignedInfoDTO?.[0];
                                  const candidateId = props.data.recommendedationCandidateShortList?.[0]?.candidateid;
                                  updateAssignedDetail(
                                    "OpenWorX",
                                    candidateId,
                                    null,
                                    owDetail?.openworxcandidateassignmentid || null,
                                    owDetail?.isassigned || false,
                                    owDetail?.assignedcompanyid || null,
                                    owDetail?.assignedcompanyname || null,
                                    owDetail?.assignmentstartdate || null,
                                    owDetail?.assignmentenddate || null
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                )}
              </>
          </Row>
          <Row className="mt-2">
            <Col md={6} lg={6}>
              <div className="muted-name">Job posted on</div>
              <div className="muted-name">
                {getTimezoneDateTime(props?.data?.jobpublishdatetime, "MM/DD/YYYY hh:mm A")}
              </div>
            </Col>
            <Col md={6} lg={6} className="text-end">
              <div className="muted-name">Job matched on</div>
              <div className="muted-name">
                {getTimezoneDateTime(
                  props?.data?.modifieddate === null
                    ? props?.data?.createddate
                    : props?.data?.modifieddate,
                  "MM/DD/YYYY hh:mm A"
                )}
              </div>
            </Col>
          </Row>

        </CardBody>
        <CardFooter className="auto-margin">
          <Row noGutters>
          {props?.data?.isclosed === false ? (
            <ButtonGroup className="card-btn-grp" size="sm">
              {/* <Col>
              <Button
                title="accept"
                className=" btn-icon"
                color="success"
                onClick={() => onAcceptClick()}
              >
                <BsCheckCircle />
              </Button>
            </Col> */}
              <Button
                outline
                title="maybe"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onActionClick("maybe")}
              >
                <BsQuestionCircle></BsQuestionCircle>  Maybe
              </Button>
              <Button
                outline
                title="liked"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onActionClick("like")}
              >
                <BsHandThumbsUp></BsHandThumbsUp>  Like
              </Button>
              {isStaffingFirm && (
                // TODO: Compose email flow is temporarily disabled (pending PO approval).
                // Directly mark the candidate as presented for all users until the flow is approved.
                // To restore: replace onClick with handlePresentButtonClick and re-enable the disabled block above.
                <Button
                  outline
                  title="present"
                  className="btn-icon mb-1"
                  color="primary"
                  onClick={() => onActionClick("presented")}
                  size="sm"
                  disabled={props?.data?.ispresented}
                >
                  <BsCheckCircle /> {props?.data?.ispresented ? "Presented" : "Present"}
                </Button>
              )}
              <Button
                outline
                title="schedule"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onScheduleInterview()}
              >
                <BsClock />  Schedule
              </Button>
              <Button
                outline
                title="decline"
                className="btn-icon mb-1"
                color="primary"
                onClick={() => onRejectClick()}
                size="sm"
              >
                <BsXCircle></BsXCircle> Decline
              </Button>

            </ButtonGroup>
             ) :  props?.data?.isclosed === true ?(
                <Button
                outline
                title="Job Closed"
                className="btn-icon lg-12"
                color="danger"
                size="lg"
                disabled={true}
              >
                <BsXCircle></BsXCircle>  Job Closed
              </Button>
          ):null}
          </Row>
        </CardFooter>
      </Card>
      <>
        {showAModal ? (
          <AcceptModal
            isAMOpen={showAModal}
            onAcceptYesClick={() => setShowAModal(false)}
            onAcceptNoClick={() => setShowAModal(false)}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showReModal ? (
          <RejectModal
            isRMOpen={showReModal}
            onCancelReject={() => setShowReModal(false)}
            onSubmitReject={(comment, reasonid) =>
              onSubmitRejectModal(comment, reasonid)
            }
            rejectDrpDwnList={props.rejectDrpDwnList}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showRejSModal ? (
          // <RejectSuccessModal
          //   isRejectConfOpen={showRejSModal}
          //   onOkClickRejSuccess={() => onCloseRejSModal()}
          // />
          <>
            <SweetAlert
              title={"Candidate status updated successfully!"}
              show={showRejSModal}
              type={"success"}
              onConfirm={() => onCloseRejSModal()}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {" "}
        {showSchdIntModal ? (
          <ScheduleInterviewModal
            candidateData={props.data}
            durationOptions={props.durationOptions}
            postData={(e) => {
              getFormData(e);
            }}
            isOpen={showSchdIntModal}
            onClose={() => setShowSchdIntSModal(false)}
          />
        ) : (
          <></>
        )}
      </>      {showJDModal && jobDetail?.length > 0 && (
        <CustJobDetailModal
          isOpen={showJDModal}
          data={jobDetail}
          onClose={() => setShowJDModal(false)}
        />
      )}
      <>
        {openBDModal ? (
          <AssigneeAtsCandidate
            isOpen={openBDModal}
            candidateType={candidateType}
            candidateId={candidateId}
            atsCandidateId={atsCandidateId}
            assignmentId={assignmentId}
            isAssigned={isAssigned}
            assignedCompanyId={assignedCompanyId}
            assignedCompanyName={assignedCompanyName}
            assignmentStartDate={assignmentStartDate}
            assignmentEndDate={assignmentEndDate}
            onClose={() => onCloseBDModal()}
            onRefresh={handleRefreshData}
          />
        ) : (
          <></>
        )}
      </>
      <ComposeEmailModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        candidateData={props.data}
        connectedEmail={connectedEmail}
        onEmailConnectionChange={(email) => setConnectedEmail(email)}
        onSendSuccess={() => onActionClick("presented")}
      />
    </>
  );
};
