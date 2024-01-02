import React, { useState, useEffect } from "react";
import {
  CardHeader,
  Col,
  CardFooter,
  Button,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
  Card,
  CardBody,
  ModalHeader,
  ModalBody,
  Modal,
} from "reactstrap";
import "./scheduledInterview.scss";
import { FaEllipsisV } from "react-icons/fa";
import { BsPersonVideo2, BsTelephone, BsPerson } from "react-icons/bs";
import { ImBin } from "react-icons/im";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { NotesCard } from "./notesCard";
import { InviteToInterviewCard } from "./inviteToInterviewCard";
import { UpdateScheduleInterviewModal } from "./updateScheduleInterviewModal";
import { Chat } from "firebase/chat/chat";
import { getTimezoneDateTime, getVideoChannelId } from "_helpers/helper";
import { NavLink } from "react-router-dom";
import { InterviewFeedback } from "./interviewFeedback";
import { USPhoneNumber } from "_helpers/helper";
export function UpcomingVideoDetails({
  interviewId,
  cancelScheduleData,
  postInviteData,
  postNotesData,
  acceptInterview,
  rejectInterview,
  getUpdatedFormData,
  postFeedbackData,
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [oldInterviewId, setOldInterviewId] = useState("");
  const [showInviteCard, setShowInviteCard] = useState(false);
  useEffect(() => {
    if (oldInterviewId !== interviewId) {
      setFeedbackModal(false);
    }
  }, [interviewId, oldInterviewId]);
  const upcomingInterviews = useSelector(
    (state) => state.scheduleInterview.upcomingInterview
  );
  let selectedJobDetails = upcomingInterviews?.scheduledInterviewList?.filter(
    (element) => {
      return element.scheduleinterviewid === interviewId;
    }
  );
  const durationOptions = useSelector(
    (state) => state.scheduleInterview.duration
  );
  const interviewDetails =
    selectedJobDetails?.length > 0 ? selectedJobDetails[0] : [];
  let scheduled = getTimezoneDateTime(
    moment(interviewDetails?.scheduledate).format("YYYY-MM-DD") +
      " " +
      interviewDetails?.starttime,
    "MM/DD/YYYY"
  );

  let id = getVideoChannelId(
    interviewDetails?.jobid,
    interviewDetails?.scheduleinterviewid,
    interviewDetails?.candidateid
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
    moment(interviewDetails?.scheduledate).format("YYYY-MM-DD") +
      " " +
      interviewDetails?.starttime,
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
  let customQuestion = [];
  let preQuestions = [];
  if (
    interviewDetails?.jobCandidatePrescreenApplicantDtos !== null &&
    interviewDetails?.jobCandidatePrescreenApplicantDtos?.length > 0
  ) {
    interviewDetails.jobCandidatePrescreenApplicantDtos.forEach((element) => {
      if (element.iscustomquestion === false) {
        preQuestions.push(element);
      }
      if (element.iscustomquestion === true) {
        customQuestion.push(element);
      }
    });
  }
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const interviewGuideLink = useSelector(
    (state) => state.scheduleInterview?.interviewGuideList
  );
  const downloadInterviewGuide = () => {
    window.open(interviewGuideLink[0].name, "_blank");
  };
  let suggestedJson = "";
  let suggestedQuestionArray = [];
  try {
    suggestedJson =
      interviewDetails?.suggestedquestion !== "" &&
      interviewDetails?.suggestedquestion !== undefined
        ? JSON.parse(interviewDetails?.suggestedquestion.replace(/'/g, '"'))
        : "";
    suggestedQuestionArray = suggestedJson?.questions?.split("\n");
  } catch {
    suggestedJson = "";
    suggestedQuestionArray = [];
  }

  return (
    <>
      <CardBody>
        <div className="dropdown-menu-header">
          <div className="dropdown-menu-header-inner">
            <div className="menu-header-content btn-pane-right">
              <Col lg="4">
                <h6 className="job-main-heading mb-0">
                  {interviewDetails?.candidatename}
                </h6>
              </Col>
              {interviewDetails?.interviewstatusid === 0 ? (
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
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
                </Col>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="p-custom">
          <h6 className="fw-bold mb-0 job-heading">Applied for</h6>
          <p className="mb-0">{interviewDetails?.jobtitle}</p>
        </div>
        <div className="p-custom">
          <h6 className="fw-bold mb-0 job-heading">Email</h6>
          <p className="mb-0">{interviewDetails?.candidateemail}</p>
        </div>
        <div className="p-custom">
          <h6 className="fw-bold mb-0 job-heading">Skills</h6>
          {interviewDetails?.candidateskills === ""
            ? "-"
            : interviewDetails?.candidateskills}
        </div>
        <div className="p-custom">
          <h6 className="fw-bold mb-0 job-heading">Status</h6>
          {interviewDetails?.isreschedulerequested === true
            ? "Requested for reschedule (" +
              interviewDetails?.reschedulerequestedreason +
              ")"
            : interviewDetails?.interviewstatusid !== 0
            ? interviewDetails?.interviewstatusid === 1
              ? "Completed"
              : "Candidate not joined"
            : interviewDetails?.isaccepted === true &&
              interviewDetails?.isrejected === false
            ? "Accepted"
            : interviewDetails?.isrejected === true
            ? interviewDetails?.rejectionreason !== ""
              ? "Rejected (" + interviewDetails?.rejectionreason + ")"
              : "Rejected"
            : "No response"}
        </div>
        {interviewDetails?.interviewstatusid !== 0 &&
          interviewDetails?.interviewfeedback !== "" && (
            <div className="p-custom">
              <h6 className="fw-bold mb-0 job-heading">Interview feedback</h6>
              {interviewDetails?.interviewfeedback}
            </div>
          )}
        {showInviteCard === true && (
          <div className="mt-2 mb-2">
            <InviteToInterviewCard
              interviewId={interviewDetails.scheduleinterviewid}
              postInviteData={(e) => postInviteData(e)}
            />
          </div>
        )}
        <Card className="mt-3">
          <CardHeader className="card-header-tab">
            <div className="card-header-title font-size-lg text-capitalize fw-normal">
              {interviewDetails?.format === "Video" && (
                <BsPersonVideo2 className="header-icon icon-gradient bg-amy-crisp" />
              )}
              {interviewDetails?.format === "Phone" && (
                <BsTelephone className="header-icon icon-gradient bg-amy-crisp" />
              )}
              {interviewDetails?.format === "In-person" && (
                <BsPerson className="header-icon icon-gradient bg-amy-crisp" />
              )}
              {interviewDetails?.format} interview
            </div>
          </CardHeader>
          <CardBody>
            <div>
              {interviewDetails?.interviewstatusid === 0 && (
                <div className="btn-actions-pane-right text-capitalize actions-icon-btn float-end">
                  <UncontrolledButtonDropdown>
                    <DropdownToggle
                      className="btn-icon btn-icon-only"
                      color="link"
                    >
                      <FaEllipsisV />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                      <DropdownItem
                        onClick={(e) => setShowEditScheduleModal(true)}
                      >
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
              )}
              <div className="p-custom">
                <p className="mb-0">
                  {scheduled} at {startTime} to {endTime} ({" "}
                  {interviewDetails?.duration} )
                </p>
              </div>
              {interviewDetails?.format === "Phone" && (
                <div className="p-custom">
                  <p className="mb-0">
                    Phone no -{" "}
                    {interviewDetails.candidatephonenumber === undefined
                      ? ""
                      : USPhoneNumber(
                          interviewDetails.candidatephonenumber
                        )}{" "}
                  </p>
                </div>
              )}
              {interviewDetails?.format === "In-person" && (
                <div className="p-custom">
                  <p className="mb-0">
                    Interview Address - {interviewDetails.interviewaddress}
                  </p>
                </div>
              )}
              {interviewDetails?.isappvideocall === false &&
                interviewDetails?.format === "Video" && (
                  <div className="p-custom">
                    <p className="mb-0">
                      <a
                        href={"https://" + interviewDetails.videolink}
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
              {interviewDetails?.isappvideocall === true &&
                interviewDetails?.format === "Video" && (
                  <div className="p-custom">
                    <p className="mb-0">
                      <a href="/" onClick={(e) => e.preventDefault()}>
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
                  Interviewers -{" "}
                  {interviewDetails?.intervieweremailids === ""
                    ? "No interviewer added"
                    : interviewDetails?.intervieweremailids}
                </p>
              </div>
            </div>
          </CardBody>
          <CardFooter className="d-block text-left">
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
            <Button
              outline
              className="mb-2 mr-2 btn-transition"
              color="primary"
              size={"sm"}
              onClick={(e) => setModal(true)}
            >
              {" "}
              Chat with {interviewDetails?.candidatename}{" "}
            </Button>
            {interviewDetails?.interviewstatusid === 0 && (
              <>
                <Button
                  outline={!feedbackModal}
                  className="mb-2 mr-2 btn-transition"
                  color="primary"
                  size={"sm"}
                  onClick={(e) => {
                    setFeedbackModal(!feedbackModal);
                    setOldInterviewId(interviewDetails.scheduleinterviewid);
                  }}
                >
                  {" "}
                  Interview feedback{" "}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
        {showNotes === true && (
          <div className="mt-2 mb-2">
            <NotesCard
              interviewNotes={interviewDetails.interviewnotes}
              interviewId={interviewDetails.scheduleinterviewid}
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
                setOldInterviewId(interviewDetails.scheduleinterviewid);
              }}
            />
          </div>
        )}
        <div className="p-3">
          <h6 className="fw-bold">Summary</h6>
          <ul className="mb-0">
            {interviewDetails?.candidateSummaryDtos?.length > 0 &&
              interviewDetails?.candidateSummaryDtos?.map((summaryDetails) => (
                <li>{summaryDetails.summary}</li>
              ))}
          </ul>
          {interviewDetails?.candidateSummaryDtos?.length === undefined && (
            <p className="mb-0 ">
              <i> - No summary added</i>
            </p>
          )}
        </div>
        <div className="p-3 pb-0">
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
        <div className="p-3 ">
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
        {interviewDetails?.suggestedquestion !== "" && (
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
            {getTimezoneDateTime(interviewDetails?.createddate, "MM/DD/YYYY")}
          </h6>
        </div>
      </CardBody>
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
          {interviewDetails?.candidatename
            ? interviewDetails?.candidatename
            : interviewDetails?.firstname && interviewDetails?.lastname
            ? interviewDetails?.firstname + " " + interviewDetails?.lastname
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
          {interviewDetails?.candidatename
            ? interviewDetails?.candidatename
            : interviewDetails?.firstname && interviewDetails?.lastname
            ? interviewDetails?.firstname + " " + interviewDetails?.lastname
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
          {interviewDetails?.candidatename
            ? interviewDetails?.candidatename
            : interviewDetails?.firstname && interviewDetails?.lastname
            ? interviewDetails?.firstname + " " + interviewDetails?.lastname
            : ""}
          !
        </SweetAlert>
      )}
      <UpdateScheduleInterviewModal
        interviewData={interviewDetails}
        durationOptions={durationOptions}
        postData={(e) => {
          getUpdatedFormData(e);
        }}
        isOpen={showEditScheduleModal}
        onClose={() => setShowEditScheduleModal(false)}
      />
      <Modal
        isOpen={modal}
        fullscreen={"lg"}
        size="lg"
        backdrop={true}
        fade={true}
        toggle={toggle}
        className="interview-details-modal"
      >
        <ModalHeader toggle={(e) => setModal(false)}>
          Chat with {interviewDetails?.candidatename}
        </ModalHeader>
        <ModalBody className="pt-4">
          <Chat
            groupId={
              Number(localStorage.getItem("userId")) +
              "-" +
              interviewDetails?.candidateuserid
            }
            details={{
              id: interviewDetails?.candidateuserid,
              name: interviewDetails?.candidatename,
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
