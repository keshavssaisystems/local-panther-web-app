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
import { MessageCard } from "./messageCard";
import { getTimezoneDateTime, getChannelId } from "_helpers/helper";
import { NavLink } from "react-router-dom";

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
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showInviteCard, setShowInviteCard] = useState(false);
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

  let id = getChannelId(
    interviewDetail?.candidateid,
    interviewDetail?.candidateuserid,
    interviewDetail?.scheduleinterviewid
  );

  let scheduled = getTimezoneDateTime(
    interviewDetails?.scheduledate,
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
    moment(interviewDetails?.scheduledate),
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
  let USNumber = interviewDetail?.candidatephonenumber
    ? interviewDetail?.candidatephonenumber?.match(/(\d{3})(\d{3})(\d{4})/)
    : null;
  const acceptSchedule = () => {
    acceptInterview(interviewId);
  };
  const rejectSchedule = () => {
    rejectInterview(interviewId);
  };
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
              ) : (
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
                  <Button
                    outline
                    size="sm"
                    className="mb-2 mr-2 btn-transition"
                    color="primary"
                    onClick={() => setShowMessage(!showMessage)}
                  >
                    {" "}
                    Message{" "}
                  </Button>
                  <ButtonGroup size={"sm"}>
                    <Button
                      name="format"
                      color={"success"}
                      size={"sm"}
                      className="mb-2 btn-transition"
                      outline
                      onClick={(e) => setShowAcceptPopup(true)}
                    >
                      <BsFillCheckCircleFill className="mb-1" />
                    </Button>
                    {/* <Button
                  name="format"
                  color={"primary"}
                  size={"sm"}
                  className="mb-2 btn-transition"
                  outline
                >
                  <BsFillQuestionCircleFill className="mb-1" />
                </Button> */}
                    <Button
                      name="format"
                      color={"danger"}
                      size={"sm"}
                      className="mb-2 btn-transition"
                      outline
                      onClick={(e) => setShowRejectPopup(true)}
                    >
                      <BsXCircleFill className="mb-1" />
                    </Button>
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
          {interviewDetail?.isaccepted === true &&
          interviewDetail?.isrejected === false
            ? "Scheduled"
            : interviewDetail?.isrejected === true
            ? "Rejected by candidate"
            : "Awaiting confirmation from candidate"}
        </p>
      </div>
      {showInviteCard === true && (
        <div className="mt-2 mb-2">
          <InviteToInterviewCard
            interviewId={interviewDetail?.scheduleinterviewid}
            postInviteData={(e) => postInviteData(e)}
          />
        </div>
      )}
      {showMessage === true && (
        <div className="mt-2 mb-2">
          <MessageCard
            interviewId={interviewDetail?.scheduleinterviewid}
            postMessageData={(e) => postMessageData(e)}
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
                  {fromCustList ? <></> : <FaEllipsisV />}
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                  <DropdownItem onClick={(e) => editScheduledInterview(true)}>
                    <i className="dropdown-icon lnr-inbox"> </i>
                    <span>Edit</span>
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
                  {interviewDetail.candidatephonenumber !== undefined
                    ? ""
                    : "(" +
                      USNumber[1] +
                      ")-" +
                      USNumber[2] +
                      "-" +
                      USNumber[3]}
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
                      href={interviewDetail.videolink}
                      target={"_blank"}
                      rel="noreferrer"
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
              >
                {" "}
                Add interview guide{" "}
              </Button>
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
      <div className="divider" />
      <div className="d-block text-center mb-1">
        <h6 className="fw-bold">
          Request sent on{" "}
          {getTimezoneDateTime(
            moment(interviewDetail?.createddate).format("MM/DD/YYYY"),
            "MM/DD/YYYY"
          )}
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
