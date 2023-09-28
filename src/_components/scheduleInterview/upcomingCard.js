import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import "./scheduledInterview.scss";
import {
  BsLink,
  BsListStars,
  BsCalendarCheck,
  BsPlaystation,
  BsCameraVideo,
  BsPersonBoundingBox,
  BsPersonCheck,
} from "react-icons/bs";

export function UpcomingCard() {
  return (
    <>
      <Card className={"mb-2 card-border-custom upcomming-card"}>
        <CardBody>
          <Row>
            <Col md="12">
              <Row className="mb-2">
                <Col md="7">
                  <div className="job-title">Ajay Singh</div>
                  <div className="muted-name">ajaysingh@gmail.com</div>
                </Col>
                <Col md="5">
                  <div className="mb-2 me-2 badge bg-success float-end badge-custom">
                    Confirmed
                  </div>
                </Col>
              </Row>
              <p className="job-details">
                <BsPersonCheck /> Job title: Java Developer, Shelton, CT, 06611
              </p>
              <p className="job-details">
                <BsCalendarCheck /> Today, 03:00 PM TO 04:00 PM EST
              </p>
              <p className="job-details">
                <BsListStars /> Mode: Video
              </p>
              <p className="job-details">
                <BsPersonBoundingBox /> Interviewer: iswatirupatirao@gmail.com
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className={"mb-2 card-border-custom upcomming-card"}>
        <CardBody>
          <Row>
            <Col md="12">
              <Row className="mb-2">
                <Col md="7">
                  <div className="job-title">Rajesh Kumar</div>
                  <div className="muted-name">rajkumar@gmail.com</div>
                </Col>
                <Col md="5">
                  <div className="mb-2 me-2 badge bg-warning float-end badge-custom">
                    Awaiting confirmation
                  </div>
                </Col>
              </Row>
              <p className="job-details">
                <BsPersonCheck /> Job title: Java Developer, Shelton, CT, 06611
              </p>
              <p className="job-details">
                <BsCalendarCheck /> Today, 05:00 PM TO 05:30 PM EST
              </p>
              <p className="job-details">
                <BsListStars /> Mode: Phone
              </p>
              <p className="job-details">
                <BsPersonBoundingBox /> Interviewer: mikegins@gmail.com
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
