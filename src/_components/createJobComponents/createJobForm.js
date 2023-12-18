import React, { useEffect, useState } from "react";
import { Card, CardHeader, Button, Collapse, CardBody } from "reactstrap";
import { BasicInformation } from "./basicInformation";
import { ExperienceAndSchedules } from "./experienceAndSchedules";
import { PaymentAndBenefits } from "./paymentAndBenefits";
import { KeyQualification } from "./keyQualification";
import { PreScreenApplicant } from "./preScreenApplicant";

export default function CreateJob({
  shiftsOption,
  workScheduleOptions,
  jobTypeOption,
  experienceLevelOption,
  hiringTimelineOption,
  jobLocationOptions,
  payPeriodTypeOption,
  preScreenQuestionsOption,
  type,
  jobData,
  JobDataForPreview,
  previousStep,
  previousData,
  bIFormSubmitted,
  esFormSubmitted,
  customerDetails,
}) {
  const [basicInformationData, setBasicInformationData] = useState(
    previousStep === 3 ? jobData.basicInformation : {}
  );
  const [experienceScheduleData, setExperienceScheduleData] = useState(
    previousStep === 3 ? jobData.experienceSchedule : {}
  );
  const [paymentBenifitsData, setPaymentBenifitsData] = useState(
    previousStep === 3 ? jobData.paymentBenifits : {}
  );
  const [keyQualificationData, setKeyQualificationData] = useState(
    previousStep === 3 ? jobData.keyQualification : {}
  );
  const [preScreenData, setPreScreenData] = useState(
    previousStep === 3 ? jobData.preScreen : {}
  );
  const [preScreenCustomData, setPreScreenCustomData] = useState(
    previousStep === 3 ? jobData.basicInformation.customquestionanswertype : ""
  );
  const [formData, setSetFormData] = useState({});
  const [accordion, setAccordion] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);
  const toggleAccordion = (tab) => {
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    setAccordion(state);
  };
  const getBIPostData = (event) => {
    setBasicInformationData(event);
    getPostJobData("BI", event);
  };
  const getESPostData = (event) => {
    setExperienceScheduleData(event);
    getPostJobData("ES", event);
  };
  const getPBPostData = (event) => {
    setPaymentBenifitsData(event);
    getPostJobData("PB", event);
  };
  const getKQPostData = (event) => {
    setKeyQualificationData(event);
    getPostJobData("KQ", event);
  };
  const getPSPostData = (event) => {
    setPreScreenData(event.questionArr);
    setPreScreenCustomData(event.customAnserType);
    getPostJobData("PS", event);
  };
  const getPostJobData = (type, event) => {
    if (previousStep === 3) {
      setSetFormData(jobData);
    }
    let data = {
      basicInformation: type === "BI" ? event : basicInformationData,
      experienceSchedule: type === "ES" ? event : experienceScheduleData,
      paymentBenifits: type === "PB" ? event : paymentBenifitsData,
      keyQualification: type === "KQ" ? event : keyQualificationData,
      preScreen: type === "PS" ? event.questionArr : preScreenData,
      preCustomScreen:
        type === "PS" ? event.customAnserType : preScreenCustomData,
    };
    JobDataForPreview(data);
    setSetFormData(data);
  };
  useEffect(() => {
    if (type === "previous_template" || type === "recommendation_template") {
      let data = {
        basicInformation: {
          companyId: "",
          jobTitle: previousData?.jobtitle,
          noOfPostions: previousData?.noofopenposition,
          jobLocation: previousData?.joblocationid,
          address: previousData?.locationaddress,
          cityId: previousData?.cityid,
          stateId: previousData?.stateid,
          cityName: previousData?.cityname,
          stateName: previousData?.statename,
          zipcode: previousData?.zipcode,
          description: previousData?.description,
          companyDetail: previousData?.companydetails,
          jobLoactionOptions: jobLocationOptions,
          customquestionanswertype: previousData?.customquestionanswertype,
          authorizedtoworkinus: previousData?.authorizedtoworkinus,
          sponsorshiprequiured: previousData?.sponsorshiprequiured,
          levelofeducationids: previousData?.levelofeducationids,
          fieldofstudiesids: previousData?.fieldofstudiesids,
          certifications: previousData?.certifications,
          subsidiaryid: previousData?.subsidiaryid,
        },
        experienceSchedule: {
          jobType:
            previousData?.jobExperienceScheduleDtos === null
              ? ""
              : previousData?.jobExperienceScheduleDtos[0]?.jobtypes,
          workSchedule:
            previousData?.jobExperienceScheduleDtos === null
              ? ""
              : previousData?.jobExperienceScheduleDtos[0]?.workschedules,
          shift:
            previousData?.jobExperienceScheduleDtos === null
              ? ""
              : previousData?.jobExperienceScheduleDtos[0]?.shifts,
          experienceLevel:
            previousData?.jobExperienceScheduleDtos === null
              ? ""
              : previousData?.jobExperienceScheduleDtos[0]?.experiencelevelid,
          hiringTimeline:
            previousData?.jobExperienceScheduleDtos === null
              ? ""
              : previousData?.jobExperienceScheduleDtos[0]?.hiringtimelineid,
          shiftsOption: shiftsOption,
          workScheduleOptions: workScheduleOptions,
          jobTypeOption: jobTypeOption,
          experienceLevelOption: workScheduleOptions,
          hiringTimelineOption: hiringTimelineOption,
        },
        paymentBenifits: {
          payPeriodType:
            previousData?.jobPaymentBenefitDtos === null
              ? ""
              : previousData?.jobPaymentBenefitDtos[0]?.payperiodtypeid,
          minimumAmount:
            previousData?.jobPaymentBenefitDtos === null
              ? ""
              : previousData?.jobPaymentBenefitDtos[0]?.minimumamount,
          maximumAmount:
            previousData?.jobPaymentBenefitDtos === null
              ? ""
              : previousData?.jobPaymentBenefitDtos[0]?.maximumamount,
          compensationPackage:
            previousData?.jobPaymentBenefitDtos === null
              ? ""
              : previousData?.jobPaymentBenefitDtos[0]?.compensationpackage,
          benefits:
            previousData?.jobPaymentBenefitDtos === null
              ? ""
              : previousData?.jobPaymentBenefitDtos[0]?.benefits,
          payPeriodTypeOption: payPeriodTypeOption,
        },
        keyQualification:
          previousData?.jobKeyQualificationDtos === null
            ? {}
            : previousData?.jobKeyQualificationDtos,
        preScreen:
          previousData?.jobPrescreenApplicationDtos === null
            ? {}
            : previousData?.jobPrescreenApplicationDtos,
      };
      setBasicInformationData(data.basicInformation);
      setExperienceScheduleData(data.experienceSchedule);
      setPaymentBenifitsData(data.paymentBenifits);
      setKeyQualificationData(data.keyQualification);
      setPreScreenData(data.preScreen);
      setPreScreenCustomData(data.basicInformation.customquestionanswertype);
      JobDataForPreview(data);
    }
  }, []);

  return (
    <>
      <div className="form-wizard-content">
        <div id="accordion" className="accordion-wrapper mb-3">
          <Card>
            <CardHeader id="headingOne">
              <Button
                block
                color="link"
                className="text-start m-0 p-0"
                onClick={() => toggleAccordion(0)}
                aria-expanded={accordion[0]}
                aria-controls="collapseOne"
              >
                <h5 className="m-0 p-0 fw-semi-bold">Basic information</h5>
              </Button>
            </CardHeader>
            <Collapse
              isOpen={accordion[0]}
              data-parent="#accordion"
              id="collapseOne"
              aria-labelledby="headingOne"
            >
              <CardBody>
                <BasicInformation
                  data={jobData.basicInformation}
                  jobLocationOptions={jobLocationOptions}
                  postData={(e) => getBIPostData(e)}
                  prevStep={previousStep}
                  previousData={previousData}
                  bIFormSubmitted={bIFormSubmitted}
                  customerDetails={customerDetails}
                />
              </CardBody>
            </Collapse>
          </Card>
          <Card>
            <CardHeader className="b-radius-0" id="headingTwo">
              <Button
                block
                color="link"
                className="text-start m-0 p-0"
                onClick={() => toggleAccordion(1)}
                aria-expanded={accordion[1]}
                aria-controls="collapseTwo"
              >
                <h5 className="m-0 p-0 fw-semi-bold">Experience & schedules</h5>
              </Button>
            </CardHeader>
            <Collapse
              isOpen={accordion[1]}
              data-parent="#accordion"
              id="collapseTwo"
            >
              <CardBody>
                <ExperienceAndSchedules
                  data={jobData.experienceSchedule}
                  shiftsOption={shiftsOption}
                  workScheduleOptions={workScheduleOptions}
                  jobTypeOption={jobTypeOption}
                  experienceLevelOption={experienceLevelOption}
                  hiringTimelineOption={hiringTimelineOption}
                  postData={(e) => getESPostData(e)}
                  prevStep={previousStep}
                  previousData={previousData?.jobExperienceScheduleDtos ?? {}}
                  esFormSubmitted={esFormSubmitted}
                />
              </CardBody>
            </Collapse>
          </Card>
          <Card>
            <CardHeader id="headingThree">
              <Button
                block
                color="link"
                className="text-start m-0 p-0"
                onClick={() => toggleAccordion(2)}
                aria-expanded={accordion[2]}
                aria-controls="collapseThree"
              >
                <h5 className="m-0 p-0 fw-semi-bold">Payments & benefits</h5>
              </Button>
            </CardHeader>
            <Collapse
              isOpen={accordion[2]}
              data-parent="#accordion"
              id="collapseThree"
            >
              <CardBody>
                <PaymentAndBenefits
                  data={jobData.paymentBenifits}
                  payPeriodTypeOption={payPeriodTypeOption}
                  postData={(e) => getPBPostData(e)}
                  prevStep={previousStep}
                  previousData={previousData?.jobPaymentBenefitDtos ?? {}}
                />
              </CardBody>
            </Collapse>
          </Card>
          <Card>
            <CardHeader id="headingThree">
              <Button
                block
                color="link"
                className="text-start m-0 p-0"
                onClick={() => toggleAccordion(3)}
                aria-expanded={accordion[3]}
                aria-controls="collapseFour"
              >
                <h5 className="m-0 p-0 fw-semi-bold">Key qualification</h5>
              </Button>
            </CardHeader>
            <Collapse
              isOpen={accordion[3]}
              data-parent="#accordion"
              id="collapseFour"
            >
              <CardBody>
                <KeyQualification
                  data={jobData.keyQualification}
                  postData={(e) => getKQPostData(e)}
                  prevStep={previousStep}
                  previousData={previousData?.jobKeyQualificationDtos ?? {}}
                />
              </CardBody>
            </Collapse>
          </Card>
          <Card>
            <CardHeader id="headingThree">
              <Button
                block
                color="link"
                className="text-start m-0 p-0"
                onClick={() => toggleAccordion(4)}
                aria-expanded={accordion[4]}
                aria-controls="collapseFive"
              >
                <h5 className="m-0 p-0 fw-semi-bold">Pre-screen applicants</h5>
              </Button>
            </CardHeader>
            <Collapse
              isOpen={accordion[4]}
              data-parent="#accordion"
              id="collapseFive"
            >
              <CardBody>
                <PreScreenApplicant
                  data={jobData.preScreen}
                  preScreenQuestionsOption={preScreenQuestionsOption}
                  postData={(e) => getPSPostData(e)}
                  prevStep={previousStep}
                  previousData={previousData?.jobPrescreenApplicationDtos ?? {}}
                />
              </CardBody>
            </Collapse>
          </Card>
        </div>
      </div>
    </>
  );
}
