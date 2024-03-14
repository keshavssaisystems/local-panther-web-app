import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  CardFooter,
  UncontrolledTooltip,
} from "reactstrap";
import { HeadingAndDetailWithDiv } from "../../../_components/jobDetailComponents/HeadingAndDetailWithDiv";
import { HeadingAndDetailWithoutIcon } from "../../../_components/jobDetailComponents/HeadingAndDetailWithoutIcon";
import Loader from "react-loaders";
import customerIcons from "../../../assets/utils/images/customer";
import "../../../_components/job/job.scss";
import "./newjobs.scss";
import { FiMapPin, FiEdit, FiCheckSquare, FiXSquare } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector } from "react-redux";
import moment from "moment";
import { getTimezoneDateTime } from "_helpers/helper";
import publishedIcon from "assets/utils/images/job-detail-icons/published.svg";
import matchedIcon from "assets/utils/images/job-detail-icons/matched.svg";
import maybeIcon from "assets/utils/images/job-detail-icons/maybe.svg";
import likedIcon from "assets/utils/images/job-detail-icons/liked.svg";
import appliedIcon from "assets/utils/images/job-detail-icons/applied.svg";
import scheduledIcon from "assets/utils/images/job-detail-icons/scheduled.svg";
import offersIcon from "assets/utils/images/job-detail-icons/offers.svg";
import acceptedIcon from "assets/utils/images/job-detail-icons/accepted.svg";
import rejectedIcon from "assets/utils/images/job-detail-icons/rejected.svg";
import { ShareSocial } from "react-share-social";
import { CloseJobReasonPopup } from "./closeJobReasonPopup";

export function CustJobDetail({
  jobDetails,
  type,
  publishJob,
  closeJob,
  isModal = false,
  isShare = false,
  isAdmin = false,
}) {
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [closeConfirmation, setCloseConfirmation] = useState(false);
  const shiftsOption = useSelector((state) => state.dropdown.shift);
  const workScheduleOptions = useSelector(
    (state) => state.dropdown.workSchedule
  );
  const billingStatus = useSelector((state) => state?.payment?.showBilling);
  const jobTypeOption = useSelector((state) => state.dropdown.jobType);
  let loading = true;
  let jobDetail = {};
  let skillsData = "-";

  if (jobDetails.length > 0) {
    loading = false;
    jobDetail = jobDetails[0];
    if (
      jobDetail?.jobKeyQualificationDtos &&
      jobDetail?.jobKeyQualificationDtos?.length > 0
    ) {
      let skillsList = [];
      jobDetail?.jobKeyQualificationDtos.forEach((element) => {
        let skillName = element.skillname == null ? "-" : element.skillname;
        skillsList.push(skillName);
      });
      skillsData = skillsList.toString().replace(/,/g, ", ");
    }
  }

  const returnAddress = () => {
    if (jobDetail.cityname && jobDetail.statename && jobDetail.countryname) {
      return `${jobDetail.cityname}, ${jobDetail.statename}, ${jobDetail.countryname}`;
    } else if (jobDetail.cityname && jobDetail.statename) {
      return `${jobDetail.cityname}, ${jobDetail.statename}`;
    } else if (jobDetail.statename && jobDetail.countryname) {
      return `${jobDetail.statename}, ${jobDetail.countryname}`;
    } else if (jobDetail.cityname && jobDetail.countryname) {
      return `${jobDetail.cityname} , ${jobDetail.countryname}`;
    } else {
      return "";
    }
  };

  const returnPayment = () => {
    if (
      jobDetail?.jobPaymentBenefitDtos &&
      jobDetail?.jobPaymentBenefitDtos[0]?.maximumamount &&
      jobDetail?.jobPaymentBenefitDtos[0]?.minimumamount &&
      jobDetail?.jobPaymentBenefitDtos[0]?.payperiodtype
    ) {
      return `$${new Intl.NumberFormat("en-US").format(
        jobDetail.jobPaymentBenefitDtos[0].minimumamount
      )} - $${new Intl.NumberFormat("en-US").format(
        jobDetail.jobPaymentBenefitDtos[0].maximumamount
      )} ${jobDetail.jobPaymentBenefitDtos[0].payperiodtype}`;
    } else if (
      jobDetail?.jobPaymentBenefitDtos &&
      jobDetail?.jobPaymentBenefitDtos[0]?.minimumamount
    ) {
      return `$${new Intl.NumberFormat("en-US").format(
        jobDetail.jobPaymentBenefitDtos[0].minimumamount
      )}`;
    } else if (
      jobDetail?.jobPaymentBenefitDtos &&
      jobDetail?.jobPaymentBenefitDtos[0]?.maximumamount
    ) {
      return `$${new Intl.NumberFormat("en-US").format(
        jobDetail.jobPaymentBenefitDtos[0].maximumamount
      )}`;
    } else {
      return "-";
    }
  };

  const returnJobType = () => {
    let jobTypeString = [];
    if (
      jobDetail?.jobExperienceScheduleDtos &&
      jobDetail?.jobExperienceScheduleDtos[0]?.jobTypesDtos?.length > 0
    ) {
      return jobDetail?.jobExperienceScheduleDtos[0]?.jobTypesDtos
        .map((item) => item.jobtypes)
        .join(", ");
    } else if (
      jobDetail?.jobExperienceScheduleDtos[0]?.jobtypes !== "" &&
      jobDetail?.jobExperienceScheduleDtos[0]?.jobTypesDtos?.length === 0
    ) {
      jobTypeOption?.forEach((element) => {
        if (
          jobDetail?.jobExperienceScheduleDtos[0]?.jobtypes?.includes(
            element.id
          )
        ) {
          jobTypeString.push(element.name);
        }
      });
      return jobTypeString.toString();
    } else {
      return "";
    }
  };

  const returnShift = () => {
    let shiftString = [];

    if (
      jobDetail?.jobExperienceScheduleDtos &&
      jobDetail?.jobExperienceScheduleDtos[0]?.shiftsDtos?.length > 0
    ) {
      return jobDetail?.jobExperienceScheduleDtos[0]?.shiftsDtos
        .map((item) => item.shifts)
        .join(", ");
    } else if (
      jobDetail?.jobExperienceScheduleDtos[0].shifts !== "" &&
      jobDetail?.jobExperienceScheduleDtos[0]?.shiftsDtos?.length === 0
    ) {
      shiftsOption?.forEach((element) => {
        if (
          jobDetail?.jobExperienceScheduleDtos[0]?.shifts?.includes(element.id)
        ) {
          shiftString.push(element.name);
        }
      });
      return shiftString.toString();
    } else {
      return "-";
    }
  };

  const returnEducation = () => {
    if (jobDetail && jobDetail?.jobLevelofedulcationDtos?.length > 0) {
      return jobDetail?.jobLevelofedulcationDtos
        .map((item) => item.levelofeducation)
        .join(", ");
    } else {
      return "-";
    }
  };
  const returnStudy = () => {
    if (jobDetail && jobDetail?.jobFieldofstudyDtos?.length > 0) {
      return jobDetail?.jobFieldofstudyDtos
        .map((item) => item.fieldofstudy)
        .join(", ");
    } else {
      return "-";
    }
  };

  const returnSchedule = () => {
    let workScheduleString = [];
    if (
      jobDetail?.jobExperienceScheduleDtos &&
      jobDetail?.jobExperienceScheduleDtos[0]?.workSchedulesDtos?.length > 0
    ) {
      return jobDetail?.jobExperienceScheduleDtos[0]?.workSchedulesDtos
        .map((item) => item.workschedules)
        .join(", ");
    } else if (
      jobDetail?.jobExperienceScheduleDtos[0].workschedules !== "" &&
      jobDetail?.jobExperienceScheduleDtos[0]?.workSchedulesDtos?.length === 0
    ) {
      workScheduleOptions?.forEach((element) => {
        if (
          jobDetail?.jobExperienceScheduleDtos[0]?.workschedules?.includes(
            element.id
          )
        ) {
          workScheduleString.push(element.name);
        }
      });
      return workScheduleString.toString();
    } else {
      return "-";
    }
  };

  const returnAdditionalCriteria = () => {
    if (
      jobDetail?.jobKeyQualificationDtos &&
      jobDetail?.jobKeyQualificationDtos?.length > 0
    ) {
      return (
        <ul>
          {jobDetail?.jobKeyQualificationDtos.map((item) => (
            <li key={item.skillid}>
              <Row>
                <Col md={9} lg={9}>
                  {item.skillname}
                </Col>
                <Col md={3} lg={3} className="right-align">
                  {item.isrequired ? (
                    <img
                      src={customerIcons.green_check}
                      alt="green check"
                    ></img>
                  ) : (
                    <img
                      src={customerIcons.yellow_check}
                      alt="yellow check"
                    ></img>
                  )}
                </Col>
              </Row>
            </li>
          ))}
        </ul>
      );
    } else {
      return "";
    }
  };

  const returnPrescreenInfo = () => {
    if (
      jobDetail?.jobPrescreenApplicationDtos &&
      jobDetail?.jobPrescreenApplicationDtos?.length > 0
    ) {
      return (
        <ul>
          {jobDetail?.jobPrescreenApplicationDtos.map((item) => (
            <li key={item.jobprescreenapplicationid}>
              {item.prescreenquestion}
            </li>
          ))}
        </ul>
      );
    } else {
      return "";
    }
  };
  const steps = [
    {
      name: "Published",
      count: getTimezoneDateTime(
        jobDetail?.publisheddate === null
          ? jobDetail?.jobcreatedatetime
          : jobDetail?.publisheddate,
        "MM/DD/YYYY"
      ),
      icon: publishedIcon,
    },
    {
      name: "Matched",
      count:
        jobDetail.totalRecommendedCandidates === null
          ? 0
          : jobDetail.totalRecommendedCandidates,
      action: `/customer-candidate-matched/${jobDetails[0]?.jobid}`,
      icon: matchedIcon,
    },
    {
      name: "Maybe",
      count:
        jobDetail.totalMaybeCandidates === null
          ? 0
          : jobDetail.totalMaybeCandidates,
      action: `/customer-candidate-maybe/${jobDetails[0]?.jobid}`,
      icon: maybeIcon,
    },
    {
      name: "Liked",
      count:
        jobDetail.totalLikedCandidates === null
          ? 0
          : jobDetail.totalLikedCandidates,
      action: `/customer-candidate-liked/${jobDetails[0]?.jobid}`,
      icon: likedIcon,
    },
    {
      name: "Applied",
      count:
        jobDetail.totalAppliedCandidates === null
          ? 0
          : jobDetail.totalAppliedCandidates,
      action: `/customer-candidate-applied/${jobDetails[0]?.jobid}`,
      icon: appliedIcon,
    },
    {
      name: "Scheduled",
      count:
        jobDetail.totalScheduledCandidates === null
          ? 0
          : jobDetail.totalScheduledCandidates,
      action: `/customer-candidate-scheduled/${jobDetails[0]?.jobid}`,
      icon: scheduledIcon,
    },
    {
      name: "Offer",
      count:
        jobDetail.totalOfferedCandidates === null
          ? 0
          : jobDetail.totalOfferedCandidates,
      action: `/customer-candidate-offers/${jobDetails[0]?.jobid}`,
      icon: offersIcon,
    },
    {
      name: "Accepted",
      count:
        jobDetail.totalAcceptedCandidates === null
          ? 0
          : jobDetail.totalAcceptedCandidates,
      action: `/customer-candidate-accepted/${jobDetails[0]?.jobid}`,
      icon: acceptedIcon,
    },
    {
      name: "Rejected",
      count:
        jobDetail.totalRejectedCandidates === null
          ? 0
          : jobDetail.totalRejectedCandidates,
      action: `/customer-candidate-rejected/${jobDetails[0]?.jobid}`,
      icon: rejectedIcon,
    },
  ];

  const renderSteps = () => {
    return steps.map((s, i) => (
      <li className="form-wizard-step-done" key={i} value={i}>
        <span className="count-details">{steps[i].count}</span>
        <em></em>
        <span onClick={(e) => navigateTo(steps[i].action)}>
          {steps[i].name}
        </span>
        <div className="">
          <img
            src={steps[i].icon}
            alt="interview-icon"
            onClick={(e) => navigateTo(steps[i].action)}
          />
        </div>
      </li>
    ));
  };
  const navigate = useNavigate();
  const navigateTo = (action) => {
    navigate(action);
  };
  return (
    <>
      <Col md="12" lg="12" className="job-detail-cont">
        {loading === true && (
          <Loader
            type="line-scale-pulse-out-rapid"
            className="d-flex justify-content-center"
          />
        )}
        {loading === false && (
          <Card className="card-shadow-primary profile-responsive card-border mb-3">
            <div className="dropdown-menu-header">
              <div className="dropdown-menu-header-inner heading-background">
                <Row>
                  <Col md={8} lg={8}>
                    <div className="menu-header-content btn-pane-right text-start">
                      <div>
                        <h5 className="menu-header-title job-title-details">
                          {jobDetail.jobtitle}
                        </h5>
                        <p className="mb-0 mt-0">
                          {jobDetail.companyname}
                          {jobDetail?.subsidiaryid !== undefined &&
                          jobDetail?.subsidiaryid !== 0
                            ? " (" + jobDetail?.subsidiaryname + ")"
                            : ""}
                        </p>

                        <p className="mb-0 mt-0">
                          <FiMapPin className="muted-icon" /> {returnAddress()}
                        </p>
                      </div>
                    </div>
                  </Col>

                  {!isAdmin ? (
                    <>
                      {jobDetail.isdraft && !isShare ? (
                        <Col md={12} lg={4} className="right-align">
                          <Button
                            color="primary"
                            className={"me-1 mt-3"}
                            onClick={(e) =>
                              navigate(`/customer-edit-job/${jobDetail.jobid}`)
                            }
                          >
                            <FiEdit className="mb-1" /> Edit job
                          </Button>
                          {billingStatus === true && (
                            <Button
                              color="primary"
                              className={"me-3 mt-3"}
                              onClick={(e) => {
                                setPublishSuccess(true);
                                publishJob(jobDetail.jobid);
                              }}
                            >
                              <FiCheckSquare className="mb-1" /> Publish job
                            </Button>
                          )}
                          {billingStatus === false && (
                            <>
                              <Button
                                color="primary"
                                className={"me-3 mt-3 btn-mute"}
                                id="publishButton"
                              >
                                <FiCheckSquare className="mb-1" /> Publish job
                              </Button>
                              <UncontrolledTooltip
                                placement="bottom"
                                target={"publishButton"}
                              >
                                Please add billing details to publish job
                              </UncontrolledTooltip>
                            </>
                          )}
                        </Col>
                      ) : (
                        <></>
                      )}
                      {jobDetail.isdraft === false &&
                        jobDetail.isclosed === false &&
                        !isShare && (
                          <Col md={4} lg={4} className="right-align">
                            <Button
                              color="danger"
                              className={"me-3 mt-3"}
                              onClick={(e) => {
                                setCloseConfirmation(true);
                              }}
                            >
                              <FiXSquare className="mb-1" /> Close job
                            </Button>
                          </Col>
                        )}
                      {jobDetail.isclosed === true && !isShare && (
                        <Col md={4} lg={4} className="right-align">
                          <div className="mb-1 me-3 mt-2 badge bg-danger text-normal">
                            Job closed
                          </div>
                          {jobDetail?.closedjobreasonid !== 0 && (
                            <div className="me-3">
                              <b>Reason -</b> {jobDetail?.closedjobreason}
                            </div>
                          )}
                        </Col>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </Row>
              </div>
            </div>
            {type === "Open" && jobDetail.isdraft === false && (
              <div className="forms-wizard-alt ms-3 me-3">
                <ol className="forms-wizard">{renderSteps()}</ol>
              </div>
            )}
            <div className="heading-title">
              <h6 className="job-main-heading mb-0">Job Details</h6>
            </div>
            <HeadingAndDetailWithDiv
              heading={"Job type"}
              detail={returnJobType()}
              iconId={5}
            />
            <HeadingAndDetailWithDiv
              heading={"Job location"}
              detail={
                jobDetail?.joblocation === "" ? "-" : jobDetail?.joblocation
              }
              iconId={5}
            />
            <HeadingAndDetailWithDiv
              heading={"Shift & schedule"}
              detail={returnShift() + ", " + returnSchedule()}
              iconId={3}
            />

            <HeadingAndDetailWithDiv
              heading={"Pay"}
              detail={returnPayment()}
              iconId={7}
            />
            <HeadingAndDetailWithDiv
              heading={"Skills"}
              detail={skillsData}
              iconId={4}
            />
            <HeadingAndDetailWithDiv
              heading={"Experience"}
              detail={
                jobDetail?.jobExperienceScheduleDtos &&
                jobDetail?.jobExperienceScheduleDtos[0]?.experiencelevel
                  ? jobDetail?.jobExperienceScheduleDtos[0]?.experiencelevel
                  : "-"
              }
              iconId={9}
            />
            <HeadingAndDetailWithDiv
              heading={"No of openings"}
              detail={jobDetail.noofopenposition}
              iconId={6}
            />
            <HeadingAndDetailWithDiv
              heading={"Hiring timeline"}
              detail={
                jobDetail?.jobExperienceScheduleDtos &&
                jobDetail?.jobExperienceScheduleDtos[0]?.hiringtimeline
                  ? jobDetail?.jobExperienceScheduleDtos[0]?.hiringtimeline
                  : ""
              }
              iconId={8}
            />
            <HeadingAndDetailWithDiv
              heading={"Address"}
              detail={
                jobDetail?.locationaddress === ""
                  ? "-"
                  : jobDetail?.locationaddress
              }
              iconId={10}
            />
            <HeadingAndDetailWithDiv
              heading={"Level of education"}
              detail={returnEducation()}
              iconId={11}
            />
            <HeadingAndDetailWithDiv
              heading={"Field of study"}
              detail={returnStudy()}
              iconId={13}
            />
            <HeadingAndDetailWithDiv
              heading={"Certifications"}
              detail={
                jobDetail?.certifications === ""
                  ? "-"
                  : jobDetail?.certifications
              }
              iconId={12}
            />
            <HeadingAndDetailWithDiv
              heading={"Authorized to work in United States"}
              detail={jobDetail.authorizedtoworkinus === true ? "Yes" : "No"}
              iconId={9}
            />
            <HeadingAndDetailWithDiv
              heading={"Willing to sponsor"}
              detail={jobDetail.sponsorshiprequiured === true ? "Yes" : "No"}
              iconId={9}
            />
            <HeadingAndDetailWithDiv
              heading={"Security clearance required"}
              detail={
                jobDetail?.issecurityclearancerequired === true ? "Yes" : "No"
              }
              iconId={14}
            />
            {jobDetail?.issecurityclearancerequired === true && (
              <HeadingAndDetailWithDiv
                heading={"Security clearance"}
                detail={jobDetail?.securityclearance}
                iconId={14}
              />
            )}
            <HeadingAndDetailWithoutIcon
              heading={"Job description"}
              detail={jobDetail.description}
            />
            <HeadingAndDetailWithoutIcon
              heading={"About company"}
              detail={jobDetail.companydetails}
            />
            <HeadingAndDetailWithoutIcon
              heading={"Benefits"}
              detail={
                jobDetail?.jobPaymentBenefitDtos &&
                jobDetail?.jobPaymentBenefitDtos[0]?.benefits
                  ? jobDetail?.jobPaymentBenefitDtos[0]?.benefits
                  : ""
              }
            />
            {jobDetail?.jobKeyQualificationDtos &&
            jobDetail?.jobKeyQualificationDtos?.length > 0 ? (
              <>
                <HeadingAndDetailWithoutIcon
                  heading={"Additional crieteria for the role"}
                  detail={
                    jobDetail?.jobKeyQualificationDtos &&
                    jobDetail?.jobKeyQualificationDtos?.length > 0
                      ? returnAdditionalCriteria()
                      : ""
                  }
                  type={"list"}
                />
              </>
            ) : (
              <></>
            )}
            {jobDetail?.jobPrescreenApplicationDtos &&
            jobDetail?.jobPrescreenApplicationDtos?.length > 0 ? (
              <>
                <HeadingAndDetailWithoutIcon
                  heading={"Pre-screen applicants"}
                  detail={
                    jobDetail?.jobPrescreenApplicationDtos &&
                    jobDetail?.jobPrescreenApplicationDtos?.length > 0
                      ? returnPrescreenInfo()
                      : ""
                  }
                  type={"list"}
                />
              </>
            ) : (
              <></>
            )}
            {/* {!isModal ? (
              <CardFooter>
                Share:{" "}
                <ShareSocial
                  url={
                    window.location.origin +
                    "/job-detail/" +
                    window.btoa(encodeURIComponent(jobDetail?.jobid))
                  }
                  socialTypes={["linkedin", "facebook", "twitter"]}
                  style={{
                    copyContainer: {
                      display: "none",
                    },
                    root: {
                      padding: "0px",
                    },
                    title: {
                      padding: "0px",
                    },
                  }}
                />
              </CardFooter>
            ) : (
              <></>
            )} */}
            {isShare ? (
              <>
                <CardFooter>
                  <div
                    style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}
                  >
                    <span className="me-2"> For more details :</span>{" "}
                    <Link to="/login">
                      {" "}
                      <Button color="primary" className="me-2">
                        Sign in
                      </Button>
                    </Link>
                    <Link to="/registration">
                      <Button>Register</Button>
                    </Link>
                  </div>
                </CardFooter>
              </>
            ) : (
              <></>
            )}
          </Card>
        )}
      </Col>
      {publishSuccess === true && (
        <SweetAlert
          success
          title="Job published successfully!"
          onConfirm={(e) => setPublishSuccess(false)}
        ></SweetAlert>
      )}
      {closeConfirmation === true && (
        <CloseJobReasonPopup
          isOpen={closeConfirmation}
          onClose={() => setCloseConfirmation(false)}
          title={jobDetail?.jobtitle}
          jobid={jobDetail?.jobid}
          setCloseJob={(e) => closeJob(e)}
        />
      )}
    </>
  );
}
