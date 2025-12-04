import React, { useEffect, useState, forwardRef, useCallback } from "react";
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
// import { CKEditor } from "ckeditor4-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./createJob.scss";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import InputMask from "react-input-mask";
import { useSelector, useDispatch } from "react-redux";
import {
  getLocation,
  getSkillsFilter,
  addLevelOfEducation,
  educationActions,
  studyFieldActions,
  addFieldOfStudy,
  dropdownActions,
  addCertification,
  certificationTypeActions,
} from "_store";
import AsyncCreatableSelect from "react-select/async-creatable";
import { findRestrictedWords } from "_helpers/helper";
import { BsPlusSquare } from "react-icons/bs";
import { locationActions } from "_store";
import debounce from "lodash/debounce";

import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  ToolbarView,
  Heading,
  Underline,
  Strikethrough,
  Link,
  BlockQuote,
  Undo,
  Alignment,
} from "ckeditor5";

// import { FormatPainter } from "ckeditor5-premium-features";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import CreatableSelect from "react-select/creatable";
import { assign } from "lodash";

export const CreateJob = forwardRef(
  (
    {
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
      customerDetails,
      nextPage,
      certificationList,
    },
    ref
  ) => {
    const dispatch = useDispatch();
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

    useEffect((e) => {
      if (type === "new_template" && previousStep !== 3) {
        setZipcodeCityState({
          value: "",
          label: "Search city or zip code",
        });
      }
      if (type === "previous_template" || type === "recommendation_template") {
        let data = {
          basicInformation: {
            companyId: previousData?.companyname,
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
            // isdraft:
            //   type === "previous_template" ? previousData?.isdraft : true,
            // isdraft:
            //   previousData?.isdraft !== undefined
            //     ? previousData?.isdraft
            //     : true,
          },

          experienceSchedule: {
            jobType:
              previousData?.jobExperienceScheduleDtos === null ||
                previousData?.jobExperienceScheduleDtos?.length === 0
                ? ""
                : previousData?.jobExperienceScheduleDtos[0]?.jobtypes,
            workSchedule:
              previousData?.jobExperienceScheduleDtos === null ||
                previousData?.jobExperienceScheduleDtos?.length === 0
                ? ""
                : previousData?.jobExperienceScheduleDtos[0]?.workschedules,
            shift:
              previousData?.jobExperienceScheduleDtos === null ||
                previousData?.jobExperienceScheduleDtos?.length === 0
                ? ""
                : previousData?.jobExperienceScheduleDtos[0]?.shifts,
            experienceLevel:
              previousData?.jobExperienceScheduleDtos === null ||
                previousData?.jobExperienceScheduleDtos?.length === 0
                ? ""
                : previousData?.jobExperienceScheduleDtos[0]?.experiencelevelid,
            hiringTimeline:
              previousData?.jobExperienceScheduleDtos === null ||
                previousData?.jobExperienceScheduleDtos?.length === 0
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
              previousData?.jobPaymentBenefitDtos === null ||
                previousData?.jobPaymentBenefitDtos?.length === 0
                ? ""
                : previousData?.jobPaymentBenefitDtos[0]?.payperiodtypeid,
            minimumAmount:
              previousData?.jobPaymentBenefitDtos === null ||
                previousData?.jobPaymentBenefitDtos?.length === 0
                ? ""
                : previousData?.jobPaymentBenefitDtos[0]?.minimumamount,
            maximumAmount:
              previousData?.jobPaymentBenefitDtos === null ||
                previousData?.jobPaymentBenefitDtos?.length === 0
                ? ""
                : previousData?.jobPaymentBenefitDtos[0]?.maximumamount,
            compensationPackage:
              previousData?.jobPaymentBenefitDtos === null ||
                previousData?.jobPaymentBenefitDtos?.length === 0
                ? ""
                : previousData?.jobPaymentBenefitDtos[0]?.compensationpackage,
            benefits:
              previousData?.jobPaymentBenefitDtos === null ||
                previousData?.jobPaymentBenefitDtos?.length === 0
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

        JobDataForPreview(data);
        setZipcodeCityState({
          value:
            previousData?.cityid +
            ", " +
            previousData?.stateid +
            ", " +
            previousData?.cityname +
            ", " +
            previousData?.statename,
          label: previousData?.cityname + ", " + previousData?.statename,
        });
        getLocationDetails({
          value:
            previousData?.cityid +
            ", " +
            previousData?.stateid +
            ", " +
            previousData?.cityname +
            ", " +
            previousData?.statename,
          label: previousData?.cityname + ", " + previousData?.statename,
        });
      }

      // load once on mount

      // optionally set default selected value if jobData contains assigned to id
      const hiringManagerDto =
        (type === "new_template" && previousStep !== 3)
          ? null
          : previousStep === 3
            ? jobData?.basicInformation?.hiringManagerDto
            : previousData?.hiringManagerDto;


      if (hiringManagerDto) {
        const found = {
          value: hiringManagerDto?.id,
          label: hiringManagerDto?.name,
        };
        if (found) setAssignedToValue(found);
      }

      const clientCompanyDto =
        (type === "new_template" && previousStep !== 3)
          ? null
          : previousStep === 3
            ? jobData?.basicInformation?.clientcompanyDto
            : previousData?.clientcompanyDto;

      if (clientCompanyDto) {
        const found = {
          value: clientCompanyDto?.id,
          label: clientCompanyDto?.name,
        };
        if (found) setClientCompanyValue(found);
      }

    }, []);

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

    let certificationOptions = certificationList.map(
      ({ id: value, ...rest }) => {
        return {
          value: `${value}`,
          label: `${rest.name}`,
        };
      }
    );
    const [stateData, setStateData] = useState({});
    const [mustHaveSkills, setMustHaveSkills] = useState([]);
    const [niceToHaveSkills, setNiceToHaveSkills] = useState([]);
    const [assignedToUserOptions, setAssignedToUserOptions] = useState([]);
    const [assignedToValue, setAssignedToValue] = useState(null);
    const [clientCompanyOptions, setClientCompanyOptions] = useState([]);
    const [clientCompanyValue, setClientCompanyValue] = useState(null);
    const [hiringManagerOptions, setHiringManagerOptions] = useState([]);
    const [hiringManagerValue, setHiringManagerValue] = useState(null);

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

    const getCertificationData = (data) => {
      if (data?.certifications?.split(",")?.length > 0) {
        let newData = data.certifications.split(",");
        let newOptions = certificationOptions.filter((data) =>
          newData.includes(data.value)
        );
        console.log(newOptions);
        return newOptions;
      }
      if (data?.certifications?.split(",")?.length === undefined) {
        return certificationOptions.filter(
          (data2) => data2.value === Number(data?.certifications)
        );
      }
    };

    let certificationsData =
      previousStep === 3
        ? getCertificationData(jobData.basicInformation)
        : getCertificationData(previousData);

    // let educationData =
    //   previousStep === 3
    //     ? getEducationData(jobData.basicInformation)
    //     : getEducationData(previousData);

    // let studyData =
    //   previousStep === 3
    //     ? getStudyData(jobData.basicInformation)
    //     : getStudyData(previousData);
    let preValue = {
      companyId: "",
      jobTitle:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.jobTitle === undefined
          ? ""
          : jobData.basicInformation.jobTitle,
      noOfPostions:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.noOfPostions === undefined
          ? ""
          : jobData.basicInformation.noOfPostions,
      jobLocation:
        jobData.basicInformation === undefined ||
          jobData.basicInformation?.jobLocation === undefined
          ? ""
          : jobData.basicInformation?.jobLocation,
      address:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.address === undefined
          ? ""
          : jobData.basicInformation.address,
      cityId:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.cityId === undefined
          ? ""
          : jobData.basicInformation.cityId,
      stateId:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.stateId === undefined
          ? ""
          : jobData.basicInformation.stateId,
      cityName:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.cityName === undefined
          ? ""
          : jobData.basicInformation.cityName,
      stateName:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.stateName === undefined
          ? ""
          : jobData.basicInformation.stateName,
      zipcode:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.zipcode === undefined
          ? ""
          : jobData.basicInformation.zipcode,
      description:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.description === undefined
          ? ""
          : jobData.basicInformation.description,
      companyDetail:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.companyDetail === undefined
          ? ""
          : jobData.basicInformation.companyDetail,
      authorizedtoworkinus:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.authorizedtoworkinus === undefined
          ? ""
          : jobData.basicInformation.authorizedtoworkinus,
      sponsorshiprequiured:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.sponsorshiprequiured === undefined
          ? ""
          : jobData.basicInformation.sponsorshiprequiured,
      certifications:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.certifications === undefined
          ? ""
          : jobData.basicInformation.certifications,
      subsidiaryid:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.subsidiaryid === undefined
          ? ""
          : jobData.basicInformation.subsidiaryid,
      issecurityclearancerequired:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.issecurityclearancerequired === undefined
          ? ""
          : jobData.basicInformation.issecurityclearancerequired,
      securityclearanceid:
        jobData.basicInformation === undefined ||
          jobData.basicInformation.securityclearance === undefined
          ? ""
          : jobData.basicInformation.securityclearance,
      jobType:
        jobData.experienceSchedule === undefined ||
          jobData.experienceSchedule.jobType === undefined
          ? ""
          : jobData.experienceSchedule.jobType.slice(","),
      workSchedule:
        jobData.experienceSchedule === undefined ||
          jobData.experienceSchedule.workSchedule === undefined
          ? ""
          : jobData.experienceSchedule.workSchedule.slice(","),
      shift:
        jobData.experienceSchedule === undefined ||
          jobData.experienceSchedule.shift === undefined
          ? ""
          : jobData.experienceSchedule.shift.slice(","),
      experienceLevel:
        jobData.experienceSchedule === undefined ||
          jobData.experienceSchedule.experienceLevel === undefined
          ? ""
          : jobData.experienceSchedule.experienceLevel,
      hiringTimeline:
        jobData.experienceSchedule === undefined ||
          jobData.experienceSchedule.hiringTimeline === undefined
          ? ""
          : jobData.experienceSchedule.hiringTimeline,
      payPeriodType:
        jobData.paymentBenifits === undefined ||
          jobData.paymentBenifits.payPeriodType === undefined
          ? ""
          : jobData.paymentBenifits.payPeriodType,
      minimumAmount:
        jobData.paymentBenifits === undefined ||
          jobData.paymentBenifits.minimumAmount === undefined
          ? ""
          : jobData.paymentBenifits.minimumAmount,
      maximumAmount:
        jobData.paymentBenifits === undefined ||
          jobData.paymentBenifits.maximumAmount === undefined
          ? ""
          : jobData.paymentBenifits.maximumAmount,
      compensationPackage:
        jobData.paymentBenifits === undefined ||
          jobData.paymentBenifits.compensationPackage === undefined
          ? ""
          : jobData.paymentBenifits.compensationPackage,
      benefits:
        jobData.paymentBenifits === undefined ||
          jobData.paymentBenifits.benefits === undefined
          ? ""
          : jobData.paymentBenifits.benefits,
    };
    let previousValue = {
      companyId: "",
      jobTitle:
        previousData === undefined || previousData.jobtitle === undefined
          ? ""
          : previousData.jobtitle,
      noOfPostions:
        previousData === undefined ||
          previousData.noofopenposition === undefined
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
      jobType:
        !previousData?.jobExperienceScheduleDtos ||
          previousData?.jobExperienceScheduleDtos?.length === 0
          ? ""
          : previousData?.jobExperienceScheduleDtos[0].jobtypes.slice(","),
      workSchedule:
        !previousData?.jobExperienceScheduleDtos ||
          previousData?.jobExperienceScheduleDtos?.length === 0
          ? ""
          : previousData?.jobExperienceScheduleDtos[0].workschedules.slice(","),
      shift:
        !previousData?.jobExperienceScheduleDtos ||
          previousData?.jobExperienceScheduleDtos?.length === 0
          ? ""
          : previousData?.jobExperienceScheduleDtos[0].shifts.slice(","),
      experienceLevel:
        !previousData?.jobExperienceScheduleDtos ||
          previousData?.jobExperienceScheduleDtos?.length === 0
          ? ""
          : previousData?.jobExperienceScheduleDtos[0].experiencelevelid,
      hiringTimeline:
        !previousData?.jobExperienceScheduleDtos ||
          previousData?.jobExperienceScheduleDtos?.length === 0
          ? ""
          : previousData?.jobExperienceScheduleDtos[0].hiringtimelineid,
      payPeriodType:
        !previousData?.jobPaymentBenefitDtos ||
          previousData?.jobPaymentBenefitDtos?.length === 0
          ? ""
          : previousData?.jobPaymentBenefitDtos[0].payperiodtypeid,
      minimumAmount:
        !previousData?.jobPaymentBenefitDtos ||
          previousData?.jobPaymentBenefitDtos?.length === 0
          ? ""
          : previousData?.jobPaymentBenefitDtos[0].minimumamount,
      maximumAmount:
        !previousData?.jobPaymentBenefitDtos ||
          previousData?.jobPaymentBenefitDtos?.length === 0
          ? ""
          : previousData?.jobPaymentBenefitDtos[0].maximumamount,
      compensationPackage:
        !previousData?.jobPaymentBenefitDtos ||
          previousData?.jobPaymentBenefitDtos?.length === 0
          ? ""
          : previousData?.jobPaymentBenefitDtos[0].compensationpackage,
      benefits:
        !previousData?.jobPaymentBenefitDtos ||
          previousData?.jobPaymentBenefitDtos?.length === 0
          ? ""
          : previousData?.jobPaymentBenefitDtos[0].benefits,
    };
    let jobLocationRaw =
      previousStep === 3
        ? jobData?.basicInformation?.jobLocation
        : previousData?.joblocationid;
    const [jobLocationOption, setJobLocationOption] = useState(
      jobLocationRaw === undefined ? 0 : jobLocationRaw
    );
    useEffect(() => {
      if (previousStep === 3) {
        setZipcodeCityState({
          value:
            jobData?.basicInformation?.cityId +
            ", " +
            jobData?.basicInformation?.stateId +
            ", " +
            jobData?.basicInformation?.cityName +
            ", " +
            jobData?.basicInformation?.stateName,
          label:
            jobData?.basicInformation?.cityName +
            ", " +
            jobData?.basicInformation?.stateName,
        });
      }

      if (previousStep === 3 && jobData?.keyQualification?.length > 0) {
        let new_array1 = [];
        let new_array2 = [];
        jobData.keyQualification.forEach((element) => {
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
      if (
        previousStep === 1 &&
        previousData?.jobKeyQualificationDtos?.length > 0
      ) {
        previousData?.jobKeyQualificationDtos?.forEach((element) => {
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

      if (previousStep === 1 && previousData?.levelofeducationids) {
        let educationData =
          previousStep === 3
            ? getEducationData(jobData.basicInformation)
            : getEducationData(previousData);
        setEduArr(educationData);
      }
      if (
        previousStep === 3 &&
        jobData?.basicInformation?.levelofeducationids
      ) {
        let educationData =
          previousStep === 3
            ? getEducationData(jobData.basicInformation)
            : getEducationData(previousData);
        setEduPrevArr(educationData);
      }

      if (previousStep === 1 && previousData?.fieldofstudiesids) {
        let studyData =
          previousStep === 3
            ? getStudyData(jobData.basicInformation)
            : getStudyData(previousData);
        setStudyFieldArr(studyData);
      }
      if (previousStep === 3 && jobData.basicInformation.fieldofstudiesids) {
        let studyData =
          previousStep === 3
            ? getStudyData(jobData.basicInformation)
            : getStudyData(previousData);
        setStudyFieldPrevArr(studyData);
      }

      if ((previousStep === 1 || previousStep === 3) && previousData?.certifications) {

        let certificationData =
          previousStep === 3
            ? getCertificationData(jobData.basicInformation)
            : getCertificationData(previousData);
        setCertificateArr(certificationData);
        setCertificatePrevArr(certificationData);
      }

    }, []);
    const [descriptionData, setDescriptionData] = useState(
      previousStep === 3 && preValue.description !== ""
        ? preValue.description
        : previousStep === 1 && previousValue.description !== ""
          ? previousValue.description
          : ""
    );
    const [autoAuthorised, setAutoAuthorised] = useState(false);
    const [companyValidation, setcompanyValidation] = useState(false);
    const [jobTitleValidation, setJobTitleValidation] = useState(false);
    const [openPositionValidation, setOpenPositionValidation] = useState(false);
    const [jobLocationValidation, setJobLocationValidation] = useState(false);
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
    const [jobTypeValidation, setJobTypeValidation] = useState(false);
    const [payPeriodTypeValidation, setPayPeriodTypeValidation] =
      useState(false);
    const [minimumBasepayValidation, setMinimumBasepayValidation] =
      useState(false);
    const [maximumBasepayValidation, setMaximumBasepayValidation] =
      useState(false);
    const [mustHaveValidation, setMustHaveValidation] = useState(false);
    const [prevKeyQualificationArr1, setPrevKey] = useState([]);
    const [prevKeyQualificationArr2, setPrevKey2] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [skillExist, setSkillExist] = useState(false);
    const [searchOptionalText, setSearchOptionalText] = useState("");
    const [optionalskillExist, setOptionalSkillExist] = useState(false);
    const [isLabelVisible, setLabelVisibility] = useState(true);
    const [keyQualificationArr1, setKeyQual1] = useState([]);
    const [keyQualificationArr2, setKeyQual2] = useState([]);
    const [keyQualicationChange, setKeyQualifucationChange] = useState(false);
    const [eduArr, setEduArr] = useState([]);
    const [eduPrevArr, setEduPrevArr] = useState([]);
    const [levelOfEduChange, setLevelOfEduChange] = useState(false);
    const [studyFieldArr, setStudyFieldArr] = useState([]);
    const [studyFieldPrevArr, setStudyFieldPrevArr] = useState([]);
    const [studyFieldChange, setStudyFieldChange] = useState(false);

    const [certificateArr, setCertificateArr] = useState([]);
    const [certificatePrevArr, setCertificatePrevArr] = useState([]);
    const [certificateChange, setCertificateChange] = useState(false);
    const [clientCompanyValidation, setClientCompanyValidation] = useState(false);
    const [hiringmanagerValidation, setHiringmanagerValidation] = useState(false);
    const flaggedWordList = useSelector(
      (state) => state.dropdown.flaggedWordsList
    );
    const [zipcodeChange, setZipcodeChange] = useState(false);
    const [zipcodeCityState, setZipcodeCityState] = useState({});
    let wordArray = [];
    if (flaggedWordList?.length > 0) {
      flaggedWordList.forEach((element) => {
        wordArray.push(element.name);
      });
    }
    let prevDataArr = [];
    if (
      previousStep === 1 &&
      previousData?.jobPrescreenApplicationDtos?.length > 0
    ) {
      previousData.jobPrescreenApplicationDtos.forEach((element) => {
        prevDataArr.push(element.prescreenquestion);
      });
    }
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
    if (previousStep === 3 && jobData.preScreen?.length > 0) {
      jobData.preScreen.forEach((element) => {
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
    const [zipCodeFromCityState, setZipCodeFromCityState] = useState(false);
    const getFormValidation = (event) => {
      event.preventDefault();
      event.target.elements.companyName.value === ""
        ? setcompanyValidation(true)
        : setcompanyValidation(false);
      event.target.elements.jobTitle.value === ""
        ? setJobTitleValidation(true)
        : setJobTitleValidation(false);
      event.target.elements.openPositions.value === "" ||
        Number(event.target.elements.openPositions.value) === 0
        ? setOpenPositionValidation(true)
        : setOpenPositionValidation(false);
      event.target.elements.jobLocation.value === "0"
        ? setJobLocationValidation(true)
        : setJobLocationValidation(false);
      event.target.elements.city.value === ""
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
      let jobType = getJobType(event.target.elements.jobType);
      jobType === "" ? setJobTypeValidation(true) : setJobTypeValidation(false);
      event.target.elements.payPeriodType.value === ""
        ? setPayPeriodTypeValidation(true)
        : setPayPeriodTypeValidation(false);
      event.target.elements.minimumAmount.value === ""
        ? setMinimumBasepayValidation(true)
        : setMinimumBasepayValidation(false);
      event.target.elements.maximumAmount.value === ""
        ? setMaximumBasepayValidation(true)
        : setMaximumBasepayValidation(false);
      prevKeyQualificationArr1?.length === 0 &&
        keyQualificationArr1?.length === 0
        ? setMustHaveValidation(true)
        : setMustHaveValidation(false);

      customerDetails.isatsenable === true && (event.target.elements.assignedto.value === "" || event.target.elements.assignedto.value === "0")
        ? setHiringmanagerValidation(true)
        : setHiringmanagerValidation(false);

      customerDetails.isatsenable === true && (event.target.elements.clientCompany.value === "" || event.target.elements.clientCompany.value === "0")
        ? setClientCompanyValidation(true)
        : setClientCompanyValidation(false);

      if (mustHaveValidation === true) {
        setAccordion([false, false, false, true, false]);
      }
      if (
        payPeriodTypeValidation === true ||
        minimumBasepayValidation === true ||
        maximumBasepayValidation === true
      ) {
        setAccordion([false, false, true, false, false]);
      }
      if (jobTypeValidation === true) {
        setAccordion([false, true, false, false, false]);
      }
      if (
        companyValidation === true ||
        jobTitleValidation === true ||
        openPositionValidation === true ||
        jobLocationValidation === true ||
        cityValidation === true ||
        descriptionValidation === true ||
        addressValidation === true ||
        hiringmanagerValidation === true ||
        clientCompanyValidation === true
      ) {
        setAccordion([true, false, false, false, false]);
      }

      if (
        event.target.elements.companyName.value !== "" &&
        event.target.elements.jobTitle.value !== "" &&
        event.target.elements.openPositions.value !== "" &&
        event.target.elements.jobLocation.value !== "0" &&
        Number(event.target.elements.openPositions.value) !== 0 &&
        event.target.elements.zipCode.value !== "" &&
        event.target.elements.city.value !== "" &&
        descriptionData !== "" &&
        checkJobLocationCondition === true &&
        checkSecurity === true &&
        jobType !== "" &&
        event.target.elements.payPeriodType.value !== "" &&
        event.target.elements.minimumAmount.value !== "" &&
        event.target.elements.maximumAmount.value !== "" &&
        (event.target.elements.mustHave.value !== "" ||
          event.target.elements.mustHave?.length > 0) &&
        (customerDetails?.isatsenable === true ? (event.target.elements.clientCompany.value !== "" ||
          event.target.elements.clientCompany?.length > 0) : true) &&
        (customerDetails?.isatsenable === true ? (event.target.elements.assignedto.value !== "" ||
          event.target.elements.assignedto?.length > 0) : true)
      ) {
        saveData(event);
      }
    };
    const saveData = (eventData) => {
      let educationString = getEducationFormData(eventData);
      let studyString = getStudyFormData(eventData);
      let certificationString = getCertificationFormData(eventData);
      let workSchedule = getWorkSchedule(
        eventData.target.elements.workSchedule
      );
      let shift = getShifts(eventData.target.elements.shifts);
      let basicInformation = {
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
          eventData.target.elements.sponsorshiprequiured.value === "yes"
            ? true
            : false,
        levelofeducationids: educationString,
        fieldofstudiesids: studyString,
        certifications: certificationString,
        levelofeducationOption: levelOfEducationOption,
        fieldofstudiesOption: fieldOfStudyOption,
        certificationsOptions: certificationList,
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
        hiringmanagerid: hiringManagerValue?.value || 0,
        hiringManagerDto: { id: hiringManagerValue?.value || 0, name: hiringManagerValue?.label || '' },
        clientcompanyid: clientCompanyValue?.value || 0,
        clientCompanyDto: { id: clientCompanyValue?.value || 0, name: clientCompanyValue?.label || '' },
        assignedtoid: assignedToValue?.value || 0,
        assignedToDto: { id: assignedToValue?.value || 0, name: assignedToValue?.label || '' },

        // isdraft: type === "previous_template" ? previousData?.isdraft : true,
        // isdraft:
        //   previousData?.isdraft !== undefined ? previousData?.isdraft : true,
      };

      let experienceSchedule = {
        jobType: getJobType(eventData.target.elements.jobType),
        workSchedule: workSchedule,
        shift: shift,
        experienceLevel: eventData.target.elements.experienceLevel.value,
        hiringTimeline: eventData.target.elements.hiringTimeline.value,
        shiftsOption: shiftsOption,
        workScheduleOptions: workScheduleOptions,
        jobTypeOption: jobTypeOption,
        experienceLevelOption: experienceLevelOption,
        hiringTimelineOption: hiringTimelineOption,
      };
      let paymentBenifits = {
        payPeriodType: eventData.target.elements.payPeriodType.value,
        minimumAmount: eventData.target.elements.minimumAmount.value,
        maximumAmount: eventData.target.elements.maximumAmount.value,
        compensationPackage:
          eventData.target.elements.compensationPackage.value,
        benefits: eventData.target.elements.benefits.value,
        payPeriodTypeOption: payPeriodTypeOption,
      };
      let mustHaveHasData = false;
      let niceToHaveHasData = false;
      let mustHave = getStringData(eventData.target.elements.mustHave, true);
      let niceToHave = getStringData(
        eventData.target.elements.niceToHave,
        false
      );
      if (
        eventData.target.elements.mustHave.value !== "" ||
        eventData.target.elements.mustHave?.length > 0
      ) {
        mustHaveHasData = true;
      }
      if (
        eventData.target.elements.niceToHave.value !== "" ||
        eventData.target.elements.niceToHave?.length > 0
      ) {
        niceToHaveHasData = true;
      }
      let keyQualification = null;
      if (mustHaveHasData === true && niceToHaveHasData === true) {
        keyQualification = mustHave.concat(niceToHave);
      }
      if (mustHaveHasData === true && niceToHaveHasData === false) {
        keyQualification = mustHave;
      }
      if (mustHaveHasData === false && niceToHaveHasData === true) {
        keyQualification = niceToHave;
      }
      let questionArr = [];
      let customAnswer =
        eventData?.target?.elements?.applicantsRecordAnswer?.value === undefined
          ? ""
          : eventData.target.elements.applicantsRecordAnswer.value;
      if (eventData.target.elements.question?.length > 0) {
        eventData.target.elements.question.forEach((element) => {
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
        eventData.target.elements.custom_question !== undefined &&
        eventData.target.elements.custom_question?.length > 0
      ) {
        eventData.target.elements.custom_question.forEach((element) => {
          if (element.value !== "") {
            let obj = {
              jobprescreenapplicationid: 0,
              jobid: 0,
              iscustomquestion: true,
              prescreenquestionid: 0,
              prescreenquestion: element.value,
              isactive: true,
            };
            questionArr.push(obj);
          }
        });
      }
      if (
        eventData.target.elements.custom_question !== undefined &&
        eventData.target.elements.custom_question?.length === undefined &&
        eventData.target.elements.custom_question.value !== ""
      ) {
        let obj = {
          jobprescreenapplicationid: 0,
          jobid: 0,
          iscustomquestion: true,
          prescreenquestionid: 0,
          prescreenquestion: eventData.target.elements.custom_question.value,
          isactive: true,
        };
        questionArr.push(obj);
      }
      let data = {
        basicInformation: basicInformation,
        experienceSchedule: experienceSchedule,
        paymentBenifits: paymentBenifits,
        keyQualification: keyQualification,
        preScreen: questionArr,
        preCustomScreen: customAnswer === "" ? "Audio" : customAnswer,
      };

      JobDataForPreview(data);
      nextPage(true);
    };

    const loadOptionsDeb = useCallback(
      debounce((inputValue, callback) => {
        loadOptions(inputValue).then(callback);
      }, 500),
      [] // Important: memoize once!
    );
    const loadOptions = async (inputValue) => {
      if (inputValue && inputValue?.length > 0) {
        const { data = [] } = await getLocation(inputValue);
        return data.map(({ cityid: value, ...rest }) => {
          setZipcodeCityState({
            value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
            label: `${rest.location}, ${rest.statename}`,
          });
          getLocationDetails({
            value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
            label: `${rest.location}, ${rest.statename}`,
          });
          return {
            value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
            label: `${rest.location}, ${rest.statename}`,
          };
        });
      }
    };

    const loadOptionsByZip = async (inputValue) => {
      if (inputValue && inputValue?.length > 0) {
        setZipCodeValidation(false);
      } else {
        setZipCodeValidation(true);
      }
      if (inputValue && inputValue?.length > 3) {
        const { data = [] } = await getLocation(inputValue);
        return data.map(({ cityid: value, ...rest }) => {
          setZipcodeCityState({
            value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
            label: `${rest.location}, ${rest.statename}`,
          });
          getLocationDetails({
            value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
            label: `${rest.location}, ${rest.statename}`,
          });
        });
      }
    };
    const getLocationDetails = (event, cityState = false) => {
      setZipcodeCityState(event);
      setCityValidation(false);
      let locationSplit = event.value.split(", ");
      setCountryOnChange(true);
      if (cityState) {
        setZipCodeFromCityState(false);
        getZipCodeData(locationSplit[0]);
      }
      setStateData({
        cityId: locationSplit[0],
        stateId: locationSplit[1],
        cityName: locationSplit[2],
        stateName: locationSplit[3],
      });
    };

    const getZipCodeData = async (locationData) => {
      await dispatch(locationActions.getLocation(locationData));
      setZipCodeFromCityState(true);
    };
    const locationZipCode = useSelector(
      (state) => state.location?.location[0]?.name
    );
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

    const getCertificationFormData = (eventData) => {
      let postCertificationData = [];
      let certificationArray = eventData?.target?.elements?.certificationids;
      if (certificationArray?.length === undefined) {
        return certificationArray.value;
      }
      if (certificationArray?.length > 0) {
        certificationArray?.forEach((element) => {
          postCertificationData.push(element.value);
        });
        return postCertificationData.toString();
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
    const getStringData = (data, type) => {
      let dataArray = [];
      if (data?.length === undefined) {
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
      if (data?.length !== undefined) {
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
    const addNewSkill = () => {
      if (searchText === "") {
        return;
      }
      setKeyQualifucationChange(true);
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
      setMustHaveValidation(false);
    };
    const addNewSkillOptional = () => {
      if (searchOptionalText === "") {
        return;
      }
      setKeyQualifucationChange(true);
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
      setMustHaveValidation(false);
    };

    const loadOptionsDeb2 = useCallback(
      debounce((inputValue, callback) => {
        loadOptions2(inputValue).then(callback);
      }, 500),
      [] // Important: memoize once!
    );
    const loadOptions2 = async (inputValue) => {
      if (inputValue && inputValue?.length > 0) {
        setLabelVisibility(true);
        setSearchText(inputValue);
        let payload = {
          searchText: inputValue,
        };
        const { data = [] } = await getSkillsFilter(payload);

        const isKeyTrueForAll = data.some(
          (item) => item["skillname"].toLowerCase() === inputValue.toLowerCase()
        );
        console.log(isKeyTrueForAll);
        if (isKeyTrueForAll) {
          setSkillExist(false);
        } else {
          setSkillExist(true);
        }
        let skills = data.map(({ skillid: value, ...rest }) => {
          return {
            value: `${value}, ${rest.skillname}`,
            label: `${rest.skillname}`,
          };
        });
        setMustHaveSkills(skills);
        return skills;
      }
    };

    const loadOptionsDeb3 = useCallback(
      debounce((inputValue, callback) => {
        loadOptionsoptional(inputValue).then(callback);
      }, 500),
      [] // Important: memoize once!
    );
    const loadOptionsoptional = async (inputValue) => {
      if (inputValue && inputValue?.length > 0) {
        setLabelVisibility(true);
        setSearchOptionalText(inputValue);
        let payload = {
          searchText: inputValue,
        };
        const { data = [] } = await getSkillsFilter(payload);

        const isKeyTrueForAll = data.some(
          (item) => item["skillname"].toLowerCase() === inputValue.toLowerCase()
        );
        console.log(isKeyTrueForAll);
        if (isKeyTrueForAll) {
          setOptionalSkillExist(false);
        } else {
          setOptionalSkillExist(true);
        }
        let skills = data.map(({ skillid: value, ...rest }) => {
          return {
            value: `${value}, ${rest.skillname}`,
            label: `${rest.skillname}`,
          };
        });
        setNiceToHaveSkills(skills);
        return skills;
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
    const onSelectSkillsDropdown = function (data) {
      setSearchText("");
      if (data?.length === 0) {
        setMustHaveValidation(true);
        setPrevKey([]);
        setKeyQual1([]);
      } else {
        setPrevKey(data);
        setKeyQual1(data);
        setMustHaveValidation(false);
      }
    };

    const onSelectEduDropdown = function (data) {
      if (data?.length === 0) {
        setEduArr([]);
        setEduPrevArr([]);
      } else {
        setEduArr(data);
        setEduPrevArr(data);
      }
    };

    const onSelectStudyFieldDropdown = (data) => {
      if (data?.length === 0) {
        setStudyFieldArr([]);
        setStudyFieldPrevArr([]);
      } else {
        setStudyFieldArr(data);
        setStudyFieldPrevArr(data);
      }
    };
    const selectOptionalSkills = function (data) {
      setSearchOptionalText("");
      if (data?.length === 0) {
        setPrevKey2([]);
        setKeyQual2([]);
      } else {
        setPrevKey2(data);
        setKeyQual2(data);
      }
    };
    const onSelectCertificateDropdown = (data) => {
      if (data?.length === 0) {
        setCertificateArr([]);
        setCertificatePrevArr([]);
      } else {
        setCertificateArr(data);
        setCertificatePrevArr(data);
      }
    };

    const formatCreateLabel = (inputValue) => {
      if (skillExist && inputValue && inputValue?.length > 0) {
        return (
          <span style={{ cursor: "pointer" }}>
            Add new skill -{" "}
            <span style={{ color: "#545cd8" }}>{inputValue}</span>
          </span>
        );
      } else {
        return "";
      }
    };
    const checkRestrictedWord = (fieldName, string) => {
      if (wordArray?.length > 0) {
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
    let securityClearenceRaw =
      type === "new_template" && previousStep !== 3
        ? 0
        : previousStep === 3
          ? preValue.securityclearanceid
          : previousValue.securityclearanceid;
    useEffect(() => {
      if (type === "ai_template") {
        setZipcodeCityState({
          value:
            previousData?.cityid +
            ", " +
            previousData?.stateid +
            ", " +
            previousData?.cityname +
            ", " +
            previousData?.statename,
          label: previousData?.cityname + ", " + previousData?.statename,
        });
        getLocationDetails({
          value:
            previousData?.cityid +
            ", " +
            previousData?.stateid +
            ", " +
            previousData?.cityname +
            ", " +
            previousData?.statename,
          label: previousData?.cityname + ", " + previousData?.statename,
        });
      }
      if (previousStep === 3) {
        setZipcodeCityState({
          value:
            jobData?.basicInformation?.cityId +
            ", " +
            jobData?.basicInformation?.stateId +
            ", " +
            jobData?.basicInformation?.cityName +
            ", " +
            jobData?.basicInformation?.stateName,
          label:
            jobData?.basicInformation?.cityName +
            ", " +
            jobData?.basicInformation?.stateName,
        });
        getLocationDetails({
          value:
            jobData?.basicInformation?.cityId +
            ", " +
            jobData?.basicInformation?.stateId +
            ", " +
            jobData?.basicInformation?.cityName +
            ", " +
            jobData?.basicInformation?.stateName,
          label:
            jobData?.basicInformation?.cityName +
            ", " +
            jobData?.basicInformation?.stateName,
        });
      }
    }, []);
    let preScreenQuestionsDataFromPre = jobData?.preScreen;
    let customQuestionDataFromPre = preScreenQuestionsDataFromPre?.filter(
      (value) => value.iscustomquestion === true
    );
    let prescreenTypeVIsibility = false;
    let customCount = 0;
    let customCount1 = 0;
    let customCount2 = 0;
    if (customQuestionDataFromPre?.length > 0) {
      prescreenTypeVIsibility = true;
      customCount1 = customQuestionDataFromPre?.length;
    }
    if (customQuestionInput?.length > 1) {
      prescreenTypeVIsibility = true;
      customCount2 = customQuestionInput?.length - 1;
    }
    customCount = Number(customCount1) + Number(customCount2);

    const formatCreateLabel2 = (inputValue) => {
      if (inputValue && inputValue?.length > 2) {
        return (
          <span style={{ cursor: "pointer" }}>
            Add new eductaion -{" "}
            <span style={{ color: "#545cd8" }}>{inputValue}</span>
          </span>
        );
      } else {
        return "";
      }
    };

    const formatCreateLabel1 = (inputValue) => {
      if (inputValue && inputValue?.length > 2) {
        return (
          <span style={{ cursor: "pointer" }}>
            Add new field of study -{" "}
            <span style={{ color: "#545cd8" }}>{inputValue}</span>
          </span>
        );
      } else {
        return "";
      }
    };

    const onCreateEducation = async (data) => {
      let payload = {
        levelofeducation1: data,
        currentUserId: localStorage.getItem("userId")
          ? Number(localStorage.getItem("userId"))
          : 0,
      };

      let res = await dispatch(addLevelOfEducation(payload));

      if (res?.payload && res?.payload?.statusCode === 201) {
        setLevelOfEduChange(true);
        let eduData = [...eduArr];
        eduData.push({
          value: res.payload.data.levelofeducationid,
          label: res.payload.data.levelofeducation1,
        });
        setEduArr(eduData);
        let eduPrevData = [...eduPrevArr];
        eduPrevData.push({
          value: res.payload.data.levelofeducationid,
          label: res.payload.data.levelofeducation1,
        });
        setEduPrevArr(eduPrevData);
        dispatch(dropdownActions.getLevelOFEducationThunk());
      } else {
        console.log(res?.error);
      }
    };

    const onCreateFieldOfStudy = async (data) => {
      let payload = {
        fieldofstudy1: data,
        currentUserId: localStorage.getItem("userId")
          ? Number(localStorage.getItem("userId"))
          : 0,
      };

      let res = await dispatch(addFieldOfStudy(payload));
      if (res?.payload && res?.payload?.statusCode === 201) {
        setStudyFieldChange(true);
        let studyFieldData = [...studyFieldArr];
        studyFieldData.push({
          value: res.payload.data.fieldofstudyid,
          label: res.payload.data.fieldofstudy1,
        });
        setStudyFieldArr(studyFieldData);
        let studyFieldPrevData = [...studyFieldPrevArr];
        studyFieldPrevData.push({
          value: res.payload.data.fieldofstudyid,
          label: res.payload.data.fieldofstudy1,
        });
        setStudyFieldPrevArr(studyFieldPrevData);
        dispatch(dropdownActions.getFieldOfStudyThunk());
      } else {
        console.log(res?.error);
      }
    };


    const formatCreateCertificateLabel = (inputValue) => {
      if (inputValue && inputValue?.length > 2) {
        return (
          <span style={{ cursor: "pointer" }}>
            Add new certificate -{" "}
            <span style={{ color: "#545cd8" }}>{inputValue}</span>
          </span>
        );
      } else {
        return "";
      }
    };

    const onCreateCertificate = async (data) => {
      let payload = [{
        certificationtype1: data,
        isactive: true,
        isfromresume: false,
        currentUserId: localStorage.getItem("userId")
          ? Number(localStorage.getItem("userId"))
          : 0,
      }];

      let res = await dispatch(addCertification(payload));

      if (res?.payload && res?.payload?.statusCode === 201) {
        setCertificateChange(true);
        let certData = [...certificateArr];
        certData.push({
          value: res.payload.data[0].certificationtypeid,
          label: res.payload.data[0].certificationtype1,
        });
        setCertificateArr(certData);
        let certPrevData = [...certificatePrevArr];
        certPrevData.push({
          value: res.payload.data[0].certificationtypeid,
          label: res.payload.data[0].certificationtype1,
        });
        setCertificatePrevArr(certPrevData);
        await dispatch(certificationTypeActions.certificationType());
      } else {
        console.log(res?.error);
      }
    };


    const getAssignedToOptions = async (inputValue) => {
      try {
        const companyId =
          Number(JSON.parse(localStorage.getItem("userDetails"))?.CompanyId) || 0;
        const response = await dispatch(
          dropdownActions.getDropdownListThunk({
            searchText: "AssignedTo",
            commonId: companyId,
            searchBy: inputValue || "",
          })
        );

        // handle possible response shapes
        const users =
          response?.payload?.data ||
          response?.payload?.data?.data ||
          response?.payload ||
          [];

        const userOptions = (users || []).map((user) => ({
          value: user.id,
          label: user.name,
        }));
        return userOptions;
      } catch (err) {
        // keep silent or console.log(err) for debugging
        // console.error(err);
      }
    };
    const loadOptionsAssignedTo = useCallback(
      async (inputValue) => {
        // return all options when input empty so AsyncSelect shows choices
        const source = await getAssignedToOptions(inputValue) || [];
        if (!inputValue) return source;
        const filtered = source.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        return filtered;
      },
      [assignedToUserOptions]
    );

    const loadOptionsDebAssignedTo = useCallback(
      debounce((inputValue, callback) => {
        loadOptionsAssignedTo(inputValue).then(callback);
      }, 300),
      [loadOptionsAssignedTo]
    );

    const getClientCompany = async (inputValue) => {
      try {
        const companyId =
          Number(JSON.parse(localStorage.getItem("userDetails"))?.CompanyId) || 0;
        const response = await dispatch(
          dropdownActions.getDropdownListThunk({
            searchText: "ClientCompany",
            commonId: companyId,
            searchBy: inputValue || "",
          })
        );

        // handle possible response shapes
        const companies =
          response?.payload?.data ||
          response?.payload?.data?.data ||
          response?.payload ||
          [];

        const clientCompanyOptions = (companies || []).map((company) => ({
          value: company.id,
          label: company.name,
        }));

        setClientCompanyOptions(clientCompanyOptions);
        return clientCompanyOptions;

      } catch (err) {
        // keep silent or console.log(err) for debugging
        // console.error(err);
      }
    };

    const loadOptionClientCompany = useCallback(
      async (inputValue) => {
        // return all options when input empty so AsyncSelect shows choices
        const source = await getClientCompany(inputValue) || [];
        if (!inputValue) return source;
        const filtered = source.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        return filtered;
      },
      [clientCompanyOptions]
    );

    const loadOptionsDebClientCompany = useCallback(
      debounce((inputValue, callback) => {
        loadOptionClientCompany(inputValue).then(callback);
      }, 300),
      [loadOptionClientCompany]
    );


    //Contact (Hiring Manager) Dropdown
    const getHiringManagerOptions = async (inputValue) => {
      try {
        const companyId =
          Number(JSON.parse(localStorage.getItem("userDetails"))?.CompanyId) || 0;
        const response = await dispatch(
          dropdownActions.getDropdownListThunk({
            searchText: "AssignedTo",
            commonId: companyId,
            searchBy: inputValue || "",
          })
        );

        // handle possible response shapes
        const users =
          response?.payload?.data ||
          response?.payload?.data?.data ||
          response?.payload ||
          [];

        const userOptions = (users || []).map((user) => ({
          value: user.id,
          label: user.name,
        }));
        return userOptions;
      } catch (err) {
        // keep silent or console.log(err) for debugging
        // console.error(err);
      }
    };
    const loadOptionsHiringManager = useCallback(
      async (inputValue) => {
        // return all options when input empty so AsyncSelect shows choices
        const source = await getHiringManagerOptions(inputValue) || [];
        if (!inputValue) return source;
        const filtered = source.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        return filtered;
      },
      [assignedToUserOptions]
    );

    const loadOptionsDebHiringManager = useCallback(
      debounce((inputValue, callback) => {
        loadOptionsHiringManager(inputValue).then(callback);
      }, 300),
      [loadOptionsHiringManager]
    );

    return (
      <>
        <div className="form-wizard-content">
          <Form onSubmit={(e) => getFormValidation(e)} id="myForm" ref={ref}>
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
                            value={customerDetails?.companyname}
                            disabled
                          />
                          {companyValidation === true && (
                            <FormText color="danger">
                              Please enter company name
                            </FormText>
                          )}
                        </FormGroup>
                      </Col>
                      {subsidiaryOption?.length > 0 && (
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
                              {subsidiaryOption?.length > 0 &&
                                subsidiaryOption.map((options) => (
                                  <option
                                    key={options.subsidiaryid}
                                    value={options.subsidiaryid}
                                    selected={
                                      type === "new_template" &&
                                        previousStep !== 3
                                        ? ""
                                        : previousStep === 3
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

                      {customerDetails?.isatsenable === true && (
                        <>
                          <Col md={6} lg={3}>
                            <FormGroup>
                              <Label className="fw-semi-bold">
                                Client company<span style={{ color: "red" }}>* </span>
                              </Label>
                              <AsyncSelect
                                name={"clientCompany"}
                                placeholder="Search Client Company"
                                cacheOptions
                                loadOptions={loadOptionsDebClientCompany}
                                defaultOptions={clientCompanyOptions}
                                value={clientCompanyValue}
                                onChange={(val) => {
                                  setClientCompanyValue(val);
                                  setClientCompanyValidation(false);
                                  // if you need to persist selection to the form submission,
                                  // write the selected id into a hidden input or local state used by saveData
                                  // e.g. setSelectedAssignedToId(val ? val.value : null);
                                }}
                                isMulti={false}
                                styles={customStyles}
                                invalid={clientCompanyValidation === true ? true : false}
                              />
                              {clientCompanyValidation === true && (
                                <FormText color="danger">
                                  Please select client company
                                </FormText>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md={6} lg={3}>
                            <FormGroup>
                              <Label for="contact" className="fw-semi-bold">
                                Contact<span style={{ color: "red" }}>* </span>
                              </Label>
                              <AsyncSelect
                                name={"contact"}
                                placeholder="Search Contact"
                                cacheOptions
                                loadOptions={loadOptionsDebHiringManager}
                                defaultOptions={hiringManagerOptions}
                                value={hiringManagerValue}
                                onChange={(val) => {
                                  setHiringManagerValue(val);
                                  // if you need to persist selection to the form submission,
                                  // write the selected id into a hidden input or local state used by saveData
                                  // e.g. setSelectedAssignedToId(val ? val.value : null);
                                }}
                                isMulti={false}
                                styles={customStyles}
                              />
                              {hiringmanagerValidation === true && (
                                <FormText color="danger">
                                  Please select Contact
                                </FormText>
                              )}
                            </FormGroup>
                          </Col>
                        </>
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
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
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
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
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
                            <span style={{ color: "red" }}>* </span>
                          </Label>
                          <Input
                            id={"jobLocation"}
                            name={"jobLocation"}
                            type={"select"}
                            invalid={
                              jobLocationValidation === true ? true : false
                            }
                            onChange={(e) => {
                              setJobLocationOption(e.target.value);
                              setJobLocationValidation(false);
                            }}
                          >
                            <option key={0} value={0}>
                              Select job location
                            </option>
                            {jobLocationOptions?.length > 0 &&
                              jobLocationOptions.map((options) => (
                                <option
                                  key={options.id}
                                  value={options.id}
                                  selected={
                                    Number(
                                      type === "new_template" &&
                                        previousStep !== 3
                                        ? 0
                                        : previousStep === 3
                                          ? preValue.jobLocation
                                          : previousValue.jobLocation
                                    ) === Number(options.id)
                                  }
                                >
                                  {options.name}
                                </option>
                              ))}
                          </Input>
                          {jobLocationValidation === true && (
                            <FormText color="danger">
                              Please select job location
                            </FormText>
                          )}
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
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
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
                            City, State<span style={{ color: "red" }}>* </span>{" "}
                            {zipcodeChange}
                          </Label>
                          <AsyncSelect
                            name={"city"}
                            placeholder="Search city or zipcode"
                            value={zipcodeCityState}
                            cacheOptions
                            loadOptions={loadOptionsDeb}
                            isMulti={false}
                            styles={customStyles}
                            onChange={(e) => getLocationDetails(e, true)}
                            className={
                              cityValidation === true ? "async-border-red" : ""
                            }
                          />
                          {cityValidation === true && (
                            <FormText color="danger">
                              Please select city
                            </FormText>
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
                            value={"USA"}
                            placeholder="Select country"
                          />
                        </FormGroup>
                      </Col>
                      {zipCodeFromCityState === true && (
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
                              defaultValue={locationZipCode}
                              onChange={(e) => {
                                loadOptionsByZip(e.target.value);
                                setZipcodeChange(true);
                                setZipCodeFromCityState(false);
                              }}
                              placeholder="Enter zip code"
                            />
                            {zipCodeValidation === true && (
                              <FormText color="danger">
                                Please enter zip code
                              </FormText>
                            )}
                          </FormGroup>
                        </Col>
                      )}
                      {zipCodeFromCityState === false && (
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
                                type === "new_template" && previousStep !== 3
                                  ? ""
                                  : previousStep === 3
                                    ? preValue.zipcode
                                    : previousValue.zipcode
                              }
                              onChange={(e) => {
                                loadOptionsByZip(e.target.value);
                                setZipcodeChange(true);
                                setZipCodeFromCityState(false);
                              }}
                              placeholder="Enter zip code"
                            />
                            {zipCodeValidation === true && (
                              <FormText color="danger">
                                Please enter zip code
                              </FormText>
                            )}
                          </FormGroup>
                        </Col>
                      )}
                      {customerDetails?.isatsenable === true && (
                        <Col md={6} lg={3}>
                          <FormGroup>
                            <Label for="city" className="fw-semi-bold">
                              Assigned To<span style={{ color: "red" }}>* </span>
                            </Label>
                            <AsyncSelect
                              name={"assignedto"}
                              placeholder="Search Assigned To"
                              cacheOptions
                              loadOptions={loadOptionsDebAssignedTo}
                              defaultOptions={assignedToUserOptions}
                              value={assignedToValue}
                              onChange={(val) => {
                                setAssignedToValue(val);
                                // if you need to persist selection to the form submission,
                                // write the selected id into a hidden input or local state used by saveData
                                // e.g. setSelectedAssignedToId(val ? val.value : null);
                              }}
                              isMulti={false}
                              styles={customStyles}
                            />
                            {hiringmanagerValidation === true && (
                              <FormText color="danger">
                                Please select Assigned To
                              </FormText>
                            )}
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      <Col md={6} lg={3}>
                        <FormGroup className="mt-4">
                          <Input
                            id={"authorizedtoworkinus"}
                            name={"authorizedtoworkinus"}
                            type={"checkbox"}
                            defaultChecked={true}
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
                                  type === "new_template" && previousStep !== 3
                                    ? false
                                    : previousStep === 3
                                      ? preValue.sponsorshiprequiured
                                      : previousValue.sponsorshiprequiured ===
                                      true
                                }
                                value={"yes"}
                                onChange={() => setAutoAuthorised(true)}
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
                                defaultChecked={true}
                                value={"no"}
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
                              type === "new_template" && previousStep !== 3
                                ? false
                                : previousStep === 3
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
                              {securityClearanceOptions?.length > 0 &&
                                securityClearanceOptions.map((options) => (
                                  <option
                                    key={options.id}
                                    value={options.id}
                                    selected={
                                      Number(securityClearenceRaw) ===
                                      Number(options.id)
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
                          <CreatableSelect
                            // defaultValue={
                            //   type === "new_template" && previousStep !== 3
                            //     ? ""
                            //     : educationData
                            // }
                            value={
                              type === "new_template" &&
                                previousStep !== 3 &&
                                levelOfEduChange === false
                                ? ""
                                : previousStep === 3
                                  ? eduPrevArr
                                  : eduArr
                            }
                            isMulti
                            name="levelofeducationids"
                            options={educationOptions}
                            classNamePrefix="select"
                            onChange={(evt) => {
                              onSelectEduDropdown(evt);
                              setLevelOfEduChange(true);
                            }}
                            formatCreateLabel={formatCreateLabel2}
                            onCreateOption={(e) => onCreateEducation(e)}
                            placeholder="Select level of education"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6} lg={3}>
                        <FormGroup>
                          <Label
                            for="fieldofstudiesids"
                            className="fw-semi-bold"
                          >
                            Field of study
                          </Label>
                          <CreatableSelect
                            // defaultValue={
                            //   type === "new_template" && previousStep !== 3
                            //     ? ""
                            //     : studyData
                            // }
                            isMulti
                            value={
                              type === "new_template" &&
                                previousStep !== 3 &&
                                studyFieldChange === false
                                ? ""
                                : previousStep === 3
                                  ? studyFieldPrevArr
                                  : studyFieldArr
                            }
                            onChange={(evt) => {
                              onSelectStudyFieldDropdown(evt);
                              setStudyFieldChange(true);
                            }}
                            name="fieldofstudiesids"
                            options={fieldStudyOptions}
                            classNamePrefix="select"
                            placeholder="Select field of study"
                            formatCreateLabel={formatCreateLabel1}
                            onCreateOption={(e) => onCreateFieldOfStudy(e)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6} lg={6}>
                        {/* <FormGroup>
                          <Label for="certifications" className="fw-semi-bold">
                            Certification test
                          </Label>
                          <Input
                            id={"certifications"}
                            name={"certifications"}
                            type={"text"}
                            placeholder="Enter certification"
                            defaultValue={
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
                                ? preValue.certifications
                                : previousValue.certifications
                            }
                          />
                        </FormGroup> */}

                        <FormGroup>
                          <Label
                            for="certificationids"
                            className="fw-semi-bold"
                          >
                            Certification
                          </Label>

                          {/* <Select
                            defaultValue={
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : certificationsData
                            }
                            isMulti
                            name="certificationids"
                            options={certificationOptions}
                            classNamePrefix="select"
                            placeholder="Select certification"
                          /> */}


                          <CreatableSelect
                            isMulti
                            // defaultValue={
                            //   type === "new_template" && previousStep !== 3
                            //     ? ""
                            //     : certificationsData
                            // }
                            value={
                              type === "new_template" &&
                                previousStep !== 3 &&
                                certificateChange === false
                                ? ""
                                : previousStep === 3
                                  ? certificatePrevArr
                                  : certificateArr
                            }
                            onChange={(evt) => {
                              onSelectCertificateDropdown(evt);
                              setCertificateChange(true);
                            }}
                            name="certificationids"
                            options={certificationOptions}
                            classNamePrefix="select"
                            placeholder="Select Certification"
                            formatCreateLabel={formatCreateCertificateLabel}
                            onCreateOption={(e) => onCreateCertificate(e)}
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
                            editor={ClassicEditor}
                            config={{
                              licenseKey: "GPL",
                              plugins: [
                                Essentials,
                                Paragraph,
                                Bold,
                                Italic,
                                ToolbarView,
                                // FormatPainter,
                                Heading,
                                Underline,
                                Strikethrough,
                                Link,

                                BlockQuote,
                                // Table,
                                // MediaEmbed,
                                // ImageInsert,
                                Undo,
                                Alignment,
                              ],
                              toolbar: [
                                "heading",
                                "|",
                                "bold",
                                "italic",
                                "underline",
                                "strikethrough",
                                "|",
                                "link",
                                "bulletedList",
                                "numberedList",
                                "blockQuote",
                                "|",
                                "insertTable",
                                "mediaEmbed",
                                "imageUpload",
                                "|",
                                "undo",
                                "redo",
                                "alignment",
                                "outdent",
                                "indent",
                              ],
                            }}
                            id="description"
                            maxLength={2000}
                            data={
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
                                  ? preValue.description
                                  : previousValue.description
                            }
                            onChange={(e, editor) => {
                              setupDescriptionData(editor.getData());
                            }}
                            className={
                              descriptionValidation === true
                                ? "ckeditor-invalid"
                                : ""
                            }
                          >
                            {" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: descriptionData,
                              }}
                            />
                          </CKEditor>
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
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
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
                          {jobTypeOption?.length > 0 &&
                            jobTypeOption.map((options) => (
                              <div className="form-group-custom">
                                <Input
                                  key={options.id}
                                  type="checkbox"
                                  name={"jobType"}
                                  id={"jobType_" + options.id}
                                  defaultChecked={
                                    type === "new_template" &&
                                      previousStep !== 3
                                      ? ""
                                      : previousStep === 3
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
                          {workScheduleOptions?.length > 0 &&
                            workScheduleOptions.map((options) => (
                              <div className="form-group-custom">
                                <Input
                                  key={options.id}
                                  type="checkbox"
                                  name={"workSchedule"}
                                  id={"workSchedule_" + options.id}
                                  defaultChecked={
                                    type === "new_template" &&
                                      previousStep !== 3
                                      ? ""
                                      : previousStep === 3
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
                          {shiftsOption?.length > 0 &&
                            shiftsOption.map((options) => (
                              <div className="form-group-custom">
                                <Input
                                  key={options.id}
                                  type="checkbox"
                                  name={"shifts"}
                                  id={"shifts_" + options.id}
                                  defaultChecked={
                                    type === "new_template" &&
                                      previousStep !== 3
                                      ? ""
                                      : previousStep === 3
                                        ? preValue?.shift?.includes(options.id)
                                        : previousValue?.shift?.includes(
                                          options.id
                                        )
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
                          <Label
                            for={"experienceLevel"}
                            className="fw-semi-bold"
                          >
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
                            {experienceLevelOption?.length > 0 &&
                              experienceLevelOption.map((options) => (
                                <option
                                  key={options.id}
                                  value={options.id}
                                  selected={
                                    type === "new_template" &&
                                      previousStep !== 3
                                      ? 0
                                      : expLevelSelected === options.id
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
                          <Label
                            for={"hiringTimeline"}
                            className="fw-semi-bold"
                          >
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
                            {hiringTimelineOption?.length > 0 &&
                              hiringTimelineOption.map((options) => (
                                <option
                                  key={options.id}
                                  value={options.id}
                                  selected={
                                    type === "new_template" &&
                                      previousStep !== 3
                                      ? 0
                                      : hiringSelected === options.id
                                  }
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
                          <Label className="fw-semi-bold">
                            Pay period type
                            <span style={{ color: "red" }}>* </span>
                          </Label>
                          <Input
                            id={"payPeriodType"}
                            name={"payPeriodType"}
                            type={"select"}
                            invalid={payPeriodTypeValidation ? true : false}
                            onChange={() => setPayPeriodTypeValidation(false)}
                          >
                            <option key={0} value={""}>
                              Select pay period type
                            </option>
                            {payPeriodTypeOption?.length > 0 &&
                              payPeriodTypeOption.map((options) => (
                                <option
                                  key={options.id}
                                  value={options.id}
                                  selected={
                                    type === "new_template" &&
                                      previousStep !== 3
                                      ? 0
                                      : previousStep === 3
                                        ? preValue.payPeriodType
                                        : previousValue.payPeriodType ===
                                        options.id
                                  }
                                >
                                  {options.name}
                                </option>
                              ))}
                          </Input>
                          {payPeriodTypeValidation === true && (
                            <FormText color="danger">
                              Please select pay period type
                            </FormText>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6} lg={3}>
                        <FormGroup>
                          <Label for={"minimumAmount"} className="fw-semi-bold">
                            Minimum base pay
                            <span style={{ color: "red" }}>* </span>
                          </Label>
                          <Input
                            id={"minimumAmount"}
                            name={"minimumAmount"}
                            type={"number"}
                            min={0}
                            step={"any"}
                            invalid={minimumBasepayValidation ? true : false}
                            onChange={() => setMinimumBasepayValidation(false)}
                            defaultValue={
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
                                  ? preValue.minimumAmount
                                  : previousValue.minimumAmount
                            }
                            placeholder="Enter minimum base pay"
                          />
                          {minimumBasepayValidation === true && (
                            <FormText color="danger">
                              Please enter minimum base pay
                            </FormText>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6} lg={3}>
                        <FormGroup>
                          <Label for="maximumAmount" className="fw-semi-bold">
                            Maximum base pay
                            <span style={{ color: "red" }}>* </span>
                          </Label>
                          <Input
                            id={"maximumAmount"}
                            name={"maximumAmount"}
                            type={"number"}
                            min={0}
                            step={"any"}
                            invalid={maximumBasepayValidation ? true : false}
                            onChange={() => setMaximumBasepayValidation(false)}
                            defaultValue={
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
                                  ? preValue.maximumAmount
                                  : previousValue.maximumAmount
                            }
                            placeholder="Enter maximum base pay"
                          />
                          {maximumBasepayValidation === true && (
                            <FormText color="danger">
                              Please enter maximum base pay
                            </FormText>
                          )}
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
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
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
                              type === "new_template" && previousStep !== 3
                                ? ""
                                : previousStep === 3
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
                            Must have <span style={{ color: "red" }}>* </span>
                          </Label>

                          <AsyncCreatableSelect
                            name="mustHave"
                            placeholder="Search to select"
                            loadOptions={loadOptionsDeb2}
                            isMulti={true}
                            closeMenuOnSelect={false}
                            styles={customStyles}
                            defaultOptions={mustHaveSkills}
                            value={
                              type === "new_template" &&
                                previousStep !== 3 &&
                                keyQualicationChange === false
                                ? []
                                : previousStep === 3
                                  ? keyQualificationArr1
                                  : prevKeyQualificationArr1
                            }
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(evt) => {
                              onSelectSkillsDropdown(evt);
                              setKeyQualifucationChange(true);
                            }}
                            className={
                              mustHaveValidation === true
                                ? "async-border-red"
                                : ""
                            }
                            formatCreateLabel={formatCreateLabel}
                            onCreateOption={addNewSkill}
                          />
                          {mustHaveValidation === true && (
                            <FormText color="danger">
                              Please select must have skills
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
                            loadOptions={loadOptionsDeb3}
                            isMulti={true}
                            closeMenuOnSelect={false}
                            styles={customStyles}
                            defaultOptions={niceToHaveSkills}
                            value={
                              type === "new_template" &&
                                previousStep !== 3 &&
                                keyQualicationChange === false
                                ? []
                                : previousStep === 3
                                  ? keyQualificationArr2
                                  : prevKeyQualificationArr2
                            }
                            onKeyDown={(e) => handleKeyDownOptional(e)}
                            onChange={(evt) => {
                              selectOptionalSkills(evt);
                              setKeyQualifucationChange(true);
                            }}
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
                        {preScreenQuestionsOption?.length > 0 &&
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
                                  type === "new_template" && previousStep !== 3
                                    ? false
                                    : previousStep === 3
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
                        {customQuestionDataFromPre?.map((item, i) => {
                          return (
                            <FormGroup>
                              <Label className="fw-semi-bold">
                                Custom Question
                              </Label>
                              <Input
                                id={i + 1}
                                name={"custom_question"}
                                type={item.type}
                                maxLength="100"
                                defaultValue={item.prescreenquestion}
                                onChange={(e) =>
                                  checkRestrictedWord(
                                    "custom_question_" + i++,
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
                        })}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={7}>
                        {customQuestionInput?.map((item, i) => {
                          if (i > 0) {
                            return (
                              <FormGroup>
                                <Label className="fw-semi-bold">
                                  Custom Question
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
                    {customCount < 3 && (
                      <Col md={5}>
                        <Button
                          color="link"
                          onClick={addInput}
                          className="custom-add-button"
                        >
                          <BsPlusSquare className="mb-1" /> Add{"  "}
                          {prescreenTypeVIsibility ? "another" : ""} custom
                          question
                        </Button>
                      </Col>
                    )}

                    {customCount > 0 && (
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
                                    defaultChecked={
                                      jobData?.preCustomScreen === "Audio"
                                    }
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
                                    defaultChecked={
                                      jobData?.preCustomScreen === "Video"
                                    }
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
                                    defaultChecked={
                                      jobData?.preCustomScreen === "Text"
                                    }
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
            <Button
              color="primary"
              className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
            >
              Continue and Save
            </Button>
          </Form>
        </div>
      </>
    );
  }
);
