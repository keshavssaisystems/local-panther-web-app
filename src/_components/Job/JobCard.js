import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import "./job.scss";
import logo from "../../assets/utils/images/panther-logo.png";
import { FiMapPin } from "react-icons/fi";
import {
  BsBriefcase,
  BsListStars,
  BsFillFlagFill,
  BsHandThumbsUp,
} from "react-icons/bs";
import moment from "moment/moment";

export function JobCard({
  name,
  minExperience,
  maxExperience,
  location,
  createdDate,
  jobId,
  type,
  getSelectedJobId,
  selectedJob,
}) {
  let recommendedLevel = 2;
  const navigateToJobDetail = () => {
    getSelectedJobId(jobId);
  };
  return (
    <>
      <Card
        className={selectedJob === jobId ? "mb-2 card-border-custom" : "mb-2"}
        onClick={() => navigateToJobDetail()}
      >
        <CardBody>
          <Row>
            <Col md="12">
              <Row className="mb-2">
                <Col md="7">
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
                <BsListStars /> Skills: Core Java, Spring Boot, Mic...
              </p>
              {type === "Recommended" && (
                <p className="job-details mt-2 recommended-success float-end">
                  Applicants: 101
                </p>
              )}
              {recommendedLevel === 1 && type === "Recommended" && (
                <p className="job-details mt-2 recommended-success">
                  <BsFillFlagFill /> Most Recommended
                </p>
              )}
              {recommendedLevel === 2 && type === "Recommended" && (
                <p className="job-details mt-2 recommended-warning">
                  <BsFillFlagFill /> Medium Recommended
                </p>
              )}
              {recommendedLevel === 3 && type === "Recommended" && (
                <p className="job-details mt-2 recommended-danger">
                  <BsFillFlagFill /> Least Recommended
                </p>
              )}
              <div className="muted-name mt-2">
                Posted {moment(createdDate).fromNow()}
                {type === "Recommended" && (
                  <p className="thumb-icon float-end">
                    <BsHandThumbsUp />
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
