import React, { useState } from "react";
import { Card, Col, Row, Button } from "reactstrap";
import { HeadingAndDetailWithDiv } from "../../../_components/jobDetailComponents/HeadingAndDetailWithDiv";
import { HeadingAndDetailWithoutIcon } from "../../../_components/jobDetailComponents/HeadingAndDetailWithoutIcon";
import { ButtonWithCount } from "../../../_components/jobDetailComponents/ButtonWithCount";
import Loader from "react-loaders";
import customerIcons from "../../../assets/utils/images/customer";
import "../../../_components/job/job.scss";
import "./newjobs.scss";
import { FiMapPin, FiEdit, FiCheckSquare, FiXSquare } from "react-icons/fi";
import {
  FaUsers,
  FaUserClock,
  FaUserCheck,
  FaUserTimes,
  FaLeanpub,
  FaUserTie,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector } from "react-redux";
import moment from "moment";
import { getTimezoneDateTime } from "_helpers/helper";

export function CustJobDetail({ jobDetails, type, publishJob, closeJob }) {
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [closeConfirmation, setCloseConfirmation] = useState(false);
  const shiftsOption = useSelector((state) => state.dropdown.shift);
  const workScheduleOptions = useSelector(
    (state) => state.dropdown.workSchedule
  );
  const jobTypeOption = useSelector((state) => state.dropdown.jobType);
  let loading = true;
  let jobDetail = {};
  let skillArray = [];
  let skillsData = "-";

  if (jobDetails.length > 0) {
    loading = false;
    jobDetail = jobDetails[0];
    // jobDetail?.jobKeyQualificationDtos !== undefined &&
    //   jobDetail?.jobKeyQualificationDtos.map((skills) =>
    //     skillArray.push(skills.skillname)
    //   );
    if (
      jobDetail?.jobKeyQualificationDtos &&
      jobDetail?.jobKeyQualificationDtos?.length > 0
    ) {
      let skillsList = [];
      jobDetail?.jobKeyQualificationDtos.forEach((element) => {
        let skillName = element.skillname == null ? "-" : element.skillname;
        skillsList.push(skillName);
      });
      skillsData = skillsList.toString();
    }
  }

  const returnAddress = () => {
    if (jobDetail.cityname && jobDetail.statename && jobDetail.countryname) {
      return `${jobDetail.cityname} ,${jobDetail.statename}, ${jobDetail.countryname}`;
    } else if (jobDetail.cityname && jobDetail.statename) {
      return `${jobDetail.cityname} ,${jobDetail.statename}`;
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
        moment(
          jobDetail?.publisheddate === null
            ? jobDetail?.jobcreatedatetime
            : jobDetail?.publisheddate
        ).format("YYYY-MM-DD"),
        "MM/DD/YYYY"
      ),
      icon: <FaLeanpub className="img-fluid " size={"35px"} />,
    },
    {
      name: "Matched",
      count:
        jobDetail.totalRecommendedCandidates === null
          ? 0
          : jobDetail.totalRecommendedCandidates,
      action: `/customer-candidate-matched/${jobDetails[0]?.jobid}`,
      icon: <FaUsers className="img-fluid " size={"35px"} />,
    },
    {
      name: "Maybe",
      count: 0,
      action: `/customer-candidate-maybe/${jobDetails[0]?.jobid}`,
      icon: <FaUsers className="img-fluid " size={"35px"} />,
    },
    {
      name: "Liked",
      count:
        jobDetail.totalLikedCandidates === null
          ? 0
          : jobDetail.totalLikedCandidates,
      action: `/customer-candidate-liked/${jobDetails[0]?.jobid}`,
      icon: <FaUsers className="img-fluid " size={"35px"} />,
    },
    {
      name: "Applied",
      count:
        jobDetail.totalAppliedCandidates === null
          ? 0
          : jobDetail.totalAppliedCandidates,
      action: `/customer-candidate-applied/${jobDetails[0]?.jobid}`,
      icon: <FaUsers className="img-fluid " size={"35px"} />,
    },
    {
      name: "Scheduled",
      count: 0,
      action: `/customer-candidate-scheduled/${jobDetails[0]?.jobid}`,
      icon: <FaUserClock className="img-fluid " size={"35px"} />,
    },
    {
      name: "Offers",
      count: 0,
      action: `/customer-candidate-offers/${jobDetails[0]?.jobid}`,
      icon: <FaUserCheck className="img-fluid " size={"35px"} />,
    },
    {
      name: "Accepted",
      count:
        jobDetail.totalAcceptedCandidates === null
          ? 0
          : jobDetail.totalAcceptedCandidates,
      action: `/customer-candidate-accepted/${jobDetails[0]?.jobid}`,
      icon: <FaUserTie className="img-fluid " size={"35px"} />,
    },
    {
      name: "Rejected",
      count:
        jobDetail.totalRejectedCandidates === null
          ? 0
          : jobDetail.totalRejectedCandidates,
      action: `/customer-candidate-rejected/${jobDetails[0]?.jobid}`,
      icon: <FaUserTimes className="img-fluid " size={"35px"} />,
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
        {/* <div className="">{steps[i].icon}</div> */}
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
                        <p className="mb-0 mt-0">{jobDetail.companyname}</p>
                        <p className="mb-0 mt-0">
                          <FiMapPin className="muted-icon" /> {returnAddress()}
                        </p>
                      </div>
                    </div>
                  </Col>
                  {jobDetail.isdraft ? (
                    <Col md={4} lg={4} className="right-align">
                      <Button
                        color="primary"
                        className={"me-1 mt-3"}
                        onClick={(e) =>
                          navigate(`/customer-edit-job/${jobDetail.jobid}`)
                        }
                      >
                        <FiEdit className="mb-1" /> Edit job
                      </Button>
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
                    </Col>
                  ) : (
                    <></>
                  )}
                  {jobDetail.isdraft === false &&
                    jobDetail.isclosed === false && (
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
                  {jobDetail.isclosed === true && (
                    <Col md={4} lg={4} className="right-align">
                      <div className="mb-2 me-3 mt-3 badge bg-danger text-normal">
                        Job closed
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </div>
            {type === "Open" && jobDetail.isdraft === false && (
              <div className="forms-wizard-alt ms-3 me-3">
                <ol className="forms-wizard">{renderSteps()}</ol>
              </div>
            )}
            {/* {type === "Open" && jobDetail.isdraft === false && (
              <div className="p-3 mt-2 align-left">
                <ButtonWithCount
                  buttonName={"Applied"}
                  color={"primary"}
                  count={
                    jobDetail.totalAppliedCandidates === null
                      ? 0
                      : jobDetail.totalAppliedCandidates
                  }
                  action={`/customer-candidate-applied/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Matched"}
                  color={"primary"}
                  count={
                    jobDetail.totalRecommendedCandidates === null
                      ? 0
                      : jobDetail.totalRecommendedCandidates
                  }
                  action={`/customer-candidate-matched/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Liked"}
                  color={"primary"}
                  count={
                    jobDetail.totalLikedCandidates === null
                      ? 0
                      : jobDetail.totalLikedCandidates
                  }
                  action={`/customer-candidate-liked/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Maybe"}
                  color={"primary"}
                  count={
                    jobDetail.totalLikedCandidates === null
                      ? 0
                      : jobDetail.totalLikedCandidates
                  }
                  action={`/customer-candidate-maybe/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Scheduled"}
                  color={"primary"}
                  count={
                    jobDetail.totalLikedCandidates === null
                      ? 0
                      : jobDetail.totalLikedCandidates
                  }
                  action={`/customer-candidate-scheduled/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Accepted"}
                  color={"success"}
                  count={
                    jobDetail.totalAcceptedCandidates === null
                      ? 0
                      : jobDetail.totalAcceptedCandidates
                  }
                  action={`/customer-candidate-accepted/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Rejected"}
                  color={"danger"}
                  count={
                    jobDetail.totalRejectedCandidates === null
                      ? 0
                      : jobDetail.totalRejectedCandidates
                  }
                  action={`/customer-candidate-rejected/${jobDetails[0]?.jobid}`}
                />
              </div>
            )} */}
            <div className="heading-title">
              <h6 className="job-main-heading mb-0">Job details</h6>
            </div>
            {/* <HeadingAndDetailWithDiv
              heading={"Job Role:"}
              detail={jobDetail.jobrole}
              iconId={1}
            /> */}
            <HeadingAndDetailWithDiv
              heading={"Job Type"}
              detail={returnJobType()}
              iconId={5}
            />
            <HeadingAndDetailWithDiv
              heading={"Shift & Schedule"}
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
              detail={returnAddress()}
              iconId={10}
            />
            <HeadingAndDetailWithoutIcon
              heading={"Job Description"}
              detail={jobDetail.description}
            />
            <HeadingAndDetailWithoutIcon
              heading={"About Company"}
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
          </Card>
        )}
      </Col>
      {publishSuccess === true && (
        <SweetAlert
          success
          title="Job published successfully!!!"
          onConfirm={(e) => setPublishSuccess(false)}
        ></SweetAlert>
      )}
      {closeConfirmation === true && (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, close job!"
          confirmBtnBsStyle="danger"
          cancelBtnText="No"
          cancelBtnBsStyle="secondary"
          title="Are you sure?"
          onConfirm={(e) => {
            closeJob(jobDetail.jobid);
            setCloseConfirmation(false);
          }}
          onCancel={() => setCloseConfirmation(false)}
          focusCancelBtn
        >
          You really want to close the {jobDetail.jobtitle} job !
        </SweetAlert>
      )}
    </>
  );
}
