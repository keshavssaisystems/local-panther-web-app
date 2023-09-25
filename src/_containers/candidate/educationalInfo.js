import React, { useState, useEffect } from "react";
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
  InputGroup,
  Form,
} from "reactstrap";

import editIcon from "../../assets/utils/images/pencil.svg";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import candidatelogo from "../../assets/utils/images/candidate.svg";

export function CandidateEducation(props) {
  const dispatch = useDispatch();

  const [educationalDetails, setDetails] = useState([
    {
      id: 1,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: false,
      fromDate: "August 2014",
      toDate: "September 2018",
    },
    {
      id: 2,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: true,
      fromDate: "",
      toDate: "",
    },
    {
      id: 3,
      id: 2,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: true,
      fromDate: "",
      toDate: "",
    },
    {
      id: 2,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: true,
      fromDate: "",
      toDate: "",
    },
  ]);

  let data = [
    {
      id: 0,
      educationLevel: "",
      error: false,
    },
  ];
  const [formDetails, setFormData] = useState(data);

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

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};
  const handleChange = function (index, data) {
    let new_data = [...formDetails];

    new_data[index].educationLevel = data;
    new_data[index].error = false;
    setFormData(new_data);
    onSubmit();
  };
  // form validation rules
  const validationSchema = Yup.object().shape({
    educationLevel: Yup.string()
      .required("Education is Required is required")
      .max(50),
    studyField: Yup.string().max(50),
    school: Yup.string().max(50),
    city: Yup.string().max(50),
    state: Yup.string().max(50),
    country: Yup.string(),
    currentlyStudying: Yup.string(),
    fromDate: Yup.string().when("currentlyStudying", {
      is: "true",
      then: Yup.string().required("From Date is Required"),
      otherwise: Yup.string(), // No requirement when something is not enabled
    }),

    toDate: Yup.string().when("currentlyStudying", {
      is: "true",
      then: Yup.string().required("To Date is Required"),
      otherwise: Yup.string(), // No requirement when something is not enabled
    }),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  const removeTabs = function (index) {
    debugger;
    let new_data = [...formDetails];
    new_data.splice(index, 1);
    setFormData(new_data);
  };

  const addMoreTabs = function (index) {
    debugger;

    let new_data = [...formDetails];
    console.log("before" + new_data);
    if (new_data[index - 1].educationLevel == "") {
      new_data[index - 1].error = true;
      setFormData(new_data);

      console.log(formDetails);
      return;
    }

    const newTab = {
      id: index,
      educationLevel: "",
      error: false,
    };
    setFormData([...formDetails, newTab]);
    console.log(formDetails);
  };

  function onSubmit(payload) {}

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3 scroll-area-md" style={{ marginLeft: "10px" }}>
            <PerfectScrollbar>
              <Row>
                <Col>
                  <strong className="card-title-text">Education</strong>
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
              <Row>
                {educationalDetails.map((item) => (
                  <div>
                    <Col>
                      <strong className="me-2 content-title">
                        {item.educationLevel} {", "}
                        {item.field}
                      </strong>
                      <img
                        src={editIcon}
                        alt="edit-icon"
                        className=" me-2 edit-icon"
                        //   onClick={(evt) => edit(item)}
                      ></img>
                      <i className="pe-7s-trash icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1"></i>
                    </Col>
                    <Label className="mb-0 mt-0 card-p-text-black">
                      {item.school}
                      {", "}
                      {item.city}
                      {", "}
                      {item.state}
                      {", "}
                      {item.country}
                      {", "}
                      {item.zipCode}
                      {"  "}
                    </Label>

                    {item.currentlyStudying ? (
                      <p className="card-p-text-black">Curretly Studying </p>
                    ) : (
                      <div>
                        <p className="card-p-text-black">
                          {item.fromDate}
                          {" to "}
                          {item.toDate}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </Row>
            </PerfectScrollbar>
          </div>
          <CardFooter
            className="d-flex justify-content-center"
            style={{ border: "none" }}
          >
            <div className="link-text">
              View all {educationalDetails.length} Details
            </div>
          </CardFooter>
        </Card>
      </div>

      {isPersonalModal ? (
        <div>
          <Modal
            className="personal-information"
            size="lg"
            isOpen={isPersonalModal}
          >
            <ModalHeader toggle={isPersonalModal} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Education Details
              </strong>
            </ModalHeader>
            <ModalBody>
              test -- {formDetails.length}
              {formDetails.map((item, index) => (
                <Form onSubmit={handleSubmit(onSubmit)}>
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
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="educationLevel" className="input-label">
                          Level of Education
                          <span className="required-icon"> *</span>
                        </Label>
                        <input
                          placeholder="Enter Level of Education"
                          name="educationLevel"
                          type="text"
                          id="educationLevel"
                          value={formDetails[index].educationLevel}
                          onInput={(evt) =>
                            handleChange(index, evt.target.value)
                          }
                          {...register("educationLevel")}
                          className={`field-input placeholder-text form-control ${
                            item.error ? "is-invalid" : ""
                          }`}
                        />

                        <div className="invalid-feedback">
                          {item.error ? "Level of Education is Required" : ""}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="studyField" className="input-label">
                          Field of Study
                        </Label>
                        <input
                          placeholder="Enter Field of Study"
                          name="studyField"
                          type="text"
                          id="studyField"
                          {...register("studyField")}
                          className="field-input placeholder-text form-control"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="school" className="input-label">
                          School
                        </Label>
                        <Input
                          className="field-input placeholder-text form-control"
                          type="text"
                          id="school"
                          name="school"
                          placeholder="Enter School"
                        ></Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="city" className="input-label">
                          City
                        </Label>
                        <input
                          placeholder="Enter city"
                          name="city"
                          type="text"
                          id="city"
                          {...register("city")}
                          className="field-input placeholder-text form-control"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="state" className="input-label">
                          State
                        </Label>
                        <input
                          placeholder="Enter State"
                          name="state"
                          type="text"
                          id="state"
                          {...register("state")}
                          className="field-input placeholder-text form-control"
                        />
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
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          name="currentlyStudying"
                          id="currentlyStudying"
                          {...register("currentlyStudying")}
                        />{" "}
                        <Label check className="input-label">
                          Currently Studying
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={4}>
                      <FormGroup>
                        <Label for="gender" className="input-label">
                          From Date
                        </Label>
                        <InputGroup>
                          <div className="input-group-text">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </div>
                          <DatePicker
                            name="fromDate"
                            id="fromDate"
                            className={`field-input placeholder-text form-control ${
                              errors.fromDate ? "is-invalid" : ""
                            }`}
                            placeholderText="DD/MM/YYYY"
                            selected={fromDate}
                            onChange={(evt) => selectDate()}
                            {...register("fromDate")}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="gender" className="input-label">
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
                            selected={toDate}
                            onChange={(evt) => selectDate()}
                            {...register("toDate")}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  {index < formDetails.length - 1 ? <hr /> : <></>}

                  {index == formDetails.length - 1 ? (
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
                  ) : (
                    <></>
                  )}
                </Form>
              ))}
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
