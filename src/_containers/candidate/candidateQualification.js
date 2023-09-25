import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
} from "reactstrap";
import { Link } from "react-router-dom";
import editIcon from "../../assets/utils/images/pencil.svg";
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

import "./profile.scss";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import PerfectScrollbar from "react-perfect-scrollbar";
import { QualificationModal } from "./qualificationModal";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";

export function CandidateQualification(props) {
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 1, title: "Tab 1", content: <QualificationModal /> },
  ]);

  const [editModal, setEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const [qualificationDetails, setDetails] = useState([
    {
      id: 1,
      jobTitle: "Lead Java Developer (Consultant 1)",
      organization: "Saisystems Technology",
      city: "California",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      fromDate: "September 2021",
      toDate: "Present",
      experience: "2 years 1 month",
      jobDescription:
        "Seeking a skilled Java developer to design,develop,and maintain high-performance Java applications.Strong expertise in Java Programming,data integration,and web development. Proficiency in Java frameworks like Spring and Hibernate.Knowledge of front-end technologies version controls,and testing frameworks,version Controls,and testing frameworks.Colloborative team player with problem solving skills.Join us to create cutting-edge software solutions.",
    },
    {
      id: 2,
      jobTitle: "Lead UI Developer (Consultant 1)",
      organization: "Saisystems Technology",
      city: "Pune",
      state: "Maharastra",
      country: "India",
      zipCode: 90001,
      fromDate: "September 2021",
      toDate: "Present",
      experience: "2 years 1 month",
      jobDescription:
        "Seeking a skilled Java developer to design,develop,and maintain high-performance Java applications.Strong expertise in Java Programming,data integration,and web development. Proficiency in Java frameworks like Spring and Hibernate.Knowledge of front-end technologies version controls,and testing frameworks,version Controls,and testing frameworks.Colloborative team player with problem solving skills.Join us to create cutting-edge software solutions.",
    },
    {
      id: 3,
      jobTitle: "Lead UI Developer (Consultant 1)",
      organization: "Saisystems Technology",
      city: "Pune",
      state: "Maharastra",
      country: "India",
      zipCode: 90001,
      fromDate: "September 2021",
      toDate: "Present",
      experience: "2 years 1 month",
      jobDescription:
        "Seeking a skilled Java developer to design,develop,and maintain high-performance Java applications.Strong expertise in Java Programming,data integration,and web development. Proficiency in Java frameworks like Spring and Hibernate.Knowledge of front-end technologies version controls,and testing frameworks,version Controls,and testing frameworks.Colloborative team player with problem solving skills.Join us to create cutting-edge software solutions.",
    },
    {
      id: 4,
      jobTitle: "Lead UI Developer (Consultant 1)",
      organization: "Saisystems Technology",
      city: "Pune",
      state: "Maharastra",
      country: "India",
      zipCode: 90001,
      fromDate: "September 2021",
      toDate: "Present",
      experience: "2 years 1 month",
      jobDescription:
        "Seeking a skilled Java developer to design,develop,and maintain high-performance Java applications.Strong expertise in Java Programming,data integration,and web development. Proficiency in Java frameworks like Spring and Hibernate.Knowledge of front-end technologies version controls,and testing frameworks,version Controls,and testing frameworks.Colloborative team player with problem solving skills.Join us to create cutting-edge software solutions.",
    },
  ]);

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

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string().required("Job Title is required").max(50),
    company: Yup.string().max(500),
    jobDescription: Yup.string().max(500),
    city: Yup.string().required("City is required").max(50),
    state: Yup.string().required("State is required").max(50),
    country: Yup.string(),
    currentlyWorking: Yup.string(),
    fromDate: Yup.string().when("currentlyWorking", {
      is: true,
      then: Yup.string().required("From Date is Required"),
      otherwise: Yup.string(), // No requirement when something is not enabled
    }),

    toDate: Yup.string().when("currentlyWorking", {
      is: true,
      then: Yup.string().required("To Date is Required"),
      otherwise: Yup.string(), // No requirement when something is not enabled
    }),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function onSubmit(payload) {}
  const edit = function (data) {
    setSelectedData(data);
    setEditModal(true);
  };

  const [newTabId, setNewTabId] = useState(2);
  const addMoreTabs = function () {
    debugger;
    const newTab = {
      id: 1,
      content: <QualificationModal />,
    };
    setTabs([...tabs, newTab]);
    setNewTabId(newTabId + 1);
    console.log(tabs);
  };
  const handlePageChange = () => {
    setPersonalModal(false);
  };

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3 scroll-area-md" style={{ marginLeft: "10px" }}>
            <PerfectScrollbar>
              <Row>
                <Col>
                  <strong className="card-title-text">Qualifications</strong>
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
                {qualificationDetails.map((item) => (
                  <div>
                    <Col>
                      <strong className="me-2 content-title">
                        {item.jobTitle}{" "}
                      </strong>
                      <img
                        src={editIcon}
                        alt="edit-icon"
                        className=" me-2 edit-icon"
                        onClick={(evt) => edit(item)}
                      ></img>
                      <i className="pe-7s-trash icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1"></i>
                    </Col>

                    <p className="mb-0 card-p-text-black">
                      {item.organization}
                      {", "}
                      {item.city}
                      {", "}
                      {item.state}
                      {", "}
                      {item.country}
                      {", "}
                      {item.zipCode}
                      {"  "}
                    </p>
                    <p className="card-p-text-black">
                      {item.fromDate}
                      {" to "}
                      {item.toDate}
                      {" ("}
                      {item.experience}
                      {")"}
                    </p>
                    <p className="card-p-text">{item.jobDescription}</p>
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
              View all {qualificationDetails.length} Details
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
                Add/Edit Work Experience
              </strong>
            </ModalHeader>
            <ModalBody>
              <QualificationModal onCallBack={handlePageChange} />
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}

      {editModal ? (
        <div>
          <Modal className="personal-information" size="lg" isOpen={editModal}>
            <ModalHeader toggle={editModal} charCode="Y">
              <strong className="card-title-text">Edit Qualification</strong>
            </ModalHeader>
            <ModalBody>
              <div>
                <Form onSubmit={handleSubmit(onSubmit)}>
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
                          value={selectedData.jobTitle}
                          className={`field-input placeholder-text form-control ${
                            errors.jobTitle ? "is-invalid" : ""
                          }`}
                          {...register("jobTitle")}
                        />
                        <div className="invalid-feedback">
                          {errors.jobTitle ? "Job Title is Required" : ""}
                        </div>
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label for="company" className="input-label">
                          Company
                        </Label>
                        <Input
                          placeholder="Enter Company"
                          name="company"
                          type="textarea"
                          id="company"
                          {...register("company")}
                          className="field-input placeholder-text form-control"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label for="jobDescription" className="input-label">
                          Job Description
                        </Label>
                        <Input
                          placeholder="Enter Job Description"
                          name="jobDescription"
                          type="textarea"
                          id="jobDescription"
                          {...register("jobDescription")}
                          className="field-input placeholder-text form-control"
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

                        <div className="invalid-feedback">
                          {errors.city?.message}
                        </div>
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

                        <div className="invalid-feedback">
                          {errors.state?.message}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup check>
                        <Input
                          name="currentlyWorking"
                          id="currentlyWorking"
                          {...register("currentlyWorking")}
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
                            {...register("toDate")}
                          />
                        </InputGroup>
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
                      onClick={() => setEditModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </Form>
              </div>
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
