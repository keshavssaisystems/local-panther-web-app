import React, { useState, useEffect, Fragment } from "react";
import { Label, Input, ModalHeader, ModalBody } from "reactstrap";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  FormGroup,
  InputGroup,
  Form,
} from "reactstrap";
import Loader from "react-loaders";
import AsyncSelect from "react-select/async";
import { formatDate, extractDatePart } from "_helpers/helper";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  BsUpload,
  BsPencil,
  BsTelephone,
  BsPinMap,
  BsGenderMale,
  BsPeople,
  BsEnvelope,
  BsBalloon,
  BsPencilSquare,
  BsCamera,
} from "react-icons/bs";
import moment from "moment-timezone";
import axios from "axios";
import { useDropzone } from "react-dropzone";

import profileImg from "../../assets/utils/images/profile-pic 1.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";

import "./profile.scss";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import imgHover from "../../assets/utils/images/profile-pic-hover.svg";
import {
  profileActions,
  jobPreferenceDetailsActions,
  getProfileActions,
} from "_store";
import { getLocationFilter } from "_store";

export function PersonalInformation(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.getProfile.loader);
  const [editImg, setEditImg] = useState(false);

  const genderList = useSelector((state) => state.gender.genderList);
  const raceList = useSelector((state) => state.ethnicity.ethnicityList);
  const pronounList = useSelector((state) => state.getProfile.pronounList);
  const eligibilityList_temp = useSelector(
    (state) => state.getProfile.dropdownLists.eligibilityDropDown
  );

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const personalInfo_temp = useSelector(
    (state) => state.getProfile.profileData.personalInfo
  );

  useEffect(() => {
    let data = {
      personalInfo: personalInfo_temp,
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
    selectedDropDown: useSelector((state) => state.getProfile.dropdownLists),
  });

  const [getResponse, setGetResponse] = useState({});

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
  const [pronounSelect, setPronounSelect] = useState("");
  const [genderSelect, setGenderSelect] = useState("");
  useEffect(() => {
    let data = {
      jobprofile: selectedCandidate.personalInfo.jobprofile,
      firstname: selectedCandidate.personalInfo.firstname,
      lastname: selectedCandidate.personalInfo.lastname,
      email: selectedCandidate.personalInfo.email,
      phonenumber: selectedCandidate.personalInfo.phonenumber,
      zipcode: selectedCandidate.personalInfo.zipcode,
      employmenteligiblity: selectedCandidate.personalInfo.employmenteligiblity,
      dob: selectedCandidate.personalInfo.dob
        ? extractDatePart(selectedCandidate.personalInfo.dob)
        : null,
      isreadytoworkimmediately:
        selectedCandidate.personalInfo.isreadytoworkimmediately,
      address: selectedCandidate.personalInfo.address,
      city: [
        {
          value: selectedCandidate.personalInfo.cityid,
          label: selectedCandidate.personalInfo.cityname,
        },
      ],
      state: [
        {
          value: selectedCandidate.personalInfo.stateid,
          label: selectedCandidate.personalInfo.statename,
        },
      ],
      country: [
        {
          value: selectedCandidate.personalInfo.countryid,
          label: selectedCandidate.personalInfo.countryname,
        },
      ],

      gender: [
        {
          value: selectedCandidate.personalInfo.genderid,
          label: selectedCandidate.personalInfo.gender,
        },
      ],
      ethinicity: [
        {
          value: selectedCandidate.personalInfo.ethnicityid,
          label: selectedCandidate.personalInfo.ethnicity,
        },
      ],
      pronoun: [
        {
          value: selectedCandidate.personalInfo.pronounid,
          label: selectedCandidate.personalInfo.pronounname,
        },
      ],

      isactive: true,
      userid: 0,
      currentUserId: 0,
    };
    setGetResponse(data);
    if (props.profileInfo.personalInfo.city != "") {
      loadOptions(props.profileInfo.personalInfo.city.slice(0, 3));
    }

    if (selectedCandidate.selectedDropDown?.selectedCountry[0]?.value != 0) {
      let countryData = [...countrySelect];
      countryData.push(selectedCandidate.selectedDropDown?.selectedCountry[0]);

      setCountrySelect(countryData);
    }

    if (selectedCandidate.selectedDropDown?.selectedState[0]?.value != 0) {
      let stateData = [...stateSelect];
      stateData.push(selectedCandidate.selectedDropDown?.selectedState[0]);
      setStateSelect(stateData);
    }

    if (selectedCandidate.selectedDropDown?.selectedCity[0]?.value != 0) {
      let cityData = [...citySelect];
      cityData.push(selectedCandidate.selectedDropDown?.selectedCity[0]);
      setCitySelect(cityData);
    }
    if (selectedCandidate.selectedDropDown?.selectedGender[0]?.value != 0) {
      let genderData = [...genderSelect];
      genderData.push(selectedCandidate.selectedDropDown?.selectedGender[0]);
      setGenderSelect(genderData);
    }

    if (selectedCandidate.selectedDropDown?.selectedEthnicity[0].value != 0) {
      let ethnicityData = [...raceSelect];
      ethnicityData.push(
        selectedCandidate.selectedDropDown?.selectedEthnicity[0]
      );
      setRaceSelect(ethnicityData);
    }

    if (selectedCandidate.selectedDropDown?.selectedPronoun[0].value != 0) {
      let pronounData = [...pronounSelect];
      pronounData.push(selectedCandidate.selectedDropDown?.selectedPronoun[0]);
      setPronounSelect(pronounData);
    }
  }, [selectedCandidate]);

  const [cityReqError, setCityReqError] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage")
  );
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
    let get_data = { ...getResponse };
    let new_array = [
      {
        value: data.value,
        label: data.label,
      },
    ];

    get_data.city = new_array;

    let obj = [
      {
        value: cityList.find((x) => x.cityid == data.value)?.stateid,
        label: cityList.find((x) => x.cityid == data.value)?.statename,
      },
    ];

    get_data.state = obj;
    setGetResponse(get_data);
  };
  const onSelectCountryDropdown = function (data) {
    let new_data = [];
    new_data.push(data);
    setCountrySelect(new_data);
    let get_data = { ...getResponse };
    let new_array = [
      {
        value: data.value,
        label: data.label,
      },
    ];

    get_data.country = new_array;
    setGetResponse(get_data);
  };

  const onSelectRaceDropdown = function (data) {
    let new_data = [];
    new_data.push(data);
    setRaceSelect(new_data);

    let get_data = { ...getResponse };
    let new_array = [
      {
        value: data.value,
        label: data.label,
      },
    ];

    get_data.ethinicity = new_array;
    setGetResponse(get_data);
  };

  const onSelectPronounDropdown = (data) => {
    let new_data = [];
    new_data.push(data);
    setPronounSelect(new_data);

    let get_data = { ...getResponse };
    let new_array = [
      {
        value: data.value,
        label: data.label,
      },
    ];

    get_data.pronoun = new_array;
    setGetResponse(get_data);
  };

  const onSelectGenderDropdown = function (data) {
    let new_data = [];
    new_data.push(data);
    setGenderSelect(new_data);

    let get_data = { ...getResponse };
    let new_array = [
      {
        value: data.value,
        label: data.label,
      },
    ];

    get_data.gender = new_array;
    setGetResponse(get_data);
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
    let new_data = { ...getResponse };
    let errors = { ...requiredErrors };
    if (new_data.city[0]?.value == 0) {
      errors.cityError = true;
    } else {
      errors.cityError = false;
    }

    if (errors.cityError) {
      setRequiredErros(errors);
      return;
    }

    if (
      new_data.jobprofile === "" ||
      !new_data.jobprofile ||
      new_data.firstname === "" ||
      new_data.lastname === "" ||
      new_data.phonenumber === "" ||
      new_data.email === "" ||
      new_data.cityid == 0
    ) {
      return;
    } else {
      let post_data = {
        candidateid: userDetails.InternalUserId,
        email: new_data.email,
        phonenumber: new_data.phonenumber,
        firstname: new_data.firstname,
        lastname: new_data.lastname,
        genderid: new_data.gender[0]?.value,
        cityid: new_data.city[0]?.value,
        stateid: new_data.state[0]?.value,
        countryid: new_data.country[0]?.value,
        zipcode: new_data.zipcode,
        ethnicityid: new_data.ethinicity[0]?.value,
        employmenteligiblity: new_data.employmenteligiblity,
        isreadytoworkimmediately: new_data.isreadytoworkimmediately,
        isactive: true,
        dob: new_data.dob,
        address: new_data.address,
        userid: userDetails.UserId,
        currentUserId: userDetails.UserId,
        jobprofile: new_data.jobprofile,
        pronounid: new_data.pronoun[0]?.value,
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
    let temp_data = { ...getResponse };
    temp_data.dob = extractDatePart(data);
    setGetResponse(temp_data);
    setDOB(extractDatePart(data));
  };

  const close = function () {
    let data = {
      personalInfo: personalInfo_temp,
      eligibilityList: eligibilityList_temp,
    };
    setSelectedCandidate(data);
    let errors = { ...requiredErrors };

    let obj = {
      emailError: false,
      phoneError: false,
      cityError: false,
      stateError: false,
    };
    errors = obj;
    setRequiredErros(errors);
    setContactModal(false);
    setEditImg(false);
    // props.onCallBack();
  };
  const closeModal = function () {
    let data = {
      personalInfo: personalInfo_temp,
      eligibilityList: eligibilityList_temp,
    };
    let errors = { ...requiredErrors };

    let obj = {
      emailError: false,
      phoneError: false,
      cityError: false,
      stateError: false,
    };
    errors = obj;
    setRequiredErros(errors);
    setSelectedCandidate(data);
    setContactModal(false);
    setSuccess(false);
    setError(false);
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
    return filter_data;
  };
  const onHandleInputChange = function (check, data) {
    let new_data = { ...getResponse };
    let errors = { ...requiredErrors };
    if (check === "jobprofile") {
      new_data.jobprofile = data;
    } else if (check === "firstname") {
      new_data.firstname = data;
    } else if (check === "lastname") {
      new_data.lastname = data;
    } else if (check === "address") {
      new_data.address = data;
    } else if (check === "email") {
      new_data.email = data;

      if (!new_data.email.match(emailRegex)) {
        errors.emailError = true;
      } else {
        errors.emailError = false;
      }
    } else if (check === "phonenumber") {
      new_data.phonenumber = data;
      if (!new_data.phonenumber.match(phoneRegExp)) {
        errors.phoneError = true;
      } else {
        errors.phoneError = false;
      }
    } else if (check === "zip") {
      new_data.zipcode = data;
    } else if (check === "authorization") {
      new_data.employmenteligiblity = data;
    } else if (check === "work") {
      new_data.isreadytoworkimmediately = !new_data.isreadytoworkimmediately;
    } else if (check === "city") {
      let new_array = [
        {
          value: data.value,
          label: data.label,
        },
      ];

      new_data.city = new_array;

      let obj = [
        {
          value: cityList.find((x) => x.cityid == data.value)?.stateid,
          label: cityList.find((x) => x.cityid == data.value)?.statename,
        },
      ];

      new_data.state = obj;
    } else if (check === "country") {
      let new_array = [
        {
          value: data.value,
          label: data.label,
        },
      ];

      new_data.country = new_array;
    }
    setRequiredErros(errors);
    setGetResponse(new_data);
  };
  const onDrop = (acceptedFiles) => {
    addEditProfileImage(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".png",
  });

  const addEditProfileImage = function (acceptedFiles) {
    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${authData}`,
      },
    };

    const form = new FormData();
    form.append("UserId", userDetails.UserId);
    form.append("Profilephotopath", "");
    form.append("ProfileFile", acceptedFiles[0]);

    axios
      .put(
        `${process.env.REACT_APP_PANTHER_URL}/api/User/UpdateProfilePhoto/` +
          userDetails.UserId,
        form,
        config
      )
      .then((result) => {
        if (result.data.statusCode == 204) {
          setSuccess(true);
          setMessage(result.data.message);
          localStorage.setItem(
            "profileImage",
            result.data.data.profilephotopath
          );
          setProfileImage(result.data.data.profilephotopath);
        } else {
          setError(true);
        }
        setEditImg(false);
      })
      .catch((error) => {});
  };

  const deleteImg = async function () {
    let id = userDetails.UserId;
    let response = await dispatch(
      jobPreferenceDetailsActions.deleteProfileImgThunk(id)
    );
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
      localStorage.setItem("profileImage", "");
      setProfileImage("");
    } else {
      setError(true);
    }
    setEditImg(false);
    props.onCallBack();
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
                          height={100}
                          className="rounded-circle"
                          src={
                            isHovered
                              ? imgHover
                              : profileImage == ""
                              ? profileImg
                              : profileImage
                          }
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          alt="profile-img"
                          onClick={() => setEditImg(true)}
                        />
                      </div>

                      <div className="widget-chart-content">
                        <div>
                          <strong className="candidate-name mb-1">
                            <span className="me-2">
                              {selectedCandidate.personalInfo.firstname +
                                " " +
                                selectedCandidate.personalInfo.lastname}
                            </span>
                            {selectedCandidate.personalInfo.pronounname !==
                              "" && (
                              <span className="candidate-label">
                                ( {selectedCandidate.personalInfo.pronounname} )
                              </span>
                            )}
                          </strong>
                          {selectedCandidate.personalInfo.jobprofile && (
                            <p className="widget-description text-focus content-text mt-0">
                              {selectedCandidate.personalInfo.jobprofile}
                            </p>
                          )}
                          <p className="candidate-label mt-0 mb-0">
                            {selectedCandidate.personalInfo.organization !=
                              "Not Working" &&
                            selectedCandidate.personalInfo.organization != ""
                              ? "at " +
                                selectedCandidate.personalInfo.organization
                              : ""}
                          </p>
                        </div>
                        <div>
                          <Row>
                            <Col className="col-12 mb-0">
                              <Label className="candidate-label mb-0">
                                Employment eligibility:{" "}
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

                  <Col sm="12" md="12" xl="6" className="">
                    <div className="m-3 float-end">
                      <BsPencil
                        className="edit-icon"
                        onClick={(evt) => setContactModal(true)}
                      />
                    </div>
                    <Row>
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
                          {selectedCandidate.personalInfo.city !== "" ||
                          selectedCandidate.personalInfo.country !== "" ? (
                            <div>
                              <BsPinMap className="personal-sec-icon me-2" />
                              <span className="content-text">
                                {selectedCandidate.personalInfo.city
                                  ? selectedCandidate.personalInfo.city +
                                    ", " +
                                    selectedCandidate.personalInfo.state
                                  : ""}

                                {selectedCandidate.personalInfo.country
                                  ? ", " +
                                    selectedCandidate.personalInfo.country
                                  : ""}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                  {/* <Col sm="12" md="12" xl="3" className="mt-3">
                    <div className="me-3 float-end">
                      <BsPencil
                        className="edit-icon"
                        onClick={(evt) => setContactModal(true)}
                      />
                    </div>
                    <Row className="mt-3">
                      <Row>
                        {selectedCandidate.personalInfo.dob ? (
                          <Col className="mb-2">
                            <div>
                              <BsBalloon className="personal-sec-icon me-2" />
                              <span className="content-text mt-3">
                                {formatDate(selectedCandidate.personalInfo.dob)}
                              </span>
                            </div>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Row>
                      <Row>
                        <Col className="mb-2">
                          {selectedCandidate.personalInfo.gender !== "" ? (
                            <div>
                              {selectedCandidate.personalInfo.gender ===
                              "Female" ? (
                                <i
                                  className="pe-7s-female personal-sec-icon me-2"
                                  style={{
                                    fontSize: "20px",
                                    color: "black",
                                    fontWeight: "400",
                                  }}
                                >
                                  {" "}
                                </i>
                              ) : (
                                <BsGenderMale className="personal-sec-icon me-2" />
                              )}

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
                  </Col> */}
                </Row>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
              <Loader active={loading} type="line-scale-pulse-out-rapid" />
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
              {getResponse ? (
                <Form onSubmit={(evt) => onSubmit(evt)}>
                  <Row className="mb-3">
                    <Col className="col-6">
                      <Label for="firstname" className="fw-semi-bold">
                        Job profile <span className="required-icon">*</span>
                      </Label>
                      <input
                        type="text"
                        name="jobProfile"
                        id="jobProfile"
                        placeholder="Enter job profile"
                        maxLength={50}
                        value={getResponse.jobprofile}
                        onInput={(evt) =>
                          onHandleInputChange("jobprofile", evt.target.value)
                        }
                        className={`field-input placeholder-text form-control ${
                          getResponse.jobprofile === "" ||
                          !getResponse.jobprofile
                            ? "is-invalid error-text"
                            : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {getResponse.jobprofile === "" ||
                        !getResponse.jobprofile
                          ? "Job profile is required"
                          : ""}
                      </div>
                    </Col>
                  </Row>

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
                          placeholder="Enter first name"
                          maxLength={50}
                          value={getResponse.firstname}
                          onInput={(evt) =>
                            onHandleInputChange("firstname", evt.target.value)
                          }
                          className={`field-input placeholder-text form-control ${
                            getResponse.firstname === ""
                              ? "is-invalid error-text"
                              : ""
                          }`}
                        />
                        <div className="invalid-feedback">
                          {getResponse.firstname == ""
                            ? "First name is required"
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
                          placeholder="Enter last name"
                          name="lastname"
                          type="lastname"
                          id="lastname"
                          maxLength={50}
                          value={getResponse.lastname}
                          onInput={(evt) =>
                            onHandleInputChange("lastname", evt.target.value)
                          }
                          className={`field-input placeholder-text form-control ${
                            getResponse.lastname == "" ? "is-invalid" : ""
                          }`}
                        />

                        <div className="invalid-feedback">
                          {getResponse.lastname == ""
                            ? "Last name is required"
                            : ""}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label for="phonenumber" className="fw-semi-bold">
                          Phone<span className="required-icon"> *</span>
                        </Label>
                        <InputMask
                          placeholder="Eg: (987)-654-3210"
                          disabled
                          name="phonenumber"
                          type="text"
                          id="phonenumber"
                          mask="(999)-999-9999"
                          value={getResponse.phonenumber}
                          onInput={(evt) =>
                            onHandleInputChange("phonenumber", evt.target.value)
                          }
                          className={`field-input placeholder-text form-control ${
                            getResponse.phonenumber == "" ||
                            getResponse.phoneError
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="invalid-feedback">
                          {getResponse.phonenumber == ""
                            ? "Phone number is required"
                            : ""}
                        </div>
                        <div className="invalid-feedback">
                          {getResponse.phonenumber != "" &&
                          getResponse.phoneError
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
                          disabled
                          placeholder="Enter Email"
                          value={getResponse.email}
                          onInput={(evt) =>
                            onHandleInputChange("email", evt.target.value)
                          }
                          className={`field-input placeholder-text form-control ${
                            getResponse.email == "" || requiredErrors.emailError
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="invalid-feedback">
                          {getResponse.email == "" ? "Email is required" : ""}
                        </div>
                        <div className="invalid-feedback">
                          {getResponse.email != "" && requiredErrors.emailError
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
                          loadOptions={loadOptions}
                          isMulti={false}
                          value={citySelect}
                          defaultOptions={locationData}
                          onChange={(evt) => onSelectCityDropdown(evt)}
                          className={`location-dropdown ${
                            requiredErrors.cityError == ""
                              ? "is-invalid error-text"
                              : ""
                          }`}
                        />
                        <div className="error-class">
                          {requiredErrors.cityError
                            ? "City,State is required"
                            : ""}
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
                          value={getResponse.address}
                          maxLength={50}
                          placeholder="Enter address"
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
                          value={getResponse.zipcode}
                          onInput={(evt) =>
                            onHandleInputChange("zip", evt.target.value)
                          }
                          placeholder="Enter zip zode"
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

                        <InputGroup>
                          <div className="input-group-text">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </div>
                          <DatePicker
                            autoComplete="off"
                            className="form-control"
                            placeholderText="MM/DD/YYYY"
                            selected={
                              getResponse.dob ? new Date(getResponse.dob) : null
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
                          defaultOptions={genderList}
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
                          defaultOptions={raceList}
                          isMulti={false}
                          value={raceSelect}
                          onChange={(evt) => onSelectRaceDropdown(evt)}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="pronoun" className="fw-semi-bold">
                          Pronoun
                        </Label>
                        <AsyncSelect
                          name="pronoun"
                          placeholder="Select"
                          defaultOptions={pronounList}
                          isMulti={false}
                          value={pronounSelect}
                          onChange={(evt) => onSelectPronounDropdown(evt)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <div className="mb-1 fw-bold">Employment eligibility</div>
                    <hr />
                  </Row>

                  <Row>
                    {selectedCandidate?.eligibilityList?.map((item) => (
                      <Col>
                        <FormGroup check>
                          <Input
                            name="eligibility"
                            type="radio"
                            checked={
                              item.id == getResponse.employmenteligiblity
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
                          checked={getResponse.isreadytoworkimmediately}
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
              ) : (
                <></>
              )}
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

      <Modal className="modal-reject-align profile-view" isOpen={editImg}>
        <ModalHeader toggle={() => close()} charCode="Y">
          <strong className="card-title-text"> Profile Image Update</strong>
        </ModalHeader>
        <Card>
          <CardBody>
            <div className="mb-0 d-flex justify-content-center">
              Accepted file formats include png,jpg,jpeg and
            </div>
            <div className="mb-0 d-flex justify-content-center">
              gif with maximum size limit of 2MB
            </div>

            <div className="mt-3">
              <Row>
                <Col>
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <Row>
                      <label>
                        <div className="dropZone float-end" id="dragbox">
                          <Button
                            style={{
                              width: "auto",
                              backgroundColor: "#2F479B",
                              borderColor: "#2F479B",
                            }}
                            className="mb-2 mt-0 btn-icon btn-text float-end"
                            color="primary"
                          >
                            <span className="me-2">Upload</span>
                          </Button>
                        </div>
                      </label>
                    </Row>
                  </div>
                </Col>
                <Col>
                  <FormGroup>
                    <Row style={{ marginLeft: "5px" }}>
                      <Button
                        style={{
                          width: "auto",
                          backgroundColor: "#2F2E2E",
                          borderColor: "#2F2E2E",
                        }}
                        className="mb-2 me-2 btn-icon btn-text"
                        color="primary"
                        onClick={() => deleteImg()}
                      >
                        <span>Delete</span>
                      </Button>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
}
