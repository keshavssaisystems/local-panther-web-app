import React, { useState, useEffect } from "react";
import {
  CardHeader,
  Col,
  CardFooter,
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
  Card,
  CardBody,
  Row,
} from "reactstrap";
import "./scheduledInterview.scss";
import { FaEllipsisV } from "react-icons/fa";
import {
  BsFillCheckCircleFill,
  BsXCircleFill,
  BsPersonVideo2,
  BsFillTelephoneFill,
  BsPerson,
  BsDownload,
} from "react-icons/bs";
import { ImBin } from "react-icons/im";
import moment from "moment-timezone";
import { NotesCard } from "./notesCard";
import { InviteToInterviewCard } from "./inviteToInterviewCard";
import { useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  getTimezoneDateTime,
  getVideoChannelId,
  USPhoneNumber,
} from "_helpers/helper";
import { NavLink } from "react-router-dom";
import { InterviewFeedback } from "./interviewFeedback";
import currentOffer from "assets/utils/images/job-detail-icons/currentoffer.svg";
import html2pdf from "html2pdf.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

export function VideoInterviewDetails({
  interviewId,
  postNotesData,
  postInviteData,
  cancelScheduleData,
  editScheduledInterview,
  postMessageData,
  acceptInterview,
  rejectInterview,
  interviewDetails, // Optional from customer schedule list
  fromCustList, // Optional from customer schedule list
  toggle,
  postFeedbackData,
  onAcceptClick
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showInviteCard, setShowInviteCard] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [linkDisabled, setLinkDisabled] = useState(true);
  const [isPastInterview, setIsPastInterview] = useState(false);

  useEffect(() => {
    if (interviewDetails) {
      const scheduledDate = moment(
        interviewDetails?.scheduledate.slice(0, 11) + interviewDetails?.starttime,
        "YYYY-MM-DD HH:mm:ss"
      );

      // compare only date parts (ignoring time)
      if (scheduledDate.isBefore(moment(), "day")) {
        setIsPastInterview(true);
      } else {
        setIsPastInterview(false);
      }
    }

  }, [interviewDetails]);

  useEffect(() => {
    checkLinkEnableDisable();
    const intervalId = setInterval(() => {
      checkLinkEnableDisable();
    }, 60000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  let interviewDetail = [];
  const allInterview = useSelector(
    (state) => state.scheduleInterview.allInterview
  );
  if (!interviewDetails) {
    let selectedJobDetails = allInterview.scheduledInterviewList.filter(
      (element) => {
        return element.scheduleinterviewid === interviewId;
      }
    );
    interviewDetail = selectedJobDetails[0];
  } else {
    interviewDetail = interviewDetails;
  }
  const [refreshData, setRefreshData] = useState(
    interviewDetail?.interviewstatusid === 0 ? false : true
  );
  let id = getVideoChannelId(
    interviewDetail?.jobid,
    interviewDetail?.scheduleinterviewid,
    interviewDetail?.candidateid
  );

  let scheduled = getTimezoneDateTime(
    moment(
      interviewDetail?.scheduledate.slice(0, 11) + interviewDetail?.starttime
    ).format("YYYY-MM-DD HH:mm:ss"),
    "MM/DD/YYYY"
  );
  let currentDay = getTimezoneDateTime(moment(), "YYYY-MM-DD");
  let yesterdayDate = getTimezoneDateTime(
    moment().subtract(1, "days"),
    "YYYY-MM-DD"
  );
  let tomorrowDate = getTimezoneDateTime(moment().add(1, "days"), "YYYY-MM-DD");
  let scheduledDate = getTimezoneDateTime(
    moment(
      interviewDetail?.scheduledate.slice(0, 11) + interviewDetail?.starttime
    ).format("YYYY-MM-DD HH:mm:ss"),
    "YYYY-MM-DD"
  );

  if (scheduledDate === currentDay) {
    scheduled = "Today";
  }
  if (scheduledDate === yesterdayDate) {
    scheduled = "Yesterday";
  }
  if (scheduledDate === tomorrowDate) {
    scheduled = "Tommorow";
  }
  let startTime = getTimezoneDateTime(
    moment(interviewDetails?.scheduledate).format("MMM D, YYYY") +
    " " +
    interviewDetails?.starttime,
    "hh:mm A"
  );
  let startDate =
    moment(interviewDetails?.scheduledate).format("MMM D, YYYY") +
    " " +
    startTime;
  let durationArr =
    interviewDetails?.duration !== undefined
      ? interviewDetails?.duration.split(" ")
      : [];
  let endTime = getTimezoneDateTime(
    moment(startDate).add(durationArr[0], "m"),
    "hh:mm A"
  );
  let userId = localStorage.getItem("userId");
  const cancelSchedule = () => {
    let cancelData = {
      currentUserId: userId,
      scheduledInterviewId: interviewId,
    };
    cancelScheduleData(cancelData);
  };
  const acceptSchedule = () => {
    acceptInterview(interviewId);
  };
  const rejectSchedule = () => {
    rejectInterview(interviewId);
  };
  let suggestedJson = "";
  let suggestedQuestionArray = [];
  try {
    suggestedJson =
      interviewDetail?.suggestedquestion !== ""
        ? JSON.parse(interviewDetails?.suggestedquestion.replace(/'/g, '"'))
        : "";
    suggestedQuestionArray = Array.isArray(suggestedJson?.questions)
      ? suggestedJson?.questions
      : suggestedJson?.questions?.split("\n");
  } catch {
    suggestedQuestionArray = [];
  }
  let customQuestion = [];
  let preQuestions = [];
  if (
    interviewDetail.jobCandidatePrescreenApplicantDtos !== null &&
    interviewDetail.jobCandidatePrescreenApplicantDtos.length > 0
  ) {
    interviewDetail.jobCandidatePrescreenApplicantDtos.forEach((element) => {
      if (element.iscustomquestion === false) {
        preQuestions.push(element);
      }
      if (element.iscustomquestion === true) {
        customQuestion.push(element);
      }
    });
  }
  const interviewGuideLink = useSelector(
    (state) => state.scheduleInterview?.interviewGuideList
  );
  const downloadInterviewGuide = () => {
    window.open(interviewGuideLink[0].name, "_blank");
  };

  const generatePDF = async (event) => {
    const element = document.getElementById("sq-pdf-content");
    if (element) {
      const pdfOptions = {
        margin: 10,
        html2canvas: {
          scale: 1.2,
          useCORS: true,
        },
        filename: interviewDetails.jobtitle + " interview-questions",
        image: { type: "jpeg", quality: 0.98 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(element).set(pdfOptions).save();
    }
  };

  const checkLinkEnableDisable = () => {
    let scheduledTime = getTimezoneDateTime(
      moment(
        interviewDetail?.scheduledate.slice(0, 11) + interviewDetail?.starttime
      ).format("YYYY-MM-DD HH:mm:ss"),

      "MM/DD/YYYY HH:mm:ss"
    );

    let endTime = getTimezoneDateTime(
      moment(
        interviewDetail?.scheduledate.slice(0, 11) + interviewDetail?.starttime
      ).add(durationArr[0], "m").format("YYYY-MM-DD HH:mm:ss"),
      "MM/DD/YYYY HH:mm:ss"
    );
    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let minutes = moment(scheduledTime).diff(now, "minutes");
    // let revminutes = moment(now).diff(scheduledTime, "minutes");
    let revminutes = moment(now).diff(endTime, "minutes");

    setLinkDisabled(!(revminutes < 0 && minutes < 15));
  };

  console.log("scheduledDate >= new Date().toISOString().slice(0, 10)", scheduledDate >= new Date().toISOString().slice(0, 10));



  return (
    <>
      <div className="dropdown-menu-header">
        <div className="dropdown-menu-header-inner">
          <div className="menu-header-content btn-pane-right">
            <Col lg="4">
              <h6 className="job-main-heading mb-0">
                {interviewDetail?.candidatename
                  ? interviewDetail?.candidatename
                  : interviewDetail?.firstname && interviewDetail?.lastname
                    ? interviewDetail?.firstname + " " + interviewDetail?.lastname
                    : ""}
              </h6>
            </Col>
            <Col style={{ display: "flex", justifyContent: "flex-end" }}>
              {fromCustList ? (
                <></>
              ) : refreshData === false ? (

                isPastInterview ? (<></>) : (
                  <>
                    <Button
                      outline={!showInviteCard}
                      size="sm"
                      className="mb-2 mr-2 btn-transition"
                      color="primary"
                      onClick={() => setShowInviteCard(!showInviteCard)}
                    >
                      {" "}
                      Invite to interview{" "}
                    </Button>

                    <ButtonGroup size={"sm"}>
                      {interviewDetail?.isaccepted === false &&
                        interviewDetail?.isactive === true && (
                          <Button
                            name="format"
                            color={"success"}
                            size={"sm"}
                            className="mb-2 btn-transition"
                            outline
                            title="Accept interview"
                            onClick={(e) => setShowAcceptPopup(true)}
                          >
                            <BsFillCheckCircleFill className="mb-1" />
                          </Button>
                        )}
                      {interviewDetail?.isrejected === false &&
                        interviewDetail?.isactive === true && (
                          <Button
                            name="format"
                            color={"danger"}
                            size={"sm"}
                            className="mb-2 btn-transition"
                            outline
                            title="Decline interview"
                            onClick={(e) => setShowRejectPopup(true)}
                          >
                            <BsXCircleFill className="mb-1" />
                          </Button>
                        )}
                    </ButtonGroup>

                    <Button
                      outline
                      size="sm"
                      className="mb-2 ms-1 btn-transition"
                      color="danger"
                      title="Cancel"
                      onClick={(e) => setShowCancelPopup(true)}
                    >
                      <ImBin className="mb-1" />
                    </Button>
                  </>)
              ) : (
                <></>
              )}
            </Col>
          </div>
        </div>
      </div>
      <div className="p-custom">
        <p className="mb-0">Applied for {interviewDetail?.jobtitle}</p>
      </div>
      <div className="p-custom">
        <h6 className="fw-bold job-heading">Status</h6>
        <p className="mb-0">
          {interviewDetail?.isreschedulerequested === true
            ? "Requested for reschedule (" +
            interviewDetail?.reschedulerequestedreason +
            ")"
            : interviewDetail?.interviewstatusid !== 0
              ? interviewDetail?.interviewstatusid === 2
                ? "Completed but candidate not joined"
                : "Completed"
              : interviewDetail?.isaccepted === true &&
                interviewDetail?.isrejected === false
                ? "Accepted"
                : interviewDetail?.isrejected === true
                  ? interviewDetail?.rejectionreason !== ""
                    ? "Declined (" + interviewDetail?.rejectionreason + ")"
                    : "Declined"
                  : "No response from candidate"}
        </p>
      </div>
      <div className="p-custom">
        <Button
          outline
          size="sm"
          className="mb-2 ms-1 btn-transition"
          color="danger"
          title="Make Offer"
          onClick={() => onAcceptClick(interviewDetail)}
        >
          Make Offer
        </Button>
      </div>
      {interviewDetail?.interviewstatusid !== 0 &&
        interviewDetail?.interviewfeedback !== "" && (
          <div className="p-custom">
            <h6 className="fw-bold job-heading">Interview feedback</h6>
            {interviewDetail?.interviewstatus !== "" && (
              <p className="mb-0">
                <b>Reason:</b> {interviewDetail?.interviewstatus}
              </p>
            )}
            {interviewDetail?.interviewfeedback !== "" && (
              <p className="mb-0">
                <b>Description:</b> {interviewDetail?.interviewfeedback}
              </p>
            )}
          </div>
        )}

      {showInviteCard === true && (
        <div className="mt-2 mb-2">
          <InviteToInterviewCard
            interviewId={interviewDetail?.scheduleinterviewid}
            postInviteData={(e) => postInviteData(e)}
          />
        </div>
      )}
      <Card className="mt-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            {interviewDetail?.format === "Video" && (
              <BsPersonVideo2 className="header-icon icon-gradient bg-amy-crisp" />
            )}
            {interviewDetail?.format === "Phone" && (
              <BsFillTelephoneFill className="header-icon icon-gradient bg-amy-crisp" />
            )}
            {interviewDetail?.format === "In-person" && (
              <BsPerson className="header-icon icon-gradient bg-amy-crisp" />
            )}
            {interviewDetail?.format} Interview
          </div>
        </CardHeader>
        <CardBody>
          <div>
            {/* <div className="btn-actions-pane-right text-capitalize actions-icon-btn float-end">
              <UncontrolledButtonDropdown>
                <DropdownToggle className="btn-icon btn-icon-only" color="link">
                  {fromCustList || interviewDetail?.interviewstatusid !== 0 ? (
                    <></>
                  ) : (
                    <FaEllipsisV />
                  )}
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                  <DropdownItem onClick={(e) => editScheduledInterview(true)}>
                    <i className="dropdown-icon lnr-inbox"> </i>
                    <span>Reschedule</span>
                  </DropdownItem>
                  <DropdownItem onClick={(e) => setShowCancelPopup(true)}>
                    <i className="dropdown-icon lnr-file-empty"> </i>
                    <span>Cancel</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div> */}
            <div className="p-custom">
              <p className="mb-0">
                {scheduled} at {startTime} to {endTime} ({" "}
                {interviewDetail.duration} )
              </p>
            </div>
            {interviewDetail?.format === "Phone" && (
              <div className="p-custom">
                <p className="mb-0">
                  Phone no -{" "}
                  {interviewDetail.candidatephonenumber === undefined
                    ? ""
                    : USPhoneNumber(interviewDetail.candidatephonenumber)}
                </p>
              </div>
            )}
            {interviewDetail?.format === "In-person" && (
              <div className="p-custom">
                <p className="mb-0">
                  Scheduled at {interviewDetail.interviewaddress}
                </p>
              </div>
            )}
            {interviewDetail?.isappvideocall === false &&
              interviewDetail?.format === "Video" && (
                <div className="p-custom">
                  <p className="mb-0">
                    <a
                      className={linkDisabled ? "no-click" : ""}
                      href={"https://" + interviewDetail.videolink}
                      target={"_blank"}
                      rel="noopener noreferrer"
                      exact
                    >
                      <Button disabled={linkDisabled} color="success" size="sm">
                        <FontAwesomeIcon
                          style={{ fontSize: "16px" }}
                          className="me-2"
                          icon={faVideo}
                        />
                        Join
                      </Button>
                    </a>{" "}
                    the interview
                  </p>
                </div>
              )}
            {interviewDetail.isappvideocall === true &&
              interviewDetail?.format === "Video" && (
                <div className="p-custom">
                  <p className="mb-0">
                    <a
                      className={linkDisabled ? "no-click" : ""}
                      href="/"
                      onClick={(e) => toggle()}
                    >
                      <NavLink to={`/video-screen/${id}`} target="_blank" exact>
                        <Button
                          disabled={linkDisabled}
                          color="success"
                          size="sm"
                        >
                          <FontAwesomeIcon
                            style={{ fontSize: "16px" }}
                            className="me-2"
                            icon={faVideo}
                          />
                          Join
                        </Button>
                      </NavLink>
                    </a>{" "}
                    the in-app interview
                  </p>
                </div>
              )}
            <div className="p-custom">
              <p className="mb-0">
                Interviewer -{" "}
                {interviewDetail?.intervieweremailids === ""
                  ? "No interviewer added"
                  : interviewDetail?.intervieweremailids}
              </p>
            </div>
          </div>
        </CardBody>
        <CardFooter className="d-block text-left right-align">
          {fromCustList ? (
            <></>
          ) : (
            <>
              <Button
                outline={!showNotes}
                className="mb-2 mr-2 btn-transition"
                color="primary"
                size={"sm"}
                onClick={() => setShowNotes(!showNotes)}
              >
                {" "}
                Take notes{" "}
              </Button>
              <Button
                outline
                className="mb-2 mr-2 btn-transition"
                color="primary"
                size={"sm"}
                onClick={() => downloadInterviewGuide()}
              >
                {" "}
                Download interview guide{" "}
              </Button>
              {refreshData === false && (
                <>
                  <Button
                    outline={!feedbackModal}
                    className="mb-2 mr-2 btn-transition"
                    color="primary"
                    size={"sm"}
                    onClick={(e) => {
                      setFeedbackModal(!feedbackModal);
                    }}
                  >
                    {" "}
                    Interview feedback{" "}
                  </Button>
                  <Button
                    outline={!feedbackModal}
                    className="mb-2 mr-2 btn-transition"
                    color="primary"
                    size={"sm"}
                    onClick={(e) => editScheduledInterview(true)}
                  >
                    {" "}
                    Reschedule{" "}
                  </Button>
                  <Button
                    outline={!feedbackModal}
                    className="mb-2 mr-2 btn-transition"
                    color="primary"
                    size={"sm"}
                    onClick={(e) => setShowCancelPopup(true)}
                  >
                    {" "}
                    Cancel{" "}
                  </Button>
                </>
              )}
            </>
          )}
        </CardFooter>
      </Card>
      {showNotes === true && (
        <div className="mt-2 mb-2">
          <NotesCard
            interviewNotes={interviewDetail?.interviewnotes}
            interviewId={interviewDetail?.scheduleinterviewid}
            postNotesData={(e) => postNotesData(e)}
          />
        </div>
      )}
      {feedbackModal === true && (
        <div className="mt-2 mb-2">
          <InterviewFeedback
            interviewId={interviewDetails.scheduleinterviewid}
            postFeedbackData={(e) => {
              postFeedbackData(e);
              setFeedbackModal(false);
              setRefreshData(true);
            }}
          />
        </div>
      )}
      <div className="p-3">
        <h6 className="fw-bold">Summary</h6>
        <ul className="mb-0">
          {interviewDetail?.candidateSummaryDtos?.length > 0 &&
            interviewDetail?.candidateSummaryDtos?.map((summaryDetails) => (
              <li>{summaryDetails.summary}</li>
            ))}
        </ul>
        {interviewDetail?.candidateSummaryDtos?.length === undefined && (
          <p className="mb-0 ">
            <i> - No summary added</i>
          </p>
        )}
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Pre-screen Questions</h6>
        {preQuestions.length > 0 &&
          preQuestions?.map((preQue) => (
            <>
              <p className="mb-1"> {preQue.prescreenquestion}</p>
              <p className="ms-2 mb-1"> - {preQue.answer}</p>
            </>
          ))}
        {preQuestions.length === 0 && (
          <p className="mb-0 ">
            <i> - No pre-screen question added</i>
          </p>
        )}
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Pre-screen Custom Questions</h6>
        {customQuestion.length > 0 &&
          customQuestion?.map((preQue) => (
            <>
              <p className="mb-1">{preQue.prescreenquestion}</p>
              <p className="ms-2 mb-1"> - {preQue.answer}</p>
            </>
          ))}
        {customQuestion.length === 0 && (
          <p className="mb-0 ">
            <i> - No pre-screen custom question added</i>
          </p>
        )}
      </div>
      {interviewDetail?.suggestedquestion !== "" && (
        <div className="p-3 suggested-question">
          <Row>
            <Col md="11">
              {" "}
              <h6 className="fw-bold">Suggested Questions</h6>
            </Col>
            {suggestedQuestionArray?.length > 0 && (
              <Col md="1">
                <div
                  style={{ cursor: "pointer" }}
                  title="Click here to download suggested questions"
                  onClick={() => generatePDF()}
                >
                  <h6>
                    {" "}
                    <BsDownload />
                  </h6>
                </div>
              </Col>
            )}
          </Row>
          <div id="sq-pdf-content">
            {suggestedQuestionArray?.length > 0 && (
              <ol type="1">
                {suggestedQuestionArray?.map((suggestedQuestion) => (
                  <>
                    <li className="mb-1 ">{suggestedQuestion}</li>
                  </>
                ))}
              </ol>
            )}
          </div>
          {suggestedQuestionArray?.length === 0 && (
            <p className="mb-0 ">
              <i> - No suggested question added</i>
            </p>
          )}
        </div>
      )}

      <div className="divider" />
      <div className="d-block text-center mb-1">
        <h6 className="fw-bold">
          Request sent on{" "}
          {getTimezoneDateTime(interviewDetail?.createddate, "MM/DD/YYYY")}
        </h6>
      </div>
      {showCancelPopup && (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, cancel it!"
          confirmBtnBsStyle="danger"
          cancelBtnText="No"
          cancelBtnBsStyle="secondary"
          title="Are you sure?"
          onConfirm={() => cancelSchedule()}
          onCancel={() => setShowCancelPopup(false)}
          focusCancelBtn
        >
          You want to cancel the interview with{" "}
          {interviewDetail?.candidatename
            ? interviewDetail?.candidatename
            : interviewDetail?.firstname && interviewDetail?.lastname
              ? interviewDetail?.firstname + " " + interviewDetail?.lastname
              : ""}
          !
        </SweetAlert>
      )}
      {showAcceptPopup && (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, accept interview!"
          confirmBtnBsStyle="success"
          cancelBtnText="No"
          cancelBtnBsStyle="secondary"
          title="Are you sure?"
          onConfirm={() => acceptSchedule()}
          onCancel={() => setShowAcceptPopup(false)}
          focusCancelBtn
        >
          You want to Accept the interview with{" "}
          {interviewDetail?.candidatename
            ? interviewDetail?.candidatename
            : interviewDetail?.firstname && interviewDetail?.lastname
              ? interviewDetail?.firstname + " " + interviewDetail?.lastname
              : ""}
          !
        </SweetAlert>
      )}
      {showRejectPopup && (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, decline interview!"
          confirmBtnBsStyle="danger"
          cancelBtnText="No"
          cancelBtnBsStyle="secondary"
          title="Are you sure?"
          onConfirm={() => rejectSchedule()}
          onCancel={() => setShowRejectPopup(false)}
          focusCancelBtn
        >
          You want to reject the interview with{" "}
          {interviewDetail?.candidatename
            ? interviewDetail?.candidatename
            : interviewDetail?.firstname && interviewDetail?.lastname
              ? interviewDetail?.firstname + " " + interviewDetail?.lastname
              : ""}
          !
        </SweetAlert>
      )}
    </>
  );
}
