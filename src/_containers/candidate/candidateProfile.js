import React, { useState, useEffect } from "react";
import { yearActions, monthActions } from "_store";
import { Row, Col } from "reactstrap";
import Loader from "react-loaders";
import { useDispatch } from "react-redux";
import PageTitle from "../../_components/common/pagetitle";
import "./profile.scss";
import candidatelogo from "../../assets/utils/images/candidate.svg";
import { ResumeDetails } from "./resumeDetails";
import { CandidateQualification } from "./candidateQualification";
import { CandidateEducation } from "./educationalInfo";
import { PersonalInformation } from "./personalInformation";
import { CandidateSkills } from "./candidateSkills";
import { CertificationDetails } from "./certifications";
import { AdditionalInformation } from "./additionalInfo";
import { JobPreferences } from "./jobPreferences";
import {
  dropdownActions,
  getSkillsFilter,
  getJobTitleActions,
  educationActions,
  getProfileActions,
  ProficiencyActions,
  genderActions,
  ethnicityActions,
  certificationTypeActions,
  workScheduleActions,
  jobTypeActions,
  shiftActions,
  getpayPeriodActions,
  experienceLevelActions,
  resumeTemplateActions,
  studyFieldActions,
  profileSkillsActions,
} from "_store";

export function CandidateProfile() {
  const dispatch = useDispatch();
  const [dropdownLists, setDropDownLists] = useState({
    cityDropdown: [],
    stateDropDown: [],
    countryDropdown: [],
    genderDropDown: "",
    ethnicityDropdown: "",
    eligibilityDropDown: [
      {
        id: 0,
        name: "Authorized to work in the US",
      },
      {
        id: 1,
        name: "Sponsorship required",
      },
      {
        id: 2,
        name: "Not Specified",
      },
    ],

    selectedCity: {
      value: 0,
      label: "",
    },
    selectedState: {
      value: 0,
      label: "",
    },
    selectedCountry: {
      value: 0,
      label: "",
    },
    selectedEthnicity: {
      value: 0,
      label: "",
    },
    selectedGender: {
      value: 0,
      label: "",
    },
  });

  const [profileData, setProfileData] = useState({
    personalInfo: {},
    resumeInfo: {},
    skillsInfo: [],
    qualificationsInfo: [],
    certificationsInfo: [],
    educationInfo: [],
    additionalInfo: [],
    jobPreferenceInfo: [],
  });

  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [popularSkills, setPopularSkills] = useState([]);

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async function () {
    await getPersonalDetails();
    await getDropdownLists();
  };
  dispatch(getProfileActions.getPronoun());
  let popular_skills = [];
  const getDropdownLists = async function () {
    await dispatch(genderActions.getGender());
    await dispatch(ethnicityActions.getEthnicity());
    await dispatch(certificationTypeActions.certificationType());
    await dispatch(ProficiencyActions.Proficiency());
    await dispatch(ProficiencyActions.getLanguage());
    let reponse = await dispatch(educationActions.getEducation());
    await dispatch(workScheduleActions.getWorkScheduleThunk());
    await dispatch(jobTypeActions.getJobTypeThunk());
    await dispatch(shiftActions.getShiftThunk());
    await dispatch(getJobTitleActions.getJobTitle());
    await dispatch(getpayPeriodActions.getpayPeriod());
    await dispatch(experienceLevelActions.getExperienceLevelThunk());
    await dispatch(resumeTemplateActions.getResumeTemplate());
    popular_skills = await getSkillsFilter("java");
    setPopularSkills(popular_skills.data);
    await dispatch(studyFieldActions.getStudyField());
    await dispatch(dropdownActions.getJobLocationTypeThunk());
    await dispatch(yearActions.getyear());
    await dispatch(monthActions.getmonth());
    await dispatch(profileSkillsActions.getPopularSkills());
  };

  const getPersonalDetails = async function () {
    let candidateid = userDetails.InternalUserId;
    let response = await dispatch(getProfileActions.getCandidate(candidateid));
    let filter_data = response.payload;
    let organization = filter_data?.candidateQualificationsDtos?.filter(
      (x) => x.iscurrentlyworking == true
    );

    let data = {
      position: organization?.length > 0 ? organization[0].jobtitle : "",
      organization:
        organization?.length > 0 ? organization[0].company : "Not Working",
      eligibility: dropdownLists.eligibilityDropDown?.find(
        (x) => x.id == filter_data.employmenteligiblity
      ).name,
      readyToWork: filter_data.isreadytoworkimmediately ? "Yes" : "No",
      phonenumber: filter_data.phonenumber,
      email: filter_data.email,
      state: filter_data.statename,
      city: filter_data.cityname,
      country: filter_data.countryname,
      dob: new Date(),
      gender: filter_data.gendername,
      race: filter_data.ethnicityname,

      candidateid: 0,
      firstname: filter_data.firstname,
      lastname: filter_data.lastname,
      genderid: filter_data.genderid,
      cityid: filter_data.cityid,
      stateid: filter_data.stateid,
      countryid: filter_data.countryid,
      zipcode: filter_data.zipcode,
      ethnicityid: filter_data.ethnicityid,
      ethnicity: filter_data.ethnicity,
      employmenteligiblity: filter_data.employmenteligiblity,
      isreadytoworkimmediately: filter_data.isreadytoworkimmediately,
      isactive: true,
      userid: 0,
      currentUserId: 0,
    };
    let new_data = { ...profileData };
    new_data.personalInfo = data;
    new_data.skillsInfo = filter_data.candidateSkillDtos;
    new_data.resumeInfo = filter_data.candidateResumeDto;
    new_data.qualificationsInfo = filter_data?.candidateQualificationsDtos;
    new_data.educationInfo = filter_data.candidateEducationDtos;
    new_data.certificationsInfo = filter_data.candidateCertificationDtos;
    new_data.additionalInfo = filter_data.candidateAdditionalInformationDtos;
    setProfileData(new_data);

    let dropdown_selected = { ...dropdownLists };

    dropdown_selected.selectedCity = {
      value: filter_data.cityid,
      label: `${filter_data.cityname + ", " + filter_data.statename}`,
    };
    dropdown_selected.selectedState = {
      value: filter_data.stateid,
      label: filter_data.statename,
    };
    dropdown_selected.selectedCountry = {
      value: filter_data.countryid,
      label: filter_data.countryname,
    };
    dropdown_selected.selectedGender = {
      value: filter_data.genderid,
      label: filter_data.gendername,
    };
    dropdown_selected.selectedEthnicity = {
      value: filter_data.ethnicityid,
      label: filter_data.ethnicity,
    };
    setDropDownLists(dropdown_selected);
  };

  return (
    <div className="profile-view">
      <div className="profile-view">
        <PageTitle heading="Candidate Profile" icon={candidatelogo} />
      </div>
      {profileData.personalInfo.email ? (
        <div className="profile-view">
          <Row>
            <PersonalInformation
              profileInfo={profileData}
              dropDownData={dropdownLists}
              onCallBack={() => loadPage()}
            />
          </Row>
          <Row>

            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>

              <ResumeDetails
                resumeInfo={profileData.resumeInfo}
                candidateDetails={profileData.personalInfo}
                onCallBack={() => loadPage()}
              />
            </Col>

            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>

              <CandidateSkills
                skillInfo={profileData.skillsInfo}
                popularSkillData={popularSkills}
                onCallBack={() => loadPage()}
              />
            </Col>
          </Row>
          <Row>

            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>

              <CandidateQualification
                qualificationInfo={profileData.qualificationsInfo}
                onCallBack={() => loadPage()}
              />
            </Col>

            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>

              <CandidateEducation
                educationInfo={profileData.educationInfo}
                onCallBack={() => loadPage()}
              />
            </Col>
          </Row>
          <Row>

            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>

              <CertificationDetails
                certificationsInfo={profileData.certificationsInfo}
                onCallBack={() => loadPage()}
              />
            </Col>

            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>

              <AdditionalInformation onCallBack={() => loadPage()} />
            </Col>
          </Row>
          <Row>
            <JobPreferences onCallBack={() => loadPage()} />
          </Row>
        </div>
      ) : (
        <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
          <Loader active={true} type="line-scale-pulse-out-rapid" />
        </div>
      )}
    </div>
  );
}
