import { Department } from "_components/dropdownComponents/Department";
import { EmploymentMode } from "_components/dropdownComponents/EmploymentMode";
import { Experience } from "_components/dropdownComponents/Experience";
import { RemoteStatus } from "_components/dropdownComponents/RemoteStatus";
import { InputFormGroup } from "_components/formComponents/InputFormGroup";
import { Location } from "_components/dropdownComponents/Location";
import { Skills } from "_components/dropdownComponents/Skills";

import React, { useState } from "react";
import "./CreateJob.scss";
import { Row, Col, Card, CardBody, CardTitle, Button, Form } from "reactstrap";
import { BsPuzzle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { createjobActions } from "_store";
import { UploadJDModal } from "./UploadJDModal";
import { Popup } from "_components/common/Popup";
import { PopupWithNextStep } from "_components/common/PopupWithNextStep";

export function CreateJob() {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupWithNextStep, setShowPopupWithNextStep] = useState(false);
  const [showJobTitleValidation, setJobTitleValidation] = useState(false);
  const [showJobRoleValidation, setJobRoleValidation] = useState(false);
  const [showDepartmentValidation, setDepartmentValidation] = useState(false);
  const [showLocationValidation, setLocationValidation] = useState(false);
  const [showJobDescriptionValidation, setJobDescriptionValidation] =
    useState(false);
  const [showMinExperienceValidation, setMinExperienceValidation] =
    useState(false);
  const [showMaxExperienceValidation, setMaxExperienceValidation] =
    useState(false);
  const [showRequiredSkillsValidation, setRequiredSkillsValidation] =
    useState(false);
  const [showResponsibilitiesValidation, setResponsibilitiesValidation] =
    useState(false);
  const checkValidation = (event) => {
    event.preventDefault();
    setShowPopup(false);
    // setShowPopupWithNextStep(false);
    if (event.target.elements.jobTitle.value === "") {
      setJobTitleValidation(true);
    }
    if (event.target.elements.jobDescription.value === "") {
      setJobDescriptionValidation(true);
    }
    if (event.target.elements.skills.value === "") {
      setRequiredSkillsValidation(true);
    }
    if (event.target.elements.department.value === "") {
      setDepartmentValidation(true);
    }
    if (event.target.elements.jobRole.value === "") {
      setJobRoleValidation(true);
    }
    if (event.target.elements.location.value === "") {
      setLocationValidation(true);
    }
    if (event.target.elements.rolesResponsibilities.value === "") {
      setResponsibilitiesValidation(true);
    }
    if (event.target.elements.minExperience.value === "") {
      setMinExperienceValidation(true);
    }
    if (event.target.elements.maxExperience.value === "") {
      setMaxExperienceValidation(true);
    }
    if (
      event.target.elements.jobTitle.value !== "" &&
      event.target.elements.jobDescription.value !== "" &&
      event.target.elements.skills.value !== "" &&
      event.target.elements.department.value !== "" &&
      event.target.elements.jobRole.value !== "" &&
      event.target.elements.location.value !== "" &&
      event.target.elements.rolesResponsibilities.value !== "" &&
      event.target.elements.minExperience.value !== "" &&
      event.target.elements.maxExperience.value !== ""
    ) {
      onSubmitClick(event);
    }
  };
  const getLocationDetails = (locationString) => {
    let locationDetails = [];
    let splitDetails = locationString.split(",");
    locationDetails = [
      {
        jobid: 0,
        joblocationid: 0,
        location:
          splitDetails[3] + ", " + splitDetails[4] + ", " + splitDetails[5],
        cityid: splitDetails[0],
        stateid: splitDetails[1],
        statename: splitDetails[4],
        countryid: splitDetails[2],
        countryname: splitDetails[5],
        regionid: 0,
        regionname: "",
        isactive: true,
        currentUserId: 0,
      },
    ];
    return locationDetails;
  };
  const getSkillsDetails = (skillsString) => {
    console.log(skillsString);
    let skillsDetails = [];
    let splitDetails = skillsString.split(",");
    splitDetails.forEach((element) => {
      let skillsDetailObj = {
        jobskillid: 0,
        jobid: 0,
        skillid: 0,
        skillname: element.trim(),
        isactive: true,
        currentUserId: 0,
      };
      skillsDetails.push(skillsDetailObj);
    });
    return skillsDetails;
  };
  const onSubmitClick = (event) => {
    let locationDetails = getLocationDetails(
      event.target.elements.location.value
    );
    let skillDetails = getSkillsDetails(event.target.elements.skills.value);
    let data = {
      jobid: 0,
      companyid: 1,
      jobtitle: event.target.elements.jobTitle.value,
      description: event.target.elements.jobDescription.value,
      pitch: event.target.elements.basicInformation.value,
      employmentmodeid: 1,
      department: event.target.elements.department.value,
      jobrole: event.target.elements.jobRole.value,
      remotestatus: event.target.elements.remoteStatus.value,
      noofopenposition: event.target.elements.openings.value,
      minexperience: event.target.elements.minExperience.value,
      maxexperience: event.target.elements.maxExperience.value,
      responsibilities: event.target.elements.rolesResponsibilities.value,
      isactive: true,
      jobLocationDtos: locationDetails,
      jobSkillDtos: skillDetails,
    };
    console.log(data);
    createJob(data);
    setShowPopupWithNextStep(!showPopupWithNextStep);
  };
  const dispatch = useDispatch();
  const createJob = async function (formElement) {
    await dispatch(createjobActions.getCreatejob(formElement));
  };
  let createJobSuccess = [];
  createJobSuccess = useSelector((state) => state.createJob);
  console.log(createJobSuccess);

  const handleDepartmentChange = (e) => {
    const { target: {name , value } } = e;
    console.log('name, value :>> ', name, value);
  }
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody>
              <CardTitle className="mb-0">
                {" "}
                <span className="icon-box">
                  <BsPuzzle style={{ transform: "rotate(90deg)" }} />
                </span>{" "}
                Create New Job <UploadJDModal />
              </CardTitle>
            </CardBody>
          </Card>
        </Col>
        <Form onSubmit={checkValidation}>
          <p className="fw-bold block-heading">Job Information</p>
          <Col md="12">
            <Card className="main-card mb-3">
              <CardBody>
                <Row>
                  <Col md="3">
                    <InputFormGroup
                      label={"Job Title"}
                      name={"jobTitle"}
                      id={"jobTitle"}
                      type={"text"}
                      placeholder={"Eg. UX UI Designer"}
                      showValidation={showJobTitleValidation}
                      validationMessage={"Please enter job title"}
                      mandatory={true}
                    />
                  </Col>
                  <Col md="3">
                    <InputFormGroup
                      label={"Job Role"}
                      name={"jobRole"}
                      id={"jobRole"}
                      type={"text"}
                      placeholder={"Eg. UX Designer, UI Developer etc."}
                      showValidation={showJobRoleValidation}
                      validationMessage={"Please enter job role"}
                      mandatory={true}
                    />
                  </Col>
                  <Col md="3">
                    <Department
                      showValidation={showDepartmentValidation}
                      validationMessage={"Please select department"}
                      mandatory={true}
                      onChange={handleDepartmentChange}
                    />
                  </Col>
                  <Col md="3">
                    <EmploymentMode
                      showValidation={false}
                      validationMessage={"Please select employment mode"}
                      mandatory={false}
                      defaultOption={"Eg. Full-time, Part-time etc."}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <InputFormGroup
                      label={"No of Openings"}
                      name={"openings"}
                      id={"openings"}
                      type={"number"}
                      placeholder={"Eg. 2"}
                      showValidation={false}
                      validationMessage={"Please enter number of openings"}
                    />
                  </Col>
                  <Col md="3">
                    <RemoteStatus
                      showValidation={false}
                      validationMessage={"Please select remote status"}
                      mandatory={false}
                    />
                  </Col>
                  <Col md="3">
                    <Location
                      label={"Location"}
                      name={"location"}
                      id={"location"}
                      defaultOption={"search city"}
                      showValidation={showLocationValidation}
                      validationMessage={"Please select location"}
                      mandatory={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <InputFormGroup
                      label={"Job Description"}
                      name={"jobDescription"}
                      id={"jobDescription"}
                      type={"textarea"}
                      placeholder={"Enter Job Description"}
                      showValidation={showJobDescriptionValidation}
                      validationMessage={"Please enter job description"}
                      mandatory={true}
                    />
                  </Col>
                  <Col md="6">
                    <InputFormGroup
                      label={"Company's Basic Information"}
                      name={"basicInformation"}
                      id={"basicInformation"}
                      type={"textarea"}
                      placeholder={"Enter Company's Basic Information"}
                      showValidation={false}
                      validationMessage={
                        "Please enter company's basic information"
                      }
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <p className="fw-bold block-heading">Skills and Responsibilities</p>
          <Col md="12">
            <Card className="main-card mb-3">
              <CardBody>
                <Row>
                  <Col md="3">
                    <Experience
                      label={"Minimum Experience"}
                      name={"minExperience"}
                      id={"minExperience"}
                      defaultOption={"Select Min"}
                      max={10}
                      showValidation={showMinExperienceValidation}
                      validationMessage={"Please enter minimum experience"}
                      mandatory={true}
                    />
                  </Col>
                  <Col md="3">
                    <Experience
                      label={"Maximum Experience"}
                      name={"maxExperience"}
                      id={"maxExperience"}
                      defaultOption={"Select Max"}
                      max={15}
                      showValidation={showMaxExperienceValidation}
                      validationMessage={"Please enter maximum experience"}
                      mandatory={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    
                    <Skills
                      label={"Required Skills"}
                      name={"skills"}
                      id={"skills"}
                      type={"textarea"}
                      placeholder={"Type to search for skill"}
                      showValidation={showRequiredSkillsValidation}
                      validationMessage={"Please enter skills"}
                      mandatory={true}
                    />
                  </Col>
                  <Col md="6">
                    <InputFormGroup
                      label={"Roles and Responsibilities"}
                      name={"rolesResponsibilities"}
                      id={"rolesResponsibilities"}
                      type={"textarea"}
                      placeholder={"Enter Roles and Responsibilities"}
                      showValidation={showResponsibilitiesValidation}
                      validationMessage={
                        "Please enter roles and responsibilities"
                      }
                      mandatory={true}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md="12">
            <Button type="submit" className="float-end button-submit-new">
              {" "}
              Submit{" "}
            </Button>
          </Col>
        </Form>
      </Row>
      {showPopup === true && (
        <Popup
          type={"success"}
          message={"Job description uploaded"}
          action={true}
        />
      )}
      {showPopupWithNextStep === true && (
        <PopupWithNextStep
          type={"success"}
          message={"The job has been created"}
          action={true}
          nextStepMessage={"Do you want to create a new job?"}
          noAction={"/JobList"}
          yesAction={"/createJob"}
        />
      )}
    </>
  );
}
