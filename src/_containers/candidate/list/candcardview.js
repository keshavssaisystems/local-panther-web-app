import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ButtonGroup,
  DropdownMenu,
  Dropdown,
  DropdownToggle,
} from "reactstrap";
import { FiMapPin } from "react-icons/fi";
import {
  BsBriefcase,
  BsListStars,
  BsFillFlagFill,
  BsHandThumbsUp,
  BsXCircle,
  BsQuestionCircle,
  BsCheckCircle,
  BsCashStack,
} from "react-icons/bs";
import moment from "moment/moment";
import "../../../_components/job/job.scss";
import "./candidatelist.scss";
import "./candcardview.scss";
import { ProgressCircle } from "_components/common/progress";
import { ScorePopup } from "_components/list/scorePopup";

export function CandCardView({
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
  onCandidateActions,
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

  const returnPayment = () => {
    if (
      additionalData?.jobPaymentBenefitDtos &&
      additionalData?.jobPaymentBenefitDtos[0]?.maximumamount &&
      additionalData?.jobPaymentBenefitDtos[0]?.minimumamount &&
      additionalData?.jobPaymentBenefitDtos[0]?.payperiodtype
    ) {
      return `$${new Intl.NumberFormat("en-US").format(
        additionalData.jobPaymentBenefitDtos[0].minimumamount
      )} - $${new Intl.NumberFormat("en-US").format(
        additionalData.jobPaymentBenefitDtos[0].maximumamount
      )} ${additionalData.jobPaymentBenefitDtos[0].payperiodtype}`;
    } else if (
      additionalData?.jobPaymentBenefitDtos &&
      additionalData?.jobPaymentBenefitDtos[0]?.minimumamount
    ) {
      return `$${new Intl.NumberFormat("en-US").format(
        additionalData.jobPaymentBenefitDtos[0].minimumamount
      )}`;
    } else if (
      additionalData?.jobPaymentBenefitDtos &&
      additionalData?.jobPaymentBenefitDtos[0]?.maximumamount
    ) {
      return `$${new Intl.NumberFormat("en-US").format(
        additionalData.jobPaymentBenefitDtos[0].maximumamount
      )}`;
    }
  };

  const onBtnClick = (type) => {
    onCandidateActions(type, additionalData.candidaterecommendedjobid);
  };
  const [button, setButton] = useState(false);
  return (
    <>
      <div className="cand-card-view">
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
                  <Col className="right-align">
                    {additionalData.avgscore ? (
                      <>
                        <Dropdown
                          className="d-inline-block"
                          onMouseOver={(e) => setButton(true)}
                          onMouseLeave={(e) => setButton(false)}
                          isOpen={button}
                          toggle={(e) => setButton(!button)}
                          direction="end"
                        >
                          <DropdownToggle color="link">
                            <ProgressCircle
                              avgscore={additionalData?.avgscore}
                            />
                          </DropdownToggle>
                          <DropdownMenu>
                            <ScorePopup
                              scoreJson={additionalData?.scorejson
                                ?.replace(/'/g, '"')
                                .replace(/candidate"s/g, "candidate's")}
                            />
                          </DropdownMenu>
                        </Dropdown>
                      </>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
                <p className="job-details">
                  <Row>
                    <Col md="1" lg="1">
                      <FiMapPin />
                    </Col>
                    <Col md="11" lg="11">
                      {location}
                    </Col>
                  </Row>
                </p>
                <p className="job-details">
                  <Row>
                    <Col md="1" lg="1">
                      <BsBriefcase />
                    </Col>
                    <Col md="11" lg="11">
                      <b>Work Experience</b>
                      <p>
                        {additionalData?.jobExperienceScheduleDtos &&
                        additionalData?.jobExperienceScheduleDtos[0]
                          ?.experiencelevel
                          ? additionalData?.jobExperienceScheduleDtos[0]
                              ?.experiencelevel
                          : "-"}
                      </p>
                    </Col>
                  </Row>
                </p>
                <p className="job-details">
                  <Row>
                    <Col md="1" lg="1">
                      <BsListStars />
                    </Col>
                    <Col md="11" lg="11">
                      <b>Skills</b>
                      <p>
                        {additionalData?.jobKeyQualificationDtos &&
                        additionalData?.jobKeyQualificationDtos?.length > 0
                          ? skillsData
                          : "-"}
                      </p>
                    </Col>
                  </Row>
                </p>
                <p className="job-details">
                  <Row>
                    <Col md="1" lg="1">
                      <BsCashStack />{" "}
                    </Col>
                    <Col md="11" lg="11">
                      <b>Pay</b> <p>{returnPayment()}</p>
                    </Col>
                  </Row>
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
                  <Col md={12} lg={12}>
                    <div className="muted-name mt-2">
                      Posted {moment(createdDate).fromNow()}
                    </div>
                  </Col>
                </Row>

                <Row noGutters className="mt-2">
                  <ButtonGroup className="card-btn-grp" size="sm">
                    {/* <Button
                      outline
                      title="liked"
                      className="btn-icon mb-1"
                      color="primary"
                      size="sm"
                      onClick={() => onBtnClick("liked")}
                    >
                      Like <BsHandThumbsUp></BsHandThumbsUp>
                    </Button> */}

                    <Button
                      outline
                      title="Maybe"
                      className="btn-icon mb-1"
                      color="primary"
                      size="sm"
                      onClick={() => onBtnClick("maybe")}
                    >
                      Maybe <BsQuestionCircle></BsQuestionCircle>
                    </Button>

                    <Button
                      outline
                      title="Reject"
                      className="btn-icon mb-1"
                      color="primary"
                      onClick={() => onBtnClick("rejected")}
                      size="sm"
                    >
                      Reject <BsXCircle></BsXCircle>
                    </Button>

                    <Button
                      outline
                      title="Apply"
                      className="btn-icon mb-1"
                      color="primary"
                      size="sm"
                      onClick={() => onBtnClick("applied")}
                    >
                      Apply <BsCheckCircle />
                    </Button>
                  </ButtonGroup>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
