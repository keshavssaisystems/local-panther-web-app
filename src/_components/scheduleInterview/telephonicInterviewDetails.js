import React from "react";
import {
  CardHeader,
  Col,
  CardFooter,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import "./scheduledInterview.scss";
import { BsFillTelephoneFill } from "react-icons/bs";
import moment from "moment-timezone";

export function TelephonicInterviewDetails({ interviewDetail }) {
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
  return (
    <>
      <div className="dropdown-menu-header">
        <div className="dropdown-menu-header-inner">
          <div className="menu-header-content btn-pane-right">
            <Col lg="4">
              <h6 className="job-main-heading mb-0">
                {interviewDetail?.candidatename}
              </h6>
            </Col>
            <Col style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                outline
                size="sm"
                className="mb-2 mr-2 btn-transition"
                color="primary"
              >
                {" "}
                Call{" "}
              </Button>
            </Col>
          </div>
        </div>
      </div>
      <div className="p-custom">
        <p className="mb-0">
          Phone no : {interviewDetail?.textremaindernumbers}
        </p>
      </div>
      <div className="p-custom">
        <p className="mb-0">Applied for {interviewDetail?.jobtitle}</p>
      </div>
      <Card className="mt-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            <BsFillTelephoneFill className="header-icon icon-gradient bg-amy-crisp" />
            Interview
          </div>
        </CardHeader>
        <CardBody>
          <div className="p-custom">
            <p className="mb-0">
              {scheduled} : {startTime} to {endTime}
            </p>
          </div>
          <div className="p-custom">
            <p className="mb-0">Mode : {interviewDetail?.format}</p>
          </div>
          <div className="p-custom">
            <p className="mb-0">
              Interviewer : {interviewDetail?.intervieweremailids}
            </p>
          </div>
        </CardBody>
        <CardFooter className="d-block text-left">
          <h6 className="fw-bold">Did they answer?</h6>
          <p className="mb-2">Save answer as a note and nofity the candidate</p>
          <Button
            outline
            className="mb-2 mr-2 btn-transition btn btn-outline-primary"
            color="primary"
            size={"sm"}
          >
            {" "}
            Answered{" "}
          </Button>
          <Button
            outline
            className="mb-2 mr-2 btn-transition"
            color="alternate"
            size={"sm"}
          >
            {" "}
            Left a voicemail{" "}
          </Button>
          <Button
            outline
            className="mb-2 mr-2 btn-transition"
            color="danger"
            size={"sm"}
          >
            {" "}
            No answer{" "}
          </Button>
          <Button
            outline
            className="mb-2 mr-2 btn-transition"
            color="secondary"
            size={"sm"}
          >
            {" "}
            Cancel{" "}
          </Button>
        </CardFooter>
      </Card>
      {/* <div className="divider" />
      <div className="d-block text-center mb-1">
        <h6 className="fw-bold">Request sent on Sept 17, 2023</h6>
      </div> */}
    </>
  );
}
