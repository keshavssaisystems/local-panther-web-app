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
import addIcon from "../../assets/utils/images/add.svg";
import subtract from "../../assets/utils/images/Subtract 1.svg";

export function AdditionalInfoModal(props) {
  const dispatch = useDispatch();
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [summary, setSummary] = useState("");

  const loadData = function () {
    let data;

    if (!props.selected || props.selected?.summary === "") {
      data = {
        candidateadditioninformationid: 0,
        candidateid: userDetails.InternalUserId,
        summary: "",
        candidateLanguageDtos: [
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
        candidateLanguageDtos: props.selected.language,
        additionalinformation: props.selected.additionalInfo,
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
  const languageList = useSelector(
    (state) => state.ProficiencyList.languageList
  );

  const closeModal = function () {
    props.onCallAdditionalInfo();
  };

  const removeTabs = function (index) {
    let new_data = { ...formDetails };

    let temp_array = new_data.candidateLanguageDtos.map((item) => ({
      ...item,
    }));
    temp_array.splice(index, 1);
    new_data.candidateLanguageDtos = temp_array;
    setFormData(new_data);
  };

  const addMoreTabs = function (index) {
    let new_data = { ...formDetails };
    let temp_array = new_data.candidateLanguageDtos.map((item) => ({
      ...item,
      selected: false,
    }));
    const new_tab = {
      languageid: 0,
      language: "",
      proficiencyid: 0,
      proficiency: "",
    };
    temp_array.push(new_tab);
    new_data.candidateLanguageDtos = temp_array;

    setFormData(new_data);
  };

  const onHandleInputChange = function (check, data, index) {
    let new_data = { ...formDetails };
    if (check === "language") {
      // let language_details = [...new_data.candidateLanguageDtos];
      // language_details[index].language = data;
      // new_data.candidateLanguageDtos = language_details;

      let temp_array = new_data.candidateLanguageDtos.map((item) => ({
        ...item,
      }));
      temp_array[index].languageid = data;
      temp_array[index].language = languageList.find(
        (x) => x.id === parseInt(data)
      )?.name;
      new_data.candidateLanguageDtos = temp_array;
    } else if (check === "proficiency") {
      let temp_array = new_data.candidateLanguageDtos.map((item) => ({
        ...item,
      }));

      temp_array[index].proficiencyid = data;
      new_data.candidateLanguageDtos = temp_array;
    } else if (check === "summary") {
      new_data.summary = data;
      if (data !== "") {
        setFormError(false);
      } else {
        setFormError(true);
      }
    } else if (check === "additionalInfo") {
      new_data.additionalinformation = data;
    }
    setFormData(new_data);
  };
  const [formError, setFormError] = useState(false);

  const onSubmit = async function (e) {
    e.preventDefault();
    if (formDetails.summary === "") {
      setFormError(true);
      return;
    } else {
      setFormError(false);
    }

    let response;
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

  return (
    <div>
      <div>
        {formDetails ? (
          <Form>
            {formDetails?.candidateLanguageDtos?.map((item, index) => (
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="language" className="fw-semi-bold">
                      Language
                    </Label>
                    <Input
                      className="placeholder-text"
                      style={{
                        fontSize: "14px",
                      }}
                      type="select"
                      id="language"
                      name="language"
                      onChange={(evt) =>
                        onHandleInputChange("language", evt.target.value, index)
                      }
                      placeholderText="Select proficiency"
                    >
                      <option
                        className="placeholder-text"
                        style={{
                          fontSize: "14px",
                        }}
                        key={0}
                      >
                        Select language
                      </option>
                      {languageList?.map((col) => (
                        <option
                          selected={col.id == item.languageid}
                          key={col.id}
                          value={col.id}
                        >
                          {col.name}
                        </option>
                      ))}
                    </Input>
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
                  {index == formDetails?.candidateLanguageDtos.length - 1 ? (
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
                  {(index == formDetails?.candidateLanguageDtos?.length - 1 &&
                    index != 0) ||
                  index < formDetails?.candidateLanguageDtos?.length - 1 ? (
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
                <FormGroup>
                  <Label for="summary" className="fw-semi-bold">
                    Summary <span className="required-icon">*</span>
                  </Label>
                  <Input
                    style={{ height: "200px" }}
                    placeholder="Enter summary"
                    name="summary"
                    type="textarea"
                    id="summary"
                    maxLength={500}
                    value={formDetails.summary}
                    onInput={(evt) =>
                      onHandleInputChange("summary", evt.target.value)
                    }
                    className={`field-input placeholder-text form-control ${
                      formDetails.error ? "is-invalid" : ""
                    }`}
                  />
                  <span className="dropdown-placeholder float-end">
                    {formDetails.summary ? formDetails.summary.length : 0}/500
                  </span>
                </FormGroup>

                <div className="error-class">
                  {formError ? "Summary is required" : ""}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="state" className="fw-semi-bold">
                    Additional information
                  </Label>
                  <Input
                    style={{ height: "200px" }}
                    maxLength={500}
                    placeholder="Enter additional information"
                    name="state"
                    type="textarea"
                    value={formDetails.additionalinformation}
                    onInput={(evt) =>
                      onHandleInputChange("additionalInfo", evt.target.value)
                    }
                    id="state"
                    className="field-input placeholder-text form-control"
                  />
                  <span className="dropdown-placeholder float-end">
                    {formDetails.additionalinformation
                      ? formDetails.additionalinformation.length
                      : 0}
                    /500
                  </span>
                </FormGroup>
              </Col>
            </Row>

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

        <Modal className=" modal-reject-align profile-view" isOpen={error}>
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
