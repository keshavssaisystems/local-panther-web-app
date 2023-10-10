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
  BsFillQuestionCircleFill,
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

export function VideoInterviewDetails({
  interviewId,
  postNotesData,
  postInviteData,
  cancelScheduleData,
  editScheduledInterview,
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showInviteCard, setShowInviteCard] = useState(false);
  const allInterview = useSelector(
    (state) => state.scheduleInterview.allInterview
  );
  let selectedJobDetails = allInterview.scheduledInterviewList.filter(
    (element) => {
      return element.scheduleinterviewid === interviewId;
    }
  );
  const interviewDetail = selectedJobDetails[0];
  let scheduled = moment(interviewDetail?.scheduledate).format("MMM D, YYYY");
  let currentDay = moment().format("YYYY-MM-DD");
  let yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  let tomorrowDate = moment().add(1, "days").format("YYYY-MM-DD");
  let scheduledDate = moment(interviewDetail?.scheduledate).format(
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
    moment(interviewDetail?.scheduledate).format("MMM D, YYYY") +
      " " +
      interviewDetail?.starttime
  )
    .tz("America/New_York")
    .format("hh:mm a");
  let startDate =
    moment(interviewDetail?.scheduledate).format("MMM D, YYYY") +
    " " +
    startTime;
  let durationArr =
    interviewDetail?.duration !== undefined
      ? interviewDetail?.duration.split(" ")
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
              <Button
                outline
                size="sm"
                className="mb-2 mr-2 btn-transition"
                color="primary"
              >
                {" "}
                Call{" "}
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
      <div className="p-custom">
        <p className="mb-0">Applied for {interviewDetail?.jobtitle}</p>
      </div>
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
                  <FaEllipsisV />
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
                {scheduled} : {startTime} to {endTime} ({" "}
                {interviewDetail.duration} )
              </p>
            </div>
            {interviewDetail?.format === "Phone" && (
              <div className="p-custom">
                <p className="mb-0">Phone no - </p>
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
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      Click here to join
                    </a>{" "}
                    the in-app interview
                  </p>
                </div>
              )}
            <div className="p-custom">
              <p className="mb-0">
                Interviewer :{" "}
                {interviewDetail?.intervieweremailids === ""
                  ? "No interviewer added"
                  : interviewDetail?.intervieweremailids}
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
            interviewNotes={interviewDetail?.interviewnotes}
            interviewId={interviewDetail?.scheduleinterviewid}
            postNotesData={(e) => postNotesData(e)}
          />
        </div>
      )}
      <div className="p-3">
        <h6 className="fw-bold">Summary</h6>
        <p className="mb-0">
          {interviewDetail?.messagetocandidate === ""
            ? "- "
            : interviewDetail?.messagetocandidate}
        </p>
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
          {moment(interviewDetail?.createddate).format("MMM D, YYYY")}
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
    </>
  );
}
