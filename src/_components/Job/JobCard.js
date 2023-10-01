import React from "react";
import { Row, Col, Card, CardBody,Button } from "reactstrap";
import "./job.scss";
import logo from "../../assets/utils/images/panther-logo.png";
import { FiMapPin } from "react-icons/fi";
import {
  IoIosCheckmark,
  IoIosClose,
  IoIosThumbsUp,
  IoIosHelp,

} from "react-icons/io";
import {
  BsBriefcase,
  BsListStars,
  BsFillFlagFill,
  BsHandThumbsUp,
  BsFillHandThumbsUpFill,
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
  customer,
  additionalData,
}) {
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
  if (additionalData.jobSkillDtos.length > 0) {
    let skillsList = [];
    additionalData.jobSkillDtos.forEach((element) => {
      let skillName = element.skillname == null ? "-" : element.skillname;
      skillsList.push(skillName);
    });
    skillsData = skillsList.toString();
    skillsData =
      skillsData.length > 35 ? skillsData.slice(0, 35 - 1) + "…" : skillsData;
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
                {additionalData.jobSkillDtos.length > 0 ? skillsData : "-"}
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
              {type === "Candidate" && (
                <>



                  <Button title="liked" className=" btn-icon mt-2" color="light">
                    <IoIosThumbsUp fontSize={"24px"}></IoIosThumbsUp>
                  </Button>


                  <Button title="maybe" className=" btn-icon" color="light">
                    <IoIosHelp fontSize={"24px"}></IoIosHelp>
                  </Button>


                  <Button
                    title="reject"
                    className="btn-icon"
                    color="light"
                  // onClick={() => onRejectClick()}
                  >
                    <IoIosClose fontSize={"24px"}></IoIosClose>
                  </Button>



                  <Button
                    title="Apply"
                    className=" btn-icon"
                    color="light"
                  >
                    <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
                  </Button>
                </>)}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
