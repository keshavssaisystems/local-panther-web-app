import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
  FormText,
} from "reactstrap";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { candidateActions } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Collapse,
  CardHeader,
  Button,
  FormGroup,
  InputGroup,
  Form,
} from "reactstrap";
import { profileActions } from "_store";
import axios from "axios";
import { SkillsFilter } from "../../_components/dropdownComponents/SkillsFilter";
import { getSkillsFilter } from "_store";

import {
  shiftsOption,
  workScheduleOptions,
  jobTypeOption,
  experienceLevelOption,
  hiringTimelineOption,
  jobLocationOptions,
  payPeriodTypeOption,
} from "../../_containers/customer/createJob/dummyData";

import { useDispatch } from "react-redux";

import "./profile.scss";
import { profileSkillsActions } from "_store";
import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";

export function CandidateSkills(props) {
  const dispatch = useDispatch();
  const [getResponse, setResponse] = useState(props.skillInfo);
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};
  const [mustHaveValidation, setMustHaveValidation] = useState(false);
  const [selectedPopSkills, setSelectedSkills] = useState([]);
  const [skillsMultiple, setSkillsMultiple] = useState([]);

  const [selectedSkillData, setSelectedSkillData] = useState([]);

  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  useEffect(() => {
    setPreData();
  }, []);

  const setPreData = function () {
    let data = [...skillsMultiple];

    let selectedData = [...selectedSkillData];

    data = getResponse.map(({ ...rest }) => {
      return {
        value: rest.skillid,
        label: rest.skillname,
      };
    });

    selectedData = getResponse.map(({ ...rest }) => {
      return {
        id: rest.skillid,
        name: rest.skillname,
        experience: rest.yearsofexperience,
      };
    });

    setSkillsMultiple(data);
    setSelectedSkillData(selectedData);
  };

  const closeModal = function () {
    setSuccess(false);
    setError(false);
    props.onCallBack();
  };
  const [selectedData, setSelectedData] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillsTemp, setSkillsTemp] = useState([]);

  const [viewSkills, setViewSkills] = useState([
    {
      name: "HTML",
      experience: "5 years",
    },
    {
      name: "JavaScript",
      experience: "7 years",
    },
    {
      name: "C#",
      experience: "2 years",
    },
    {
      name: "Java",
      experience: "1 year",
    },
    {
      name: "React Js",
      experience: "1 year",
    },
    {
      name: "Angular",
      experience: "2 years",
    },
  ]);

  const removeSkills = function (data) {
    debugger;
    let filter_data = skills.find((x) => x.value == data.value);
    if (data) {
      let new_array = [...skills];
      new_array.push(data);
      setSkills(new_array);
    }
    let multiple_skills = [...skillsMultiple];
    let multiple_skills_new = multiple_skills.filter(function (obj) {
      return obj.value !== data.value;
    });

    let data_new = selectedSkillData.filter(function (obj) {
      return obj.id !== data.value;
    });

    setSkillsMultiple(multiple_skills_new);
    setSelectedSkillData(data_new);
  };

  useEffect(() => {
    loadDefaultOptions();
  }, []);
  useEffect(() => {
    let slice_array = [...skills];
    let index = skills.findIndex((x) => x.value == selectedData.value);

    let data = slice_array.filter(function (obj) {
      return obj.value !== selectedData.value;
    });
    setSkills(data);
    setSkillsTemp(data);
    console.log(skills);
  }, [selectedData]);

  const onSelectSkillsDropdown = function (data) {
    setSkillsMultiple(data);
    console.log(skillsMultiple);
  };
  const close = function () {
    setPersonalModal(false);
  };

  const onSelectPopSkills = function (data) {
    debugger;
    let new_array = [...skillsMultiple];
    new_array.push(data);
    setSkillsMultiple(new_array);
    setSelectedData(data);

    let skill_data = {
      id: data.value,
      name: data.label,
      experience: "",
    };
    let new_data = [...selectedSkillData];
    new_data.push(skill_data);

    setSelectedSkillData(new_data);
  };
  // form validation rules
  const getStringData = (data) => {
    let dataArray = [];
    if (data.length === undefined) {
      return data.value;
    }
    if (data.length !== undefined) {
      data.forEach((element) => {
        dataArray.push(element.value);
      });
      return dataArray.toString();
    }
  };
  const getFormData = async (event) => {
    event.preventDefault();
    let mustHave = getStringData(event.target.elements.skills);
    if (mustHave === "") {
      setMustHaveValidation(true);
    } else {
      setMustHaveValidation(false);
      let id = JSON.parse(localStorage.getItem("userDetails")).InternalUserId;
      let userId = JSON.parse(localStorage.getItem("userDetails")).UserId;

      let payload = selectedSkillData.map((rest) => {
        return {
          candidateid: Number(id),
          yearsofexperience:
            rest.experience == "" ? 0 : parseInt(rest.experience),
          skillid: rest.id,
          currentUserId: parseInt(userId),
          isactive: true,
        };
      });

      console.log(payload);
      const candidateId = JSON.parse(
        localStorage.getItem("userDetails")
      ).UserId;
      dispatch(profileSkillsActions.updateSkillThunk({ id, payload, userId }));

      debugger;
    }
  };
  const loadOptions = async function (inputValue) {
    if (inputValue.length > 2) {
      const { data = [] } = await getSkillsFilter(inputValue);
      return data.map(({ skillid: value, ...rest }) => {
        return {
          value,
          label: `${rest.skillname}`,
        };
      });
    }
  };

  const loadDefaultOptions = async function () {
    const { data = [] } = await getSkillsFilter("net");
    let filtered_data = data.map(({ skillid: value, ...rest }) => {
      return {
        value,
        label: `${rest.skillname}`,
      };
    });
    setSkills(filtered_data);
  };
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const removeView = async function (data) {
    debugger;
    let id = data.candidateskillid;
    let response = await dispatch(profileSkillsActions.deleteSkillThunk(id));
    debugger;
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  };

  const onSelectExperience = function (selectedSkill, data) {
    debugger;
    const index = selectedSkillData.findIndex(
      (x) => x.id == selectedSkill.value
    );

    let new_array = [...selectedSkillData];
    new_array[index].experience = data;

    setSelectedSkillData(new_array);
    debugger;
  };

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Row>
          <Col sm="12" lg="12">
            <Card className="main-card mb-3">
              <div className="mt-3" style={{ marginLeft: "10px" }}>
                <Row className="mb-3">
                  <Col>
                    <strong className="card-title-text">Skills</strong>
                  </Col>

                  <Col>
                    <Label
                      className="float-end me-3 link-text"
                      onClick={(evt) => setPersonalModal(true)}
                    >
                      Add
                    </Label>
                  </Col>
                </Row>
                <Row style={{ marginLeft: "2px" }} className="d-flex flex-row">
                  {getResponse.map((item) => (
                    <Button
                      className="
                       mb-2 me-2 skills-view btn-shadow btn-outline-2x"
                      outline
                      color="light"
                    >
                      <strong className="skills-view-text">
                        {" "}
                        {item.skillname + " "}
                      </strong>
                      <span className="skills-exp-text me-1">
                        {item.yearsofexperience
                          ? item.yearsofexperience + "years "
                          : ""}
                      </span>
                      <span
                        aria-hidden="true"
                        style={{ fontSize: "15px", cursor: "pointer" }}
                        onClick={(evt) => removeView(item)}
                      >
                        x
                      </span>
                    </Button>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {isPersonalModal ? (
        <div className="profile-view">
          <Modal className="profile-view" size="lg" isOpen={isPersonalModal}>
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Skill Details
              </strong>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={(e) => getFormData(e)}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for={skills} className="input-label">
                        Skills <span style={{ color: "red" }}>* </span>
                      </Label>
                      <AsyncSelect
                        name="skills"
                        placeholder="Search to select"
                        loadOptions={loadOptions}
                        className={mustHaveValidation ? "is-invalid" : ""}
                        isMulti={true}
                        value={skillsMultiple}
                        onChange={(evt) => onSelectSkillsDropdown(evt)}
                      />
                      {mustHaveValidation === true && (
                        <FormText color="danger">Skills is Required</FormText>
                      )}
                    </FormGroup>
                  </Col>

                  <Row className="mt-2">
                    {skillsMultiple.map((item) => (
                      <div>
                        <Row>
                          <Col md={4}>
                            <FormGroup>
                              <Label
                                for={"skillsInput"}
                                className="fw-semi-bold"
                              >
                                Selected Skill
                              </Label>
                              <Input
                                type="text"
                                name="skillSelected"
                                id="skillSelected"
                                disabled={true}
                                value={item.label}
                              ></Input>
                            </FormGroup>
                          </Col>

                          <Col md={4}>
                            <div>
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
                                  onChange={(evt) =>
                                    onSelectExperience(item, evt.target.value)
                                  }
                                  // value={getExpLabel(item.experience)}
                                >
                                  <option key={0}>
                                    Select experience level
                                  </option>
                                  {experienceLevelOption.length > 0 &&
                                    experienceLevelOption.map((options) => (
                                      <option
                                        key={options.id}
                                        value={options.id}
                                      >
                                        {options.label}
                                      </option>
                                    ))}
                                </Input>
                              </FormGroup>
                            </div>
                          </Col>
                          <Col>
                            <div
                              onClick={() => removeSkills(item)}
                              className="nav-link"
                            >
                              remove
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Row>
                </Row>
                <Row>
                  <Label className="input-label">
                    Add any of these popular skills
                  </Label>
                </Row>
                <Row className="skills-div mb-3 mt-2">
                  {skills.map((item) => (
                    <Button
                      className="
                       mb-1 me-2 mt-3 skills-view-popup btn-shadow btn-outline-2x"
                      outline
                      color="light"
                      onClick={(evt) => onSelectPopSkills(item)}
                    >
                      <strong className="pop-skills-div"> {item.label}</strong>
                    </Button>
                  ))}
                </Row>

                <div className="float-end">
                  <Button className="me-2 save-btn" type="submit">
                    Save
                  </Button>
                  <Button
                    type="button"
                    className="close-btn"
                    onClick={() => setPersonalModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}

      <Modal className="modal-reject-align profile-view" isOpen={success}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              {message}
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Thank you!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => closeModal()}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-reject-align profile-view" isOpen={error}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Something went wrong
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Please try again later
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => closeModal()}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
}
