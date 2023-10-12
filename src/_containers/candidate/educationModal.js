import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { getLocationFilter, educationDetailsSlice } from "_store";
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

import "./profile.scss";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { formatDate, extractDatePart } from "_helpers/helper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import AsyncSelect from "react-select/async";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";

export function EducationModal(props) {
  const [check, setCheck] = useState(props.check);
  const [formDetails, setFormData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const studyFieldList = useSelector(
    (state) => state.getStudyField.studyFieldList
  );

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);

  const [educationList, setEducationList] = useState(
    useSelector((state) => state.educationLevelReducer.educationList)
  );

  const loadData = function () {
    let data = [];
    if (check == "add") {
      data.push({
        candidateeducationid: 0,
        error: false,
        education: {
          value: 0,
          label: "",
        },

        candidateid: 0,

        fieldofstudy: {
          value: 0,
          label: "",
        },
        school: "",
        city: [
          {
            value: 0,
            label: "",
          },
        ],
        state: [
          {
            value: 0,
            label: "",
          },
        ],
        country: [
          {
            value: 0,
            label: "",
          },
        ],
        iscurrentlystudying: false,
        startdate: "",
        enddate: "",
        isactive: false,
        fromDateValid: false,
        fromDateReq: false,
        currentUserId: null,
      });
    } else {
      data.push({
        error: false,
        candidateeducationid: props.selected.candidateeducationid,
        education: {
          value: props.selected.candidateeducationid,
          label: props.selected.levelofeducation,
        },

        candidateid: 0,

        fieldofstudy: {
          value: props.selected.fieldofstudyid,
          label: props.selected.fieldofstudy,
        },
        school: props.selected.school,
        city: {
          value: props.selected.cityid,
          label: props.selected.cityname,
        },

        state: {
          value: props.selected.stateid,
          label: props.selected.statename,
        },

        country: {
          value: props.selected.countryid,
          label: props.selected.countryname,
        },
        iscurrentlystudying: props.selected.iscurrentlystudying,
        startdate:
          props.selected.startdate != "" && props.selected.startdate
            ? extractDatePart(props.selected.startdate)
            : null,
        enddate:
          props.selected.enddate != "" && props.selected.enddate
            ? extractDatePart(props.selected.enddate)
            : null,
        isactive: props.selected.isactive,
        currentUserId: null,
        fromDateValid: false,
        fromDateReq: false,
      });
      loadOptions(props.selected.cityname.slice(0, 3));
    }
    setFormData(data);
  };
  useEffect(() => {
    if (cityList?.length > 0) {
      let country_response;
      let state_response;
      country_response = cityList.map(({ countryid: value, ...rest }) => {
        return {
          value,
          label: `${rest.countryname}`,
        };
      });
      state_response = cityList.map(({ stateid: value, ...rest }) => {
        return {
          value,
          label: `${rest.statename}`,
        };
      });

      let data = [];
      if (country_response.length > 0) {
        data = Array.from(new Set(country_response.map((item) => item.id))).map(
          (id) => {
            return country_response.find((item) => item.id === id);
          }
        );

        // data.push(country_response[0]);
        setCountryList(data);
      } else {
        setCountryList(data);
      }

      setStateList(state_response);
    }
  }, [cityList]);

  const closeModal = function () {
    props.onCallEducation();
    // window.location.reload();
  };

  const removeTabs = function (index) {
    let new_data = [...formDetails];
    new_data.splice(index, 1);
    setFormData(new_data);
  };

  const loadOptions = async function (inputValue) {
    // if (inputValue.length > 2) {
    if (inputValue != "") {
      const { data = [] } = await getLocationFilter(inputValue);
      setCityList(data);

      let location_data = data.map(({ cityid: value, ...rest }) => {
        return {
          value,
          label: `${rest.location + ", " + rest.statename}`,
        };
      });
      setSelectedLocation(location_data);
      return location_data;
    }
  };

  const addMoreTabs = function (index) {
    let new_data = [...formDetails];
    if (new_data[index - 1].education.value == 0) {
      new_data[index - 1].error = true;
      setFormData(new_data);
      return;
    }

    const newTab = {
      candidateeducationid: 0,
      error: false,
      education: {
        value: 0,
        label: "",
      },

      candidateid: 0,

      fieldofstudy: {
        value: 0,
        label: "",
      },
      school: "",
      city: [
        {
          value: 0,
          label: "",
        },
      ],
      state: [
        {
          value: 0,
          label: "",
        },
      ],
      country: [
        {
          value: 0,
          label: "",
        },
      ],
      iscurrentlystudying: false,
      startdate: null,
      enddate: null,
      isactive: false,
      currentUserId: null,
    };
    new_data.push(newTab);

    setFormData(new_data);
  };

  const onHandleInputChange = function (check, data, index) {
    let new_data = [...formDetails];
    let dropdown = {
      value: 0,
      label: "",
    };
    if (check == "levelofeducation") {
      dropdown.value = data.value;
      dropdown.label = data.label;

      new_data[index].education = dropdown;
    } else if (check == "studyField") {
      dropdown.value = data.value;
      dropdown.label = data.label;
      new_data[index].fieldofstudy = dropdown;
    } else if (check == "school") {
      new_data[index].school = data;
    } else if (check == "city") {
      dropdown.value = data.value;
      dropdown.label = data.label;
      new_data[index].city = dropdown;

      let obj_new = {
        value: cityList.find((x) => x.cityid == data.value)?.stateid,
        label: cityList.find((x) => x.cityid == data.value)?.statename,
      };
      new_data[index].state = obj_new;
    } else if (check == "state") {
      dropdown.value = data.value;
      dropdown.label = data.label;
      new_data[index].state = dropdown;
    } else if (check == "country") {
      dropdown.value = data.value;
      dropdown.label = data.label;

      new_data[index].country = dropdown;
    } else if (check == "currentlyStudying") {
      new_data[index].iscurrentlystudying =
        !new_data[index].iscurrentlystudying;

      if (new_data[index].iscurrentlystudying) {
        if (new_data[index].startdate) {
          if (new Date(data) < new Date(new_data[index].startdate)) {
            new_data[index].fromDateValid = true;
          } else {
            new_data[index].fromDateValid = false;
            new_data[index].enddate = extractDatePart(new Date());
          }
        } else {
          new_data[index].fromDateValid = false;
          new_data[index].enddate = extractDatePart(new Date());
        }
      }
    } else if (check == "fromdate") {
      if (new_data[index].enddate) {
        if (new Date(data) > new Date(new_data[index].enddate)) {
          new_data[index].fromDateValid = true;
        } else {
          new_data[index].fromDateValid = false;
          new_data[index].startdate = extractDatePart(data);
        }
      } else {
        new_data[index].fromDateValid = false;
        new_data[index].startdate = extractDatePart(data);
      }
    } else if (check == "todate") {
      new_data[index].enddate = data;

      if (new_data[index].startdate) {
        if (new Date(data) < new Date(new_data[index].startdate)) {
          new_data[index].fromDateValid = true;
        } else {
          new_data[index].fromDateValid = false;
          new_data[index].enddate = extractDatePart(data);
        }
      } else {
        new_data[index].fromDateValid = false;
        new_data[index].enddate = extractDatePart(data);
      }
    }
    setFormData(new_data);
  };
  async function onSubmit() {
    let error_data = [...formDetails];
    for (let i = 0; i < formDetails.length; i++) {
      if (formDetails[i].education.label == "") {
        error_data[i].error = true;
        setFormData(error_data);
        return;
      }
    }

    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    let filtered_data = formDetails.map(({ skillid: value, ...rest }) => {
      return {
        candidateeducationid: rest.candidateeducationid,
        candidateid: Number(userDetails.InternalUserId),
        levelofeducation: rest.education.label,
        fieldofstudy: rest.fieldofstudy?.label,
        school: rest.school,
        countryid: rest.country.value,
        cityid: rest.city.value,
        stateid: rest.state.value,
        iscurrentlystudying: rest.iscurrentlystudying,
        startdate:
          rest.startdate && rest.startdate != "" ? rest.startdate : null,
        enddate: rest.enddate && rest.enddate != "" ? rest.enddate : null,
        isactive: true,
        currentUserId: parseInt(userDetails.UserId),
      };
    });

    let response;
    let education_data = filtered_data[0];
    let id = filtered_data[0].candidateeducationid;
    if (check == "add") {
      response = await dispatch(
        educationDetailsSlice.addEducationThunk(filtered_data)
      );
    } else {
      response = await dispatch(
        educationDetailsSlice.updateEducationThunk({
          id,
          education_data,
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
      {formDetails.map((item, index) => (
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
                <Label for="levelofeducation" className="input-label">
                  Level of education
                  <span className="required-icon"> *</span>
                </Label>

                <AsyncSelect
                  placeholder="Select..."
                  name="levelofeducation"
                  defaultOptions={educationList}
                  isMulti={false}
                  value={item.education.value == 0 ? [] : item.education}
                  className="location-dropdown-education"
                  onChange={(evt) =>
                    onHandleInputChange("levelofeducation", evt, index, index)
                  }
                />

                <div className="filter-info-text filter-error-msg">
                  {item.error ? "Level of education is required" : ""}
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              {/* <FormGroup>
                <Label for="studyField" className="input-label">
                  Field of study
                </Label>
                <input
                  placeholder="Enter field of study"
                  name="studyField"
                  type="text"
                  id="studyField"
                  maxLength={50}
                  value={item.fieldofstudy}
                  onInput={(evt) =>
                    onHandleInputChange("studyField", evt.target.value, index)
                  }
                  className="field-input placeholder-text form-control"
                />
              </FormGroup> */}
              <div>
                <FormGroup>
                  <Label for={"studyField"} className="input-label">
                    Field of study
                  </Label>
                  <AsyncSelect
                    placeholder="Select..."
                    name="studyField"
                    defaultOptions={studyFieldList}
                    isMulti={false}
                    value={
                      item.fieldofstudy?.value == 0 ? [] : item.fieldofstudy
                    }
                    className="location-dropdown-education"
                    onChange={(evt) =>
                      onHandleInputChange("studyField", evt, index, index)
                    }
                  />
                </FormGroup>
              </div>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="school" className="input-label">
                  School
                </Label>
                <input
                  placeholder="Enter school"
                  name="school"
                  type="text"
                  id="school"
                  maxLength={50}
                  value={item.school}
                  onInput={(evt) =>
                    onHandleInputChange("school", evt.target.value, index)
                  }
                  className="field-input placeholder-text form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="city" className="input-label">
                  City, State
                </Label>
                <AsyncSelect
                  name="skills"
                  placeholder="Search to select"
                  loadOptions={loadOptions}
                  isMulti={false}
                  className="location-dropdown"
                  value={!item.city.value ? [] : item.city}
                  defaultOptions={selectedLocation}
                  onChange={(evt) => onHandleInputChange("city", evt, index)}
                />
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="country" className="input-label">
                  Country
                </Label>
                <AsyncSelect
                  name="country"
                  placeholder="Select"
                  defaultOptions={countryList}
                  isMulti={false}
                  value={!item.country.value ? [] : item.country}
                  onChange={(evt) => onHandleInputChange("country", evt, index)}
                />
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
                  checked={item.iscurrentlystudying}
                  onChange={(evt) =>
                    onHandleInputChange(
                      "currentlyStudying",
                      evt.target.value,
                      index
                    )
                  }
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
                    autoComplete="off"
                    id="fromDate"
                    dateFormat="MM/yyyy"
                    placeholderText="MM/YYYY"
                    showMonthYearPicker
                    scrollableYearDropdown
                    selected={
                      item.startdate ? new Date(item.startdate) : item.startdate
                    }
                    className="form-control"
                    onChange={(evt) =>
                      onHandleInputChange("fromdate", evt, index)
                    }
                  />
                </InputGroup>
                <div className="filter-info-text filter-error-msg">
                  {item.fromDateValid
                    ? "From Date should be less than To Date"
                    : ""}
                </div>
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
                    dateFormat="MM/yyyy"
                    placeholderText="MM/YYYY"
                    showMonthYearPicker
                    scrollableYearDropdown
                    autoComplete="off"
                    disabled={item.iscurrentlystudying}
                    selected={
                      item.enddate ? new Date(item.enddate) : item.enddate
                    }
                    onChange={(evt) =>
                      onHandleInputChange("todate", evt, index)
                    }
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
