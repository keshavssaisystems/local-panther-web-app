import React from "react";
import { Card, Col, Row } from "reactstrap";
import { HeadingAndDetailWithDiv } from "../../../_components/jobDetailComponents/HeadingAndDetailWithDiv";
import { HeadingAndDetailWithoutIcon } from "../../../_components/jobDetailComponents/HeadingAndDetailWithoutIcon";
import { ButtonWithCount } from "../../../_components/jobDetailComponents/ButtonWithCount";
import { DetailsHeader } from "../../../_components/jobDetailComponents/DetailsHeader";
import Loader from "react-loaders";
import customerIcons from "../../../assets/utils/images/customer";
import "../../../_components/job/job.scss";

export function CandJobDetail({ jobDetails, type, onApplyClick, isModal }) {
  let jobDetail = {};
  let skillArray = [];
  let skillsData = "-";

  if (jobDetails.length > 0) {
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
      return `${jobDetail.jobPaymentBenefitDtos[0].minimumamount} - ${jobDetail.jobPaymentBenefitDtos[0].maximumamount} ${jobDetail.jobPaymentBenefitDtos[0].payperiodtype}`;
    } else if (
      jobDetail?.jobPaymentBenefitDtos &&
      jobDetail?.jobPaymentBenefitDtos[0]?.minimumamount
    ) {
      return `${jobDetail.jobPaymentBenefitDtos[0].minimumamount}`;
    } else if (
      jobDetail?.jobPaymentBenefitDtos &&
      jobDetail?.jobPaymentBenefitDtos[0]?.maximumamount
    ) {
      return `${jobDetail.jobPaymentBenefitDtos[0].maximumamount}`;
    }
  };

  const returnJobType = () => {
    if (
      jobDetail?.jobExperienceScheduleDtos &&
      jobDetail?.jobExperienceScheduleDtos[0]?.jobTypesDtos?.length > 0
    ) {
      return jobDetail?.jobExperienceScheduleDtos[0]?.jobTypesDtos
        .map((item) => item.jobtypes)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnShift = () => {
    if (
      jobDetail?.jobExperienceScheduleDtos &&
      jobDetail?.jobExperienceScheduleDtos[0]?.shiftsDtos?.length > 0
    ) {
      return jobDetail?.jobExperienceScheduleDtos[0]?.shiftsDtos
        .map((item) => item.shifts)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnSchedule = () => {
    if (
      jobDetail?.jobExperienceScheduleDtos &&
      jobDetail?.jobExperienceScheduleDtos[0]?.workSchedulesDtos?.length > 0
    ) {
      return jobDetail?.jobExperienceScheduleDtos[0]?.workSchedulesDtos
        .map((item) => item.workschedules)
        .join(", ");
    } else {
      return "";
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
            subHeading={jobDetail.companyname}
            location={jobDetail.locationaddress}
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
        </Card>
      </Col>
    </>
  );
}
