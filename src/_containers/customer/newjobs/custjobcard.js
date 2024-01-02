import React from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { FiMapPin } from "react-icons/fi";
import {
  IoIosCheckmark,
  IoIosClose,
  IoIosThumbsUp,
  IoIosHelp,
} from "react-icons/io";
import { BsBriefcase, BsListStars, BsFillFlagFill } from "react-icons/bs";
import moment from "moment/moment";
import customerIcons from "../../../assets/utils/images/customer";
import { getTimezoneDateTimeForNow } from "_helpers/helper";
import "../../../_components/job/job.scss";

export function CustJobCard({
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
  if (additionalData?.jobKeyQualificationDtos?.length > 0) {
    let skillsList = [];
    additionalData.jobKeyQualificationDtos.forEach((element) => {
      let skillName = element.skillname == null ? "-" : element.skillname;
      skillsList.push(skillName);
    });
    skillsData = skillsList.toString().replace(/,/g, ", ");
    skillsData =
      skillsData.length > 35 ? skillsData.slice(0, 35 - 1) + "…" : skillsData;
  }

  const renderStatusIcon = (data) => {
    if (data.isclosed) {
      return (
        <div className="float-end">
          {" "}
          <img src={customerIcons.closed_ic} alt="closed icon"></img>{" "}
          <img src={customerIcons.closed} alt="closed text"></img>
        </div>
      );
    } else if (data.isdraft) {
      return (
        <div className="float-end">
          {" "}
          <img src={customerIcons.draft_ic} alt="draft icon"></img>{" "}
          <img src={customerIcons.draft} alt="darft text"></img>
        </div>
      );
    } else {
      return (
        <div className="float-end">
          {" "}
          <img src={customerIcons.publish_ic} alt="publish icon"></img>{" "}
          <img src={customerIcons.publish} alt="publish text"></img>
        </div>
      );
    }
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
                <Col md={12} lg={7}>
                  <div className="job-title">{name}</div>
                  <div className="muted-name">{customer}</div>
                  {additionalData?.subsidiaryid !== 0 && (
                    <div className="muted-name">
                      {additionalData?.subsidiaryname}
                    </div>
                  )}
                </Col>
                <Col md={12} lg={5}>
                  {renderStatusIcon(additionalData)}
                </Col>
              </Row>
              <p className="job-details">
                <FiMapPin /> {location}
              </p>
              <p className="job-details">
                <BsBriefcase /> Work Experience:{" "}
                {additionalData?.jobExperienceScheduleDtos &&
                additionalData?.jobExperienceScheduleDtos[0]?.experiencelevel
                  ? additionalData?.jobExperienceScheduleDtos[0]
                      ?.experiencelevel
                  : "-"}
              </p>
              <p className="job-details">
                <BsListStars /> Skills:{" "}
                {additionalData?.jobKeyQualificationDtos &&
                additionalData?.jobKeyQualificationDtos?.length > 0
                  ? skillsData
                  : "-"}
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
              <Row>
                <Col md={12} lg={9}>
                  <div className="muted-name mt-2">
                    Posted {getTimezoneDateTimeForNow(moment(createdDate))}
                  </div>
                </Col>
                <Col md={12} lg={3} className="mt-2 right-align"></Col>
              </Row>
              {type === "Candidate" && (
                <>
                  <Button
                    title="liked"
                    className=" btn-icon mt-2"
                    color="light"
                  >
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

                  <Button title="Apply" className=" btn-icon" color="light">
                    <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
