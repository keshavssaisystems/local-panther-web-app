import React from "react";
import { Row, Col, Card, CardBody, Button, CardFooter, ButtonGroup } from "reactstrap";
import "./job.scss";
import logo from "../../assets/utils/images/panther-logo.png";
import { FiMapPin } from "react-icons/fi";

import {
  BsBriefcase,
  BsListStars,
  BsFillFlagFill,
  BsHandThumbsUp,
  BsFillHandThumbsUpFill,
  BsQuestionCircle,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";


import moment from "moment/moment";
import { useDispatch } from "react-redux";

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
  customer,
  additionalData,
}) {
  const dispatch = useDispatch();
  let recommendedLevel =
    additionalData.avgscore === 10
      ? 1
      : additionalData.avgscore === 9 || additionalData.avgscore === 8
        ? 2
        : 3;
  const navigateToJobDetail = () => {
    getSelectedJobId(jobId);
  };
  let skillsData = "-";
  if (additionalData?.jobSkillDtos?.length > 0) {
    let skillsList = [];
    additionalData?.jobSkillDtos?.forEach((element) => {
      let skillName = element.skillname == null ? "-" : element.skillname;
      skillsList.push(skillName);
    });
    skillsData = skillsList.toString();
    skillsData =
      skillsData.length > 35 ? skillsData.slice(0, 35 - 1) + "…" : skillsData;
  }

  const handleLike = (jobId) => {
    console.log('jobId :>> ', jobId);
    dispatch()
  }
  
  const handleMayBe = (jobId) => {
    console.log('jobId :>> ', jobId);
    dispatch()
  }
  
  const handleApply = (jobId) => {
    console.log('jobId :>> ', jobId);
    dispatch()
  }

  const handleReject = () => {

  }

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
                  <div className="muted-name">{customer}</div>
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
                <FiMapPin /> {location}
              </p>
              <p className="job-details">
                <BsBriefcase /> Work Experience: {minExperience}-{maxExperience}{" "}
                Years
              </p>
              <p className="job-details">
                <BsListStars /> Skills:{" "}
                {additionalData.jobSkillDtos?.length > 0 ? skillsData : "-"}
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
                    {additionalData.iscandidateliked === false && (
                      <BsHandThumbsUp />
                    )}
                    {additionalData.iscandidateliked === true && (
                      <BsFillHandThumbsUpFill />
                    )}
                  </p>
                )}
              </div>
              
            </Col>
          </Row>
        </CardBody>        
        {type === "Candidate" && (
          <>
            <CardFooter className="auto-margin">
              <Row noGutters>
                <ButtonGroup className="card-btn-grp" size="sm">
                  <Button
                    outline
                    title="liked"
                    className="btn-icon"
                    color="primary"
                    size="sm"
                    onClick={() => handleLike(jobId)}
                  >
                    Like <BsHandThumbsUp />
                  </Button>

                  <Button
                    outline
                    title="maybe"
                    className="btn-icon"
                    color="primary"
                    size="sm"
                    onClick={() => handleMayBe(jobId)}
                  >
                    Maybe <BsQuestionCircle />
                  </Button>

                  <Button
                    outline
                    title="reject"
                    className="btn-icon"
                    color="primary"
                    size="sm"
                  >
                    Reject <BsXCircle />
                  </Button>

                  <Button
                    outline
                    title="schedule"
                    className="btn-icon"
                    color="primary"
                    size="sm"
                    onClick={() => handleApply(jobId)}
                  >
                    Apply <BsCheckCircle />
                  </Button>
                </ButtonGroup>
              </Row>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );
}
