import React, { useEffect } from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
      // isdraft: type === "edit" ? reqData?.basicInformation?.isdraft : true,
      // isdraft:
      //   reqData?.basicInformation?.isdraft !== undefined
      //     ? reqData?.basicInformation?.isdraft
      //     : true,
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
      issecurityclearancerequired:
        reqData.basicInformation.issecurityclearancerequired,
      securityclearanceid: reqData.basicInformation.securityclearance,
      hiringmanagerid: String(reqData.basicInformation?.hiringmanagerid),
      clientcompanyid: reqData.basicInformation?.clientcompanyid,
      recruiterid: String(reqData.basicInformation?.recruiterid),
      isprescreenmandatory: reqData.isprescreenmandatory ?? false,
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
        reqData?.keyQualification?.length === undefined
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
  const billingStatus = useSelector((state) => state?.payment?.showBilling);
  const customerDetails = useSelector(
    (state) => state?.createJob?.customerDetails
  );
  let customerApproval = customerDetails?.customerstatusid === 2 ? true : false;
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
            Your job with <b>{reqData.basicInformation.jobTitle}</b> has been
            successfully {type === "edit" ? "updated" : "created"}{" "}
            {type === "edit" && !reqData.basicInformation.isdraft
              ? "!"
              : "& saved as a draft!"}
          </div>
          <div className="mt-3 mb-3" />
          {type === "add" ? (
            <div className="text-center">
              <Button
                color="primary"
                size="lg"
                className="btn-shadow btn-wide"
                onClick={() => createNewJob()}
              >
                Create new job
              </Button>{" "}
              {"   "}
              {(billingStatus === true || customerDetails?.companyBillingdetailstatus ===
                true) && customerApproval === true ? (
                <Button
                  color="success"
                  size="lg"
                  className="btn-shadow btn-wide"
                  onClick={(e) => publishJob(true)}
                >
                  Publish job
                </Button>
              ) : (
                <Button
                  color="success"
                  size="lg"
                  className="btn-shadow btn-wide"
                  onClick={(e) => navigate(`/job-list`)}
                >
                  Back to job list
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="text-center">
                {(billingStatus === true || customerDetails?.companyBillingdetailstatus ===
                  true) && customerApproval === true && (
                    <Button
                      color="success"
                      size="lg"
                      className="btn-shadow btn-wide"
                      onClick={(e) => publishJob(true)}
                    >
                      Publish job
                    </Button>
                  )}
                {"      "}
                <Button
                  color="primary"
                  size="lg"
                  className="btn-shadow btn-wide"
                  onClick={(e) => navigate(`/job-list`)}
                >
                  Back to job list
                </Button>{" "}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
