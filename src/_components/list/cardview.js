import React from "react";
import { Card, CardBody, CardFooter, Row, Col } from "reactstrap";
import {
  IoIosCheckmark,
  IoIosClose,
  IoIosThumbsUp,
  IoIosHelp,
  IoIosInformation,
  IoIosMail,
  IoIosContact,
  IoIosBriefcase,
  IoIosStar,
  IoIosAlbums,
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
      <CardFooter>
        <Row>
          <Col>
            <IoIosCheckmark fontSize={"32px"}></IoIosCheckmark>
          </Col>
          <Col>
            <IoIosClose fontSize={"32px"}></IoIosClose>
          </Col>
          <Col>
            <IoIosThumbsUp fontSize={"32px"}></IoIosThumbsUp>
          </Col>
          <Col>
            <IoIosHelp fontSize={"32px"}></IoIosHelp>
          </Col>
          <Col>
            <IoIosInformation fontSize={"32px"}></IoIosInformation>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};
