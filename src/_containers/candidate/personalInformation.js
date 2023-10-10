import React, { useState, useEffect, Fragment } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
} from "reactstrap";
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
  FormFeedback,
  InputGroup,
  Form,
} from "reactstrap";
import Loader from "react-loaders";
import AsyncSelect from "react-select/async";
import { formatDate } from "_helpers/helper";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  BsPencil,
  BsTelephone,
  BsPinMap,
  BsGenderFemale,
  BsGenderMale,
  BsPeople,
  BsEnvelope,
  BsBalloon,
} from "react-icons/bs";

import profileImg from "../../assets/utils/images/avatars/1.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import Tabs from "react-responsive-tabs";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import {
  profileActions,
  getProfileActions,
  cityActions,
  genderActions,
  ethnicityActions,
} from "_store";
import { getLocationFilter } from "_store";

export function PersonalInformation(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.getProfile.loader);

  const genderList_temp = useSelector((state) => state.gender.genderList);
  const raceList_temp = useSelector((state) => state.ethnicity.ethnicityList);
  const eligibilityList_temp = useSelector(
    (state) => state.getProfile.dropdownLists.eligibilityDropDown
  );

  const personalInfo_temp = useSelector(
    (state) => state.getProfile.profileData.personalInfo
  );

  useEffect(() => {
    let data = {
      personalInfo: personalInfo_temp,
      genderList: genderList_temp,
      raceList: raceList_temp,
      eligibilityList: eligibilityList_temp,
    };
    setSelectedCandidate(data);
  }, [personalInfo_temp]);

  const [selectedCandidate, setSelectedCandidate] = useState({
    personalInfo: {},
    genderList: useSelector((state) => state.gender.genderList),
    raceList: useSelector((state) => state.ethnicity.ethnicityList),
    eligibilityList: useSelector(
      (state) => state.getProfile.dropdownLists.eligibilityDropDown
    ),
  });
  const [selectedCandidate_temp, setSelectedCandidateTemp] = useState({
    personalInfo: props.profileInfo.personalInfo,
    genderList: useSelector((state) => state.gender.genderList),
    raceList: useSelector((state) => state.ethnicity.ethnicityList),
    eligibilityList: useSelector(
      (state) => state.getProfile.dropdownLists.eligibilityDropDown
    ),
  });

  const [requiredErrors, setRequiredErros] = useState({
    emailError: false,
    phoneError: false,
    cityError: false,
    stateError: false,
  });

  const [citySelect, setCitySelect] = useState("");
  const [stateSelect, setStateSelect] = useState("");
  const [countrySelect, setCountrySelect] = useState("");
  const [raceSelect, setRaceSelect] = useState("");
  const [genderSelect, setGenderSelect] = useState("");
  useEffect(() => {
    loadSelectedData();
  }, []);
  const loadSelectedData = function () {
    if (props.profileInfo.personalInfo.city != "") {
      loadOptions(props.profileInfo.personalInfo.city.slice(0, 3));
    }

    if (props.dropDownData.selectedCountry.value != 0) {
      let countryData = [...countrySelect];
      countryData.push(props.dropDownData.selectedCountry);

      setCountrySelect(countryData);
    }

    if (props.dropDownData.selectedState.value != 0) {
      let stateData = [...stateSelect];
      stateData.push(props.dropDownData.selectedState);
      setStateSelect(stateData);
    }

    if (props.dropDownData.selectedCity.value != 0) {
      let cityData = [...citySelect];
      cityData.push(props.dropDownData.selectedCity);
      setCitySelect(cityData);
    }
    if (props.dropDownData.selectedGender.value != 0) {
      let genderData = [...genderSelect];
      genderData.push(props.dropDownData.selectedGender);
      setGenderSelect(genderData);
    }

    if (props.dropDownData.selectedEthnicity.value != 0) {
      let ethnicityData = [...raceSelect];
      ethnicityData.push(props.dropDownData.selectedEthnicity);
      setRaceSelect(ethnicityData);
    }
  };

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [cityReqError, setCityReqError] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  let userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const [dob, setDOB] = useState(null);
  const [isContactModal, setContactModal] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const [locationData, setLocation] = useState([]);

  const onSelectCityDropdown = function (data) {
    let error_data = { ...requiredErrors };
    let new_data = [];
    new_data.push(data);

    setCitySelect(new_data);
    error_data.cityError = false;
    setRequiredErros(error_data);
  };
  const onSelectCountryDropdown = function (data) {
    let new_data = [];
    new_data.push(data);
    setCountrySelect(new_data);
  };
  const onSelectStateDropdown = function (data) {
    let error_data = { ...requiredErrors };
    let new_data = [];
    new_data.push(data);
    setStateSelect(new_data);
    error_data.stateError = false;
    setRequiredErros(error_data);
  };
  const renderDate = function (data) {
    const date = new Date(data);
    return date.toLocaleDateString("en-CA");
  };
  const onSelectRaceDropdown = function (data) {
    let new_data = [];
    new_data.push(data);
    setRaceSelect(new_data);
  };
  const onSelectGenderDropdown = function (data) {
    let new_data = [];
    new_data.push(data);
    setGenderSelect(new_data);
  };

  function maskPhoneNumber(phoneNumber) {
    const numericPhoneNumber = phoneNumber.replace(/\D/g, "");
    const maskedPhoneNumber = `(${numericPhoneNumber.slice(
      0,
      3
    )}) ${numericPhoneNumber.slice(3, 6)}-${numericPhoneNumber.slice(6)}`;

    return maskedPhoneNumber;
  }

  async function onSubmit(e) {
    e.preventDefault();
    let errors = { ...requiredErrors };
    if (citySelect.length == 0) {
      errors.cityError = true;
    } else {
      errors.cityError = false;
    }

    if (errors.cityError) {
      setRequiredErros(errors);
      return;
    }
    let new_data = { ...selectedCandidate_temp };

    new_data.personalInfo.cityid = citySelect[0]?.value;
    new_data.personalInfo.countryid = countrySelect[0]
      ? countrySelect[0]?.value
      : 0;
    new_data.personalInfo.stateid = stateSelect[0]?.value;
    new_data.personalInfo.genderid = genderSelect[0]
      ? genderSelect[0]?.value
      : 0;
    new_data.personalInfo.ethnicityid = raceSelect[0]
      ? raceSelect[0]?.value
      : 0;

    if (
      new_data.personalInfo.firstname == "" ||
      new_data.personalInfo.lastname == "" ||
      new_data.personalInfo.phonenumber == "" ||
      new_data.personalInfo.email == "" ||
      new_data.personalInfo.cityid == 0
    ) {
      return;
    } else {
      let post_data = {
        candidateid: userDetails.InternalUserId,
        email: new_data.personalInfo.email,
        phonenumber: new_data.personalInfo.phonenumber,
        firstname: new_data.personalInfo.firstname,
        lastname: new_data.personalInfo.lastname,
        genderid: new_data.personalInfo.genderid,
        cityid: new_data.personalInfo.cityid,
        stateid: new_data.personalInfo.stateid,
        countryid: new_data.personalInfo.countryid,
        zipcode: new_data.personalInfo.zipcode,
        ethnicityid: new_data.personalInfo.ethnicityid,
        employmenteligiblity: new_data.personalInfo.employmenteligiblity,
        isreadytoworkimmediately:
          new_data.personalInfo.isreadytoworkimmediately,
        isactive: true,
        dob: dob,
        userid: userDetails.UserId,
        currentUserId: userDetails.UserId,
      };

      let response = await dispatch(
        profileActions.insertPersonalInfo(post_data)
      );
      if (response.payload) {
        setSuccess(true);
        setMessage(response.payload.message);
      } else {
        setError(true);
      }
      setContactModal(false);
    }
  }

  const checkCityValid = function () {
    if (citySelect[0]?.value == 0) {
      setCityReqError(true);
    } else {
      setCityReqError(false);
    }
  };

  const selectDate = function (data) {
    let temp_data = { ...selectedCandidate_temp };
    temp_data.personalInfo.dob = new Date(data);
    setSelectedCandidate(temp_data);
    setDOB(new Date(data));
  };

  const close = function () {
    let data = {
      personalInfo: personalInfo_temp,
      genderList: genderList_temp,
      raceList: raceList_temp,
      eligibilityList: eligibilityList_temp,
    };
    setSelectedCandidate(data);
    setContactModal(false);
    // props.onCallBack();
  };
  const closeModal = function () {
    let data = {
      personalInfo: personalInfo_temp,
      genderList: genderList_temp,
      raceList: raceList_temp,
      eligibilityList: eligibilityList_temp,
    };
    setSelectedCandidate(data);
    setContactModal(false);
    setSuccess(false);
    setError(false);
    // window.location.reload();
    props.onCallBack();
  };

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
    let data = [];
    if (country_response.length > 0) {
      data = Array.from(new Set(country_response.map((item) => item.id))).map(
        (id) => {
          return country_response.find((item) => item.id === id);
        }
      );

      // data.push(country_response[0]);
      setCountryList(data);
    } else {
      setCountryList(data);
    }
  }, [cityList]);
  const loadOptions = async function (inputValue) {
    // if (inputValue.length > 2) {
    const { data = [] } = await getLocationFilter(inputValue);
    setCityList(data);

    let filter_data = data.map(({ cityid: value, ...rest }) => {
      return {
        value,
        label: `${rest.location + ", " + rest.statename}`,
      };
    });

    setLocation(filter_data);
  };
  const onHandleInputChange = function (check, data) {
    let new_data = { ...selectedCandidate_temp };
    let errors = { ...requiredErrors };

    if (check == "firstname") {
      new_data.personalInfo.firstname = data;
    } else if (check == "lastname") {
      new_data.personalInfo.lastname = data;
    } else if (check == "address") {
      new_data.personalInfo.address = data;
    } else if (check == "email") {
      new_data.personalInfo.email = data;

      if (!new_data.personalInfo.email.match(emailRegex)) {
        errors.emailError = true;
      } else {
        errors.emailError = false;
      }
    } else if (check == "phonenumber") {
      new_data.personalInfo.phonenumber = data;
      if (!new_data.personalInfo.phonenumber.match(phoneRegExp)) {
        errors.phoneError = true;
      } else {
        errors.phoneError = false;
      }
    } else if (check == "zip") {
      new_data.personalInfo.zipcode = data;
    } else if (check == "authorization") {
      new_data.personalInfo.employmenteligiblity = data;
    } else if (check == "work") {
      new_data.personalInfo.isreadytoworkimmediately =
        !new_data.personalInfo.isreadytoworkimmediately;
    }

    setSelectedCandidate(new_data);
  };

  return (
    <div>
      <Fragment>
        <Card className="mb-3 profile-view">
          {!loading ? (
            <div>
              {selectedCandidate.personalInfo.email ? (
                <Row className="g-0">
                  <Col sm="12" md="12" xl="6" className=" mb-0">
                    <div className="card no-shadow rm-border bg-transparent widget-chart text-start mb-0">
                      <div className="icon-wrapper rounded-circle profile-img">
                        <img
                          width={100}
                          className="rounded-circle"
                          src={profileImg}
                          alt=""
                        />
                      </div>
                      <div className="widget-chart-content">
                        <div>
                          <strong className="candidate-name mb-0">
                            {selectedCandidate.personalInfo.firstname +
                              " " +
                              selectedCandidate_temp.personalInfo.lastname}
                          </strong>
                          <p className="widget-description text-focus content-text mt-0">
                            {selectedCandidate.personalInfo.position}
                          </p>
                          <p className="candidate-label mt-0 mb-0">
                            {selectedCandidate.personalInfo.organization ==
                              "Not working" ||
                            selectedCandidate.personalInfo.organization != ""
                              ? "at " +
                                selectedCandidate.personalInfo.organization
                              : selectedCandidate.personalInfo.organization}
                          </p>
                        </div>
                        <div>
                          <Row>
                            <Col className="col-12 mb-0">
                              <Label className="candidate-label mb-0">
                                Employement eligibility:{" "}
                                <strong className="content-text">
                                  {selectedCandidate.personalInfo.eligibility}
                                </strong>
                              </Label>
                            </Col>
                            <Col>
                              <Label className="candidate-label mt-0">
                                Ready to work immediately:{" "}
                                <strong className="content-text">
                                  {selectedCandidate.personalInfo.readyToWork}{" "}
                                </strong>
                              </Label>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col sm="12" md="12" xl="3" className="">
                    <Row className="mt-4">
                      <Col className="mb-2 mt-2">
                        <BsTelephone className="personal-sec-icon me-2" />
                        <span className="content-text mt-3">
                          {maskPhoneNumber(
                            selectedCandidate.personalInfo.phonenumber
                          )}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mb-2">
                        <BsEnvelope className="personal-sec-icon me-2" />
                        <span className="content-text">
                          {selectedCandidate.personalInfo.email}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mb-2">
                        {selectedCandidate.personalInfo.city != "" ||
                        selectedCandidate.personalInfo.country != "" ? (
                          <div>
                            <BsPinMap className="personal-sec-icon me-2" />
                            <span className="content-text">
                              {selectedCandidate.personalInfo.city
                                ? selectedCandidate.personalInfo.city +
                                  ", " +
                                  selectedCandidate.personalInfo.state
                                : ""}

                              {selectedCandidate.personalInfo.country
                                ? ", " + selectedCandidate.personalInfo.country
                                : ""}
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col sm="12" md="12" xl="3" className="mt-3">
                    <div className="me-3 float-end">
                      <BsPencil
                        className="edit-icon"
                        onClick={(evt) => setContactModal(true)}
                      />
                    </div>
                    <Row className="mt-3">
                      <Row>
                        <Col className="mb-2">
                          {selectedCandidate.personalInfo.dob != "" ? (
                            <div>
                              <BsBalloon className="personal-sec-icon me-2" />
                              <span className="content-text mt-3">
                                {formatDate(selectedCandidate.personalInfo.dob)}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col className="mb-2">
                          {selectedCandidate.personalInfo.gender != "" ? (
                            <div>
                              <BsGenderMale className="personal-sec-icon me-2" />
                              <span className="content-text">
                                {selectedCandidate.personalInfo.gender}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col className="mb-2">
                          {selectedCandidate.personalInfo.ethnicity != "" ? (
                            <div>
                              <BsPeople className="personal-sec-icon me-2" />
                              <span className="content-text">
                                {selectedCandidate.personalInfo.ethnicity}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                </Row>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
              <Loader active={loading} type="ball-pulse" />
            </div>
          )}
        </Card>
      </Fragment>

      {isContactModal ? (
        <div className="profile-view">
          <Modal
            className="personal-information"
            size="lg"
            isOpen={isContactModal}
          >
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">Contact information</strong>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={(evt) => onSubmit(evt)}>
                <Row>
                  <div className="mb-1 fw-bold">Contact</div>
                  <hr />
                </Row>

                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="firstname" className="fw-semi-bold">
                        First name <span className="required-icon">*</span>
                      </Label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter First Name"
                        maxLength={50}
                        value={selectedCandidate.personalInfo.firstname}
                        onInput={(evt) =>
                          onHandleInputChange("firstname", evt.target.value)
                        }
                        className={`field-input placeholder-text form-control ${
                          selectedCandidate.personalInfo.firstname == ""
                            ? "is-invalid error-text"
                            : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {selectedCandidate.personalInfo.firstname == ""
                          ? "firstname is required"
                          : ""}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="password" className="fw-semi-bold">
                        Last name <span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter Last Name"
                        name="lastname"
                        type="lastname"
                        id="lastname"
                        maxLength={50}
                        value={selectedCandidate.personalInfo.lastname}
                        onInput={(evt) =>
                          onHandleInputChange("lastname", evt.target.value)
                        }
                        className={`field-input placeholder-text form-control ${
                          selectedCandidate.personalInfo.lastname == ""
                            ? "is-invalid"
                            : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {selectedCandidate.personalInfo.lastname == ""
                          ? "lastname is required"
                          : ""}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="phonenumber" className="fw-semi-bold">
                        Phone<span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter Phone Number"
                        name="phonenumber"
                        type="text"
                        id="phonenumber"
                        mask="(999)-999-9999"
                        value={selectedCandidate.personalInfo.phonenumber}
                        onInput={(evt) =>
                          onHandleInputChange("phonenumber", evt.target.value)
                        }
                        maxLength={20}
                        className={`field-input placeholder-text form-control ${
                          selectedCandidate.personalInfo.phonenumber == "" ||
                          selectedCandidate.phoneError
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {selectedCandidate.personalInfo.phonenumber == ""
                          ? "phone number is required"
                          : ""}
                      </div>
                      <div className="invalid-feedback">
                        {selectedCandidate.personalInfo.phonenumber != "" &&
                        selectedCandidate.phoneError
                          ? "Phone number is not valid"
                          : ""}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="email" className="fw-semi-bold">
                        Email <span className="required-icon">*</span>
                      </Label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                        value={selectedCandidate.personalInfo.email}
                        onInput={(evt) =>
                          onHandleInputChange("email", evt.target.value)
                        }
                        className={`field-input placeholder-text form-control ${
                          selectedCandidate.personalInfo.email == "" ||
                          requiredErrors.emailError
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {selectedCandidate.personalInfo.email == ""
                          ? "Email is required"
                          : ""}
                      </div>
                      <div className="invalid-feedback">
                        {selectedCandidate.personalInfo.email != "" &&
                        requiredErrors.emailError
                          ? "Email is not valid"
                          : ""}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <div className="mb-1 fw-bold">Location</div>
                  <hr />
                </Row>

                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="city" className="fw-semi-bold">
                        City, State <span className="required-icon">*</span>
                      </Label>

                      <AsyncSelect
                        name="skills"
                        placeholder="Search to select"
                        placeholderText="search"
                        location-dropdown
                        loadOptions={loadOptions}
                        isMulti={false}
                        value={citySelect}
                        defaultOptions={locationData}
                        onChange={(evt) => onSelectCityDropdown(evt)}
                        styles={{
                          borderColor: requiredErrors.stateError
                            ? "#d92550"
                            : "",
                        }}
                      />

                      <div className="error-class">
                        {requiredErrors.cityError ? "Location is required" : ""}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="country" className="fw-semi-bold">
                        Country
                      </Label>
                      <AsyncSelect
                        name="country"
                        placeholder="Select"
                        defaultOptions={countryList}
                        readOnly
                        isMulti={false}
                        value={countrySelect}
                        onChange={(evt) => onSelectCountryDropdown(evt)}
                        onMenuOpen={() => checkCityValid()}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="address" className="fw-semi-bold">
                        Address
                      </Label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        onInput={(evt) =>
                          onHandleInputChange("address", evt.target.value)
                        }
                        maxLength={50}
                        placeholder="Enter Address"
                        className="field-input placeholder-text form-control input-text"
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="zipCode" className="fw-semi-bold">
                        Zip code
                      </Label>
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        maxLength={50}
                        value={selectedCandidate.personalInfo.zipcode}
                        onInput={(evt) =>
                          onHandleInputChange("zip", evt.target.value)
                        }
                        placeholder="Enter Zip Code"
                        className="field-input placeholder-text form-control input-text"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <div className="mb-1 fw-bold">Demographic</div>
                  <hr />
                </Row>

                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="gender" className="fw-semi-bold">
                        Birth year
                      </Label>
                      {/* <Input
                        type="date"
                        name="scheduleDate"
                        id="scheduleDate"
                        placeholder="mm-dd-yyyy"
                        defaultValue={
                          selectedCandidate.personalInfo.dob
                            ? new Date(selectedCandidate.personalInfo.dob)
                            : null
                        }
                        selected={
                          selectedCandidate.personalInfo.dob
                            ? new Date(selectedCandidate.personalInfo.dob)
                            : null
                        }
                        onChange={(evt) => selectDate(evt.target.value)}
                      /> */}

                      <InputGroup>
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <DatePicker
                          className="form-control"
                          placeholderText="MM/DD/YYYY"
                          selected={
                            selectedCandidate.personalInfo.dob
                              ? new Date(selectedCandidate.personalInfo.dob)
                              : null
                          }
                          showYearDropdown={true}
                          onChange={(evt) => selectDate(evt)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup>
                      <Label for="gender" className="fw-semi-bold">
                        Gender
                      </Label>

                      <AsyncSelect
                        name="gender"
                        placeholder="Select"
                        defaultOptions={selectedCandidate_temp.genderList}
                        isMulti={false}
                        value={genderSelect}
                        onChange={(evt) => onSelectGenderDropdown(evt)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="race" className="fw-semi-bold">
                        Race/Etnicity
                      </Label>
                      <AsyncSelect
                        name="race"
                        placeholder="Select"
                        defaultOptions={selectedCandidate_temp.raceList}
                        isMulti={false}
                        value={raceSelect}
                        onChange={(evt) => onSelectRaceDropdown(evt)}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <div className="mb-1 fw-bold">Employement eligibility</div>
                  <hr />
                </Row>

                <Row>
                  {selectedCandidate_temp?.eligibilityList?.map((item) => (
                    <Col>
                      <FormGroup check>
                        <Input
                          name="eligibility"
                          type="radio"
                          checked={
                            item.id ==
                            selectedCandidate_temp.personalInfo
                              .employmenteligiblity
                          }
                          onClick={(evt) =>
                            onHandleInputChange("authorization", item.id)
                          }
                        />
                        <Label check className="fw-semi-bold">
                          {item.name}
                        </Label>
                      </FormGroup>
                    </Col>
                  ))}
                </Row>
                <Row>
                  <Col>
                    <FormGroup check>
                      <Input
                        name="immediateJoin"
                        type="checkbox"
                        checked={
                          selectedCandidate_temp.personalInfo
                            .isreadytoworkimmediately
                        }
                        onChange={(evt) =>
                          onHandleInputChange("work", evt.target.value)
                        }
                      />{" "}
                      <Label className="fw-semi-bold">
                        Ready to work immediately{" "}
                      </Label>
                    </FormGroup>
                  </Col>
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

      <Modal className="modal-reject-align profile-view" isOpen={cityReqError}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Please select City to filter
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Country
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => setCityReqError(false)}
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
