import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  ModalHeader,
  ModalBody,
  FormText,
  CardFooter,
  CardHeader,
} from "reactstrap";
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
import { NoDataFound } from "_components/common/nodatafound";

export function CandidateSkills(props) {
  const dispatch = useDispatch();

  const get_response = useSelector(
    (state) => state.getProfile.profileData.skillsInfo
  );
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [getResponse, setResponse] = useState([]);

  const [isPersonalModal, setPersonalModal] = useState(false);
  const [mustHaveValidation, setMustHaveValidation] = useState(false);
  const [skillsMultiple, setSkillsMultiple] = useState([]);
  const [isNewSkill, setNewSkill] = useState(false);
  const [searchText, setSearchText] = useState("");

  const experienceLevelOption = useSelector(
    (state) => state.experienceLevel.experienceLevel
  );

  const [selectedSkillData, setSelectedSkillData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isLabelVisible, setLabelVisibility] = useState(true);

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

  let skills_data = useSelector(
    (state) => state.profileSkills.skill_data_profile
  );
  useEffect(() => {
    if (skills_data) {
      const result = skills_data.filter(
        (item1) => !selectedSkillData.find((item2) => item1.value === item2.id)
      );
      setSkills(result);
    }
  }, [skills_data]);

  const removeSkills = function (data) {
    let filter_data = skills_data?.find((x) => x.value === data.value);
    if (filter_data) {
      let new_array = [...skills];
      new_array.push(data);
      setSkills(new_array);
    }
    let multiple_skills = [...skillsMultiple];
    let multiple_skills_new = multiple_skills?.filter(function (obj) {
      return obj.value !== data.value;
    });

    let data_new = selectedSkillData.filter(function (obj) {
      return obj.id !== data.value;
    });

    setSkillsMultiple(multiple_skills_new);
    setSelectedSkillData(data_new);
  };

  const onSelectSkillsDropdown = function (data) {
    setSkillsMultiple(data);
    setSearchText("");
    let new_data = [...skills];
    let index = skills?.findIndex(
      (x) => x.value == data[data.length - 1]?.value
    );

    new_data.splice(index, 1);

    setSkills(new_data);
    let selected_data = {};
    if (data.length > 0) {
      selected_data.id = data[data.length - 1].value;
      selected_data.name = data[data.length - 1].label;
      selected_data.experience = "";
    } else {
      selected_data.id = 0;
      selected_data.name = "";
      selected_data.experience = "";
    }

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
    let new_popular = [...skills];
    let index = skills.findIndex((x) => x.value === data.value);
    new_popular.splice(index, 1);
    setSkills(new_popular);
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
      let id = JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId;
      let userId = JSON.parse(localStorage.getItem("userDetails")).UserId;

      let payload = selectedSkillData.map((rest) => {
        return {
          candidateid: Number(id),
          yearsofexperience:
            rest.experience === "" ? 0 : parseInt(rest.experience),
          skillid: rest.id,
          currentUserId: parseInt(userId),
          isactive: true,
          skillname: rest.name,
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
  const [skillExist, setSkillExist] = useState(false);
  const loadOptions = async function (inputValue) {
    if (inputValue.length > 2) {
      setSearchText(inputValue);
      setLabelVisibility(true);

      const { data = [] } = await getSkillsFilter(inputValue);

      const isKeyTrueForAll = data.some(
        (item) => item["skillname"].toLowerCase() === inputValue.toLowerCase()
      );
      if (isKeyTrueForAll) {
        setSkillExist(false);
      } else {
        setSkillExist(true);
      }

      let filter_data = data.map(({ skillid: value, ...rest }) => {
        return {
          value,
          label: `${rest.skillname}`,
        };
      });
      setOptions(filter_data);
    } else {
      setSearchText("");
      setOptions([]);
    }
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
    new_array[index].experience = data;

    setSelectedSkillData(new_array);
  };

  const addNewSkill = () => {
    if (searchText === "") {
      return;
    }

    let selected_data = {
      value: 0,
      label: searchText,
      experience: "",
    };

    let new_array = [...skillsMultiple];
    let i = selectedSkillData.findIndex(
      (x) => x.name.toLowerCase() === searchText.toLowerCase()
    );
    if (i > -1) {
      setSearchText("");
      return;
    } else {
      new_array.push(selected_data);
    }

    setSkillsMultiple(new_array);

    let skill_data = {
      id: 0,
      name: searchText,
      experience: "",
    };
    let new_data = [...selectedSkillData];
    new_data.push(skill_data);

    setSelectedSkillData(new_data);

    setSearchText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      setSearchText("");
      setSkillExist(false);
    }
  };
  const handleBlur = (searchText) => {
    // AsyncSelect lost focus, hide the label

    setSearchText("");
  };

  return (
    <div>
      <div className="profile-view">
        <Card className="main-card mb-3">
          <CardHeader className="card-title-text  text-capitalize ">
            Skills
            <div className="ms-auto me-2">
              <Label
                className="link-text"
                onClick={(evt) => setPersonalModal(true)}
              >
                Add
              </Label>
            </div>
          </CardHeader>

          <CardBody className="scroll-area-md">
            {/* <div className="mb-3">
              <strong className="card-title-text">Skills</strong>
              <Label
                className="float-end  link-text"
                onClick={(evt) => setPersonalModal(true)}
              >
                Add
              </Label>
            </div> */}

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
                  <Row style={{ textAlign: "center" }}>
                    <Col>
                      {" "}
                      <NoDataFound imageSize={"25px"} />
                    </Col>
                  </Row>
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
            <ModalHeader toggle={() => closeModal()} charCode="Y">
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
                        isMulti={true}
                        value={skillsMultiple}
                        onChange={(evt) => onSelectSkillsDropdown(evt)}
                        styles={{
                          borderColor: mustHaveValidation
                            ? "#d92550 !important"
                            : "",
                        }}
                        onKeyDown={(e) => handleKeyDown(e)}
                      />

                      {mustHaveValidation === true && (
                        <FormText color="danger">Skills is required</FormText>
                      )}
                    </FormGroup>
                  </Col>
                  {/* {isLabelVisible && ( */}
                  <Col>
                    {skillExist && searchText !== "" ? (
                      <Label
                        style={{ marginTop: "30px" }}
                        className="fw-semi-bold skills-remove"
                        onClick={() => addNewSkill()}
                      >
                        Add
                      </Label>
                    ) : (
                      ""
                    )}
                  </Col>
                  {/* )} */}
                </Row>
                <Row className="mt-2">
                  {skillsMultiple?.map((item) => (
                    <div>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={"skillsInput"} className="fw-semi-bold">
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
                                <option key={0}>Select experience level</option>
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
                          <Label
                            onClick={() => removeSkills(item)}
                            className="skills-remove"
                          >
                            remove
                          </Label>
                        </Col>
                      </Row>
                    </div>
                  ))}
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
                       m-2 skills-view-popup btn-shadow btn-outline-2x"
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
