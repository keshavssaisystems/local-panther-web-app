import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { additionalInfoDetailsSlice } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import "./profile.scss";
import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import { CKEditor } from "ckeditor4-react";
import { BsFillPlusCircleFill, BsDashCircleFill } from "react-icons/bs";
import addIcon from "../../assets/utils/images/add.svg";
import subtract from "../../assets/utils/images/Subtract 1.svg";

export function AdditionalInfoModal(props) {
  const dispatch = useDispatch();
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [check, setCheck] = useState(props.check);
  const [isSave, setSave] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [summary, setSummary] = useState("");
  const [additionalInfo, setadditionalInfo] = useState("");

  const loadData = function () {
    let data;

    if (!props.selected) {
      data = {
        candidateadditioninformationid: 0,
        candidateid: userDetails.InternalUserId,
        summary: "",
        language: [
          {
            languageid: 0,
            language: "",
            proficiencyid: null,
            proficiency: "",
          },
        ],
        additionalinformation: "",
        isactive: true,
        currentUserId: userDetails.UserId,
      };
    } else {
      data = {
        candidateid: userDetails.InternalUserId,
        candidateadditioninformationid:
          props.selected.candidateadditioninformationid,
        summary: props.selected.summary,
        language: props.selected.language,
        additionalinformation: props.selected.additionalinformation,
        isactive: true,
        currentUserId: parseInt(userDetails.UserId),
      };
    }
    setFormData(data);
  };
  const [formDetails, setFormData] = useState({});
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
    let new_data = { ...formDetails };
    new_data.language.splice(index, 1);

    setFormData(new_data);
  };

  const addMoreTabs = function (index) {
    let new_data = { ...formDetails };

    const new_tab = {
      languageid: 0,
      language: "",
      proficiencyid: 0,
      proficiency: "",
    };
    new_data.language.push(new_tab);

    setFormData(new_data);
  };

  const onHandleInputChange = function (check, data, index) {
    let new_data = { ...formDetails };
    if (check == "language") {
      let language_details = [...new_data.language];
      language_details[index].language = data;
      new_data.language = language_details;
    } else if (check == "proficiency") {
      let language_details = [...new_data.language];
      language_details[index].proficiencyid = data;
      new_data.language = language_details;
    } else if (check == "summary") {
      setSummary(data);
      if (data != "") {
        setFormError(false);
      } else {
        setFormError(true);
      }
    } else if (check == "additionalInfo") {
      setadditionalInfo(data);
    }
    setFormData(new_data);
  };
  const [formError, setFormError] = useState(false);

  const onSubmit = async function (e) {
    e.preventDefault();
    if (summary == "") {
      setFormError(true);
      return;
    } else {
      setFormError(false);
    }

    let post_data = {
      candidateid: userDetails.InternalUserId,
      summary: summary,
      candidateLanguageDtos: formDetails.language,
      additionalinformation: additionalInfo,
      isactive: true,
      currentUserId: userDetails.UserId,
    };

    let response;
    formDetails.summary = summary;
    formDetails.additionalinformation = additionalInfo;
    response = await dispatch(
      additionalInfoDetailsSlice.addadditionalInfoThunk(formDetails)
    );

    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  };

  const selectDate = function () {};

  return (
    <div>
      <div>
        {formDetails ? (
          <Form>
            {/* {check == "add" ? (
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
            )} */}
            {formDetails?.language?.map((item, index) => (
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="language" className="fw-semi-bold">
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
                    <Label for="proficiency" className="fw-semi-bold">
                      Proficiency
                    </Label>
                    <Input
                      className="placeholder-text"
                      style={{
                        height: "35px",
                        color: "#afaba5",
                        fontSize: "14px",
                      }}
                      type="select"
                      id="proficiency"
                      name="proficiency"
                      onChange={(evt) =>
                        onHandleInputChange(
                          "proficiency",
                          evt.target.value,
                          index
                        )
                      }
                      placeholderText="Select proficiency"
                    >
                      <option
                        className="placeholder-text"
                        style={{
                          color: "#afaba5 !important",
                          fontSize: "14px",
                        }}
                        key={0}
                      >
                        Select proficiency
                      </option>
                      {proficiencyList?.map((col) => (
                        <option
                          selected={col.id == item.proficiencyid}
                          key={col.id}
                          value={col.id}
                        >
                          {col.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col>
                  {index == formDetails?.language.length - 1 ? (
                    <img
                      src={addIcon}
                      alt="add-icon"
                      style={{ marginTop: "15%" }}
                      className="me-2"
                      onClick={() => addMoreTabs()}
                    ></img>
                  ) : (
                    <></>
                  )}
                  {(index == formDetails?.language?.length - 1 && index != 0) ||
                  index < formDetails?.language?.length - 1 ? (
                    <img
                      src={subtract}
                      alt="add-icon"
                      style={{ marginTop: "15%" }}
                      className="me-2"
                      onClick={() => removeTabs(index)}
                    ></img>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            ))}

            <Row className="mb-2">
              <Col>
                {/* <FormGroup>
                  <Label for="summary" className="fw-semi-bold">
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
                </FormGroup> */}

                <FormGroup>
                  <Label for="description" className="fw-semi-bold">
                    Summary<span style={{ color: "red" }}>* </span>
                  </Label>
                  <CKEditor
                    name="description"
                    id="description"
                    maxLength={2000}
                    initData={formDetails.summary}
                    onChange={(e) => setSummary(e.editor.getData())}
                  />
                </FormGroup>

                <div className="error-class">
                  {formError ? "Summary is required" : ""}
                </div>
              </Col>
              {/* <Col md={6}>
                <FormGroup>
                  <Label for="state" className="fw-semi-bold">
                    Additional information
                  </Label>
                  <Input
                    style={{ height: "100px" }}
                    maxLength={500}
                    placeholder="Enter additional information"
                    name="state"
                    type="textarea"
                    value={item.additionalinformation}
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
              </Col> */}
            </Row>

            <Row>
              <FormGroup>
                <Label for="additionalInfo" className="fw-semi-bold">
                  Additional information
                </Label>
                <CKEditor
                  name="additionalInfo"
                  id="additionalInfo"
                  maxLength={500}
                  initData={formDetails.additionalinformation}
                  onChange={(e) => setadditionalInfo(e.editor.getData())}
                />
              </FormGroup>
            </Row>

            {/* {index < formDetails.length - 1 ? <hr /> : <></>}
            {index == formDetails.length - 1 ? ( */}
            <div className="float-end">
              <Button
                className="me-2 save-btn"
                type="button"
                onClick={(e) => onSubmit(e)}
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
          </Form>
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

        <Modal
          centered
          className=" modal-reject-align profile-view"
          isOpen={error}
        >
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
      </div>
    </div>
  );
}
