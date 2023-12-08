import React, { useState, useEffect, Fragment } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
} from "reactstrap";
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
  FormFeedback,
  InputGroup,
  Form,
} from "reactstrap";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import editIcon from "../../assets/utils/images/pencil.svg";

import profileImg from "../../assets/utils/images/avatars/1.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import Tabs from "react-responsive-tabs";
import { useDispatch } from "react-redux";
import successIcon from "../../assets/utils/images/check-circle.svg";
import errorIcon from "../../assets/utils/images/x-circle.svg";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import candidatelogo from "../../assets/utils/images/candidate.svg";

export function PersonalInformationNew(props) {
  const dispatch = useDispatch();
  const [selectedCandidate, setSelectedCandidate] = useState(
    props.selectedData
  );

  const [countryList, setCountryList] = useState([
    {
      value: 1,
      type: "USA",
    },
    {
      value: 2,
      type: "India",
    },
  ]);
  const [genderList, setGenderList] = useState([
    {
      value: 1,
      type: "Male",
    },
    {
      value: 2,
      type: "Female",
    },
  ]);

  const [raceList, setRaceList] = useState([
    { value: 1, type: "Aboriginal" },

    { value: 2, type: "African American or Black" },

    { value: 3, type: "Asian" },

    { value: 4, name: "European American or White" },

    { value: 5, type: "Native American" },

    { value: 6, type: "Native Hawaiian or Pacific Islander" },

    { value: 7, type: "Māori," },

    { value: 8, type: "Other race" },
  ]);

  const [authorization, setAuthorization] = useState(false);
  const [sponserdCheck, setSponserdCheck] = useState(false);
  const [notSpecifiedCheck, setNotSpecifiedCheck] = useState(false);

  const [dob, setDOB] = useState(new Date());
  const [isEligibilityModal, setEligibilityModal] = useState(false);
  const [isLocationModal, setLocationModal] = useState(false);
  const [isContactModal, setContactModal] = useState(false);
  const [isDemographicModal, setDemographicModal] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  // form validation rules
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("Firstname is required").max(50),
    lastname: Yup.string().required("Lastname is required").max(50),
    phonenumber: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid")
      .max(20),
    email: Yup.string()
      .required("Email is required")
      .matches(emailRegex, "Email is not valid")
      .max(50),
    city: Yup.string().required("City is required").max(50),
    state: Yup.string().required("State is required").max(50),
    location: Yup.string(),
    country: Yup.string(),
    address: Yup.string().max(50),
    zipCode: Yup.string().max(50),
    gender: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function onSubmit(payload) {}
  const selectDate = function () {};
  const onSelectEligibility = function (check, data) {
    if (check === "authorization") {
      setAuthorization(true);
      setSponserdCheck(false);
      setNotSpecifiedCheck(false);
    }
    if (check === "sponserdCheck") {
      setAuthorization(false);
      setSponserdCheck(true);
      setNotSpecifiedCheck(false);
    }
    if (check === "notSpecifiedCheck") {
      setAuthorization(false);
      setSponserdCheck(false);
      setNotSpecifiedCheck(true);
    }
  };

  return (
    <div>
      <Fragment>
        <Card className="mb-3 profile-view">
          <Row className="g-0">
            <Col sm="12" md="12" xl="6" className="ml-border">
              <div className="card no-shadow rm-border bg-transparent widget-chart text-start">
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
                    <strong className="candidate-name mb-0">John Doe</strong>
                    <p className="widget-description text-focus content-text mt-0 mb-1">
                      Lead Java Developer
                    </p>
                    <p className="personal-info-label">
                      at Saisystems Technology
                    </p>
                  </div>
                  <div className="mt-1">
                    <Row>
                      <Col>
                        <Label className="personal-info-label">
                          Employment Eligibility:{" "}
                          <strong className="content-text">
                            Authorized to work in the US{" "}
                          </strong>
                        </Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p className="personal-info-label">
                          Ready to work Immediately:{" "}
                          <strong className="content-text">Yes </strong>
                        </p>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm="12" md="12" xl="3" className="ml-border">
              <Row className="mt-3">
                <Col className="col-2">
                  <div className="float-end">
                    <i className="pe-7s-call icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1">
                      {" "}
                    </i>
                  </div>
                </Col>
                <Col>
                  <div>
                    <p className="content-text">(120)456-789</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="col-2">
                  <div className="float-end">
                    <i className="pe-7s-mail icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1">
                      {" "}
                    </i>
                  </div>
                </Col>
                <Col>
                  <div>
                    <p className="content-text">johndoe@gmail.com</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="col-2">
                  <div className=" float-end">
                    <i className="pe-7s-map-marker icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1">
                      {" "}
                    </i>
                  </div>
                </Col>
                <Col>
                  <div>
                    <p className="content-text">Pune,Maharastra,India</p>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col sm="12" md="12" xl="3" className="mt-3">
              <div className="me-1">
                <img
                  src={editIcon}
                  alt="edit-icon"
                  className="float-end me-3 edit-icon"
                  onClick={(evt) => setContactModal(true)}
                ></img>
              </div>
              <Row className="mt-3">
                <Col className="col-2">
                  <div className=" float-end">
                    <i className="pe-7s-call icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1">
                      {" "}
                    </i>
                  </div>
                </Col>
                <Col>
                  <Label className="content-text">Sep 12,2001</Label>
                </Col>
              </Row>
              <Row>
                <Col className="col-2">
                  <div className=" float-end">
                    <i className="pe-7s-mail icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1">
                      {" "}
                    </i>
                  </div>
                </Col>
                <Col>
                  <div>
                    <p className="content-text">Male</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="col-2">
                  <div className=" float-end">
                    <i className="pe-7s-map-marker icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1">
                      {" "}
                    </i>
                  </div>
                </Col>
                <Col>
                  <div>
                    <p className="content-text">African</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Fragment>

      {isContactModal ? (
        <div>
          <Modal
            className="personal-information"
            size="lg"
            isOpen={isContactModal}
          >
            <ModalHeader toggle={isContactModal} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Personal Information
              </strong>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="email" className="input-label">
                        First Name <span className="required-icon">*</span>
                      </Label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter First Name"
                        {...register("firstname")}
                        className={`field-input placeholder-text form-control ${
                          errors.firstname
                            ? "is-invalid error-text"
                            : "input-text"
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.firstname?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="password" className="input-label">
                        Last Name <span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter Last Name"
                        name="lastname"
                        type="lastname"
                        id="lastname"
                        {...register("lastname")}
                        className={`field-input placeholder-text form-control ${
                          errors.lastname ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.lastname?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="phonenumber" className="input-label">
                        Phone<span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter Phone Number"
                        name="phonenumber"
                        type="text"
                        id="phonenumber"
                        {...register("phonenumber")}
                        className={`field-input placeholder-text form-control ${
                          errors.phonenumber ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors.phonenumber?.message}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="email" className="input-label">
                        Email <span className="required-icon">*</span>
                      </Label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                        {...register("email")}
                        className={`field-input placeholder-text form-control ${
                          errors.email ? "is-invalid error-text" : "input-text"
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="country" className="input-label">
                        Country
                      </Label>
                      <Input
                        className="reason-dropdown-input dropdown-placeholder"
                        type="select"
                        id="country"
                        name="country"
                        placeholder="Select Country"
                      >
                        {countryList.map((col) => (
                          <option key={col.value} value={col.value}>
                            {col.type}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="address" className="input-label">
                        Address
                      </Label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Enter Address"
                        {...register("address")}
                        className="field-input placeholder-text form-control input-text"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="city" className="input-label">
                        City <span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter city"
                        name="city"
                        type="text"
                        id="city"
                        {...register("city")}
                        className={`field-input placeholder-text form-control ${
                          errors.city ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors.city?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="state" className="input-label">
                        State<span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter State"
                        name="state"
                        type="text"
                        id="state"
                        {...register("state")}
                        className={`field-input placeholder-text form-control ${
                          errors.state ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors.state?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="zipCode" className="input-label">
                        Zip Code
                      </Label>
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        placeholder="Enter Zip Code"
                        {...register("zipCode")}
                        className="field-input placeholder-text form-control input-text"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="gender" className="input-label">
                        Birth Year
                      </Label>
                      <InputGroup>
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <DatePicker
                          className="form-control"
                          placeholderText="DD/MM/YYYY"
                          selected={dob}
                          onChange={(evt) => selectDate()}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>

                  <Col md={4}>
                    <FormGroup>
                      <Label for="gender" className="input-label">
                        Gender
                      </Label>
                      <Input
                        className="reason-dropdown-input dropdown-placeholder"
                        type="select"
                        id="gender"
                        name="gender"
                        placeholder="Select Gender"
                      >
                        <option>Select Gender</option>
                        {genderList.map((col) => (
                          <option key={col.value} value={col.value}>
                            {col.type}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="gender" className="input-label">
                        Race/Etnicity
                      </Label>
                      <Input
                        className="reason-dropdown-input dropdown-placeholder"
                        type="select"
                        id="race"
                        name="race"
                        placeholder="Select Etnicity"
                      >
                        <option>Select Etnicity</option>
                        {raceList.map((col) => (
                          <option key={col.value} value={col.value}>
                            {col.type}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup check>
                      <Input
                        name="authorization"
                        type="radio"
                        checked={authorization}
                        onClick={(evt) =>
                          onSelectEligibility("authorization", evt.target.value)
                        }
                      />{" "}
                      <Label check className="input-label">
                        Authorized to work in the US
                      </Label>
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup check>
                      <Input
                        name="sponserdCheck"
                        type="radio"
                        onClick={(evt) =>
                          onSelectEligibility("sponserdCheck", evt.target.value)
                        }
                        checked={sponserdCheck}
                      />{" "}
                      <Label check className="input-label">
                        Sponsorship required
                      </Label>
                    </FormGroup>
                  </Col>

                  <Col>
                    <FormGroup check>
                      <Input
                        name="notSpecifiedCheck"
                        type="radio"
                        checked={notSpecifiedCheck}
                        onClick={(evt) =>
                          onSelectEligibility(
                            "notSpecifiedCheck",
                            evt.target.value
                          )
                        }
                      />{" "}
                      <Label check className="input-label">
                        Not Specified
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Ready to work immediately
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="float-end">
                  <Button
                    disabled={
                      errors.state ||
                      errors.firstname ||
                      errors.lastname ||
                      errors.city ||
                      errors.phonenumber ||
                      errors.email
                    }
                    className="me-2 save-btn"
                    type="submit"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    className="close-btn"
                    onClick={() => setContactModal(false)}
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
