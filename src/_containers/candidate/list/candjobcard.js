import React from "react";
import { Card, Col, Row } from "reactstrap";
import { HeadingAndDetailWithDiv } from "../../../_components/jobDetailComponents/HeadingAndDetailWithDiv";
import { HeadingAndDetailWithoutIcon } from "../../../_components/jobDetailComponents/HeadingAndDetailWithoutIcon";
import { DetailsHeader } from "../../../_components/jobDetailComponents/DetailsHeader";
import customerIcons from "../../../assets/utils/images/customer";
import "../../../_components/job/job.scss";
import { useSelector } from "react-redux";

export function CandJobDetail({ jobDetails, type, onApplyClick, isModal }) {
  let jobDetail = {};
  let skillArray = [];
  let skillsData = "-";
  const shiftsOption = useSelector((state) => state.dropdown.shift);
  const workScheduleOptions = useSelector(
    (state) => state.dropdown.workSchedule
  );
  const jobTypeOption = useSelector((state) => state.dropdown.jobType);
  if (jobDetails.length > 0) {
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
      return `${jobDetail.cityname}, ${jobDetail.countryname}`;
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
      return "-";
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

  const onClickApplyBtn = () => {
    onApplyClick();
  };

  return (
    <>
      <Col md="12" lg="12" className="job-detail-cont">
        <Card className="card-shadow-primary profile-responsive card-border mb-3">
          <DetailsHeader
            heading={jobDetail.jobtitle}
            subHeading={
              jobDetail.subsidiaryid !== 0
                ? jobDetail.companyname + " (" + jobDetail?.subsidiaryname + ")"
                : jobDetail.companyname
            }
            location={returnAddress()}
            // ApplyButton={type !== "Open"}
            // jobId={jobDetail.jobid}
            // department={jobDetail.departmentid ?? 1}
            showApplyBtn={!isModal}
            applyBtnState={true}
            onClickApply={() => onClickApplyBtn()}
          />
          <div className="heading-title">
            <h6 className="job-main-heading mb-0">Job details</h6>
          </div>
          <HeadingAndDetailWithDiv
            heading={"Job Type"}
            detail={returnJobType()}
            iconId={5}
          />
          <HeadingAndDetailWithDiv
            heading={"Job Location"}
            detail={
              jobDetail?.joblocation === "" ? "-" : jobDetail?.joblocation
            }
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
              jobDetail?.certifications === "" ? "-" : jobDetail?.certifications
            }
            iconId={12}
          />
          <HeadingAndDetailWithDiv
            heading={"Authorized to work in United States"}
            detail={jobDetail?.authorizedtoworkinus === true ? "Yes" : "No"}
            iconId={9}
          />
          <HeadingAndDetailWithDiv
            heading={"Sponsorship is required"}
            detail={jobDetail?.sponsorshiprequiured === true ? "Yes" : "No"}
            iconId={9}
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
          {jobDetail?.jobPrescreenApplicationDtos &&
            jobDetail?.jobPrescreenApplicationDtos?.length > 0 && (
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
            )}
        </Card>
      </Col>
    </>
  );
}
