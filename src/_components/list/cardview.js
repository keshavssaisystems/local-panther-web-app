import React from "react";
import { Card, CardBody, CardFooter, Row, Col, Button } from "reactstrap";
import {
  IoIosCheckmark,
  IoIosClose,
  IoIosThumbsUp,
  IoIosHelp,
  IoIosMail,
  IoIosContact,
  IoIosBriefcase,
  IoIosStar,
  IoIosAlbums,
  IoIosTime,
} from "react-icons/io";
export const CandidateCardView = (props) => {
  return (
    <Card className="main-card mb-3">
      <CardBody>
        <Row>
          <Col className="col-12">
            <IoIosAlbums fontSize={"16px"}></IoIosAlbums> <b> Profile:</b>{" "}
            {props?.data?.primaryskills}
          </Col>
          <Col className="col-12">
            <IoIosContact fontSize={"16px"}></IoIosContact>
            <b>Name:</b>
            {props?.data?.firstname + "  " + props?.data?.lastname}
          </Col>
          <Col className="col-12">
            <IoIosBriefcase fontSize={"16px"}></IoIosBriefcase>
            <b>Experience:</b>
            {props?.data?.experienceyears}
          </Col>
          <Col className="col-12">
            <IoIosStar fontSize={"16px"}></IoIosStar>
            <b>Skills:</b>
            {props?.data?.secondaryskills}
          </Col>
          <Col className="col-12">
            <IoIosMail fontSize={"16px"}></IoIosMail>
            <b>Email:</b>
            {props?.data?.email}
          </Col>
        </Row>
      </CardBody>
      <CardFooter className="auto-margin">
        <Row xs={5} sm={5} md={5} lg={5} xl={5} noGutters>
          <Col>
            <Button title="accept" className=" btn-icon" color="primary">
              <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
            </Button>
          </Col>
          <Col>
            <Button title="reject" className="btn-icon" color="primary">
              <IoIosClose fontSize={"24px"}></IoIosClose>
            </Button>
          </Col>
          <Col>
            <Button title="liked" className=" btn-icon" color="primary">
              <IoIosThumbsUp fontSize={"24px"}></IoIosThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button title="maybe" className=" btn-icon" color="primary">
              <IoIosHelp fontSize={"24px"}></IoIosHelp>
            </Button>
          </Col>
          <Col>
            <Button
              title="schedule"
              className="mb-2 me-2 btn-icon"
              color="primary"
            >
              <IoIosTime fontSize={"24px"}></IoIosTime>
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};
