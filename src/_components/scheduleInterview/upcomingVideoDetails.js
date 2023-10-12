import React, { useState } from "react";
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
  ButtonGroup,
} from "reactstrap";
import "./scheduledInterview.scss";
import { FaEllipsisV } from "react-icons/fa";
import {
  BsPersonVideo2,
  BsFillCheckCircleFill,
  BsFillQuestionCircleFill,
  BsXCircleFill,
  BsTelephone,
  BsPerson,
} from "react-icons/bs";
import { ImBin } from "react-icons/im";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { NotesCard } from "./notesCard";
import { InviteToInterviewCard } from "./inviteToInterviewCard";

export function UpcomingVideoDetails({
  interviewId,
  cancelScheduleData,
  postInviteData,
  postNotesData,
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showInviteCard, setShowInviteCard] = useState(false);
  const upcomingInterviews = useSelector(
    (state) => state.scheduleInterview.upcomingInterview
  );
  let selectedJobDetails = upcomingInterviews.scheduledInterviewList.filter(
    (element) => {
      return element.scheduleinterviewid === interviewId;
    }
  );

  const interviewDetails = selectedJobDetails[0];
  let scheduled = moment(interviewDetails?.scheduledate).format("MMM D, YYYY");
  let currentDay = moment().format("YYYY-MM-DD");
  let yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  let tomorrowDate = moment().add(1, "days").format("YYYY-MM-DD");
  let scheduledDate = moment(interviewDetails?.scheduledate).format(
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
  let startTime = moment(
    moment(interviewDetails?.scheduledate).format("MMM D, YYYY") +
      " " +
      interviewDetails?.starttime
  )
    .tz("America/New_York")
    .format("hh:mm a");
  let startDate =
    moment(interviewDetails?.scheduledate).format("MMM D, YYYY") +
    " " +
    startTime;
  let durationArr =
    interviewDetails?.duration !== undefined
      ? interviewDetails?.duration.split(" ")
      : [];
  let endTime = moment(startDate).add(durationArr[0], "m").format("hh:mm a");
  let userId = localStorage.getItem("userId");
  const cancelSchedule = () => {
    let cancelData = {
      currentUserId: userId,
      scheduledInterviewId: interviewId,
    };
    cancelScheduleData(cancelData);
  };
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
                  className="mb-2 mr-2 btn-transition"
                  color="primary"
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
                  >
                    <BsFillCheckCircleFill className="mb-1" />
                  </Button>
                  <Button
                    name="format"
                    color={"primary"}
                    size={"sm"}
                    className="mb-2 btn-transition"
                    outline
                  >
                    <BsFillQuestionCircleFill className="mb-1" />
                  </Button>
                  <Button
                    name="format"
                    color={"danger"}
                    size={"sm"}
                    className="mb-2 btn-transition"
                    outline
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
              </Col>
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
          {interviewDetails?.isaccepted === true &&
          interviewDetails?.isrejected === false
            ? "Scheduled"
            : interviewDetails?.isrejected === true
            ? "Rejected"
            : "Awaiting confirmation"}
        </div>
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
              <div className="btn-actions-pane-right text-capitalize actions-icon-btn float-end">
                <UncontrolledButtonDropdown>
                  <DropdownToggle
                    className="btn-icon btn-icon-only"
                    color="link"
                  >
                    <FaEllipsisV />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                    <DropdownItem>
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
                  {interviewDetails?.duration} )
                </p>
              </div>
              {interviewDetails?.format === "Phone" && (
                <div className="p-custom">
                  <p className="mb-0">Phone no - </p>
                </div>
              )}
              {interviewDetails?.format === "In-person" && (
                <div className="p-custom">
                  <div className="p-custom">
                    <p className="mb-0">
                      Interview Address - {interviewDetails.interviewaddress}
                    </p>
                  </div>
                </div>
              )}
              {interviewDetails?.isappvideocall === false &&
                interviewDetails?.format === "Video" && (
                  <div className="p-custom">
                    <p className="mb-0">
                      <a
                        href={interviewDetails.videolink}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        Click here to join
                      </a>{" "}
                      the interview
                    </p>
                  </div>
                )}
              {interviewDetails.isappvideocall === true &&
                interviewDetails?.format === "Video" && (
                  <div className="p-custom">
                    <p className="mb-0">
                      <a href="/" onClick={(e) => e.preventDefault()}>
                        Click here to join
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
            >
              {" "}
              Add interview guide{" "}
            </Button>
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
        <div className="p-3">
          <h6 className="fw-bold">Summary</h6>
          <ul className="mb-0">
            {interviewDetails?.candidateSummaryDtos?.length > 0 &&
              interviewDetails?.candidateSummaryDtos?.map((summaryDetails) => (
                <li>{summaryDetails.summary}</li>
              ))}
          </ul>
          {interviewDetails?.candidateSummaryDtos?.length === undefined && (
            <p className="mb-0">-</p>
          )}
        </div>
        <div className="p-3">
          <h6 className="fw-bold">Application questions</h6>
          <p className="mb-0">-</p>
        </div>
        <div className="p-3">
          <h6 className="fw-bold">Pre-screen</h6>
          <p className="mb-0">-</p>
        </div>
        <div className="divider" />
        <div className="d-block text-center mb-1">
          <h6 className="fw-bold">
            Request sent on{" "}
            {moment(interviewDetails?.createddate).format("MMM D, YYYY")}
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
    </>
  );
}
