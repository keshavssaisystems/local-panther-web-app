import React, { useState } from "react";
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
} from "reactstrap";
import "./scheduledInterview.scss";
import { FaEllipsisV } from "react-icons/fa";
import {
  BsFillCheckCircleFill,
  BsXCircleFill,
  BsPersonVideo2,
  BsFillTelephoneFill,
  BsPerson,
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
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showInviteCard, setShowInviteCard] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);

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
    moment(interviewDetail?.scheduledate).format("YYYY-MM-DD") +
      " " +
      interviewDetail?.starttime,
    "MM/DD/YYYY"
  );
  let currentDay = getTimezoneDateTime(moment(), "YYYY-MM-DD");
  let yesterdayDate = getTimezoneDateTime(
    moment().subtract(1, "days").format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  let tomorrowDate = getTimezoneDateTime(
    moment().add(1, "days").format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  let scheduledDate = getTimezoneDateTime(
    moment(interviewDetail?.scheduledate).format("YYYY-MM-DD") +
      " " +
      interviewDetail?.starttime,
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
    "hh:mm a"
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
    "hh:mm a"
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
  let suggestedJson =
    interviewDetail?.suggestedquestion !== ""
      ? JSON.parse(interviewDetails?.suggestedquestion.replace(/'/g, '"'))
      : "";
  let suggestedQuestionArray = suggestedJson?.questions?.split("\n");
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
                          title="Reject interview"
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
                </>
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
              ? "Rejected (" + interviewDetail?.rejectionreason + ")"
              : "Rejected"
            : "No response from candidate"}
        </p>
      </div>
      {interviewDetail?.interviewstatusid !== 0 &&
        interviewDetail?.interviewfeedback !== "" && (
          <div className="p-custom">
            <h6 className="fw-bold job-heading">Interview feedback</h6>
            <p className="mb-0">{interviewDetail?.interviewfeedback}</p>
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
            <div className="btn-actions-pane-right text-capitalize actions-icon-btn float-end">
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
            </div>
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
                      href={"https://" + interviewDetail.videolink}
                      target={"_blank"}
                      rel="noopener noreferrer"
                      exact
                    >
                      Click here to join
                    </a>{" "}
                    the interview
                  </p>
                </div>
              )}
            {interviewDetail.isappvideocall === true &&
              interviewDetail?.format === "Video" && (
                <div className="p-custom">
                  <p className="mb-0">
                    <a href="/" onClick={(e) => toggle()}>
                      <NavLink to={`/video-screen/${id}`} exact>
                        Click here to join
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
        <CardFooter className="d-block text-left">
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
                onClick={(e) => downloadInterviewGuide(e)}
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
        <h6 className="fw-bold">Application questions</h6>
        {preQuestions.length > 0 &&
          preQuestions?.map((preQue) => (
            <>
              <p className="mb-1"> {preQue.prescreenquestion}</p>
              <p className="ms-2 mb-1"> - {preQue.answer}</p>
            </>
          ))}
        {preQuestions.length === 0 && (
          <p className="mb-0 ">
            <i> - No application question added</i>
          </p>
        )}
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Pre-screen</h6>
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
          <h6 className="fw-bold">Suggested Questions</h6>
          {suggestedQuestionArray?.length > 0 &&
            suggestedQuestionArray?.map((suggestedQuestion) => (
              <>
                <p className="mb-1">{suggestedQuestion}</p>
              </>
            ))}
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
          onConfirm={(e) => cancelSchedule(e)}
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
          onConfirm={(e) => acceptSchedule(e)}
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
          confirmBtnText="Yes, reject interview!"
          confirmBtnBsStyle="danger"
          cancelBtnText="No"
          cancelBtnBsStyle="secondary"
          title="Are you sure?"
          onConfirm={(e) => rejectSchedule(e)}
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
