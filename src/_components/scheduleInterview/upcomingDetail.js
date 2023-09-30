import React from "react";
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
} from "reactstrap";
import "./scheduledInterview.scss";
import { FaEllipsisV } from "react-icons/fa";
import { BsLink45Deg, BsCameraVideo } from "react-icons/bs";
import { TakeNotesModal } from "./takeNotesModal";
import moment from "moment-timezone";

export function UpcomingDetail({ interviewDetails }) {
  let scheduled = moment(interviewDetails.scheduledate).format("MMM D, YYYY");
  let currentDay = moment().format("YYYY-MM-DD");
  let yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  let tomorrowDate = moment().add(1, "days").format("YYYY-MM-DD");
  let scheduledDate = moment(interviewDetails.scheduledate).format(
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
    moment(interviewDetails.scheduledate).format("MMM D, YYYY") +
      " " +
      interviewDetails.starttime
  )
    .tz("America/New_York")
    .format("hh:mm a");
  let startDate =
    moment(interviewDetails.scheduledate).format("MMM D, YYYY") +
    " " +
    startTime;
  let durationArr =
    interviewDetails.duration !== undefined
      ? interviewDetails.duration.split(" ")
      : [];
  let endTime = moment(startDate).add(durationArr[0], "m").format("hh:mm a");
  return (
    <>
      <Card className="upcoming-interview">
        <CardBody>
          <div className="dropdown-menu-header">
            <div className="dropdown-menu-header-inner">
              <div className="menu-header-content btn-pane-right">
                <Col lg="4">
                  <h6 className="job-main-heading mb-0">
                    {interviewDetails.candidatename}
                  </h6>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    outline
                    size="sm"
                    className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                    color="primary"
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
                        <span>Reject</span>
                      </DropdownItem>
                      <DropdownItem>
                        <i className="dropdown-icon lnr-file-empty"> </i>
                        <span>Delete</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </Col>
              </div>
            </div>
          </div>
          <div className="divider" />
          <div className="p-custom">
            <h6 className="fw-bold mb-0 job-heading">Email</h6>
            <p className="mb-0">ajaysingh@gmail.com</p>
          </div>
          <div className="p-custom">
            <p className="mb-0">
              <h6 className="fw-bold mb-0 job-heading">Mobile</h6>
              {interviewDetails.textremaindernumbers}
            </p>
          </div>
          <div className="p-custom">
            <p className="mb-0">
              <h6 className="fw-bold mb-0 job-heading">Skills</h6>
              {interviewDetails.candidateskills === ""
                ? "-"
                : interviewDetails.candidateskills}
            </p>
          </div>
          <div className="p-custom">
            <p className="mb-0">
              <h6 className="fw-bold mb-0 job-heading">Status</h6>
              {interviewDetails.isaccepted === true &&
              interviewDetails.isrejected === false
                ? "Scheduled"
                : interviewDetails.isrejected === true
                ? "Rejected"
                : "Awaiting confirmation"}
            </p>
          </div>
          <Card className="mt-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <BsCameraVideo className="header-icon icon-gradient bg-amy-crisp" />
                Interview
              </div>
              <div className="btn-actions-pane-right text-capitalize actions-icon-btn">
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
                    <DropdownItem>
                      <i className="dropdown-icon lnr-file-empty"> </i>
                      <span>Cancel</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <CardBody>
              <div className="p-custom">
                <p className="mb-0">
                  {scheduled} at {startTime} to {endTime}
                </p>
              </div>
              <div className="p-custom">
                <p className="mb-0">Mode : {interviewDetails.format}</p>
              </div>
              {interviewDetails.isappvideocall === false && (
                <div className="p-custom">
                  <p className="mb-0">
                    Interview link :{" "}
                    <a
                      href={interviewDetails.videolink}
                      onClick={(e) => e.preventDefault()}
                    >
                      <BsLink45Deg /> Click here to join
                    </a>
                  </p>
                </div>
              )}
              <div className="p-custom">
                <p className="mb-0">
                  Interviewer : {interviewDetails.intervieweremailids}
                </p>
              </div>
            </CardBody>
            <CardFooter className="d-block text-left">
              <TakeNotesModal />
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

          <div className="p-3">
            <h6 className="fw-bold">Summary</h6>
            <p className="mb-0">{interviewDetails.messagetocandidate}</p>
          </div>
          <div className="p-3">
            <h6 className="fw-bold">Application questions</h6>
            <p className="mb-0">-</p>
          </div>
          <div className="p-3">
            <h6 className="fw-bold">Phase pre-screen</h6>
            <p className="mb-0">-</p>
          </div>
          <div className="p-3">
            <h6 className="fw-bold">Skills test</h6>
            <p className="mb-0">-</p>
          </div>
          <div className="divider" />
          <div className="d-block text-center mb-1">
            <h6 className="fw-bold">
              Request sent on{" "}
              {moment(interviewDetails.createddate).format("MMM D, YYYY")}
            </h6>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
