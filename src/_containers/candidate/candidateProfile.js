import React, { useState, useEffect, useRef } from "react";
import { yearActions, monthActions } from "_store";
import { Row, Col, Alert } from "reactstrap";
import Loader from "react-loaders";
import { useDispatch, useSelector } from "react-redux";
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
import SweetAlert from "react-bootstrap-sweetalert";
import { analytics } from "../../firebase/index";

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
    dispatch(getProfileActions.getAvailability());
    dispatch(getProfileActions.getPronoun());
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "candidate profile",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  const loadPage = async function () {
    await getPersonalDetails();
    await getDropdownLists();
  };

  const closeJobPreferModal = function () {
    setshowJobPreferModal(false);
    loadPage();
  };

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
    let payload = {
      searchText: "java",
    };
    popular_skills = await getSkillsFilter(payload);
    setPopularSkills(popular_skills.data);
    await dispatch(studyFieldActions.getStudyField());
    await dispatch(dropdownActions.getJobLocationTypeThunk());
    await dispatch(yearActions.getyear());
    await dispatch(monthActions.getmonth());
    await dispatch(profileSkillsActions.getPopularSkills());
  };

  const getPersonalDetails = async function () {
    let candidateid = localStorage.getItem("admcandid")
      ? localStorage.getItem("admcandid")
      : userDetails.InternalUserId;
    let response = await dispatch(getProfileActions.getCandidate(candidateid));
    let filter_data = response.payload;
    let organization = filter_data?.candidateQualificationsDtos?.filter(
      (x) => x.iscurrentlyworking == true
    );

    let data = {
      position: organization?.length > 0 ? organization[0].jobtitle : "",
      organization:
        organization?.length > 0 ? organization[0].company : "Not Working",
      eligibility: dropdownLists?.eligibilityDropDown?.find(
        (x) => x.id == filter_data?.employmenteligiblity
      )?.name,
      readyToWork: filter_data?.isreadytoworkimmediately ? "Yes" : "No",
      phonenumber: filter_data?.phonenumber,
      email: filter_data?.email,
      state: filter_data?.statename,
      city: filter_data?.cityname,
      country: filter_data?.countryname,
      dob: new Date(),
      gender: filter_data?.gendername,
      race: filter_data?.ethnicityname,

      candidateid: 0,
      firstname: filter_data?.firstname,
      lastname: filter_data?.lastname,
      genderid: filter_data?.genderid,
      cityid: filter_data?.cityid,
      stateid: filter_data?.stateid,
      countryid: filter_data?.countryid,
      zipcode: filter_data?.zipcode,
      ethnicityid: filter_data?.ethnicityid,
      ethnicity: filter_data?.ethnicity,
      employmenteligiblity: filter_data?.employmenteligiblity,
      isreadytoworkimmediately: filter_data?.isreadytoworkimmediately,
      isactive: true,
      userid: 0,
      currentUserId: 0,
    };
    let new_data = { ...profileData };
    new_data.personalInfo = data;
    new_data.skillsInfo = filter_data?.candidateSkillDtos;
    new_data.resumeInfo = filter_data?.candidateResumeDto;
    new_data.qualificationsInfo = filter_data?.candidateQualificationsDtos;
    new_data.educationInfo = filter_data?.candidateEducationDtos;
    new_data.certificationsInfo = filter_data?.candidateCertificationDtos;
    new_data.additionalInfo = filter_data?.candidateAdditionalInformationDtos;
    new_data.jobPreferenceInfo = filter_data?.candidateJobPreferenceDtos;
    setProfileData(new_data);

    let dropdown_selected = { ...dropdownLists };

    dropdown_selected.selectedCity = {
      value: filter_data?.cityid,
      label: `${filter_data?.cityname + ", " + filter_data?.statename}`,
    };
    dropdown_selected.selectedState = {
      value: filter_data?.stateid,
      label: filter_data?.statename,
    };
    dropdown_selected.selectedCountry = {
      value: filter_data?.countryid,
      label: filter_data?.countryname,
    };
    dropdown_selected.selectedGender = {
      value: filter_data?.genderid,
      label: filter_data?.gendername,
    };
    dropdown_selected.selectedEthnicity = {
      value: filter_data?.ethnicityid,
      label: filter_data?.ethnicity,
    };
    setDropDownLists(dropdown_selected);
  };
  let sectionValidation = {};
  let stringArray = [];
  const [viewValidation, setViewValidation] = useState(true);
  const [showEEPopup, setShowEEPopup] = useState(false);
  const [showJopPrefPopup, setShowJopPrefPopup] = useState(false);
  const [showJobPreferModal, setshowJobPreferModal] = useState(false);
  const [stringValue, setStringValue] = useState("");
  const [viewAINote, setViewAINote] = useState(true);
  useEffect(() => {
    if (profileData) {
      sectionValidation.skills =
        profileData?.skillsInfo?.length === 0 ? false : true;
      sectionValidation.education =
        profileData?.educationInfo?.length === 0 ? false : true;
      // sectionValidation.certification =
      //   profileData?.certificationsInfo?.length === 0 ? false : true;
      sectionValidation.qualification =
        profileData?.qualificationsInfo?.length === 0 ? false : true;
      sectionValidation.jobPreference =
        profileData?.jobPreferenceInfo?.length === 0 ||
        profileData?.jobPreferenceInfo === null
          ? false
          : true;
      sectionValidation.employmentEligiblity =
        profileData?.personalInfo?.employmenteligiblity === null ||
        profileData?.personalInfo?.employmenteligiblity === 0
          ? false
          : true;
      sectionValidation.employmentEligiblity === false
        ? setShowEEPopup(true)
        : setShowEEPopup(false);

      if (
        profileData?.personalInfo?.employmenteligiblity !== null &&
        profileData?.personalInfo?.employmenteligiblity !== undefined &&
        profileData?.personalInfo?.employmenteligiblity !== 0 &&
        (profileData?.jobPreferenceInfo === null ||
          profileData?.jobPreferenceInfo?.length === 0)
      ) {
        setShowJopPrefPopup(true);
      } else {
        setShowJopPrefPopup(false);
      }
      if (
        sectionValidation.skills === true &&
        sectionValidation.qualification === true &&
        sectionValidation.education === true &&
        // sectionValidation.certification === true &&
        sectionValidation.employmentEligiblity === true &&
        sectionValidation.jobPreference === true
      ) {
        setViewValidation(false);
      }
      if (sectionValidation.skills === false) {
        stringArray.push("Skills");
      }
      if (sectionValidation.qualification === false) {
        stringArray.push(" Qualification details");
      }
      if (sectionValidation.education === false) {
        stringArray.push(" Education details");
      }
      // if (sectionValidation.certification === false) {
      //   stringArray.push(" Certifications");
      // }
      if (sectionValidation.employmentEligiblity === false) {
        stringArray.push(" Employment eligibility");
      }
      if (sectionValidation.jobPreference === false) {
        if (stringArray.length > 0) {
          stringArray.push(" and Job preferences.");
        } else {
          stringArray.push(" Job preferences.");
        }
      }
    }
    setStringValue(stringArray.toString());
  }, [profileData]);
  const notifications = useSelector(
    (state) => state.candidateDashboard.alertsList
  );
  useEffect(() => {
    if (notifications?.[0]?.notificationmessage === "Resume Parsed") {
      loadPage();
    }
  }, [notifications]);

  const setEmployementEligibility = (type) => {
    updateEmploymentEligibility(type);
    setShowEEPopup(false);
  };

  const updateEmploymentEligibility = async (type) => {
    let candidateId = localStorage.getItem("admcandid")
      ? Number(localStorage.getItem("admcandid"))
      : Number(userDetails.InternalUserId);
    let payload = {
      candidateid: candidateId,
      employmenteligiblity: type,
    };
    let data = await dispatch(
      getProfileActions.updateEmploymentEligibilityThunk({
        candidateId,
        payload,
      })
    );
    if (data?.payload?.status === "Success") {
      dispatch(getProfileActions.getCandidate(candidateId));
    }
  };

  const onClickJobPrefUpdate = async () => {
    setshowJobPreferModal(true);
    setShowJopPrefPopup(false);
  };

  return (
    <div className="profile-view">
      <div className="profile-view">
        <PageTitle heading="Candidate Profile" icon={candidatelogo} />
      </div>

      {profileData.personalInfo.email ? (
        <div className="profile-view">
          <SweetAlert
            warning
            show={showEEPopup}
            cancelBtnText={"No"}
            confirmBtnText={"Yes"}
            onConfirm={() => setEmployementEligibility(1)}
            onCancel={() => setEmployementEligibility(2)}
            showCancel
            closeOnClickOutside={false}
          >
            <p className="candidate-profile-prompt">
              Are you authorized to work in the United States?
            </p>
          </SweetAlert>

          <SweetAlert
            warning
            show={showJopPrefPopup}
            confirmBtnText={"Update"}
            onConfirm={() => onClickJobPrefUpdate(true)}
            closeOnClickOutside={false}
          >
            Please provide job preferences.
          </SweetAlert>

          <Alert
            color="warning"
            isOpen={viewValidation}
            toggle={() => setViewValidation(false)}
          >
            Enhance your experience and find the{" "}
            <span className="prompt-bold">best job matches</span>. Please
            provide <span className="prompt-bold">{stringValue}</span>
          </Alert>
          <Alert
            color="info"
            isOpen={viewAINote}
            toggle={() => setViewAINote(false)}
          >
            <b>Note:</b>
            <ul className="mb-0">
              <li>
                Although AI Candidate/Job Matching and Resume Parsing can
                greatly enhance the resume parsing and matching process, they
                are not foolproof.
              </li>
              <li>
                It is still important for users to carefully review and adjust
                their profiles according to their individual experiences and
                preferences.
              </li>
              <li>
                No technology can substitute the significance of thoughtful
                self-presentation and customization to meet specific criteria.
              </li>
            </ul>
          </Alert>
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
            <JobPreferences onCallBack={() => loadPage()} isRequired={false} />
          </Row>

          {showJobPreferModal && (
            <Row>
              <JobPreferences
                onCallBack={() => closeJobPreferModal()}
                isRequired={true}
              />
            </Row>
          )}
        </div>
      ) : (
        <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
          <Loader active={true} type="line-scale-pulse-out-rapid" />
        </div>
      )}
    </div>
  );
}
