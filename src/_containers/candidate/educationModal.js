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

export function EducationModal(props) {
  const [check, setCheck] = useState(props.check);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [isSave, setSave] = useState(true);
  const [formDetails, setFormData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = function () {
    let data = [];
    if (check == "add") {
      data.push({
        id: 0,
        educationLevel: "",
        error: false,
      });
    } else {
      data.push({
        id: 0,
        educationLevel: props.selected.educationLevel,
        error: false,
      });
    }
    setFormData(data);
  };

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

  const closeModal = function () {
    let data = [
      {
        id: 0,
        educationLevel: "",
        error: false,
      },
    ];
    setFormData(data);
    props.onCallBack();
  };

  const removeTabs = function (index) {
    let new_data = [...formDetails];
    new_data.splice(index, 1);
    setFormData(new_data);
  };
  const handleChange = function (index, data) {
    let new_data = [...formDetails];

    new_data[index].educationLevel = data;
    new_data[index].error = false;
    setFormData(new_data);
    onSubmit();
  };

  const addMoreTabs = function (index) {
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

  // form validation rules

  const collectTitle = function (index, data) {
    let new_data = [...formDetails];

    new_data[index].jobTitle = data;
    new_data[index].error = false;
    setFormData(new_data);
    // onSubmit();
  };

  function onSubmit() {
    const keyToCheck = "educationLevel";

    // const emptyKeyIndexes = formDetails
    //   .map((item, index) => (item[keyToCheck] == "" ? index : null))
    //   .filter((index) => index !== null);
    //
    // if (emptyKeyIndexes.length > 0) {
    //   let new_data = [...formDetails];

    //   for (let i = 0; i < emptyKeyIndexes.length; i++) {
    //     new_data[emptyKeyIndexes[i]].error = true;
    //   }

    // }
    let new_data = [...formDetails];
    setFormData(new_data);
    setSave(false);
  }

  const selectDate = function () {};

  return (
    <div>
      {formDetails.map((item, index) => (
        <Form>
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
                <Label for="educationLevel" className="input-label">
                  Level of Education
                  <span className="required-icon"> *</span>
                </Label>
                <input
                  placeholder="Enter Level of Education"
                  name="educationLevel"
                  type="text"
                  id="educationLevel"
                  maxLength={50}
                  value={formDetails[index].educationLevel}
                  onInput={(evt) => handleChange(index, evt.target.value)}
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
                  maxLength={50}
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
                  maxLength={50}
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
                  maxLength={50}
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
                  maxLength={50}
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
                    className="field-input placeholder-text form-control"
                    placeholderText="DD/MM/YYYY"
                    selected={fromDate}
                    onChange={(evt) => selectDate()}
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
                onClick={() => closeModal()}
              >
                Close
              </Button>
            </div>
          ) : (
            <></>
          )}
        </Form>
      ))}
    </div>
  );
}
