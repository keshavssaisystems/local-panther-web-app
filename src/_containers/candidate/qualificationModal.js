import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { qualificationSlice } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Collapse,
  InputGroup,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import { Link } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { useDispatch } from "react-redux";
import PageTitle from "../../_components/common/pagetitle";
import { profileSkillsActions } from "_store";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import { getLocationFilter } from "_store";

export function QualificationModal(props) {
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  const dispatch = useDispatch();
  const [check, setCheck] = useState(props.check);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [isSave, setSave] = useState(true);
  const [formDetails, setFormData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  let user = JSON.parse(localStorage.getItem("userDetails"));

  const loadData = function () {
    let data = [...formDetails];
    if (check == "add") {
      data.push({
        id: 0,
        jobTitle: "",
        organization: "",
        jobdescription: "",
        countryid: 0,
        cityid: 0,
        stateid: 0,
        iscurrentlyworking: true,
        startdate: null,
        enddate: null,
        isactive: true,
        currentUserId: user.userId,

        error: false,
      });
    } else {
      data.push({
        id: props.selected.candidatequalificationid,
        jobTitle: props.selected.jobtitle,
        organization: props.selected.company,
        jobDescription: props.selected.jobdescription,
        countryid: props.selected.countryid,
        cityid: props.selected.cityid,
        stateid: props.selected.stateid,
        iscurrentlyworking: props.selected.iscurrentlyworking,
        startdate: new Date(props.selected.startdate),
        enddate: new Date(props.selected.enddate),
        isactive: props.selected.isactive,
        currentUserId: user.userId,
        error: false,
      });
    }
    setFormData(data);
  };

  // const closeModal = function () {
  //   let data = [
  //     {
  //       id: 0,
  //       jobTitle: "",
  //       organization: "",
  //       jobdescription: "",
  //       error: false,
  //     },
  //   ];
  //   setFormData(data);
  //   props.onCallBack();
  // };

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [citySelect, setCitySelect] = useState([]);
  const [stateSelect, setStateSelect] = useState([]);
  const [countrySelect, setCountrySelect] = useState([]);
  useEffect(() => {
    let country_response;
    let state_response;
    country_response = cityList.map(({ countryid: value, ...rest }) => {
      return {
        value,
        label: `${rest.countryname}`,
      };
    });
    state_response = cityList.map(({ stateid: value, ...rest }) => {
      return {
        value,
        label: `${rest.statename}`,
      };
    });
    setStateList(state_response);
    console.log(stateList);
    setCountryList(country_response);
  }, [cityList]);
  const loadOptions = async function (inputValue) {
    // if (inputValue.length > 2) {
    const { data = [] } = await getLocationFilter(inputValue);
    setCityList(data);
    return data.map(({ cityid: value, ...rest }) => {
      return {
        value,
        label: `${rest.location}`,
      };
    });
  };

  const removeTabs = function (index) {
    let new_data = [...formDetails];
    new_data.splice(index, 1);
    setFormData(new_data);

    let state_details = [...stateSelect];
    let city_details = [...citySelect];
    let country_details = [...countrySelect];
    city_details.splice(index, 1);
    state_details.splice(index, 1);
    country_details.splice(index, 1);
    setCitySelect(city_details);
    setStateSelect(state_details);
    setCountrySelect(country_details);
  };

  const addMoreTabs = function (index) {
    let new_data = [...formDetails];
    console.log("before" + new_data);
    if (new_data[index - 1].jobTitle == "") {
      new_data[index - 1].error = true;
      setFormData(new_data);

      console.log(formDetails);
      return;
    }

    const newTab = {
      id: index,
      jobTitle: "",
      organization: "",
      jobdescription: "",
      countryid: 0,
      cityid: 0,
      stateid: 0,
      iscurrentlyworking: true,
      startdate: "",
      enddate: "",
      isactive: true,
      currentUserId: 13960,

      error: false,
    };
    new_data.push(newTab);

    setFormData(new_data);
    console.log(formDetails);
  };

  const handleInputChange = function (check, index, data) {
    let new_data = [...formDetails];

    if (check == "title") {
      new_data[index].jobTitle = data;
      new_data[index].error = false;
    } else if (check == "company") {
      new_data[index].organization = data;
    } else if (check == "description") {
      new_data[index].jobdescription = data;
    } else if (check == "status") {
      new_data[index].iscurrentlyworking = data == "on" ? true : false;
    } else if (check == "fromDate") {
      new_data[index].startdate = data;
    } else if (check == "toDate") {
      new_data[index].enddate = data;
    }

    setFormData(new_data);
    // onSubmit();
  };

  const onSelectCityDropdown = function (data, index) {
    let form_details = [...formDetails];
    let city_details = [...citySelect];
    city_details.push(data);
    form_details[index].cityid = data.value;

    setFormData(form_details);
    setCitySelect(city_details);
  };
  const onSelectCountryDropdown = function (data, index) {
    let form_details = [...formDetails];
    let country_details = [...countrySelect];
    country_details.push(data);

    form_details[index].countryid = data.value;
    setFormData(form_details);
    setCountrySelect(country_details);
  };
  const onSelectStateDropdown = function (data, index) {
    let new_data = [...stateSelect];
    let form_details = [...formDetails];

    form_details[index].stateid = data.value;
    setFormData(form_details);
    new_data.push(data);
    setStateSelect(new_data);
  };
  const closeModal = function () {
    setSuccess(false);
    setError(false);
    window.location.reload();
  };

  async function onSubmit() {
    let new_data = [...formDetails];

    const keyToCheck = "jobTitle";

    const emptyKeyIndexes = formDetails
      .map((item, index) => (item[keyToCheck] == "" ? index : null))
      .filter((index) => index !== null);

    if (emptyKeyIndexes.length > 0) {
      let new_data = [...formDetails];

      for (let i = 0; i < emptyKeyIndexes.length; i++) {
        new_data[emptyKeyIndexes[i]].error = true;
      }

      setFormData(new_data);
      setSave(false);
      return;
    }

    let filtered_data = formDetails.map(({ skillid: value, ...rest }) => {
      return {
        candidateid: parseInt(user.InternalUserId),
        jobtitle: rest.jobTitle,
        company: rest.organization,
        jobdescription: rest.jobdescription,
        countryid: rest.countryid,
        cityid: rest.cityid,
        stateid: rest.stateid,
        iscurrentlyworking: rest.iscurrentlyworking,
        startdate: rest.startdate,
        enddate: rest.enddate,
        isactive: rest.isactive,
        currentUserId: rest.currentUserId,
      };
    });
    let qualification_data = filtered_data[0];
    let response;
    if (check == "edit") {
      let id = formDetails[0].id;
      response = await dispatch(
        qualificationSlice.updateQualificationThunk({ id, qualification_data })
      );
    } else {
      response = await dispatch(
        qualificationSlice.addQualificationThunk(filtered_data)
      );
    }
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  }
  const selectDate = function () {};

  return (
    <div>
      {formDetails.map((item, index) => (
        <div>
          <Form id={index}>
            {check == "add" ? (
              <Row>
                <Col>
                  {index < formDetails.length - 1 ? (
                    <Label
                      className="float-end"
                      style={{
                        cursor: "pointer",
                        color: "#2f479b",
                        borderBottom: "1px solid #2f479b",
                        fontWeight: "500",
                      }}
                      onClick={() => removeTabs(index)}
                    >
                      Remove
                    </Label>
                  ) : (
                    <Label
                      className="float-end"
                      onClick={() => addMoreTabs(index + 1)}
                      style={{
                        cursor: "pointer",
                        color: "#2f479b",
                        borderBottom: "1px solid #2f479b",
                        fontWeight: "500",
                      }}
                    >
                      +Add More
                    </Label>
                  )}
                </Col>
              </Row>
            ) : (
              <></>
            )}
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="jobTitle" className="input-label">
                    Job Title <span className="required-icon">*</span>
                  </Label>
                  <input
                    placeholder="Enter Job Title"
                    name="jobTitle"
                    type="text"
                    id="jobTitle"
                    value={item.jobTitle}
                    className={`field-input placeholder-text form-control ${
                      item.error ? "is-invalid" : ""
                    }`}
                    onInput={(evt) =>
                      handleInputChange("title", index, evt.target.value)
                    }
                  />
                  <div className="invalid-feedback">
                    {item.error ? "Job Title is Required" : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label for="city" className="input-label">
                    City
                  </Label>
                  <AsyncSelect
                    name="skills"
                    placeholder="Search to select"
                    loadOptions={loadOptions}
                    isMulti={false}
                    value={citySelect[index]}
                    // defaultOptions={citySelect}
                    onChange={(evt) => onSelectCityDropdown(evt, index)}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="state" className="input-label">
                    State
                  </Label>
                  <AsyncSelect
                    name="state"
                    placeholder="Select"
                    defaultOptions={stateList}
                    isMulti={false}
                    value={stateSelect[index]}
                    onChange={(evt) => onSelectStateDropdown(evt, index)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="country" className="input-label">
                    Country
                  </Label>
                  <AsyncSelect
                    name="country"
                    placeholder="Select"
                    defaultOptions={countryList}
                    isMulti={false}
                    value={countrySelect[index]}
                    onChange={(evt) => onSelectCountryDropdown(evt, index)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup check>
                  <Input
                    name="currentlyWorking"
                    id="currentlyWorking"
                    onInput={(evt) =>
                      handleInputChange("status", index, evt.target.value)
                    }
                    type="checkbox"
                  />{" "}
                  <Label check className="input-label">
                    Currently Working
                  </Label>
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <FormGroup>
                  <Label for="fromDate" className="input-label">
                    From Date
                  </Label>
                  <InputGroup>
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <DatePicker
                      name="fromDate"
                      id="fromDate"
                      placeholderText="DD/MM/YYYY"
                      className="form-control"
                      selected={item.startdate}
                      onChange={(evt) =>
                        handleInputChange("fromDate", index, evt)
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="toDate" className="input-label">
                    To Date
                  </Label>
                  <InputGroup>
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <DatePicker
                      name="toDate"
                      id="toDate"
                      className="form-control"
                      placeholderText="DD/MM/YYYY"
                      selected={item.enddate}
                      onChange={(evt) =>
                        handleInputChange("toDate", index, evt)
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="jobDescription" className="input-label">
                    Job Description
                  </Label>
                  <Input
                    placeholder="Enter Job Description"
                    name="jobDescription"
                    type="textarea"
                    id="jobDescription"
                    value={item.jobDescription}
                    maxLength={500}
                    className="field-input placeholder-text form-control"
                    onInput={(evt) =>
                      handleInputChange("description", index, evt.target.value)
                    }
                  />

                  {item.jobDescription ? (
                    <span className="dropdown-placeholder float-end">
                      {item.jobDescription.length}/500
                    </span>
                  ) : (
                    <></>
                  )}
                </FormGroup>
              </Col>

              <Col>
                <FormGroup>
                  <Label for="company" className="input-label">
                    Company
                  </Label>
                  <Input
                    placeholder="Enter Company"
                    name="company"
                    type="textarea"
                    id="company"
                    value={item.organization}
                    maxLength={500}
                    className="field-input placeholder-text form-control"
                    onInput={(evt) =>
                      handleInputChange("company", index, evt.target.value)
                    }
                  />
                  <span className="dropdown-placeholder float-end">
                    {item.organization ? item.organization.length : 0}/500
                  </span>
                </FormGroup>
              </Col>
            </Row>
            {index < formDetails.length - 1 ? <hr /> : <></>}

            {index == formDetails.length - 1 ? (
              <div className="float-end">
                <Button
                  className="me-2 save-btn"
                  type="button"
                  onClick={() => onSubmit()}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  className="close-btn"
                  onClick={() => closeModal()}
                >
                  Close
                </Button>
              </div>
            ) : (
              <></>
            )}
          </Form>
        </div>
      ))}

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
