import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { candidateActions } from "_store";
import {
  Row,
  Col,
  Card,
  CardBody,
  Collapse,
  CardHeader,
  Button,
  FormGroup,
  Container,
} from "reactstrap";
import Tabs from "react-responsive-tabs";
import { useDispatch } from "react-redux";
import PageTitle from "../../_components/common/pagetitle";
import "./profile.scss";
import candidatelogo from "../../assets/utils/images/candidate.svg";
import { CSSTransition } from "react-transition-group";
import { ResumeDetails } from "./resumeDetails";
import { CandidateQualification } from "./candidateQualification";
import { CandidateEducation } from "./educationalInfo";
import { PersonalInformation } from "./personalInformation";
import { CandidateSkills } from "./candidateSkills";
import { CertificationDetails } from "./certifications";
import { AdditionalInformation } from "./additionalInfo";
import { JobPreferences } from "./jobPreferences";
import {
  profileActions,
  getProfileActions,
  cityActions,
  genderActions,
  ethnicityActions,
} from "_store";
import { getLocationFilter } from "_store";

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

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async function () {
    await getDropdownLists();
    await getPersonalDetails();
  };

  const getDropdownLists = async function () {
    await dispatch(genderActions.getGender());
    await dispatch(ethnicityActions.getEthnicity());
  };

  const getPersonalDetails = async function () {
    let candidateid = userDetails.InternalUserId;
    let response = await dispatch(getProfileActions.getCandidate(candidateid));
    let filter_data = response.payload;
    let organization = filter_data.candidateQualificationsDtos.filter(
      (x) => x.iscurrentlyworking == true
    );

    let data = {
      position: organization.length > 0 ? organization[0].jobtitle : "",
      organization:
        organization.length > 0 ? organization[0].company : "Not Working",
      eligibility: dropdownLists.eligibilityDropDown.find(
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
    new_data.qualificationsInfo = filter_data.candidateQualificationsDtos;
    new_data.educationInfo = filter_data.candidateEducationDtos;
    new_data.certificationsInfo = filter_data.candidateCertificationDtos;
    new_data.additionalInfo = filter_data.candidateAdditionalInformationDtos;
    setProfileData(new_data);

    let dropdown_selected = { ...dropdownLists };

    dropdown_selected.selectedCity = {
      value: filter_data.cityid,
      label: filter_data.cityname,
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
      label: filter_data.ethnicityname,
    };
    setDropDownLists(dropdown_selected);
  };

  return (
    <div>
      <div className="profile-view">
        <PageTitle heading="Candidate Profile" icon={candidatelogo} />
      </div>
      {profileData.personalInfo.email ? (
        <div className="profile-view">
          <Row>
            <PersonalInformation
              profileInfo={profileData}
              dropDownData={dropdownLists}
              onCallBack={() => loadPage}
            />
          </Row>
          <Row>
            <Col>
              <ResumeDetails
                resumeInfo={profileData.resumeInfo}
                candidateDetails={profileData.personalInfo}
                onCallBack={() => loadPage}
              />
            </Col>
            <Col>
              <CandidateSkills
                skillInfo={profileData.skillsInfo}
                onCallBack={() => loadPage}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CandidateQualification
                qualificationInfo={profileData.qualificationsInfo}
                onCallBack={() => loadPage}
              />
            </Col>
            <Col>
              <CandidateEducation />
            </Col>
          </Row>
          <Row>
            <Col>
              <CertificationDetails />
            </Col>
            <Col>
              <AdditionalInformation />
            </Col>
          </Row>
          <Row>
            <JobPreferences />
          </Row>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
