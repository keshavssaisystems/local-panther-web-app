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

export function AdditionalInfoModal(props) {
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
        summary: "",
        language: "",
        proficiency: "",
        additionalInfo: "",
      });
    } else {
      data.push({
        id: 0,
        summary: props.selected.summary,
        language: props.selected.language,
        proficiency: props.selected.proficiency,
        additionalInfo: props.selected.additionalInfo,
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
        summary: "",
        language: "",
        proficiency: "",
        additionalInfo: "",
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

  const addMoreTabs = function (index) {
    const newTab = {
      id: index,
      summary: "",
      language: "",
      proficiency: "",
      additionalInfo: "",
    };
    setFormData([...formDetails, newTab]);
    console.log(formDetails);
  };

  function onSubmit() {
    // const keyToCheck = "jobTitle";

    // const emptyKeyIndexes = formDetails
    //   .map((item, index) => (item[keyToCheck] == "" ? index : null))
    //   .filter((index) => index !== null);
    //
    // if (emptyKeyIndexes.length > 0) {

    // }

    let new_data = [...formDetails];

    setFormData(new_data);
    setSave(false);
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
                  <Label for="language" className="input-label">
                    Language
                  </Label>
                  <input
                    placeholder="Enter Language"
                    name="language"
                    type="text"
                    id="language"
                    maxLength={50}
                    value={item.language}
                    className="field-input placeholder-text form-control"
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="proficiency" className="input-label">
                    Proficiency
                  </Label>
                  <Input
                    className="reason-dropdown-input dropdown-placeholder"
                    type="select"
                    id="proficiency"
                    name="proficiency"
                    value={item.proficiency}
                    placeholderText="Select Proficiency"
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
            <Row className="mb-2">
              <Col md={6}>
                <FormGroup>
                  <Label for="summary" className="input-label">
                    Summary
                  </Label>
                  <Input
                    style={{ height: "100px" }}
                    placeholder="Enter Summary"
                    name="summary"
                    type="textarea"
                    id="summary"
                    maxLength={500}
                    value={item.summary}
                    className="field-input placeholder-text form-control"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="state" className="input-label">
                    Additional Information
                  </Label>
                  <Input
                    style={{ height: "100px" }}
                    maxLength={500}
                    placeholder="Enter Additional Information"
                    name="state"
                    type="textarea"
                    value={item.additionalInfo}
                    id="state"
                    className="field-input placeholder-text form-control"
                  />
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
    </div>
  );
}
