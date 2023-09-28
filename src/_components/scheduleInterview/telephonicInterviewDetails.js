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

export function TelephonicInterviewDetails() {
  return (
    <>
      <div className="dropdown-menu-header">
        <div className="dropdown-menu-header-inner">
          <div className="menu-header-content btn-pane-right">
            <Col lg="4">
              <h6 className="job-main-heading mb-0">Ajay Singh</h6>
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
        <p className="mb-0">Phone no : (987)-654-3210</p>
      </div>
      <div className="p-custom">
        <p className="mb-0">Applied to Java Developer, Shelton, CT, 06611</p>
      </div>
      <Card className="mt-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            <i className="header-icon lnr-lighter icon-gradient bg-amy-crisp">
              {" "}
            </i>
            Interviews
          </div>
        </CardHeader>
        <CardBody>
          <div className="p-custom">
            <p className="mb-0">Today : 3:00 PM to 4:00 PM</p>
          </div>
          <div className="p-custom">
            <p className="mb-0">Mode : Phone</p>
          </div>
          <div className="p-custom">
            <p className="mb-0">Interviewer : iswatirupatirao@gmail.com</p>
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
      <div className="divider" />
      <div className="d-block text-center mb-1">
        <h6 className="fw-bold">Request sent on Sept 17, 2023</h6>
      </div>
    </>
  );
}
