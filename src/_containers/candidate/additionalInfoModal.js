import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { additionalInfoDetailsSlice } from "_store";
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
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../_components/common/pagetitle";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { BsFillPlusCircleFill, BsDashCircleFill } from "react-icons/bs";

import DatePicker from "react-datepicker";
import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";

export function AdditionalInfoModal(props) {
  const dispatch = useDispatch();

  const [check, setCheck] = useState(props.check);
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [isSave, setSave] = useState(true);

  const loadData = function () {
    let data;
    if (check == "add") {
      data = [
        {
          candidateAdditionalInformationId: 0,
          summary: "",
          language: "",
          proficiencey: 0,
          additionalInfo: "",
        },
      ];
    } else {
      data = [
        {
          candidateAdditionalInformationId:
            props.selected.candidateAdditionalInformationId,
          summary: props.selected.summary,
          language: props.selected.language,
          proficiency: props.selected.proficiency,
          additionalInfo: props.selected.additionalInfo,
        },
      ];
    }
    // return data;
    setFormData(data);
  };
  const [formDetails, setFormData] = useState([]);
  useEffect(() => {
    loadData();
  }, []);

  const [proficiencyList, setProficiencyList] = useState(
    useSelector((state) => state.ProficiencyList.user.data)
  );
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
    window.location.reload();
  };

  const removeTabs = function (index) {
    let new_data = [...formDetails];

    new_data.language.splice(index, 1);

    setFormData(new_data);
  };

  const addMoreTabs = function (index) {
    let new_data = [...formDetails];
    if (new_data[index - 1].summary == "") {
      new_data[index - 1].error = true;
      setFormData(new_data);

      return;
    }

    const new_tab = {
      candidateAdditionalInformationId: 0,
      summary: "",
      language: "",
      proficiencey: 0,
      additionalInfo: "",
    };
    new_data.push(new_tab);

    setFormData(new_data);
    console.log(formDetails);
  };

  const onHandleInputChange = function (check, data, index) {
    let new_data = [...formDetails];
    if (check == "language") {
      new_data[index].language = data;
    } else if (check == "proficiency") {
      new_data[index].proficiency = data;
    } else if (check == "summary") {
      new_data[index].summary = data;
    } else if (check == "additionalInfo") {
      new_data[index].additionalInfo = data;
    }
    setFormData(new_data);
  };

  async function onSubmit() {
    const keyToCheck = "summary";

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
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    let filtered_data = formDetails.map((rest) => {
      return {
        candidateid: Number(userDetails.InternalUserId),
        summary: rest.summary,
        language: rest.language,
        proficiencyid: Number(rest.proficiency),
        additionalinformation: rest.additionalInfo,
        isactive: true,
        currentUserId: parseInt(userDetails.UserId),
      };
    });
    let response;
    if (check == "add") {
      response = await dispatch(
        additionalInfoDetailsSlice.addadditionalInfoThunk(filtered_data)
      );
    } else {
      response = await dispatch(
        additionalInfoDetailsSlice.updateadditionalInfoThunk({
          // id,
          filtered_data,
        })
      );
    }
  }
  const selectDate = function () {};

  return (
    <div>
      <div>
        {formDetails?.map((item, index) => (
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
                    onInput={(evt) =>
                      onHandleInputChange("language", evt.target.value, index)
                    }
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
                    onChange={(evt) =>
                      onHandleInputChange(
                        "proficiency",
                        evt.target.value,
                        index
                      )
                    }
                    placeholderText="Select Proficiency"
                  >
                    {proficiencyList.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              {/* <Col>
                {index == formDetails.language.length - 1 ? (
                  <BsFillPlusCircleFill
                    className="me-2"
                    onClick={() => addMoreTabs()}
                  />
                ) : (
                  <></>
                )}
                {(index == formDetails.language.length - 1 && index != 0) ||
                index < formDetails.language.length - 1 ? (
                  <BsDashCircleFill onClick={() => removeTabs(index)} />
                ) : (
                  <></>
                )}
              </Col> */}
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <FormGroup>
                  <Label for="summary" className="input-label">
                    Summary <span className="required-icon">*</span>
                  </Label>
                  <Input
                    style={{ height: "100px" }}
                    placeholder="Enter Summary"
                    name="summary"
                    type="textarea"
                    id="summary"
                    maxLength={500}
                    value={formDetails?.summary}
                    onInput={(evt) =>
                      onHandleInputChange("summary", evt.target.value, index)
                    }
                    className={`field-input placeholder-text form-control ${
                      item.error ? "is-invalid" : ""
                    }`}
                  />
                </FormGroup>
                <div className="error-class">
                  {item.error ? "Summary is required" : ""}
                </div>
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
                    value={formDetails?.additionalInfo}
                    onInput={(evt) =>
                      onHandleInputChange(
                        "additionalInfo",
                        evt.target.value,
                        index
                      )
                    }
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
        ))}
      </div>
    </div>
  );
}
