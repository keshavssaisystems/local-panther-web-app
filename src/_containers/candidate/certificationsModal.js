import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { certificateDetailsSlice } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  InputGroup,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import "./profile.scss";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";

export function CertificationsModal(props) {
  const dispatch = useDispatch();
  const [check, setCheck] = useState(props.check);

  const [typeList, setTypeList] = useState(
    useSelector((state) => state.certificateType.user.data)
  );
  const [isSave, setSave] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [formDetails, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = function () {
    let data;
    if (check == "add") {
      data = {
        candidatecertificationid: 0,
        candidateid: 0,
        certificationtypeid: 0,
        isexpired: true,
        startdate: "",
        enddate: "",
        description: "",
        isactive: true,
        currentUserId: 0,
        error: false,
        fromDateValid: false,
        fromDateReq: false,
      };
    } else {
      data = {
        id: 0,
        candidatecertificationid: props.selected.candidatecertificationid,
        candidateid: props.selected.candidateid,
        certificationtypeid: props.selected.certificationtypeid,
        isexpired: props.selected.isexpired,
        startdate: new Date(props.selected.startdate),
        enddate: new Date(props.selected.enddate),
        description: props.selected.description,
        isactive: props.selected.isactive,
        currentUserId: 0,
        error: false,
        certificationname: props.selected.certificationname,
        fromDateValid: false,
        fromDateReq: false,
      };
    }
    setFormData(data);
  };

  const closeModal = function () {
    props.onCallCertification();
  };

  // const removeTabs = function (index) {
  //   let new_data = {}...formDetails};
  //   new_data.splice(index, 1);
  //   setFormData(new_data);
  // };

  // const addMoreTabs = function (index) {
  //   let new_data = [...formDetails];
  //   if (new_data[index - 1].name == "") {
  //     new_data[index - 1].error = true;
  //     setFormData(new_data);

  //     return;
  //   }

  //   const newTab = {
  //     candidatecertificationid: 0,
  //     candidateid: 0,
  //     certificationtypeid: 0,
  //     isexpired: true,
  //     startdate: new Date(),
  //     enddate: new Date(),
  //     description: "",
  //     isactive: true,
  //     currentUserId: 0,
  //     error: false,
  //   };
  //   setFormData([...formDetails, newTab]);
  // };

  const onHandleInputChange = function (check, data) {
    let new_data = { ...formDetails };

    if (check == "certificateType") {
      new_data.certificationtypeid = data;
    } else if (check == "name") {
      new_data.certificationname = data;
      if (new_data.certificationname == "") {
        new_data.error = true;
      } else {
        new_data.error = false;
      }
    } else if (check == "expired") {
      new_data.isexpired = !new_data.isexpired;
    } else if (check == "description") {
      new_data.description = data;
    } else if (check == "fromdate") {
      if (new_data.enddate) {
        if (new Date(data) > new Date(new_data.enddate)) {
          new_data.fromDateValid = true;
        } else {
          new_data.fromDateValid = false;
          new_data.startdate = data;
        }
      } else {
        new_data.fromDateValid = false;
        new_data.startdate = data;
      }
    } else if (check == "todate") {
      new_data.enddate = data;

      if (new_data.startdate) {
        if (new Date(data) < new Date(new_data.startdate)) {
          new_data.fromDateValid = true;
        } else {
          new_data.fromDateValid = false;
          new_data.enddate = data;
        }
      } else {
        new_data.fromDateValid = false;
        new_data.enddate = data;
      }
    }
    setFormData(new_data);
  };

  async function onSubmit() {
    if (!formDetails.certificationname || formDetails.certificationname == "") {
      let new_data = { ...formDetails };

      new_data.error = true;

      setFormData(new_data);
      return;
    }

    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    let filtered_data = {
      candidateid: Number(userDetails.InternalUserId),
      certificationname: formDetails.certificationname,
      candidatecertificationid: formDetails.candidatecertificationid,
      certificationtypeid: formDetails.certificationtypeid,
      isexpired: formDetails.isexpired,
      startdate: formDetails.startdate
        ? formDetails.startdate.toISOString()
        : null,
      enddate: formDetails.startdate ? formDetails.enddate.toISOString() : null,
      description: formDetails.description,
      isactive: formDetails.isactive,
      currentUserId: parseInt(userDetails.UserId),
    };
    let response;
    let certification_data = filtered_data;
    let id = filtered_data.candidatecertificationid;

    if (check == "add") {
      response = await dispatch(
        certificateDetailsSlice.addcertificateThunk(certification_data)
      );
    } else {
      response = await dispatch(
        certificateDetailsSlice.updatecertificateThunk({
          id,
          certification_data,
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
  return (
    <div className="profile-view">
      {/* {formDetails.map((item, index) => ( */}
      <Form>
        {/* {check == "add" ? (
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
          )} */}
        {/* 
        <Row>
          {typeList.map((item) => (
            <Col>
              <FormGroup check>
                <Input
                  name="eligibility"
                  type="radio"
                  checked={item.id == formDetails.certificationtypeid}
                  onChange={(evt) =>
                    onHandleInputChange("certificateType", item.id)
                  }
                />
                <Label check className="input-label">
                  {item.name}
                </Label>
              </FormGroup>
            </Col>
          ))}
        </Row> */}

        <Row>
          <Col md={4}>
            <div>
              <FormGroup>
                <Label for={"experienceLevel"} className="input-label">
                  Certification type
                </Label>

                <Input
                  id={"eligibility"}
                  name={"eligibility"}
                  type={"select"}
                  onChange={(evt) =>
                    onHandleInputChange("certificateType", evt.target.value)
                  }
                >
                  <option key={0}>Select Certification Type</option>
                  {typeList?.length > 0 &&
                    typeList?.map((options) => (
                      <option
                        selected={options.id == formDetails.certificationtypeid}
                        key={options.id}
                        value={options.id}
                      >
                        {options.name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </div>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="certification" className="input-label">
                Certification/License
                <span className="required-icon"> *</span>
              </Label>
              <input
                placeholder="Enter Certification/license"
                maxLength={50}
                name="name"
                type="text"
                id="name"
                value={formDetails.certificationname}
                onInput={(evt) => onHandleInputChange("name", evt.target.value)}
                className={`field-input placeholder-text form-control ${
                  formDetails.error ? "is-invalid" : ""
                }`}
              />

              <div className="invalid-feedback">
                {formDetails.error ? "Certifications is required" : ""}
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup check>
              <Input
                name="immediateJoin"
                type="checkbox"
                checked={formDetails.isexpired}
                onInput={(evt) =>
                  onHandleInputChange("expired", evt.target.value)
                }
              />{" "}
              <Label check className="input-label">
                Does not expire
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mt-2 input-label">
          <Label>Time period</Label>

          <Col md={4}>
            <FormGroup>
              <InputGroup>
                <div className="input-group-text">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <DatePicker
                  name="fromdate"
                  id="fromdata"
                  className="form-control"
                  placeholderText="MM/DD/YYYY"
                  onSelect={(evt) => onHandleInputChange("fromdate", evt)}
                  selected={formDetails.startdate}
                  showYearDropdown={true}
                />
              </InputGroup>
              <div className="filter-info-text filter-error-msg">
                {formDetails.fromDateValid
                  ? "From Date should be less than To Date"
                  : ""}
              </div>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <InputGroup>
                <div className="input-group-text">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <DatePicker
                  name="todate"
                  id="todate"
                  className="form-control"
                  placeholderText="MM/DD/YYYY"
                  selected={formDetails.enddate}
                  showYearDropdown={true}
                  onSelect={(evt) => onHandleInputChange("todate", evt)}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        {/* {index < formDetails.length - 1 ? <hr /> : <></>} */}
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
      </Form>
      {/* ))} */}
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
  );
}
