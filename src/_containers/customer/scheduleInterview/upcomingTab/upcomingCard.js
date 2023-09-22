import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import logo from "../../../../assets/utils/images/panther-logo.png";
import {
  BsLink,
  BsListStars,
  BsCalendarCheck,
  BsPlaystation,
  BsCameraVideo,
  BsPersonBoundingBox,
  BsPersonCheck
} from "react-icons/bs";

export function UpcomingCard() {
  return (
    <>
      <Card
        className={"mb-2 card-border-custom"}
      >
        <CardBody>
          <Row>
            <Col md="12">
              <Row className="mb-2">
                <Col md="7">
                  <div className="job-title">Fullstack developer</div>
                  <div className="muted-name">Sai systems</div>
                </Col>
                <Col>
                  <img
                    src={logo}
                    alt="logo"
                    className="float-end display-logo-card"
                  />
                </Col>
              </Row>
              <p className="job-details">
                <BsPersonCheck />  Candidate:  Ajay Singh (80850-34214)
              </p>
              <p className="job-details">
                <BsCalendarCheck />  Toady, 03:00 PM TO 04:00 PM EST
              </p>
              <p className="job-details">
                <BsPlaystation /> Status: Confirmed
              </p>
              <p className="job-details">
                <BsCameraVideo /> Mode: Video 
              </p>
              <p className="job-details">
                <BsLink /> Link: <a href="https://meet.google.com/pto-xajk-ngq" target="_blank" rel="noreferrer">https://meet.google.com/pto-xajk-ngq</a>
              </p>
              <p className="job-details">
                <BsListStars /> Skills: .NET Assemblies,.NET Development,.…
              </p>
              <p className="job-details">
                <BsPersonBoundingBox /> Interviewer: Vinit Pal
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
