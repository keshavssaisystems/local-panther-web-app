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
import { getLocation } from "_store";
import { useSelector } from "react-redux";
import { getSkillsFilter } from "_store";
import AsyncCreatableSelect from "react-select/async-creatable";
import { findRestrictedWords } from "_helpers/helper";
import { BsPlusSquare } from "react-icons/bs";

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

  const getFormValidation2 = (event) => {
    event.preventDefault();
    console.log(event);
  };
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
  const [stateOnchange, setStateOnChange] = useState(false);
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
    // postData(data);
    setPreValue(data);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
    bIFormSubmitted(true);
  };
  // const loadOptions = async (inputValue) => {
  //   if (inputValue.length > 0) {
  //     const { data = [] } = await getLocation(inputValue);
  //     return data.map(({ cityid: value, ...rest }) => {
  //       return {
  //         value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
  //         label: `${rest.location}, ${rest.statename}`,
  //       };
  //     });
  //   }
  // };
  const getLocationDetails = (event) => {
    setCityValidation(false);
    let locationSplit = event.value.split(", ");
    setStateOnChange(true);
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
  // const [successMessage, setSuccessMessage] = useState(false);
  // const [preValue, setPreValue] = useState({
  //   jobType:
  //     data === undefined || data.jobType === undefined
  //       ? ""
  //       : data.jobType.slice(","),
  //   workSchedule:
  //     data === undefined || data.workSchedule === undefined
  //       ? ""
  //       : data.workSchedule.slice(","),
  //   shift:
  //     data === undefined || data.shift === undefined
  //       ? ""
  //       : data.shift.slice(","),
  //   experienceLevel:
  //     data === undefined || data.experienceLevel === undefined
  //       ? ""
  //       : data.experienceLevel,
  //   hiringTimeline:
  //     data === undefined || data.hiringTimeline === undefined
  //       ? ""
  //       : data.hiringTimeline,
  // });
  // const [previousValue, setPreviousValue] = useState({
  //   jobType:
  //     previousData[0] === undefined || previousData[0].jobtypes === undefined
  //       ? ""
  //       : previousData[0].jobtypes.slice(","),
  //   workSchedule:
  //     previousData[0] === undefined ||
  //     previousData[0].workschedules === undefined
  //       ? ""
  //       : previousData[0].workschedules.slice(","),
  //   shift:
  //     previousData[0] === undefined || previousData[0].shifts === undefined
  //       ? ""
  //       : previousData[0].shifts.slice(","),
  //   experienceLevel:
  //     previousData[0] === undefined ||
  //     previousData[0].experiencelevelid === undefined
  //       ? ""
  //       : previousData[0].experiencelevelid,
  //   hiringTimeline:
  //     previousData[0] === undefined ||
  //     previousData[0].hiringtimelineid === undefined
  //       ? ""
  //       : previousData[0].hiringtimelineid,
  // });
  const [jobTypeValidation, setJobTypeValidation] = useState(false);
  // const getFormValidation = (event) => {
  //   event.preventDefault();
  //   let jobType = getJobType(event.target.elements.jobType);
  //   jobType === "" ? setJobTypeValidation(true) : setJobTypeValidation(false);
  //   if (jobType !== "") {
  //     saveData(jobType, event);
  //   }
  // };
  // const saveData = (jobType, event) => {
  //   let workSchedule = getWorkSchedule(event.target.elements.workSchedule);
  //   let shift = getShifts(event.target.elements.shifts);
  //   let data = {
  //     jobType: jobType,
  //     workSchedule: workSchedule,
  //     shift: shift,
  //     experienceLevel: event.target.elements.experienceLevel.value,
  //     hiringTimeline: event.target.elements.hiringTimeline.value,
  //     shiftsOption: shiftsOption,
  //     workScheduleOptions: workScheduleOptions,
  //     jobTypeOption: jobTypeOption,
  //     experienceLevelOption: experienceLevelOption,
  //     hiringTimelineOption: hiringTimelineOption,
  //   };
  //   postData(data);
  //   setPreValue(data);
  //   setSuccessMessage(true);
  //   setTimeout(() => {
  //     setSuccessMessage(false);
  //   }, 2000);
  //   esFormSubmitted(true);
  // };
  const getJobType = (jobTypeArray) => {
    let jobTypeArr = [];
    jobTypeArray.forEach((element) => {
      if (element.checked === true) {
        jobTypeArr.push(element.value);
      }
    });
    return jobTypeArr.toString();
  };
  const getWorkSchedule = (workScheduleArray) => {
    let workScheduleArr = [];
    workScheduleArray.forEach((element) => {
      if (element.checked === true) {
        workScheduleArr.push(element.value);
      }
    });
    return workScheduleArr.toString();
  };
  const getShifts = (shiftArray) => {
    let shiftArr = [];
    shiftArray.forEach((element) => {
      if (element.checked === true) {
        shiftArr.push(element.value);
      }
    });
    return shiftArr.toString();
  };
  let expLevelSelected =
    previousStep === 3
      ? Number(preValue.experienceLevel)
      : previousValue.experienceLevel;
  let hiringSelected =
    previousStep === 3
      ? Number(preValue.hiringTimeline)
      : previousValue.hiringTimeline;

  const [prevKeyQualificationArr1, setPrevKey] = useState([]);
  const [prevKeyQualificationArr2, setPrevKey2] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [skillExist, setSkillExist] = useState(false);
  const [searchOptionalText, setSearchOptionalText] = useState("");
  const [optionalskillExist, setOptionalSkillExist] = useState(false);
  const [isLabelVisible, setLabelVisibility] = useState(true);

  // const [successMessage, setSuccessMessage] = useState(false);
  // let keyQualificationArr1 = [];
  // let keyQualificationArr2 = [];

  const [keyQualificationArr1, setKeyQual1] = useState([]);
  const [keyQualificationArr2, setKeyQual2] = useState([]);

  useEffect(() => {
    if (previousStep === 3 && jobData.length > 0) {
      let new_array1 = [];
      let new_array2 = [];
      jobData.forEach((element) => {
        if (element.isrequired === true) {
          new_array1.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
        if (element.isrequired === false) {
          new_array2.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
      });
      setKeyQual1(new_array1);
      setKeyQual2(new_array2);
    }

    let new_arr3 = [];
    let new_arr4 = [];
    if (previousStep === 1 && previousData.length > 0) {
      previousData.forEach((element) => {
        if (element.isrequired === true) {
          new_arr3.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
        if (element.isrequired === false) {
          new_arr4.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
      });
      setPrevKey(new_arr3);
      setPrevKey2(new_arr4);
    }
  }, []);

  const [mustHaveValidation, setMustHaveValidation] = useState(false);
  const getStringData = (data, type) => {
    let dataArray = [];
    if (data.length === undefined) {
      let skillArr = data.value.split(", ");
      return [
        {
          jobkeyqualifications: 0,
          jobid: 0,
          skillid: skillArr[0],
          skillname: skillArr[1],
          isrequired: type,
          isactive: true,
        },
      ];
    }
    if (data.length !== undefined) {
      data.forEach((element) => {
        let skillArr = element.value.split(", ");
        let obj = {
          jobkeyqualifications: 0,
          jobid: 0,
          skillid: skillArr[0],
          skillname: skillArr[1],
          isrequired: type,
          isactive: true,
        };
        dataArray.push(obj);
      });
      return dataArray;
    }
  };
  const getFormData = (event) => {
    event.preventDefault();
    let mustHaveHasData = false;
    let niceToHaveHasData = false;
    let mustHave = getStringData(event.target.elements.mustHave, true);
    let niceToHave = getStringData(event.target.elements.niceToHave, false);
    if (
      event.target.elements.mustHave.value !== "" ||
      event.target.elements.mustHave.length > 0
    ) {
      mustHaveHasData = true;
    }
    if (
      event.target.elements.niceToHave.value !== "" ||
      event.target.elements.niceToHave.length > 0
    ) {
      niceToHaveHasData = true;
    }
    let data = null;
    if (mustHaveHasData === true && niceToHaveHasData === true) {
      data = mustHave.concat(niceToHave);
    }
    if (mustHaveHasData === true && niceToHaveHasData === false) {
      data = mustHave;
    }
    if (mustHaveHasData === false && niceToHaveHasData === true) {
      data = niceToHave;
    }
    // postData(data);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  };

  const addNewSkill = () => {
    if (searchText === "") {
      return;
    }
    let prevKey = [...prevKeyQualificationArr1];

    let obj = {
      value: 0 + ", " + searchText,
      label: searchText,
    };

    prevKey.push(obj);
    setPrevKey(prevKey);
    setSearchText("");

    let keyQualification1 = [...keyQualificationArr1];
    keyQualification1.push(obj);
    setKeyQual1(keyQualification1);
  };

  const addNewSkillOptional = () => {
    if (searchOptionalText === "") {
      return;
    }
    let prevKey2 = [...prevKeyQualificationArr2];

    let obj = {
      value: 0 + ", " + searchOptionalText,
      label: searchOptionalText,
    };

    prevKey2.push(obj);
    setPrevKey2(prevKey2);
    setSearchOptionalText("");

    let keyQualification2 = [...keyQualificationArr2];
    keyQualification2.push(obj);
    setKeyQual2(keyQualification2);
  };
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      setLabelVisibility(true);
      setSearchText(inputValue);
      const { data = [] } = await getSkillsFilter(inputValue);

      const isKeyTrueForAll = data.some(
        (item) => item["skillname"].toLowerCase() === inputValue.toLowerCase()
      );
      console.log(isKeyTrueForAll);
      if (isKeyTrueForAll) {
        setSkillExist(false);
      } else {
        setSkillExist(true);
      }
      return data.map(({ skillid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.skillname}`,
          label: `${rest.skillname}`,
        };
      });
    }
  };

  const loadOptionsoptional = async (inputValue) => {
    if (inputValue.length > 2) {
      setLabelVisibility(true);
      setSearchOptionalText(inputValue);
      const { data = [] } = await getSkillsFilter(inputValue);

      const isKeyTrueForAll = data.some(
        (item) => item["skillname"].toLowerCase() === inputValue.toLowerCase()
      );
      console.log(isKeyTrueForAll);
      if (isKeyTrueForAll) {
        setOptionalSkillExist(false);
      } else {
        setOptionalSkillExist(true);
      }
      return data.map(({ skillid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.skillname}`,
          label: `${rest.skillname}`,
        };
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      setSearchText("");
      setSkillExist(false);
    }
  };

  const handleKeyDownOptional = (event) => {
    if (event.key === "Backspace") {
      setSearchOptionalText("");
      setOptionalSkillExist(false);
    }
  };
  // const customStyles = {
  //   valueContainer: (provided, state) => ({
  //     ...provided,
  //     minHeight: "30px",
  //     padding: "0 6px",
  //   }),
  //   input: (provided, state) => ({
  //     ...provided,
  //     margin: "0px",
  //   }),
  // };
  const onSelectSkillsDropdown = function (data) {
    setSearchText("");
    if (data.length === 0) {
      setPrevKey([]);
      setKeyQual1([]);
    } else {
      setPrevKey(data);
    }
  };
  const selectOptionalSkills = function (data) {
    setSearchOptionalText("");
    if (data.length === 0) {
      setPrevKey2([]);
      setKeyQual2([]);
    } else {
      setPrevKey2(data);
    }
  };
  const formatCreateLabel = (inputValue) => {
    if (skillExist && inputValue !== "" && inputValue.length > 2) {
      return (
        <span style={{ cursor: "pointer" }}>
          Add new skill - <span style={{ color: "#545cd8" }}>{inputValue}</span>
        </span>
      );
    } else {
      return "";
    }
  };
  const flaggedWordList = useSelector(
    (state) => state.dropdown.flaggedWordsList
  );
  let wordArray = [];
  if (flaggedWordList?.length > 0) {
    flaggedWordList.forEach((element) => {
      wordArray.push(element.name);
    });
  }
  let prevDataArr = [];
  if (previousStep === 1 && previousData.length > 0) {
    previousData.forEach((element) => {
      prevDataArr.push(element.prescreenquestion);
    });
  }
  // const [successMessage, setSuccessMessage] = useState(false);
  const [checkRestrictionValidation, setCheckRestrictionValidation] =
    useState(false);
  const [restrictionValidation1, setRestrictionValidation1] = useState(false);
  const [restrictionValidation2, setRestrictionValidation2] = useState(false);
  const [restrictionValidation3, setRestrictionValidation3] = useState(false);
  const [restrictionWord1, setRestrictionWord1] = useState([]);
  const [restrictionWord2, setRestrictionWord2] = useState([]);
  const [restrictionWord3, setRestrictionWord3] = useState([]);
  const inputArr = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];
  let questionArray = [
    {
      jobprescreenapplicationid: 0,
      jobid: 0,
      iscustomquestion: false,
      prescreenquestionid: "6",
      question: "How would you like applicants to record their answers?",
      isactive: true,
    },
  ];
  if (previousStep === 3 && jobData.length > 0) {
    jobData.forEach((element) => {
      questionArray.push(element.prescreenquestion);
    });
  }

  const [customQuestionInput, setCustomQuestionInput] = useState(inputArr);

  const addInput = () => {
    setCustomQuestionInput((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
        },
      ];
    });
  };
  const getFormValidation3 = (event) => {
    event.preventDefault();
    if (
      restrictionValidation1 === false &&
      restrictionValidation2 === false &&
      restrictionValidation3 === false
    ) {
      getFormValues(event);
      setCheckRestrictionValidation(false);
    } else {
      setCheckRestrictionValidation(true);
      setSuccessMessage(false);
    }
  };
  const getFormValues = (event) => {
    event.preventDefault();
    let questionArr = [];
    let customAnswer =
      event?.target?.elements?.applicantsRecordAnswer?.value === undefined
        ? ""
        : event.target.elements.applicantsRecordAnswer.value;
    if (event.target.elements.question.length > 0) {
      event.target.elements.question.forEach((element) => {
        if (element.checked === true) {
          let questionIdString = element.id.split("_");
          let obj = {
            jobprescreenapplicationid: 0,
            jobid: 0,
            iscustomquestion: false,
            prescreenquestionid: questionIdString[1],
            prescreenquestion: element.value,
            isactive: true,
          };
          questionArr.push(obj);
        }
      });
    }
    if (
      event.target.elements.custom_question !== undefined &&
      event.target.elements.custom_question.length > 0
    ) {
      event.target.elements.custom_question.forEach((element) => {
        let obj = {
          jobprescreenapplicationid: 0,
          jobid: 0,
          iscustomquestion: true,
          prescreenquestionid: 0,
          prescreenquestion: element.value,
          isactive: true,
        };
        questionArr.push(obj);
      });
    }
    if (
      event.target.elements.custom_question !== undefined &&
      event.target.elements.custom_question.length === undefined &&
      event.target.elements.custom_question.value !== ""
    ) {
      let obj = {
        jobprescreenapplicationid: 0,
        jobid: 0,
        iscustomquestion: true,
        prescreenquestionid: 0,
        prescreenquestion: event.target.elements.custom_question.value,
        isactive: true,
      };
      questionArr.push(obj);
    }
    // postData({
    //   questionArr: questionArr,
    //   customAnserType: customAnswer === "" ? "Audio" : customAnswer,
    // });
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  };

  const checkRestrictedWord = (fieldName, string) => {
    if (wordArray.length > 0) {
      if (fieldName === "custom_question_1") {
        let restrictedWords = findRestrictedWords(wordArray, string);
        restrictedWords.wordsCount > 0
          ? setRestrictionValidation1(true)
          : setRestrictionValidation1(false);
        restrictedWords.wordsCount > 0
          ? setRestrictionWord1(restrictedWords.wordsArray)
          : setRestrictionWord1([]);
      }
      if (fieldName === "custom_question_2") {
        let restrictedWords = findRestrictedWords(wordArray, string);
        restrictedWords.wordsCount > 0
          ? setRestrictionValidation2(true)
          : setRestrictionValidation2(false);
        restrictedWords.wordsCount > 0
          ? setRestrictionWord2(restrictedWords.wordsArray)
          : setRestrictionWord2([]);
      }
      if (fieldName === "custom_question_3") {
        let restrictedWords = findRestrictedWords(wordArray, string);
        restrictedWords.wordsCount > 0
          ? setRestrictionValidation3(true)
          : setRestrictionValidation3(false);
        restrictedWords.wordsCount > 0
          ? setRestrictionWord3(restrictedWords.wordsArray)
          : setRestrictionWord3([]);
      }
    }
  };

  return (
    <>
      <div className="form-wizard-content">
        <Form onSubmit={(e) => getFormValidation2(e)}>
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
                    {/* <Col md={6} lg={3}>
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                State
              </Label>
              <Input
                id={"state"}
                name={"state"}
                type={"text"}
                readOnly
                value={
                  stateData.stateName === undefined || stateOnchange === false
                    ? previousValue.stateName
                    : stateData.stateName
                }
                placeholder="Select state"
              />
            </FormGroup>
          </Col> */}
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
                      <FormGroup className="mt-4">
                        <Input
                          id={"sponsorshiprequiured"}
                          name={"sponsorshiprequiured"}
                          type={"checkbox"}
                          defaultChecked={
                            previousStep === 3
                              ? preValue.sponsorshiprequiured
                              : previousValue.sponsorshiprequiured
                          }
                        />{" "}
                        {"  "}
                        <Label
                          for="sponsorshiprequiured"
                          className="fw-semi-bold"
                        >
                          Willing to sponsor
                        </Label>
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
                  <h5 className="m-0 p-0 fw-semi-bold">
                    Experience & Schedules
                  </h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[1]}
                data-parent="#accordion"
                id="collapseTwo"
              >
                <CardBody>
                  <Row>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label className="fw-semi-bold">
                          Job type<span style={{ color: "red" }}>* </span>
                        </Label>
                        {jobTypeOption.length > 0 &&
                          jobTypeOption.map((options) => (
                            <div className="form-group-custom">
                              <Input
                                key={options.id}
                                type="checkbox"
                                name={"jobType"}
                                id={"jobType_" + options.id}
                                defaultChecked={
                                  previousStep === 3
                                    ? preValue?.jobType?.includes(options.id)
                                    : previousValue?.jobType?.includes(
                                        options.id
                                      )
                                }
                                value={options.id}
                                invalid={
                                  jobTypeValidation === true ? true : false
                                }
                              />{" "}
                              {"  "}
                              <Label check for={"jobType_" + options.id}>
                                {options.name}
                              </Label>
                            </div>
                          ))}
                        {jobTypeValidation === true && (
                          <FormText color="danger">
                            Please select any one job type
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="workSchedule" className="fw-semi-bold">
                          Work schedules
                        </Label>
                        {workScheduleOptions.length > 0 &&
                          workScheduleOptions.map((options) => (
                            <div className="form-group-custom">
                              <Input
                                key={options.id}
                                type="checkbox"
                                name={"workSchedule"}
                                id={"workSchedule_" + options.id}
                                defaultChecked={
                                  previousStep === 3
                                    ? preValue?.workSchedule?.includes(
                                        options.id
                                      )
                                    : previousValue?.workSchedule?.includes(
                                        options.id
                                      )
                                }
                                value={options.id}
                              />{" "}
                              {"  "}
                              <Label check for={"workSchedule_" + options.id}>
                                {options.name}
                              </Label>
                            </div>
                          ))}
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="shifts" className="fw-semi-bold">
                          Shifts
                        </Label>
                        {shiftsOption.length > 0 &&
                          shiftsOption.map((options) => (
                            <div className="form-group-custom">
                              <Input
                                key={options.id}
                                type="checkbox"
                                name={"shifts"}
                                id={"shifts_" + options.id}
                                defaultChecked={
                                  previousStep === 3
                                    ? preValue?.shift?.includes(options.id)
                                    : previousValue?.shift?.includes(options.id)
                                }
                                value={options.id}
                              />{" "}
                              {"  "}
                              <Label check for={"shifts_" + options.id}>
                                {options.name}
                              </Label>
                            </div>
                          ))}
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}></Col>
                  </Row>
                  <Row>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for={"experienceLevel"} className="fw-semi-bold">
                          Experience level
                        </Label>
                        <Input
                          id={"experienceLevel"}
                          name={"experienceLevel"}
                          type={"select"}
                        >
                          <option key={0} value={""}>
                            Select experience level
                          </option>
                          {experienceLevelOption.length > 0 &&
                            experienceLevelOption.map((options) => (
                              <option
                                key={options.id}
                                value={options.id}
                                selected={expLevelSelected === options.id}
                              >
                                {options.name}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for={"hiringTimeline"} className="fw-semi-bold">
                          Hiring timeline
                        </Label>
                        <Input
                          id={"hiringTimeline"}
                          name={"hiringTimeline"}
                          type={"select"}
                        >
                          <option key={0} value={""}>
                            Select hiring timeline
                          </option>
                          {hiringTimelineOption.length > 0 &&
                            hiringTimelineOption.map((options) => (
                              <option
                                key={options.id}
                                value={options.id}
                                selected={hiringSelected === options.id}
                              >
                                {options.name}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}></Col>
                    <Col md={6} lg={3}></Col>
                  </Row>
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
                  <h5 className="m-0 p-0 fw-semi-bold">
                    Compensation & Benefits
                  </h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[2]}
                data-parent="#accordion"
                id="collapseThree"
              >
                <CardBody>
                  <Row>
                    <Col md={6} lg={3}>
                      {" "}
                      <FormGroup>
                        <Label className="fw-semi-bold">Pay period type</Label>
                        <Input
                          id={"payPeriodType"}
                          name={"payPeriodType"}
                          type={"select"}
                        >
                          <option key={0} value={""}>
                            Select pay period type
                          </option>
                          {payPeriodTypeOption.length > 0 &&
                            payPeriodTypeOption.map((options) => (
                              <option
                                key={options.id}
                                value={options.id}
                                selected={
                                  previousStep === 3
                                    ? preValue.payPeriodType
                                    : previousValue.payPeriodType === options.id
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
                        <Label for={"minimumAmount"} className="fw-semi-bold">
                          Minimum base pay
                        </Label>
                        <Input
                          id={"minimumAmount"}
                          name={"minimumAmount"}
                          type={"number"}
                          min={0}
                          defaultValue={
                            previousStep === 3
                              ? preValue.minimumAmount
                              : previousValue.minimumAmount
                          }
                          placeholder="Enter minimum base pay"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}>
                      <FormGroup>
                        <Label for="maximumAmount" className="fw-semi-bold">
                          Maximum base pay
                        </Label>
                        <Input
                          id={"maximumAmount"}
                          name={"maximumAmount"}
                          type={"number"}
                          min={0}
                          defaultValue={
                            previousStep === 3
                              ? preValue.maximumAmount
                              : previousValue.maximumAmount
                          }
                          placeholder="Enter maximum base pay"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={3}></Col>
                  </Row>
                  <Row>
                    <Col md={6} lg={6}>
                      <FormGroup>
                        <Label
                          for="compensationPackage"
                          className="fw-semi-bold"
                        >
                          Additional compensation
                        </Label>
                        <Input
                          id={"compensationPackage"}
                          name={"compensationPackage"}
                          type={"textarea"}
                          placeholder="Enter additional compensation"
                          defaultValue={
                            previousStep === 3
                              ? preValue.compensationPackage
                              : previousValue.compensationPackage
                          }
                          maxLength={1000}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={6}>
                      <FormGroup>
                        <Label for="benefits" className="fw-semi-bold">
                          Benefits
                        </Label>
                        <Input
                          id={"benefits"}
                          name={"benefits"}
                          type={"textarea"}
                          placeholder="Enter benefits"
                          defaultValue={
                            previousStep === 3
                              ? preValue.benefits
                              : previousValue.benefits
                          }
                          maxLength={1000}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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
                  <h5 className="m-0 p-0 fw-semi-bold">Key Qualification</h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[3]}
                data-parent="#accordion"
                id="collapseFour"
              >
                <CardBody>
                  <Row>
                    <Label className="fw-semi-bold">
                      Additional qualification for the role
                    </Label>
                    <Col md={6} lg={4}>
                      <FormGroup>
                        <Label for={"mustHave"} className="fw-semi-bold">
                          Must have
                        </Label>

                        <AsyncCreatableSelect
                          name="mustHave"
                          placeholder="Search to select"
                          loadOptions={loadOptions}
                          isMulti={true}
                          styles={customStyles}
                          value={
                            previousStep === 3
                              ? keyQualificationArr1
                              : prevKeyQualificationArr1
                          }
                          onKeyDown={(e) => handleKeyDown(e)}
                          onChange={(evt) => onSelectSkillsDropdown(evt)}
                          formatCreateLabel={formatCreateLabel}
                          onCreateOption={addNewSkill}
                        />
                        {mustHaveValidation === true && (
                          <FormText color="danger">
                            Please select must have skiils for better
                            recommendations
                          </FormText>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6} lg={4}>
                      <FormGroup>
                        <Label for={"niceToHave"} className="fw-semi-bold">
                          Nice to have
                        </Label>

                        <AsyncCreatableSelect
                          name="niceToHave"
                          id="niceToHave"
                          placeholder="Search to select"
                          loadOptions={loadOptionsoptional}
                          isMulti={true}
                          styles={customStyles}
                          value={
                            previousStep === 3
                              ? keyQualificationArr2
                              : prevKeyQualificationArr2
                          }
                          onKeyDown={(e) => handleKeyDownOptional(e)}
                          onChange={(evt) => selectOptionalSkills(evt)}
                          formatCreateLabel={formatCreateLabel}
                          onCreateOption={addNewSkillOptional}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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
                  <h5 className="m-0 p-0 fw-semi-bold">
                    Pre-screen Applicants
                  </h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[4]}
                data-parent="#accordion"
                id="collapseFive"
              >
                <CardBody>
                  <Row>
                    <Col>
                      {preScreenQuestionsOption.length > 0 &&
                        preScreenQuestionsOption.map((options) => (
                          <FormGroup>
                            <Input
                              id={
                                options.questiontype +
                                "_" +
                                options.prescreenquestionid
                              }
                              name={"question"}
                              type={"checkbox"}
                              value={options.prescreenquestion}
                              defaultChecked={
                                previousStep === 3
                                  ? questionArray.includes(
                                      options.prescreenquestion
                                    )
                                  : prevDataArr.includes(
                                      options.prescreenquestion
                                    )
                              }
                            />{" "}
                            {"  "}
                            <Label
                              className="fw-semi-bold"
                              for={
                                options.questiontype +
                                "_" +
                                options.prescreenquestionid
                              }
                            >
                              {options.prescreenquestion}
                            </Label>
                          </FormGroup>
                        ))}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={7}>
                      {customQuestionInput?.map((item, i) => {
                        if (i > 0) {
                          return (
                            <FormGroup>
                              <Label className="fw-semi-bold">
                                Custom Question {i}
                              </Label>
                              <Input
                                id={i}
                                name={"custom_question"}
                                type={item.type}
                                maxLength="100"
                                onChange={(e) =>
                                  checkRestrictedWord(
                                    "custom_question_" + i,
                                    e.target.value
                                  )
                                }
                              />
                              {i === 1 && restrictionValidation1 === true && (
                                <FormText
                                  color="danger"
                                  className="custom-question-validation"
                                >
                                  Your input contains the flagged word '{" "}
                                  <b>{restrictionWord1.toString()}</b> '.
                                </FormText>
                              )}
                              {i === 2 && restrictionValidation2 === true && (
                                <FormText
                                  color="danger"
                                  className="custom-question-validation"
                                >
                                  Your input contains the flagged word '{" "}
                                  <b>{restrictionWord2.toString()}</b> '.
                                </FormText>
                              )}
                              {i === 3 && restrictionValidation3 === true && (
                                <FormText
                                  color="danger"
                                  className="custom-question-validation"
                                >
                                  Your input contains the flagged word '{" "}
                                  <b>{restrictionWord3.toString()}</b> '.
                                </FormText>
                              )}
                            </FormGroup>
                          );
                        }
                      })}
                    </Col>
                  </Row>
                  {customQuestionInput.length < 4 && (
                    <Col md={5}>
                      <Button
                        color="link"
                        onClick={addInput}
                        className="custom-add-button"
                      >
                        <BsPlusSquare className="mb-1" /> Add{"  "}
                        {customQuestionInput.length > 1 ? "another" : ""} custom
                        question
                      </Button>
                    </Col>
                  )}

                  {customQuestionInput.length > 1 && (
                    <Row>
                      <Col md={5}>
                        <FormGroup>
                          <Label className="fw-semi-bold">
                            How would you like applicants to record their
                            answers?
                          </Label>
                          <FormGroup>
                            <Row>
                              <Col md={3}>
                                <Input
                                  id={"applicantsRecordAnswer"}
                                  name={"applicantsRecordAnswer"}
                                  type={"radio"}
                                  value={"Audio"}
                                />{" "}
                                {"  "}
                                <Label className="fw-semi-bold">Audio</Label>
                              </Col>
                              <Col md={3}>
                                <Input
                                  id={"applicantsRecordAnswer"}
                                  name={"applicantsRecordAnswer"}
                                  type={"radio"}
                                  value={"Video"}
                                />{" "}
                                {"  "}
                                <Label className="fw-semi-bold">Video</Label>
                              </Col>
                              <Col md={3}>
                                <Input
                                  id={"applicantsRecordAnswer"}
                                  name={"applicantsRecordAnswer"}
                                  type={"radio"}
                                  value={"Text"}
                                />{" "}
                                {"  "}
                                <Label className="fw-semi-bold">Text</Label>
                              </Col>
                            </Row>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
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
