import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import "./job.scss";
import logo from "../../assets/utils/images/panther-logo.png";
import { FiMapPin } from "react-icons/fi";
import { BsBriefcase, BsListStars, BsFillFlagFill } from "react-icons/bs";
import moment from "moment/moment";

export function JobCard({
  name,
  customer,
  minExperience,
  maxExperience,
  location,
  description,
  createdDate,
  role,
  jobId,
  typeId,
  // getSelectedJobId,
}) {
  // const navigateToJobDetail = (selectedJobId) => {
  //   getSelectedJobId(selectedJobId);
  // };
  return (
    <>
      <Card
        className="mb-2"
        // onClick={navigateToJobDetail(jobId)}
      >
        <CardBody>
          <Row>
            <Col md="12">
              <Row className="mb-2">
                <Col md="7">
                  {" "}
                  <div className="job-title">{name}</div>
                  <div className="muted-name">Saisystems Technology</div>
                </Col>
                <Col>
                  <img
                    src={logo}
                    alt="logo"
                    className="float-end display-logo"
                  />
                </Col>
              </Row>
              <p className="job-details">
                <FiMapPin /> {location}
              </p>
              <p className="job-details">
                <BsBriefcase /> Work Experience : {minExperience}-
                {maxExperience} Years
              </p>
              <p className="job-details">
                <BsListStars /> Skills: Core Java, Spring Boot, Microservice,
                Kaf...
              </p>
              <p className="job-details mt-2">
                <BsFillFlagFill /> Highly Recommended
              </p>
              <div className="muted-name mt-2">
                Posted {moment(createdDate).fromNow()}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
