import React, { useEffect } from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function PublishJobStep({
  companyId,
  reqData,
  responseData,
  publishJob,
  jobId,
  type,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    let main = {
      jobId: jobId,
      companyid: companyId,
      jobtitle: reqData.basicInformation.jobTitle,
      description: reqData.basicInformation.description,
      companydetails: reqData.basicInformation.companyDetail,
      noofopenposition: reqData.basicInformation.noOfPostions,
      joblocationid: reqData.basicInformation.jobLocation,
      locationaddress: reqData.basicInformation.address,
      cityid: reqData.basicInformation.cityId,
      stateid: reqData.basicInformation.stateId,
      zipcode: reqData.basicInformation.zipcode,
      countryid: 1,
      isdraft: true,
      isclosed: false,
      isactive: true,
      currentUserId: Number(localStorage.getItem("userId")),
      customquestionanswertype: reqData.preCustomScreen,
      authorizedtoworkinus: reqData.basicInformation.authorizedtoworkinus,
      sponsorshiprequiured: reqData.basicInformation.sponsorshiprequiured,
      fieldofstudiesids: reqData.basicInformation.fieldofstudiesids,
      levelofeducationids: reqData.basicInformation.levelofeducationids,
      certifications: reqData.basicInformation.certifications,
      subsidiaryid: reqData.basicInformation.subsidiaryid,
      jobExperienceScheduleDtos: [
        {
          jobexperiencescheduleid: 0,
          jobid: jobId,
          jobtypes: reqData.experienceSchedule.jobType,
          experiencelevel: Number(reqData.experienceSchedule.experienceLevel),
          workschedules: reqData.experienceSchedule.workSchedule,
          shifts: reqData.experienceSchedule.shift,
          hiringtimelineid: Number(reqData.experienceSchedule.hiringTimeline),
          isactive: true,
        },
      ],
      jobKeyQualificationDtos:
        reqData.keyQualification.length === undefined
          ? null
          : reqData.keyQualification,
      jobPaymentBenefitDtos: [
        {
          jobpaymentsbenifitsid: 0,
          jobid: jobId,
          payperiodtypeid: Number(reqData.paymentBenifits.payPeriodType),
          minimumamount: reqData.paymentBenifits.minimumAmount,
          maximumamount: reqData.paymentBenifits.maximumAmount,
          compensationpackage: reqData.paymentBenifits.compensationPackage,
          benefits: reqData.paymentBenifits.benefits,
          isactive: true,
        },
      ],
      jobPrescreenApplicationDtos:
        reqData.preScreen.length === undefined ? null : reqData.preScreen,
    };
    console.log(main);
    responseData(main);
  }, []);
  const createNewJob = () => {
    window.location.reload(false);
  };
  return (
    <>
      <div className="form-wizard-content">
        <div className="no-results">
          <div className="sa-icon sa-success animate">
            <span className="sa-line sa-tip animateSuccessTip" />
            <span className="sa-line sa-long animateSuccessLong" />
            <div className="sa-placeholder" />
            <div className="sa-fix" />
          </div>
          <div className="results-subtitle mt-4">Successfull!</div>
          <div className="results-title">
            Your job with <b>{reqData.basicInformation.jobTitle}</b> has
            successfully {type === "edit" ? "updated" : "created"} & saved as
            draft!
          </div>
          <div className="mt-3 mb-3" />
          {type === "add" ? (
            <div className="text-center">
              <Button
                color="primary"
                size="lg"
                className="btn-shadow btn-wide"
                onClick={(e) => createNewJob(e)}
              >
                Create new job
              </Button>{" "}
              {"   "}
              <Button
                color="success"
                size="lg"
                className="btn-shadow btn-wide"
                onClick={(e) => publishJob(true)}
              >
                Publish job
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Button
                color="primary"
                size="lg"
                className="btn-shadow btn-wide"
                onClick={(e) => navigate(`/job-list`)}
              >
                Back to job list
              </Button>{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
