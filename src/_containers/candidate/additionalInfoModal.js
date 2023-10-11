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
import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";

export function AdditionalInfoModal(props) {
  const dispatch = useDispatch();

  const [check, setCheck] = useState(props.check);
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [isSave, setSave] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const loadData = function () {
    let data;

    if (!props.selected) {
      data = [
        {
          candidateadditioninformationid: 0,
          candidateid: 0,
          summary: "",
          language: "",
          proficiencyid: null,
          proficiency: "",
          additionalinformation: "",
          isactive: true,
        },
      ];
    } else {
      data = [
        {
          candidateadditioninformationid:
            props.selected.candidateadditioninformationid,
          summary: props.selected.summary,
          language: props.selected.language,
          proficiencyid: props.selected.proficiencyid,
          proficiency: props.selected.proficiency,
          additionalinformation: props.selected.additionalinformation,
          isactive: true,
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
    // let data = [
    //   {
    //     id: 0,
    //     summary: "",
    //     language: "",
    //     proficiency: "",
    //     additionalInfo: "",
    //   },
    // ];
    // setFormData(data);
    // window.location.reload();
    props.onCallAdditionalInfo();
  };

  const removeTabs = function (index) {
    let new_data = [...formDetails];

    new_data.splice(index, 1);

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
  };

  const onHandleInputChange = function (check, data, index) {
    let new_data = [...formDetails];
    if (check == "language") {
      new_data[index].language = data;
    } else if (check == "proficiency") {
      new_data[index].proficiency = data;
    } else if (check == "summary") {
      new_data[index].summary = data;
      if (data != "") {
        new_data[index].error = false;
      } else {
        new_data[index].error = true;
      }
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
        candidateadditioninformationid: rest.candidateadditioninformationid,
        candidateid: Number(userDetails.InternalUserId),
        summary: rest.summary,
        language: rest.language,
        proficiencyid: Number(rest.proficiency),
        additionalinformation: rest.additionalInfo ? rest.additionalInfo : "",
        isactive: true,
        currentUserId: parseInt(userDetails.UserId),
        isactive: true,
      };
    });
    let response;
    if (check == "add") {
      response = await dispatch(
        additionalInfoDetailsSlice.addadditionalInfoThunk(filtered_data)
      );
    } else {
      let id = filtered_data[0].candidateadditioninformationid;
      let additional_info = filtered_data[0];
      response = await dispatch(
        additionalInfoDetailsSlice.updateadditionalInfoThunk({
          id,
          additional_info,
        })
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
      <div>
        {formDetails?.map((item, index) => (
          <Form>
            {check == "add" ? (
              <Row>
                <Col>
                  <div className="float-end">
                    {formDetails.length > 1 ? (
                      <Label
                        className="me-2"
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
                      <></>
                    )}
                    {index == formDetails.length - 1 ? (
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
                    ) : (
                      <></>
                    )}
                  </div>
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
                    placeholder="Enter language"
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
                    placeholderText="Select proficiency"
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
                    placeholder="Enter summary"
                    name="summary"
                    type="textarea"
                    id="summary"
                    maxLength={500}
                    value={item.summary}
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
                    Additional information
                  </Label>
                  <Input
                    style={{ height: "100px" }}
                    maxLength={500}
                    placeholder="Enter additional information"
                    name="state"
                    type="textarea"
                    value={item.additionalInfo}
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
    </div>
  );
}
