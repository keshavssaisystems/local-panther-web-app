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
import {
  formatDate,
  extractDatePart,
  convertDateToYYYMMDD,
  checkDateValidation,
} from "_helpers/helper";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import "./profile.scss";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { CKEditor } from "ckeditor4-react";

import DatePicker from "react-datepicker";

export function CertificationsModal(props) {
  const dispatch = useDispatch();
  const [check, setCheck] = useState(props.check);
  const [summary, setSummary] = useState("");

  const [typeList, setTypeList] = useState(
    useSelector((state) => state.certificateType.user.data)
  );
  let desc_temp;
  const [isSave, setSave] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [formDetails, setFormData] = useState({});
  const [monthList, setMonthList] = useState(
    useSelector((state) => state.monthList.user.data)
  );
  const [yearList, setYearList] = useState(
    useSelector((state) => state.yearList.user.data)
  );
  const [fromDateSelect, setFromDateSelect] = useState({
    month: "",
    year: "",
  });
  const [toDateSelect, setToDateSelect] = useState({
    month: "",
    year: "",
  });

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
        isexpired: false,
        startdate: "",
        enddate: "",
        description: "",
        isactive: true,
        currentUserId: 0,
        error: false,
        typeError: false,
        fromDateValid: false,
        fromDateReq: false,
        fromMonthReq: false,
        toMonthReq: false,
        fromYearReq: false,
        toYearReq: false,
        toDateReq: false,
      };
    } else {
      data = {
        id: 0,
        candidatecertificationid: props.selected.candidatecertificationid,
        candidateid: props.selected.candidateid,
        certificationtypeid: props.selected.certificationtypeid,
        isexpired: props.selected.isexpired,
        startdate: props.selected.startdate
          ? extractDatePart(props.selected.startdate)
          : null,
        enddate: props.selected.enddate
          ? extractDatePart(props.selected.enddate)
          : null,
        description: props.selected.description,
        isactive: props.selected.isactive,
        currentUserId: 0,
        error: false,
        certificationname: props.selected.certificationname,
        fromDateValid: false,
        fromDateReq: false,
        typeError: false,
        fromMonthReq: false,
        toMonthReq: false,
        fromYearReq: false,
        toYearReq: false,
        toDateReq: false,
      };

      if (props.selected.startdate) {
        let year = new Date(props.selected.startdate).getFullYear();
        let selectedYear = yearList?.find((x) => x.name == Number(year))?.name;

        let fromSelected = { ...fromDateSelect };
        fromSelected.month = Number(
          new Date(props.selected.startdate).getMonth() + 1
        );
        fromSelected.year = selectedYear;
        setFromDateSelect(fromSelected);
      }
      if (props.selected.enddate) {
        let year = new Date(props.selected.enddate).getFullYear();
        let selectedYear = yearList?.find((x) => x.name == Number(year))?.name;

        let toSelected = { ...toDateSelect };
        toSelected.month = Number(
          new Date(props.selected.enddate).getMonth() + 1
        );
        toSelected.year = selectedYear;
        setToDateSelect(toSelected);
      }
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
    if (check === "certificateType") {
      new_data.certificationtypeid = data;
      new_data.typeError = false;
    } else if (check === "name") {
      new_data.certificationname = data;
      if (new_data.certificationname == "") {
        new_data.error = true;
      } else {
        new_data.error = false;
      }
    } else if (check === "expired") {
      new_data.isexpired = !new_data.isexpired;

      if (new_data.expired) {
        let date = { ...toDateSelect };
        date.year = "";
        date.month = "";
        setToDateSelect(date);
      }
    } else if (check === "description") {
      new_data.description = data;
    } else if (check === "fromYear") {
      let date = { ...fromDateSelect };
      if (data === "Select year") {
        date.year = "";
        if (date.month === "" || !date.month) {
          new_data.fromYearReq = false;
          new_data.fromMonthReq = false;
        } else {
          new_data.fromYearReq = true;
        }
      } else {
        new_data.fromYearReq = false;
        if (date.month === "" || !date.month) {
          new_data.fromMonthReq = true;
        }
        date.year = yearList?.find((x) => x.id == Number(data))?.name;
      }
      let validData = {
        fromDateSelect: date,
        toDateSelect: toDateSelect,
      };
      new_data.fromDateValid = checkDateValidation(validData);

      setFromDateSelect(date);
    } else if (check === "toYear") {
      let date = { ...toDateSelect };

      if (data === "Select year") {
        date.year = "";
        if (date.month === "" || !date.month) {
          new_data.toYearReq = false;
          new_data.toMonthReq = false;
        } else {
          new_data.toYearReq = true;
        }
      } else {
        new_data.toYearReq = false;
        if (date.month === "" || !date.month) {
          new_data.toMonthReq = true;
        }
        date.year = yearList?.find((x) => x.id == Number(data))?.name;
      }
      let validData = {
        fromDateSelect: fromDateSelect,
        toDateSelect: date,
      };
      new_data.fromDateValid = checkDateValidation(validData);
      setToDateSelect(date);
    } else if (check === "fromMonth") {
      let date = { ...fromDateSelect };
      if (data === "Select month") {
        date.month = "";
        if (date.year === "" || !date.year) {
          new_data.fromYearReq = false;
          new_data.fromMonthReq = false;
        } else {
          new_data.fromMonthReq = true;
        }
      } else {
        new_data.fromMonthReq = false;
        if (date.year === "" || !date.year) {
          new_data.fromYearReq = true;
        }
        date.month = monthList?.find((x) => x.id == Number(data))?.name;
      }
      let validData = {
        fromDateSelect: date,
        toDateSelect: toDateSelect,
      };
      new_data.fromDateValid = checkDateValidation(validData);
      setFromDateSelect(date);
    } else if (check === "toMonth") {
      let date = { ...toDateSelect };

      if (data === "Select month") {
        if (date.year === "" || !date.year) {
          new_data.toYearReq = false;
          new_data.toMonthReq = false;
        } else {
          new_data.toMonthReq = true;
        }
        date.month = "";
      } else {
        new_data.toMonthReq = false;
        if (date.year === "" || !date.year) {
          new_data.toYearReq = true;
        }
        date.month = monthList?.find((x) => x.id == Number(data))?.name;
      }
      let validData = {
        fromDateSelect: fromDateSelect,
        toDateSelect: date,
      };
      new_data.fromDateValid = checkDateValidation(validData);
      setToDateSelect(date);
    }
    setFormData(new_data);
  };

  async function onSubmit() {
    let valid = true;
    let new_data = { ...formDetails };
    if (
      !formDetails.certificationname ||
      formDetails.certificationname === ""
    ) {
      new_data.error = true;
      valid = false;
    }
    if (formDetails.certificationtypeid === 0) {
      new_data.typeError = true;
      valid = false;
    }

    if (formDetails.isexpired) {
      if (
        formDetails.fromMonthReq ||
        formDetails.fromYearReq ||
        formDetails.toMonthReq ||
        formDetails.toYearReq
      ) {
        valid = false;
      }
    } else {
      if (formDetails.fromMonthReq || formDetails.fromYearReq) {
        valid = false;
      }
    }

    if (formDetails.fromDateValid) {
      valid = false;
    }

    setFormData(new_data);
    if (!valid) {
      return;
    }

    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    let filtered_data = {
      candidateid: Number(userDetails.InternalUserId),
      certificationname: formDetails.certificationname,
      candidatecertificationid: formDetails.candidatecertificationid,
      certificationtypeid: formDetails.certificationtypeid,
      isexpired: formDetails.isexpired,
      startdate: convertDateToYYYMMDD(fromDateSelect),
      enddate: convertDateToYYYMMDD(toDateSelect),
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
    <div className="profile-view react-date-picker-profile">
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
                <Label check className="fw-semi-bold">
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
                <Label for={"experienceLevel"} className="fw-semi-bold">
                  Certification type <span className="required-icon"> *</span>
                </Label>

                <Input
                  id={"eligibility"}
                  name={"eligibility"}
                  type={"select"}
                  onChange={(evt) =>
                    onHandleInputChange("certificateType", evt.target.value)
                  }
                  className={`form-control ${
                    formDetails.typeError ? "is-invalid" : ""
                  }`}
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
                <div className="invalid-feedback">
                  {formDetails.typeError
                    ? "Certification type is required"
                    : ""}
                </div>
              </FormGroup>
            </div>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="certification" className="fw-semi-bold">
                Certification/License
                <span className="required-icon"> *</span>
              </Label>
              <input
                placeholder="Enter certification/license"
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
              <Label check className="fw-semi-bold">
                Does not expire
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mt-2">
          <Label>Time period</Label>
        </Row>
        <Row className="mt-2 fw-semi-bold">
          <Label for="fromDate" className="fw-semi-bold">
            From
          </Label>
          <Col md={4}>
            <FormGroup>
              <Input
                id={"monthList"}
                name={"monthList"}
                type={"select"}
                onChange={(evt) =>
                  onHandleInputChange("fromMonth", evt.target.value)
                }
                className={`form-control ${
                  formDetails.fromMonthReq || formDetails.fromDateValid
                    ? "is-invalid"
                    : ""
                }`}
              >
                <option key={0}>Select month</option>
                {monthList?.length > 0 &&
                  monthList?.map((options) => (
                    <option
                      selected={options.id == fromDateSelect.month}
                      key={options.id}
                      value={options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>

              <div className="filter-info-text filter-error-msg">
                {formDetails.fromMonthReq ? "Month is required" : ""}
              </div>

              <div className="filter-info-text filter-error-msg">
                {formDetails.fromDateValid && !formDetails.fromMonthReq
                  ? "From date should be less than to date"
                  : ""}
              </div>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <InputGroup>
                <Input
                  id={"yearList"}
                  name={"yearList"}
                  type={"select"}
                  onChange={(evt) =>
                    onHandleInputChange("fromYear", evt.target.value)
                  }
                  className={`form-control ${
                    formDetails.fromYearReq || formDetails.fromDateValid
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option key={0}>Select year</option>
                  {yearList?.length > 0 &&
                    yearList?.map((options) => (
                      <option
                        selected={options.name == fromDateSelect.year}
                        key={options.id}
                        value={options.id}
                      >
                        {options.name}
                      </option>
                    ))}
                </Input>
              </InputGroup>
              <div className="filter-info-text filter-error-msg">
                {formDetails.fromYearReq ? "Year is required" : ""}
              </div>
              <div className="filter-info-text filter-error-msg">
                {formDetails.fromDateValid && !formDetails.fromYearReq
                  ? "From date should be less than to date"
                  : ""}
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Label for="fromDate" className="fw-semi-bold">
            To
          </Label>
          <Col md={4}>
            <FormGroup>
              <Input
                id={"monthList"}
                name={"monthList"}
                type={"select"}
                onChange={(evt) =>
                  onHandleInputChange("toMonth", evt.target.value)
                }
                disabled={formDetails.isexpired}
                className={`form-control ${
                  formDetails.toMonthReq ? "is-invalid" : ""
                }`}
              >
                <option key={0}>Select month</option>
                {monthList?.length > 0 &&
                  monthList?.map((options) => (
                    <option
                      selected={options.id == toDateSelect.month}
                      key={options.id}
                      value={options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>
              <div className="filter-info-text filter-error-msg">
                {formDetails.toMonthReq ? "Month is required" : ""}
              </div>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Input
                id={"yearList"}
                name={"yearList"}
                type={"select"}
                onChange={(evt) =>
                  onHandleInputChange("toYear", evt.target.value)
                }
                disabled={formDetails.isexpired}
                className={`form-control ${
                  formDetails.toYearReq ? "is-invalid" : ""
                }`}
              >
                <option key={0}>Select year</option>
                {yearList?.length > 0 &&
                  yearList?.map((options) => (
                    <option
                      selected={options.name == toDateSelect.year}
                      key={options.id}
                      value={options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>
              <div className="filter-info-text filter-error-msg">
                {formDetails.toYearReq ? "Year is required" : ""}
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <FormGroup>
            <Label for="summary" className="fw-semi-bold">
              Description
            </Label>
            <Input
              style={{ height: "200px" }}
              placeholder="Enter summary"
              name="summary"
              type="textarea"
              id="summary"
              maxLength={500}
              value={formDetails.description}
              onInput={(evt) =>
                onHandleInputChange("description", evt.target.value)
              }
            />
            <span className="dropdown-placeholder float-end">
              {formDetails.description ? formDetails.description.length : 0}/500
            </span>
          </FormGroup>
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
  );
}
