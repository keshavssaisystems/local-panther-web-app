import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { candidateActions } from "_store";
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
import Tabs from "react-responsive-tabs";
import { useDispatch } from "react-redux";
import PageTitle from "../../_components/common/pagetitle";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";

export function QualificationModal(props) {
  debugger;
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [isSave, setSave] = useState(true);

  let data = [
    {
      id: 0,
      jobTitle: "",
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

  const [tabs, setTabs] = useState([
    {
      id: 0,
    },
  ]);
  const [newTabId, setNewTabId] = useState(0);

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
    if (new_data[index - 1].jobTitle == "") {
      new_data[index - 1].error = true;
      setFormData(new_data);

      console.log(formDetails);
      return;
    }

    const newTab = {
      id: index,
      jobTitle: "",
      error: false,
    };
    setFormData([...formDetails, newTab]);
    console.log(formDetails);
  };

  // form validation rules
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
  const collectTitle = function (index, data) {
    let new_data = [...formDetails];

    new_data[index].jobTitle = data;
    new_data[index].error = false;
    setFormData(new_data);
    onSubmit();
  };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function onSubmit() {
    debugger;
    const keyToCheck = "jobTitle";

    const emptyKeyIndexes = formDetails
      .map((item, index) => (item[keyToCheck] == "" ? index : null))
      .filter((index) => index !== null);
    debugger;
    if (emptyKeyIndexes.length > 0) {
      let new_data = [...formDetails];

      for (let i = 0; i < emptyKeyIndexes.length; i++) {
        new_data[emptyKeyIndexes[i]].error = true;
      }

      setFormData(new_data);
      setSave(false);
    }
  }
  const selectDate = function () {};

  return (
    <div>
      {formDetails.map((item, index) => (
        <div>
          <Form id={index}>
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
                  <Label for="jobTitle" className="input-label">
                    Job Title <span className="required-icon">*</span>
                  </Label>
                  <input
                    placeholder="Enter Job Title"
                    name="jobTitle"
                    type="text"
                    id="jobTitle"
                    value={index.jobTitle}
                    className={`field-input placeholder-text form-control ${
                      item.error ? "is-invalid" : ""
                    }`}
                    onInput={(evt) => collectTitle(index, evt.target.value)}
                  />
                  <div className="invalid-feedback">
                    {item.error ? "Job Title is Required" : ""}
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

                  <div className="invalid-feedback">{errors.city?.message}</div>
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
                  onClick={() => props.onCallBack()}
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
    </div>
  );
}
