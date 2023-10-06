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
import { BsCheckLg, BsPersonVideo2, BsXCircleFill } from "react-icons/bs";
import { ImBin } from "react-icons/im";
import moment from "moment-timezone";
import { NotesCard } from "./notesCard";
import { InviteToInterviewCard } from "./inviteToInterviewCard";

export function VideoInterviewDetails({ interviewDetail }) {
  const [showNotes, setShowNotes] = useState(false);
  const [showInviteCard, setShowInviteCard] = useState(false);
  let scheduled = moment(interviewDetail.scheduledate).format("MMM D, YYYY");
  let currentDay = moment().format("YYYY-MM-DD");
  let yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  let tomorrowDate = moment().add(1, "days").format("YYYY-MM-DD");
  let scheduledDate = moment(interviewDetail.scheduledate).format("YYYY-MM-DD");
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
    moment(interviewDetail.scheduledate).format("MMM D, YYYY") +
      " " +
      interviewDetail.starttime
  )
    .tz("America/New_York")
    .format("hh:mm a");
  let startDate =
    moment(interviewDetail.scheduledate).format("MMM D, YYYY") +
    " " +
    startTime;
  let durationArr =
    interviewDetail.duration !== undefined
      ? interviewDetail.duration.split(" ")
      : [];
  let endTime = moment(startDate).add(durationArr[0], "m").format("hh:mm a");
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
                  color={"primary"}
                  size={"sm"}
                  className="mb-2 btn-transition"
                  outline
                >
                  <BsCheckLg />
                </Button>
                <Button
                  name="format"
                  color={"primary"}
                  size={"sm"}
                  className="mb-2 btn-transition"
                  outline
                >
                  ?
                </Button>
                <Button
                  name="format"
                  color={"primary"}
                  size={"sm"}
                  className="mb-2 btn-transition"
                  outline
                >
                  x
                </Button>
              </ButtonGroup>

              <Button
                outline
                size="sm"
                className="mb-2 ms-1 btn-transition"
                color="danger"
                title="Cancel"
              >
                <ImBin />
              </Button>

              {/* <UncontrolledButtonDropdown>
                <DropdownToggle className="btn-icon btn-icon-only" color="link">
                  <FaEllipsisV />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                  <DropdownItem>
                    <i className="dropdown-icon lnr-inbox"> </i>
                    <span>Reject</span>
                  </DropdownItem>
                  <DropdownItem>
                    <i className="dropdown-icon lnr-file-empty"> </i>
                    <span>Delete</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown> */}
            </Col>
          </div>
        </div>
      </div>
      <div className="p-custom">
        <p className="mb-0">Applied for {interviewDetail.jobtitle}</p>
      </div>
      {showInviteCard === true && (
        <div className="mt-2 mb-2">
          <InviteToInterviewCard />
        </div>
      )}
      <Card className="mt-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            <BsPersonVideo2 className="header-icon icon-gradient bg-amy-crisp" />
            Interview
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
                  <DropdownItem>
                    <i className="dropdown-icon lnr-inbox"> </i>
                    <span>Edit</span>
                  </DropdownItem>
                  <DropdownItem>
                    <i className="dropdown-icon lnr-file-empty"> </i>
                    <span>Cancel</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
            <div className="p-custom">
              <p className="mb-0">
                {scheduled} : {startTime} to {endTime}
              </p>
            </div>
            <div className="p-custom">
              <p className="mb-0">Mode : {interviewDetail.format}</p>
            </div>
            {interviewDetail.isappvideocall === false && (
              <div className="p-custom">
                <p className="mb-0">
                  Interview link :{" "}
                  <a
                    href={interviewDetail.videolink}
                    onClick={(e) => e.preventDefault()}
                  >
                    Click here to join
                  </a>
                </p>
              </div>
            )}
            <div className="p-custom">
              <p className="mb-0">
                Interviewer : {interviewDetail.intervieweremailids}
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
          <NotesCard />
        </div>
      )}
      <div className="p-3">
        <h6 className="fw-bold">Summary</h6>
        <p className="mb-0">{interviewDetail.messagetocandidate}</p>
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Application questions</h6>
        <p className="mb-0">-</p>
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Pre-screen</h6>
        <p className="mb-0">-</p>
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Skills test</h6>
        <p className="mb-0">-</p>
      </div>
      {/* <div className="divider" />
      <div className="d-block text-center mb-1">
        <h6 className="fw-bold">Request sent on Sept 17, 2023</h6>
      </div> */}
    </>
  );
}
