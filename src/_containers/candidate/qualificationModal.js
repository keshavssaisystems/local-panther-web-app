import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { qualificationSlice } from "_store";
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
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import "./profile.scss";
import Loader from "react-loaders";
import {
  formatDate,
  extractDatePart,
  convertDateToYYYMMDD,
  checkDateValidation,
} from "_helpers/helper";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import { getLocationFilter } from "_store";

export function QualificationModal(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.getProfile.loader);
  const [check, setCheck] = useState(props.check);

  const [formDetails, setFormData] = useState([]);
  const [location, setLocation] = useState([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [citySelect, setCitySelect] = useState([]);
  const [stateSelect, setStateSelect] = useState([]);
  const [countrySelect, setCountrySelect] = useState([]);
  const [cityReqError, setCityReqError] = useState(false);
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
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      userSelect: "none",
    }),
  };

  useEffect(() => {
    loadData();
  }, []);

  let user = JSON.parse(localStorage.getItem("userDetails"));

  const loadData = function () {
    let data = [...formDetails];
    if (check == "add") {
      data.push({
        id: 0,
        jobTitle: "",
        organization: "",
        jobdescription: "",
        countryid: 0,
        cityid: 0,
        stateid: 0,
        iscurrentlyworking: false,
        startdate: null,
        enddate: null,
        isactive: true,
        currentUserId: user.userId,
        fromDateValid: false,
        fromDateReq: false,
        toDateReq: false,
        fromYearReq: false,
        toYearReq: false,
        error: false,
        city: {
          value: 0,
          label: "",
        },

        state: {
          value: 0,
          label: "",
        },
        country: {
          value: 0,
          label: "",
        },
        fromDateSelect: {
          month: "",
          year: "",
        },

        toDateSelect: {
          month: "",
          year: "",
        },
      });
    } else {
      data.push({
        id: props.selected.candidatequalificationid,
        jobTitle: props.selected.jobtitle,
        organization: props.selected.company,
        jobdescription: props.selected.jobdescription,
        countryid: props.selected.countryid,
        cityid: props.selected.cityid,
        stateid: props.selected.stateid,
        iscurrentlyworking: props.selected.iscurrentlyworking,
        startdate:
          props.selected.startdate == "" || !props.selected.startdate
            ? null
            : extractDatePart(props.selected.startdate),
        enddate:
          props.selected.enddate == "" || !props.selected.enddate
            ? null
            : extractDatePart(props.selected.enddate),
        isactive: props.selected.isactive,
        currentUserId: user.userId,
        fromDateValid: false,
        fromDateReq: false,
        toDateReq: false,
        error: false,
        toYearReq: false,
        fromYearReq: false,
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
        fromDateSelect: {
          month: "",
          year: "",
        },

        toDateSelect: {
          month: "",
          year: "",
        },
      });
      if (props.selected.cityname != "") {
        loadOptions(props.selected.cityname.slice(0, 3));
      }

      if (props.selected.startdate) {
        let year = new Date(props.selected.startdate).getFullYear();
        let selectedYear = yearList?.find((x) => x.name == Number(year))?.name;

        data[0].fromDateSelect.month = Number(
          new Date(props.selected.startdate).getMonth() + 1
        );
        data[0].fromDateSelect.year = selectedYear;
      }
      if (props.selected.enddate) {
        let year = new Date(props.selected.enddate).getFullYear();
        let selectedYear = yearList?.find((x) => x.name == Number(year))?.name;

        data[0].toDateSelect.month = Number(
          new Date(props.selected.enddate).getMonth() + 1
        );
        data[0].toDateSelect.year = selectedYear;
      }
    }
    setFormData(data);
  };

  useEffect(() => {
    let country_response;
    let state_response;
    country_response = filterData?.map(({ countryid: value, ...rest }) => {
      return {
        value,
        label: `${rest.countryname}`,
      };
    });

    state_response = filterData?.map(({ stateid: value, ...rest }) => {
      return {
        value,
        label: `${rest.statename}`,
      };
    });
    setStateList(state_response);
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
  }, [cityList]);
  const loadOptions = async function (inputValue) {
    if (inputValue != "") {
      const { data = [] } = await getLocationFilter(inputValue);

      setFilterData(data);
      let location_details = data.map(({ cityid: value, ...rest }) => {
        return {
          value,
          label: `${rest.location + ", " + rest.statename}`,
        };
      });
      if (location_details.length > 0) {
        let new_data = [...cityList];
        let filtered_data = location_details.find(
          (x) => x.value == props.selected.cityid
        );
        new_data.push(filtered_data);
        setCityList(new_data);
        setLocation(location_details);
      }

      return location_details;
    }
  };

  const removeTabs = function (index) {
    let new_data = [...formDetails];
    new_data.splice(index, 1);
    setFormData(new_data);

    let state_details = [...stateSelect];
    let city_details = [...citySelect];
    let country_details = [...countrySelect];
    city_details.splice(index, 1);
    state_details.splice(index, 1);
    country_details.splice(index, 1);
    setCitySelect(city_details);
    setStateSelect(state_details);
    setCountrySelect(country_details);
  };

  const addMoreTabs = function (index) {
    let new_data = [...formDetails];
    let valid = true;
    if (new_data[index - 1].jobTitle == "") {
      new_data[index - 1].error = true;
      valid = false;
    }
    if (
      new_data[index - 1].fromDateSelect.month == "" ||
      !new_data[index - 1].fromDateSelect.month
    ) {
      new_data[index - 1].fromDateReq = true;
      valid = false;
    }
    if (
      new_data[index - 1].fromDateSelect.year == "" ||
      !new_data[index - 1].fromDateSelect.year
    ) {
      new_data[index - 1].fromYearReq = true;
      valid = false;
    }

    if (
      new_data[index - 1].toDateSelect.month == "" ||
      !new_data[index - 1].toDateSelect.month
    ) {
      new_data[index - 1].toDateReq = true;
      valid = false;
    }

    if (
      new_data[index - 1].toDateSelect.year == "" ||
      !new_data[index - 1].toDateSelect.year
    ) {
      new_data[index - 1].toYearReq = true;
      valid = false;
    }

    if (!valid) {
      setFormData(new_data);
      return;
    }

    const newTab = {
      id: index,
      jobTitle: "",
      organization: "",
      jobdescription: "",
      countryid: 0,
      cityid: 0,
      stateid: 0,
      iscurrentlyworking: false,
      startdate: null,
      enddate: null,
      isactive: true,
      currentUserId: 13960,
      fromDateSelect: {
        month: "",
        year: "",
      },

      toDateSelect: {
        month: "",
        year: "",
      },

      error: false,
    };
    new_data.push(newTab);

    setFormData(new_data);
  };

  const handleInputChange = function (check, index, data) {
    let new_data = [...formDetails];

    if (check === "title") {
      new_data[index].jobTitle = data;
      new_data[index].error = false;
    } else if (check === "company") {
      new_data[index].organization = data;
    } else if (check === "description") {
      new_data[index].jobdescription = data;
    } else if (check === "status") {
      new_data[index].iscurrentlyworking = !new_data[index].iscurrentlyworking;
      if (new_data[index].iscurrentlyworking) {
        new_data[index].toDateReq = false;
        new_data[index].enddate = extractDatePart(new Date());
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();

        new_data[index].toDateSelect.month = monthList.find(
          (x) => x.id == month
        )?.id;
        new_data[index].toDateSelect.year = yearList.find(
          (x) => x.name == year
        )?.name;

        if (
          new_data[index].fromDateSelect.year !== "" &&
          new_data[index].fromDateSelect.month !== ""
        ) {
          let fromDate = convertDateToYYYMMDD(new_data[index].fromDateSelect);
          let toDate = convertDateToYYYMMDD(new_data[index].toDateSelect);

          if (new Date(fromDate) <= new Date(toDate)) {
            new_data[index].fromDateValid = false;
          } else {
            new_data[index].fromDateValid = true;
          }
        }
      } else {
        new_data[index].toDateSelect.month = "";
        new_data[index].toDateSelect.year = "";
      }
    } else if (check === "fromYear") {
      if (data === "Select year") {
        new_data[index].fromDateSelect.year = "";
      } else {
        new_data[index].fromDateSelect.year = yearList?.find(
          (x) => x.id == Number(data)
        )?.name;
      }
      new_data[index].fromDateValid = checkDateValidation(new_data[index]);
    } else if (check === "toYear") {
      if (data === "Select year") {
        new_data[index].toDateSelect.year = "";
      } else {
        new_data[index].toDateSelect.year = yearList?.find(
          (x) => x.id == Number(data)
        )?.name;
      }

      new_data[index].fromDateValid = checkDateValidation(new_data[index]);
    } else if (check === "fromMonth") {
      if (data === "Select year") {
        new_data[index].fromDateSelect.month = "";
      } else {
        new_data[index].fromDateSelect.month = monthList?.find(
          (x) => x.id == Number(data)
        )?.name;
      }

      new_data[index].fromDateValid = checkDateValidation(new_data[index]);
    } else if (check === "toMonth") {
      if (data === "Select year") {
        new_data[index].toDateSelect.month = "";
      } else {
        new_data[index].toDateSelect.month = monthList?.find(
          (x) => x.id == Number(data)
        )?.name;
      }

      new_data[index].fromDateValid = checkDateValidation(new_data[index]);
    }

    setFormData(new_data);
  };

  const onSelectCityDropdown = function (data, index) {
    let form_details = [...formDetails];
    let city_details = [...citySelect];
    city_details.push(data);

    form_details[index].cityid = data.value;
    let obj = {
      value: data.value,
      label: data.label,
    };

    form_details[index].city = obj;
    setFormData(form_details);
    setCitySelect(city_details);
  };
  const onSelectCountryDropdown = function (data, index) {
    let form_details = [...formDetails];
    let country_details = [...countrySelect];
    country_details.push(data);

    form_details[index].countryid = data.value;
    let obj = {
      value: data.value,
      label: data.label,
    };
    form_details[index].country = obj;
    setFormData(form_details);
    setCountrySelect(country_details);
  };
  const onSelectStateDropdown = function (data, index) {
    let new_data = [...stateSelect];
    let form_details = [...formDetails];

    form_details[index].stateid = data.value;
    let obj = {
      value: data.value,
      label: data.label,
    };
    form_details[index].state = obj;
    setFormData(form_details);
    new_data.push(data);
    setStateSelect(new_data);
  };
  const closeModal = function () {
    setSuccess(false);
    setError(false);

    props.OnCallQualification();
  };

  const checkCityValid = function (id) {
    if (id == 0) {
      setCityReqError(true);
    } else {
      setCityReqError(false);
    }
  };

  async function onSubmit() {
    let new_data = [...formDetails];
    let valid = true;
    for (let i = 0; i < formDetails.length; i++) {
      if (formDetails[i].jobTitle == "") {
        new_data[i].error = true;
        valid = false;
      }
      if (
        formDetails[i].fromDateSelect.month == "" ||
        !formDetails[i].fromDateSelect.month
      ) {
        new_data[i].fromDateReq = true;
        valid = false;
      }
      if (
        formDetails[i].fromDateSelect.year == "" ||
        !formDetails[i].fromDateSelect.year
      ) {
        new_data[i].fromYearReq = true;
        valid = false;
      }

      if (
        formDetails[i].toDateSelect.month == "" ||
        !formDetails[i].toDateSelect.month
      ) {
        new_data[i].toDateReq = true;
        valid = false;
      }

      if (
        formDetails[i].toDateSelect.year == "" ||
        !formDetails[i].toDateSelect.year
      ) {
        new_data[i].toYearReq = true;
        valid = false;
      }

      if (new_data[i].fromDateValid) {
        valid = false;
      }
      setFormData(new_data);
    }
    if (!valid) {
      return;
    }

    let filtered_data = formDetails.map(({ skillid: value, ...rest }) => {
      return {
        candidateid: parseInt(user.InternalUserId),
        jobtitle: rest.jobTitle,
        company: rest.organization,
        jobdescription: rest.jobdescription,
        countryid: rest.countryid,
        cityid: rest.cityid,
        stateid: rest.stateid,
        iscurrentlyworking: rest.iscurrentlyworking,
        startdate: convertDateToYYYMMDD(rest.fromDateSelect),
        enddate: convertDateToYYYMMDD(rest.toDateSelect),
        isactive: rest.isactive,
        currentUserId: rest.currentUserId,
      };
    });
    let qualification_data = filtered_data[0];
    let response;
    if (check == "edit") {
      let id = formDetails[0].id;
      response = await dispatch(
        qualificationSlice.updateQualificationThunk({ id, qualification_data })
      );
    } else {
      response = await dispatch(
        qualificationSlice.addQualificationThunk(filtered_data)
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
        <div>
          <Form id={index}>
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
                  <Label for="jobTitle" className="fw-semi-bold">
                    Job title <span className="required-icon">*</span>
                  </Label>
                  <input
                    placeholder="Enter job title"
                    name="jobTitle"
                    type="text"
                    id="jobTitle"
                    value={item.jobTitle}
                    className={`field-input placeholder-text form-control ${
                      item.error ? "is-invalid" : ""
                    }`}
                    onInput={(evt) =>
                      handleInputChange("title", index, evt.target.value)
                    }
                  />
                  <div className="invalid-feedback">
                    {item.error ? "Job title is required" : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label for="city" className="fw-semi-bold">
                    City, State
                  </Label>
                  <AsyncSelect
                    name="skills"
                    placeholder="Search to select"
                    loadOptions={loadOptions}
                    styles={customStyles}
                    isMulti={false}
                    value={!item.city?.value ? [] : item.city}
                    defaultOptions={location}
                    onChange={(evt) => onSelectCityDropdown(evt, index)}
                    className="location-dropdown"
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="country" className="fw-semi-bold">
                    Country
                  </Label>
                  <AsyncSelect
                    name="country"
                    placeholder="Select"
                    styles={customStyles}
                    defaultOptions={countryList}
                    isMulti={false}
                    value={!item.country?.value ? [] : item.country}
                    onChange={(evt) => onSelectCountryDropdown(evt, index)}
                    onMenuOpen={() => checkCityValid(item.cityid)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Col md={4}>
              <FormGroup>
                <Label for="company" className="fw-semi-bold">
                  Company
                </Label>
                <Input
                  placeholder="Enter company"
                  name="company"
                  type="text"
                  id="company"
                  value={item.organization}
                  maxLength={50}
                  className="field-input placeholder-text form-control"
                  onInput={(evt) =>
                    handleInputChange("company", index, evt.target.value)
                  }
                />
              </FormGroup>
            </Col>

            <Row>
              <Col>
                <FormGroup check>
                  <Input
                    name="currentlyWorking"
                    id="currentlyWorking"
                    onInput={(evt) =>
                      handleInputChange("status", index, evt.target.value)
                    }
                    type="checkbox"
                    checked={item.iscurrentlyworking}
                  />{" "}
                  <Label check className="fw-semi-bold">
                    Currently Working
                  </Label>
                </FormGroup>
              </Col>
            </Row>

            {/* <Row className="mt-2">
              <Col md={4}>
                <FormGroup>
                  <Label for="fromDate" className="fw-semi-bold">
                    From <span className="required-icon">*</span>
                  </Label>
                  <InputGroup>
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <DatePicker
                      name="fromDate"
                      id="fromDate"
                      dateFormat="MM/yyyy"
                      placeholderText="MM/YYYY"
                      showMonthYearPicker
                      autoComplete="off"
                      className={`field-input placeholder-text form-control ${
                        item.fromDateReq ? "is-invalid" : ""
                      }`}
                      selected={
                        item.startdate
                          ? new Date(item.startdate)
                          : item.startdate
                      }
                      showYearDropdown={true}
                      onChange={(evt) =>
                        handleInputChange("fromDate", index, evt)
                      }
                    />
                  </InputGroup>
                  <div className="filter-info-text filter-error-msg">
                    {item.fromDateReq ? "From date is required" : ""}
                  </div>
                  <div className="filter-info-text filter-error-msg">
                    {item.fromDateValid && !item.fromDateReq
                      ? "From date should be less than to date"
                      : ""}
                  </div>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="toDate" className="fw-semi-bold">
                    To <span className="required-icon">*</span>
                  </Label>
                  <InputGroup
                    style={{ borderColor: item.toDateReq ? "#d92550" : "" }}
                  >
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <DatePicker
                      name="toDate"
                      id="toDate"
                      autoComplete="off"
                      className={`field-input placeholder-text form-control ${
                        item.toDateReq ? "is-invalid" : ""
                      }`}
                      disabled={item.iscurrentlyworking}
                      dateFormat="MM/yyyy"
                      placeholderText="MM/YYYY"
                      showMonthYearPicker
                      scrollableYearDropdown
                      selected={
                        item.enddate ? new Date(item.enddate) : item.enddate
                      }
                      showYearDropdown={true}
                      onChange={(evt) =>
                        handleInputChange("toDate", index, evt)
                      }
                    />
                  </InputGroup>
                  <div className="filter-info-text filter-error-msg">
                    {item.toDateReq ? "To date is required" : ""}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
             
            </Row> */}

            <Row className="mt-2 fw-semi-bold">
              <Label for="fromDate" className="fw-semi-bold">
                From<span className="required-icon"> *</span>
              </Label>
              <Col md={4}>
                <FormGroup>
                  <Input
                    id={"monthList"}
                    name={"monthList"}
                    type={"select"}
                    onChange={(evt) =>
                      handleInputChange("fromMonth", index, evt.target.value)
                    }
                    className={`form-control ${
                      item.fromDateReq || item.fromDateValid ? "is-invalid" : ""
                    }`}
                  >
                    <option key={0}>Select month</option>
                    {monthList?.length > 0 &&
                      monthList?.map((options) => (
                        <option
                          selected={options.id == item.fromDateSelect?.month}
                          key={options.id}
                          value={options.id}
                        >
                          {options.name}
                        </option>
                      ))}
                  </Input>

                  <div className="filter-info-text filter-error-msg">
                    {item.fromDateReq ? "From month is required" : ""}
                  </div>
                  <div className="filter-info-text filter-error-msg">
                    {item.fromDateValid
                      ? "From date should be less than to date"
                      : ""}
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
                      handleInputChange("fromYear", index, evt.target.value)
                    }
                    className={`form-control ${
                      item.fromYearReq || item.fromDateValid ? "is-invalid" : ""
                    }`}
                  >
                    <option key={0}>Select year</option>
                    {yearList?.length > 0 &&
                      yearList?.map((options) => (
                        <option
                          selected={options.name == item.fromDateSelect?.year}
                          key={options.id}
                          value={options.id}
                        >
                          {options.name}
                        </option>
                      ))}
                  </Input>
                  <div className="filter-info-text filter-error-msg">
                    {item.fromYearReq ? "From year is required" : ""}
                  </div>
                  <div className="filter-info-text filter-error-msg">
                    {item.fromDateValid
                      ? "From date should be less than to date"
                      : ""}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Label for="fromDate" className="fw-semi-bold">
                To<span className="required-icon"> *</span>
              </Label>
              <Col md={4}>
                <FormGroup>
                  <Input
                    id={"monthList"}
                    name={"monthList"}
                    disabled={item.iscurrentlyworking}
                    type={"select"}
                    onChange={(evt) =>
                      handleInputChange("toMonth", index, evt.target.value)
                    }
                    className={`form-control ${
                      item.toDateReq ? "is-invalid" : ""
                    }`}
                  >
                    <option key={0}>Select month</option>
                    {monthList?.length > 0 &&
                      monthList?.map((options) => (
                        <option
                          selected={options.id == item.toDateSelect?.month}
                          key={options.id}
                          value={options.id}
                        >
                          {options.name}
                        </option>
                      ))}
                  </Input>
                  <div className="filter-info-text filter-error-msg">
                    {item.toDateReq ? "To month is required" : ""}
                  </div>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Input
                    id={"yearList"}
                    name={"yearList"}
                    type={"select"}
                    disabled={item.iscurrentlyworking}
                    onChange={(evt) =>
                      handleInputChange("toYear", index, evt.target.value)
                    }
                    className={`form-control ${
                      item.toYearReq ? "is-invalid" : ""
                    }`}
                  >
                    <option key={0}>Select year</option>
                    {yearList?.length > 0 &&
                      yearList?.map((options) => (
                        <option
                          selected={options.name == item.toDateSelect?.year}
                          key={options.id}
                          value={options.id}
                        >
                          {options.name}
                        </option>
                      ))}
                  </Input>
                  <div className="filter-info-text filter-error-msg">
                    {item.toYearReq ? "To year is required" : ""}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="jobDescription" className="fw-semi-bold">
                    Job description
                  </Label>
                  <Input
                    style={{ height: "100px" }}
                    placeholder="Enter job description"
                    name="jobDescription"
                    type="textarea"
                    id="jobDescription"
                    value={item.jobdescription}
                    maxLength={500}
                    className="field-input placeholder-text form-control"
                    onInput={(evt) =>
                      handleInputChange("description", index, evt.target.value)
                    }
                  />

                  <span className="dropdown-placeholder float-end">
                    {item.jobdescription ? item.jobdescription.length : 0}/500
                  </span>
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

      <Modal className="modal-reject-align profile-view" isOpen={cityReqError}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Please select City to filter
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Country
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => setCityReqError(false)}
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
