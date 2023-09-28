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

export function CandidateSkills(props) {
  const dispatch = useDispatch();
  const [getResponse, setResponse] = useState(props.skillInfo);
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};
  const [mustHaveValidation, setMustHaveValidation] = useState(false);
  const [selectedPopSkills, setSelectedSkills] = useState([]);
  const [skillsMultiple, setSkillsMultiple] = useState([]);

  const [selectedSkillData, setSelectedSkillData] = useState([]);

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
    setSkillsMultiple(multiple_skills_new);
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

      let data = selectedSkillData.map(({ ...rest }) => {
        return {
          candidateid: id,
          yearsofexperience: `${rest.experience}`,
          candidateskillid: `${rest.id}`,
          skillid: `${rest.id}`,
          currentUserId: `${rest.userId}`,
          isactive: true,
        };
      });
      debugger;
      const currentUserId = Number(
        JSON.parse(localStorage.getItem("userDetails")).UserId
      );
      let response = await dispatch(
        profileActions.addSkills(id, currentUserId, data)
      );
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

  const removeView = function (data) {
    let new_array = [...viewSkills];
    let data_new = new_array.filter(function (obj) {
      return obj.skillname !== data.skillname;
    });
    setViewSkills(data_new);
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
            <Card className="main-card mb-3" style={{ height: "168%" }}>
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
                        {item.skillname + ", "}
                      </strong>
                      <span className="skills-exp-text me-1">
                        {item.yearsofexperience + " "}
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
    </div>
  );
}
