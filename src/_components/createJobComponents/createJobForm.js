import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Button,
  Collapse,
  CardBody,
  Form,
  Label,
  Input,
  FormGroup,
  Row,
  Col,
  FormText,
} from "reactstrap";
import { CKEditor } from "ckeditor4-react";
import "./createJob.scss";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import InputMask from "react-input-mask";
import { useSelector } from "react-redux";
import { getLocation } from "_store";

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
  useEffect((e) => {
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
          issecurityclearancerequired:
            previousData?.issecurityclearancerequired,
          securityclearanceid: previousData?.securityclearanceid,
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

  // const getFormValidation2 = (event) => {
  //   event.preventDefault();
  //   console.log(event);
  // };

  // Basic Information
  let jobLocationRaw =
    previousStep === 3 ? jobData?.joblocationid : previousData?.joblocationid;
  const [jobLocationOption, setJobLocationOption] = useState(
    jobLocationRaw === undefined ? 0 : jobLocationRaw
  );

  const fieldOfStudyOption = useSelector(
    (state) => state.dropdown.fieldOfStudyList
  );
  const levelOfEducationOption = useSelector(
    (state) => state.dropdown.levelOfEducationList
  );
  const subsidiaryOption = useSelector(
    (state) => state.dropdown.subsidiaryList
  );
  const securityClearanceOptions = useSelector(
    (state) => state.dropdown.securityClearanceList
  );

  let educationOptions = levelOfEducationOption.map(
    ({ id: value, ...rest }) => {
      return {
        value: `${value}`,
        label: `${rest.name}`,
      };
    }
  );
  let fieldStudyOptions = fieldOfStudyOption.map(({ id: value, ...rest }) => {
    return {
      value: `${value}`,
      label: `${rest.name}`,
    };
  });
  const [successMessage, setSuccessMessage] = useState(false);
  const [stateData, setStateData] = useState({});
  const customStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      minHeight: "30px",
      padding: "0 6px",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
  };
  const getEducationData = (data) => {
    if (data?.levelofeducationids?.split(",")?.length > 0) {
      let newData = data.levelofeducationids.split(",");
      let newOptions = educationOptions.filter((data) =>
        newData.includes(data.value)
      );
      return newOptions;
    }
    if (data?.levelofeducationids?.split(",")?.length === undefined) {
      return educationOptions.filter(
        (data2) => data2.value === Number(data?.levelofeducationids)
      );
    }
  };
  const getStudyData = (data) => {
    if (data?.fieldofstudiesids?.split(",")?.length > 0) {
      let newData = data.fieldofstudiesids.split(",");
      let newOptions = fieldStudyOptions.filter((data) =>
        newData.includes(data.value)
      );
      return newOptions;
    }
    if (data?.fieldofstudiesids?.split(",")?.length === undefined) {
      return fieldStudyOptions.filter(
        (data2) => data2.value === Number(data?.fieldofstudiesids)
      );
    }
  };
  let educationData =
    previousStep === 3
      ? getEducationData(jobData)
      : getEducationData(previousData);
  let studyData =
    previousStep === 3 ? getStudyData(jobData) : getStudyData(previousData);
  const [preValue, setPreValue] = useState({
    companyId: "",
    jobTitle:
      jobData === undefined || jobData.jobTitle === undefined
        ? ""
        : jobData.jobTitle,
    noOfPostions:
      jobData === undefined || jobData.noOfPostions === undefined
        ? ""
        : jobData.noOfPostions,
    jobLocation:
      jobData === undefined || jobData?.jobLocation === undefined
        ? ""
        : jobData?.jobLocation,
    address:
      jobData === undefined || jobData.address === undefined
        ? ""
        : jobData.address,
    cityId:
      jobData === undefined || jobData.cityId === undefined
        ? ""
        : jobData.cityId,
    stateId:
      jobData === undefined || jobData.stateId === undefined
        ? ""
        : jobData.stateId,
    cityName:
      jobData === undefined || jobData.cityName === undefined
        ? ""
        : jobData.cityName,
    stateName:
      jobData === undefined || jobData.stateName === undefined
        ? ""
        : jobData.stateName,
    zipcode:
      jobData === undefined || jobData.zipcode === undefined
        ? ""
        : jobData.zipcode,
    description:
      jobData === undefined || jobData.description === undefined
        ? ""
        : jobData.description,
    companyDetail:
      jobData === undefined || jobData.companyDetail === undefined
        ? ""
        : jobData.companyDetail,
    authorizedtoworkinus:
      jobData === undefined || jobData.authorizedtoworkinus === undefined
        ? ""
        : jobData.authorizedtoworkinus,
    sponsorshiprequiured:
      jobData === undefined || jobData.sponsorshiprequiured === undefined
        ? ""
        : jobData.sponsorshiprequiured,
    certifications:
      jobData === undefined || jobData.certifications === undefined
        ? ""
        : jobData.certifications,
    subsidiaryid:
      jobData === undefined || jobData.subsidiaryid === undefined
        ? ""
        : jobData.subsidiaryid,
    issecurityclearancerequired:
      jobData === undefined || jobData.issecurityclearancerequired === undefined
        ? ""
        : jobData.issecurityclearancerequired,
    securityclearanceid:
      jobData === undefined || jobData.securityclearanceid === undefined
        ? ""
        : jobData.securityclearanceid,
  });
  const [previousValue, setPreviousValue] = useState({
    companyId: "",
    jobTitle:
      previousData === undefined || previousData.jobtitle === undefined
        ? ""
        : previousData.jobtitle,
    noOfPostions:
      previousData === undefined || previousData.noofopenposition === undefined
        ? ""
        : previousData.noofopenposition,
    jobLocation:
      previousData === undefined || previousData?.joblocationid === undefined
        ? ""
        : previousData?.joblocationid,
    address:
      previousData === undefined || previousData.locationaddress === undefined
        ? ""
        : previousData.locationaddress,
    cityId:
      previousData === undefined || previousData.cityid === undefined
        ? ""
        : previousData.cityid,
    stateId:
      previousData === undefined || previousData.stateid === undefined
        ? ""
        : previousData.stateid,
    stateName:
      previousData === undefined || previousData.statename === undefined
        ? ""
        : previousData.statename,
    cityName:
      previousData === undefined || previousData.cityname === undefined
        ? ""
        : previousData.cityname,
    zipcode:
      previousData === undefined || previousData.zipcode === undefined
        ? ""
        : previousData.zipcode,
    description:
      previousData === undefined || previousData.description === undefined
        ? ""
        : previousData.description,
    companyDetail:
      previousData === undefined || previousData.companydetails === undefined
        ? ""
        : previousData.companydetails,
    authorizedtoworkinus:
      previousData === undefined ||
      previousData.authorizedtoworkinus === undefined
        ? ""
        : previousData.authorizedtoworkinus,
    sponsorshiprequiured:
      previousData === undefined ||
      previousData.sponsorshiprequiured === undefined
        ? ""
        : previousData.sponsorshiprequiured,
    countryName:
      previousData === undefined || previousData.statename === undefined
        ? ""
        : "US",
    certifications:
      previousData === undefined || previousData.certifications === undefined
        ? ""
        : previousData.certifications,
    subsidiaryid:
      previousData === undefined || previousData.subsidiaryid === undefined
        ? ""
        : previousData.subsidiaryid,
    issecurityclearancerequired:
      previousData === undefined ||
      previousData.issecurityclearancerequired === undefined
        ? ""
        : previousData.issecurityclearancerequired,
    securityclearanceid:
      previousData === undefined ||
      previousData.securityclearanceid === undefined
        ? ""
        : previousData.securityclearanceid,
  });
  const [descriptionData, setDescriptionData] = useState(
    previousStep === 3 && preValue.description !== ""
      ? preValue.description
      : previousStep === 1 && previousValue.description !== ""
      ? previousValue.description
      : ""
  );
  const [companyValidation, setcompanyValidation] = useState(false);
  const [jobTitleValidation, setJobTitleValidation] = useState(false);
  const [openPositionValidation, setOpenPositionValidation] = useState(false);
  const [cityValidation, setCityValidation] = useState(false);
  const [countryOnchange, setCountryOnChange] = useState(false);
  const [descriptionValidation, setDescriptionValidation] = useState(false);
  const [zipCodeValidation, setZipCodeValidation] = useState(false);
  const [addressValidation, setAddressValidation] = useState(false);
  const [securityValidation, setSecurityValidation] = useState(false);
  const [securityClearence, setSecurityClearence] = useState(
    previousStep === 3
      ? preValue.issecurityclearancerequired
      : previousValue.issecurityclearancerequired
  );
  const getFormValidation = (event) => {
    event.preventDefault();
    // console.log(event);
    event.target.elements.companyName.value === ""
      ? setcompanyValidation(true)
      : setcompanyValidation(false);
    event.target.elements.jobTitle.value === ""
      ? setJobTitleValidation(true)
      : setJobTitleValidation(false);
    event.target.elements.openPositions.value === ""
      ? setOpenPositionValidation(true)
      : setOpenPositionValidation(false);
    event.target.elements.city.value ===
    "undefined, undefined, undefined, undefined"
      ? setCityValidation(true)
      : setCityValidation(false);
    event.target.elements.zipCode.value === ""
      ? setZipCodeValidation(true)
      : setZipCodeValidation(false);
    event.target.elements.address.value === ""
      ? setAddressValidation(true)
      : setAddressValidation(false);
    event.target.elements.issecurityclearancerequired.checked === true &&
    Number(event.target.elements.securityclearance.value) === 0
      ? setSecurityValidation(true)
      : setSecurityValidation(false);
    descriptionData === ""
      ? setDescriptionValidation(true)
      : setDescriptionValidation(false);
    let checkJobLocationCondition = false;
    if (
      Number(jobLocationOption) === 2 &&
      event.target.elements.address.value !== ""
    ) {
      checkJobLocationCondition = true;
    } else if (
      Number(jobLocationOption) === 3 &&
      event.target.elements.address.value !== ""
    ) {
      checkJobLocationCondition = true;
    } else if (
      Number(jobLocationOption) === 1 ||
      Number(jobLocationOption) === 0
    ) {
      checkJobLocationCondition = true;
    }
    let checkSecurity = false;
    if (
      event.target.elements.issecurityclearancerequired.checked === true &&
      Number(event.target.elements.securityclearance.value) !== 0
    ) {
      checkSecurity = true;
    } else if (
      event.target.elements.issecurityclearancerequired.checked === false
    ) {
      checkSecurity = true;
    }
    if (
      event.target.elements.companyName.value !== "" &&
      event.target.elements.jobTitle.value !== "" &&
      event.target.elements.openPositions.value !== "" &&
      event.target.elements.zipCode.value !== "" &&
      event.target.elements.city.value !==
        "undefined, undefined, undefined, undefined" &&
      descriptionData !== "" &&
      checkJobLocationCondition === true &&
      checkSecurity === true
    ) {
      saveData(event);
    }
  };
  const saveData = (eventData) => {
    let educationString = getEducationFormData(eventData);
    let studyString = getStudyFormData(eventData);
    let data = {
      companyId: eventData.target.elements.companyName.value,
      jobTitle: eventData.target.elements.jobTitle.value,
      noOfPostions: eventData.target.elements.openPositions.value,
      jobLocation: eventData.target.elements.jobLocation.value,
      address: eventData.target.elements.address.value,
      cityId:
        stateData.cityId === undefined
          ? previousValue.cityId
          : stateData.cityId,
      stateId:
        stateData.stateId === undefined
          ? previousValue.stateId
          : stateData.stateId,
      cityName:
        stateData.cityName === undefined
          ? previousValue.cityName
          : stateData.cityName,
      stateName:
        stateData.stateName === undefined
          ? previousValue.stateName
          : stateData.stateName,
      zipcode: eventData.target.elements.zipCode.value,
      description:
        descriptionData === ""
          ? previousStep === 3
            ? preValue.description
            : previousValue.description
          : descriptionData,
      companyDetail: eventData.target.elements.companyDetails.value,
      jobLoactionOptions: jobLocationOptions,
      authorizedtoworkinus:
        eventData.target.elements.authorizedtoworkinus.checked,
      sponsorshiprequiured:
        eventData.target.elements.sponsorshiprequiured.checked,
      levelofeducationids: educationString,
      fieldofstudiesids: studyString,
      certifications: eventData.target.elements.certifications.value,
      levelofeducationOption: levelOfEducationOption,
      fieldofstudiesOption: fieldOfStudyOption,
      subsidiaryid:
        eventData?.target?.elements?.subsidiaryid?.value === undefined
          ? 0
          : eventData?.target?.elements?.subsidiaryid?.value,
      subsidiaryOption: subsidiaryOption,
      issecurityclearancerequired:
        eventData.target.elements.issecurityclearancerequired.checked,
      securityclearance:
        eventData?.target?.elements?.securityclearance?.value === undefined
          ? 0
          : eventData?.target?.elements?.securityclearance?.value,
      securityclearanceOptions: securityClearanceOptions,
    };
    console.log(data);
    setPreValue(data);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
    bIFormSubmitted(true);
  };
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 0) {
      const { data = [] } = await getLocation(inputValue);
      return data.map(({ cityid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
          label: `${rest.location}, ${rest.statename}`,
        };
      });
    }
  };
  const getLocationDetails = (event) => {
    setCityValidation(false);
    let locationSplit = event.value.split(", ");
    setCountryOnChange(true);
    setStateData({
      cityId: locationSplit[0],
      stateId: locationSplit[1],
      cityName: locationSplit[2],
      stateName: locationSplit[3],
    });
  };

  const setupDescriptionData = (event) => {
    setDescriptionData(event);
    setDescriptionValidation(false);
  };
  const getEducationFormData = (eventData) => {
    let postEducationData = [];
    let educationArray = eventData?.target?.elements?.levelofeducationids;
    if (educationArray?.length === undefined) {
      return educationArray.value;
    }
    if (educationArray?.length > 0) {
      educationArray?.forEach((element) => {
        postEducationData.push(element.value);
      });
      return postEducationData.toString();
    }
  };
  const getStudyFormData = (eventData) => {
    let postStudyData = [];
    let studyArray = eventData?.target?.elements?.fieldofstudiesids;
    if (studyArray?.length === undefined) {
      return studyArray.value;
    }
    if (studyArray?.length > 0) {
      studyArray?.forEach((element) => {
        postStudyData.push(element.value);
      });
      return postStudyData.toString();
    }
  };

  return (
    <>
      <div className="form-wizard-content">
        <Form onSubmit={(e) => getFormValidation(e)}>
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
                  <h5 className="m-0 p-0 fw-semi-bold">Basic Information</h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[0]}
                data-parent="#accordion"
                id="collapseOne"
                aria-labelledby="headingOne"
              >
                <CardBody>
                  <Row>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label className="fw-semi-bold">
                          Company name<span style={{ color: "red" }}>* </span>
                        </Label>
                        <Input
                          id={"companyName"}
                          name={"companyName"}
                          type={"text"}
                          value={customerDetails.companyname}
                          disabled
                        />
                        {companyValidation === true && (
                          <FormText color="danger">
                            Please enter company name
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    {subsidiaryOption.length > 0 && (
                      <Col md={6} lg={3}>
                        <FormGroup>
                          <Label for={"jobTitle"} className="fw-semi-bold">
                            Subsidiary name
                          </Label>
                          <Input
                            id={"subsidiaryid"}
                            name={"subsidiaryid"}
                            type={"select"}
                          >
                            <option key={0} value={0}>
                              Select subsidiary
                            </option>
                            {subsidiaryOption.length > 0 &&
                              subsidiaryOption.map((options) => (
                                <option
                                  key={options.subsidiaryid}
                                  value={options.subsidiaryid}
                                  selected={
                                    previousStep === 3
                                      ? preValue.subsidiaryid
                                      : previousValue.subsidiaryid ===
                                        options.subsidiaryid
                                  }
                                >
                                  {options.subsidiaryname}
                                </option>
                              ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for={"jobTitle"} className="fw-semi-bold">
                          Job title<span style={{ color: "red" }}>* </span>
                        </Label>
                        <Input
                          id={"jobTitle"}
                          name={"jobTitle"}
                          type={"text"}
                          placeholder="Eg. UX UI Designer"
                          defaultValue={
                            previousStep === 3
                              ? preValue.jobTitle
                              : previousValue.jobTitle
                          }
                          maxLength={50}
                          invalid={jobTitleValidation === true ? true : false}
                          onChange={(e) => setJobTitleValidation(false)}
                        />
                        {jobTitleValidation === true && (
                          <FormText color="danger">
                            Please enter job title
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="openPositions" className="fw-semi-bold">
                          Number of positions
                          <span style={{ color: "red" }}>* </span>
                        </Label>
                        <Input
                          id={"openPositions"}
                          name={"openPositions"}
                          type={"number"}
                          placeholder="Eg. 2"
                          defaultValue={
                            previousStep === 3
                              ? preValue.noOfPostions
                              : previousValue.noOfPostions
                          }
                          min={0}
                          invalid={
                            openPositionValidation === true ? true : false
                          }
                          onChange={(e) => setOpenPositionValidation(false)}
                        />
                        {openPositionValidation === true && (
                          <FormText color="danger">
                            Please enter number of positions
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="jobLocation" className="fw-semi-bold">
                          Job location
                        </Label>
                        <Input
                          id={"jobLocation"}
                          name={"jobLocation"}
                          type={"select"}
                          onChange={(e) => setJobLocationOption(e.target.value)}
                        >
                          <option key={0} value={0}>
                            Select job location
                          </option>
                          {jobLocationOptions.length > 0 &&
                            jobLocationOptions.map((options) => (
                              <option
                                key={options.id}
                                value={options.id}
                                selected={
                                  previousStep === 3
                                    ? preValue.jobLocation
                                    : previousValue.jobLocation === options.id
                                }
                              >
                                {options.name}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="address" className="fw-semi-bold">
                          Address{" "}
                          {Number(jobLocationOption) !== 1 &&
                            Number(jobLocationOption) !== 0 && (
                              <span style={{ color: "red" }}>* </span>
                            )}
                        </Label>
                        <Input
                          id={"address"}
                          name={"address"}
                          type={"textarea"}
                          placeholder="Enter address"
                          defaultValue={
                            previousStep === 3
                              ? preValue.address
                              : previousValue.address
                          }
                          maxLength={100}
                          invalid={
                            addressValidation &&
                            Number(jobLocationOption) !== 1 &&
                            Number(jobLocationOption) !== 0
                              ? true
                              : false
                          }
                          onChange={() => setAddressValidation(false)}
                        />
                        {addressValidation &&
                          Number(jobLocationOption) !== 1 &&
                          Number(jobLocationOption) !== 0 && (
                            <FormText color="danger">
                              Please enter address
                            </FormText>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="city" className="fw-semi-bold">
                          City, State<span style={{ color: "red" }}>* </span>
                        </Label>
                        <AsyncSelect
                          name={"city"}
                          placeholder="Search city or zipcode"
                          defaultValue={
                            previousStep === 1
                              ? {
                                  label: "",
                                }
                              : {
                                  value:
                                    previousStep === 3
                                      ? jobData?.cityId +
                                        ", " +
                                        jobData?.stateId +
                                        ", " +
                                        jobData?.cityName +
                                        ", " +
                                        jobData?.stateName
                                      : previousData?.cityid +
                                        ", " +
                                        previousData?.stateid +
                                        ", " +
                                        previousData?.cityname +
                                        ", " +
                                        previousData?.statename,
                                  label:
                                    previousStep === 3
                                      ? jobData?.cityName
                                      : previousData?.cityname,
                                }
                            // previousValue.statename
                          }
                          loadOptions={loadOptions}
                          isMulti={false}
                          styles={customStyles}
                          onChange={(e) => getLocationDetails(e)}
                          className={
                            cityValidation === true ? "async-border-red" : ""
                          }
                        />
                        {cityValidation === true && (
                          <FormText color="danger">Please select city</FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="country" className="fw-semi-bold">
                          Country
                        </Label>
                        <Input
                          id={"country"}
                          name={"country"}
                          type={"text"}
                          readOnly
                          value={
                            countryOnchange === false
                              ? previousValue.countryName
                              : "US"
                          }
                          placeholder="Select country"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="zipCode" className="fw-semi-bold">
                          Zip code<span style={{ color: "red" }}>* </span>
                        </Label>
                        <InputMask
                          className={
                            zipCodeValidation === true
                              ? "is-invalid form-control"
                              : "form-control "
                          }
                          id={"zipCode"}
                          name={"zipCode"}
                          mask={"99999"}
                          maskChar={null}
                          defaultValue={
                            previousStep === 3
                              ? preValue.zipcode
                              : previousValue.zipcode
                          }
                          onChange={(e) => loadOptions(e.target.value)}
                          placeholder="Enter zip code"
                        />
                        {zipCodeValidation === true && (
                          <FormText color="danger">
                            Please enter zip code
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} lg={3}>
                      <FormGroup className="mt-4">
                        <Input
                          id={"authorizedtoworkinus"}
                          name={"authorizedtoworkinus"}
                          type={"checkbox"}
                          defaultChecked={
                            previousStep === 3
                              ? preValue.authorizedtoworkinus
                              : previousValue.authorizedtoworkinus
                          }
                        />
                        {"  "}
                        <Label
                          for="authorizedtoworkinus"
                          className="fw-semi-bold"
                        >
                          Authorized to work in United States
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label
                          for="sponsorshiprequiured"
                          className="fw-semi-bold"
                        >
                          Willing to sponsor
                          <span style={{ color: "red" }}>* </span>
                        </Label>
                        <Row>
                          <Col md={4} lg={3}>
                            <Input
                              id={"sponsorshiprequiured"}
                              name={"sponsorshiprequiured"}
                              className="mt-1"
                              type={"radio"}
                              defaultChecked={
                                previousStep === 3
                                  ? preValue.sponsorshiprequiured
                                  : previousValue.sponsorshiprequiured
                              }
                            />{" "}
                            <Label
                              for="sponsorshiprequiured"
                              className="fw-semi-bold"
                            >
                              Yes
                            </Label>
                          </Col>
                          <Col md={4} lg={3}>
                            <Input
                              id={"sponsorshiprequiured"}
                              name={"sponsorshiprequiured"}
                              className="mt-1"
                              type={"radio"}
                              defaultChecked={
                                previousStep === 3
                                  ? preValue.sponsorshiprequiured
                                  : previousValue.sponsorshiprequiured
                              }
                            />{" "}
                            <Label
                              for="sponsorshiprequiured"
                              className="fw-semi-bold"
                            >
                              No
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup className="mt-4">
                        <Input
                          id={"issecurityclearancerequired"}
                          name={"issecurityclearancerequired"}
                          type={"checkbox"}
                          defaultChecked={
                            previousStep === 3
                              ? preValue.issecurityclearancerequired
                              : previousValue.issecurityclearancerequired
                          }
                          onChange={(e) =>
                            setSecurityClearence(e.target.checked)
                          }
                        />{" "}
                        {"  "}
                        <Label
                          for="issecurityclearancerequired"
                          className="fw-semi-bold"
                        >
                          Security clearance required
                        </Label>
                      </FormGroup>
                    </Col>
                    {securityClearence === true && (
                      <Col md={6} lg={3}>
                        <FormGroup>
                          <Label
                            for="securityclearance"
                            className="fw-semi-bold"
                          >
                            Security clearance
                            <span style={{ color: "red" }}>* </span>
                          </Label>
                          <Input
                            id={"securityclearance"}
                            name={"securityclearance"}
                            type={"select"}
                            invalid={securityValidation ? true : false}
                            onChange={() => setSecurityValidation(false)}
                          >
                            <option key={0} value={0}>
                              Select security clearance
                            </option>
                            {securityClearanceOptions.length > 0 &&
                              securityClearanceOptions.map((options) => (
                                <option
                                  key={options.id}
                                  value={options.id}
                                  selected={
                                    previousStep === 3
                                      ? preValue.securityclearanceid
                                      : previousValue.securityclearanceid ===
                                        options.id
                                  }
                                >
                                  {options.name}
                                </option>
                              ))}
                          </Input>
                          {securityValidation === true && (
                            <FormText color="danger">
                              Please select security clearence
                            </FormText>
                          )}
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label
                          for="levelofeducationids"
                          className="fw-semi-bold"
                        >
                          Level of education
                        </Label>
                        <Select
                          defaultValue={educationData}
                          isMulti
                          name="levelofeducationids"
                          options={educationOptions}
                          classNamePrefix="select"
                          placeholder="Select level of education"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="fieldofstudiesids" className="fw-semi-bold">
                          Field of study
                        </Label>
                        <Select
                          defaultValue={studyData}
                          isMulti
                          name="fieldofstudiesids"
                          options={fieldStudyOptions}
                          classNamePrefix="select"
                          placeholder="Select field of study"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={6}>
                      <FormGroup>
                        <Label for="certifications" className="fw-semi-bold">
                          Certification
                        </Label>
                        <Input
                          id={"certifications"}
                          name={"certifications"}
                          type={"text"}
                          placeholder="Enter certification"
                          defaultValue={
                            previousStep === 3
                              ? preValue.certifications
                              : previousValue.certifications
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} lg={6}>
                      <FormGroup>
                        <Label for="description" className="fw-semi-bold">
                          Description<span style={{ color: "red" }}>* </span>
                        </Label>
                        <CKEditor
                          name="description"
                          id="description"
                          maxLength={2000}
                          initData={
                            previousStep === 3
                              ? preValue.description
                              : previousValue.description
                          }
                          onChange={(e) => {
                            setupDescriptionData(e.editor.getData());
                          }}
                          className={
                            descriptionValidation === true
                              ? "ckeditor-invalid"
                              : ""
                          }
                        />
                      </FormGroup>
                      {descriptionValidation === true && (
                        <FormText color="danger">
                          Please enter description
                        </FormText>
                      )}
                    </Col>
                    <Col md={6} lg={6}>
                      <FormGroup>
                        <Label for="companyDetails" className="fw-semi-bold">
                          Company details
                        </Label>
                        <Input
                          id={"companyDetails"}
                          name={"companyDetails"}
                          type={"textarea"}
                          defaultValue={
                            previousStep === 3
                              ? preValue.companyDetail
                              : previousValue.companyDetail
                          }
                          placeholder="Enter company details"
                          maxLength={1000}
                          className={"textarea-height-custom"}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </div>
          <div className="divider" />
          <Button>Save</Button>
        </Form>
      </div>
    </>
  );
}
