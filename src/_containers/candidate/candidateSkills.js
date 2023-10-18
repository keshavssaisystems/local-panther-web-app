import React, { useState, useEffect } from "react";
import { Label, Input, ModalHeader, ModalBody, FormText } from "reactstrap";
import AsyncSelect from "react-select/async";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  FormGroup,
  Form,
  CardTitle,
} from "reactstrap";

import { getSkillsFilter } from "_store";
import Loader from "react-loaders";

import { useDispatch, useSelector } from "react-redux";

import "./profile.scss";
import { profileSkillsActions } from "_store";
import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";

export function CandidateSkills(props) {
  const dispatch = useDispatch();

  const get_response = useSelector(
    (state) => state.getProfile.profileData.skillsInfo
  );

  const [getResponse, setResponse] = useState([]);

  const [isPersonalModal, setPersonalModal] = useState(false);
  const [mustHaveValidation, setMustHaveValidation] = useState(false);
  const [skillsMultiple, setSkillsMultiple] = useState([]);

  const shiftsOption = useSelector((state) => state.shifts.shift);
  const workScheduleOptions = useSelector(
    (state) => state.workSchedule.workSchedule
  );
  const jobTypeOption = useSelector((state) => state.jobType.jobType);
  const experienceLevelOption = useSelector(
    (state) => state.experienceLevel.experienceLevel
  );

  const [selectedSkillData, setSelectedSkillData] = useState([]);
  const [loader, setLoader] = useState(true);

  const [selectedExp, setSelectedExp] = useState([]);
  useEffect(() => {
    setResponse(get_response);
    let data = [...skillsMultiple];

    let selectedData = [...selectedSkillData];

    data = get_response?.map(({ ...rest }) => {
      return {
        value: rest.skillid,
        label: rest.skillname,
        experience: rest.yearsofexperience,
      };
    });

    selectedData = get_response?.map(({ ...rest }) => {
      return {
        id: rest.skillid,
        name: rest.skillname,
        experience: rest.yearsofexperience,
      };
    });

    setSkillsMultiple(data);
    setSelectedSkillData(selectedData);
    let selected_exp = [...selectedExp];
    selected_exp = get_response?.map(({ ...rest }) => {
      return {
        id: rest.yearsofexperience,
        name: experienceLevelOption.find((x) => x.id == rest.yearsofexperience)
          ?.name,
      };
    });
    setSelectedExp(selected_exp);
    setLoader(false);
    loadDefaultOptions(data);
  }, [get_response]);

  const closeModal = function () {
    setLoader(true);
    setPersonalModal(false);
    setSuccess(false);
    setError(false);
    setMustHaveValidation(false);
    setSelectedData([]);
    setSkillsMultiple([]);
    props.onCallBack();
  };
  const [selectedData, setSelectedData] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillsTemp, setSkillsTemp] = useState([]);

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

    let data_new = selectedSkillData.filter(function (obj) {
      return obj.id !== data.value;
    });

    setSkillsMultiple(multiple_skills_new);
    setSelectedSkillData(data_new);
  };

  // useEffect(() => {
  //   loadDefaultOptions();
  // }, []);
  useEffect(() => {
    let slice_array = [...skills];

    let index = skills.findIndex((x) => x.value == selectedData.value);

    let data = slice_array.filter(function (obj) {
      return obj.value !== selectedData.value;
    });
    setSkills(data);
    setSkillsTemp(data);
  }, [selectedData]);

  const onSelectSkillsDropdown = function (data) {
    setSkillsMultiple(data);

    let new_data = [...skills];
    let index = skills.findIndex(
      (x) => x.value == data[data.length - 1]?.value
    );

    new_data.splice(index, 1);

    setSkills(new_data);

    let selected_data = {
      id: data[data.length - 1].value,
      name: data[data.length - 1].label,
      experience: "",
    };
    let new_array = [...selectedSkillData];
    let i = selectedSkillData.findIndex(
      (x) => x.id == data[data.length - 1]?.value
    );
    if (i > -1) {
      new_array.splice(i, 1);
    } else {
      new_array.push(selected_data);
    }

    setSelectedSkillData(new_array);
  };
  const close = function () {
    setPersonalModal(false);
  };

  const onSelectPopSkills = function (data) {
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

      let response = await dispatch(
        profileSkillsActions.updateSkillThunk({ id, payload, userId })
      );
      if (response.payload) {
        setSuccess(true);
        setMessage(response.payload.message);
      } else {
        setError(true);
      }
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

  const loadDefaultOptions = async function (selectedData) {
    const { data = [] } = await getSkillsFilter("java");
    let filtered_data = data.map(({ skillid: value, ...rest }) => {
      return {
        value,
        label: `${rest.skillname}`,
      };
    });

    const uniqueArray = filtered_data.filter((item1) => {
      return !selectedData.find((item2) => item1.value === item2.value);
    });

    setSkills(uniqueArray);
  };
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const removeView = async function (data) {
    let id = data.candidateskillid;
    let response = await dispatch(profileSkillsActions.deleteSkillThunk(id));

    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  };

  const onSelectExperience = function (selectedSkill, data) {
    const index = selectedSkillData.findIndex(
      (x) => x.id == selectedSkill.value
    );

    let new_array = [...selectedSkillData];
    new_array[index].experience = selectedSkill;

    setSelectedSkillData(new_array);
  };
  return (
    <div>
      <div className="profile-view">
        <Card className="main-card mb-3">
          <CardBody className="scroll-area-lg">
            <div className="mb-3">
              <strong className="card-title-text">Skills</strong>
              <Label
                className="float-end me-3 link-text"
                onClick={(evt) => setPersonalModal(true)}
              >
                Add
              </Label>
            </div>

            {!loader ? (
              <div>
                {getResponse?.length > 0 ? (
                  getResponse.map((item) => (
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
                  ))
                ) : (
                  <div className="d-flex justify-content-center">
                    No Data available
                  </div>
                )}
              </div>
            ) : (
              <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
                <Loader active={true} type="line-scale-pulse-out-rapid" />
              </div>
            )}
          </CardBody>
        </Card>
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
                    <FormGroup
                      styles={{
                        borderColor: mustHaveValidation
                          ? "#d92550 !important"
                          : "",
                      }}
                    >
                      <Label for={skills} className="fw-semi-bold">
                        Skills <span style={{ color: "red" }}>* </span>
                      </Label>
                      <AsyncSelect
                        name="skills"
                        placeholder="Search to select"
                        loadOptions={loadOptions}
                        // className={mustHaveValidation ? "is-invalid" : ""}
                        isMulti={true}
                        value={skillsMultiple}
                        onChange={(evt) => onSelectSkillsDropdown(evt)}
                        styles={{
                          borderColor: mustHaveValidation
                            ? "#d92550 !important"
                            : "",
                        }}
                      />
                      {mustHaveValidation === true && (
                        <FormText color="danger">Skills is required</FormText>
                      )}
                    </FormGroup>
                  </Col>

                  <Row className="mt-2">
                    {skillsMultiple?.map((item) => (
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
                                  {experienceLevelOption?.length > 0 &&
                                    experienceLevelOption?.map((options) => (
                                      <option
                                        selected={options.id == item.experience}
                                        key={options.id}
                                        value={options.id}
                                      >
                                        {options.name}
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
                  <Label className="fw-semi-bold">
                    Add any of these popular skills
                  </Label>
                </Row>
                <Row className="skills-div mb-3 mt-2">
                  {skills?.map((item) => (
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
                    onClick={() => closeModal(false)}
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
                    onClick={(evt) => setError(false)}
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
