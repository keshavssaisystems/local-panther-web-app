import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLevelOfEducation, educationActions, addFieldOfStudy, studyFieldActions, yearActions, monthActions } from "_store";
import {
    Label, Input, Row, Col, Modal, Card, CardBody, InputGroup, Button, FormGroup, Form,
} from "reactstrap";

import { getLocationFilter, educationDetailsSlice } from "_store";
import {
    convertDateToYYYMMDD,
    extractDatePart,
    checkDateValidation,
} from "_helpers/helper";

import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";

import debounce from "lodash/debounce";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export function QualificationAIProfile({ qualificationData, setQualificationData }) {
    const dispatch = useDispatch();
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [monthList, setMonthList] = useState(useSelector((state) => state.monthList.user.data));
    const [yearList, setYearList] = useState(useSelector((state) => state.yearList.user.data));
    const [check, setCheck] = useState("add");
    console.log("qualification ", qualificationData);
    const [formDetails, setFormData] = useState([]);
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            userSelect: "none",
        }),
    };
    useEffect(() => {
        loadData();
        getDropdownLists();

    }, []);

    const [selectedLocation, setSelectedLocation] = useState([]);


    const getDropdownLists = async function () {

        await dispatch(yearActions.getyear());
        await dispatch(monthActions.getmonth());
    };

    // Initialize formDetails from qualificationData when it loads/changes
    useEffect(() => {
        if (qualificationData && qualificationData.length > 0) {
            // Map qualificationData to formDetails structure as needed
            setFormData(
                qualificationData.map((item) => ({
                    ...item,
                    // Optionally, ensure fields are objects for controlled selects
                    jobtitle: item.jobtitle,
                    company: item.company,
                    jobdescription: item?.jobdescription,
                    iscurrentlyworking: item?.iscurrentlyworking,
                    startdate: item?.startdate,
                    enddate: item?.startdate,
                    fromDateSelect: {
                        month: item?.fromDateSelect?.month,
                        year: item?.fromDateSelect?.year,
                    },
                    toDateSelect: {
                        month: item?.toDateSelect?.month,
                        year: item?.toDateSelect?.year,
                    },
                    error: item?.error,
                    fromDateValid: item?.fromDateValid ?? false,
                    fromMonthReq: item?.fromMonthReq ?? false,
                    fromYearReq: item?.fromYearReq ?? false,
                    toMonthReq: item?.toMonthReq ?? false,
                    toYearReq: item?.toYearReq ?? false,
                    // Add other fields as needed
                }))
            );
        }
    }, [qualificationData]);

    const loadData = () => { }

    const onHandleInputChange = function (check, data, index) {
        let new_data = [...formDetails];
        let dropdown = { value: 0, label: "", };
        const updatedList = [...qualificationData];

        if (check === "jobtitle") {
            new_data[index].jobtitle = data;
            if (new_data[index].jobtitle !== "") {
                new_data[index].error = false;
            }
            else {
                new_data[index].error = true;
            }

            updatedList[index] = {
                ...updatedList[index],
                [check]: data, error: new_data[index].error
            };
        }
        if (check === "fieldofstudy") {
            dropdown.value = data.value;
            dropdown.label = data.label;
            new_data[index].fieldofstudy = dropdown;
            if (new_data[index].fieldofstudy !== "") {
                new_data[index].error = false;
            }
            updatedList[index] = {
                ...updatedList[index],
                [check]: data.label, fieldofstudyid: data.value
            };
        }
        else if (check === "company") {
            new_data[index].company = data;
            updatedList[index] = {
                ...updatedList[index],
                [check]: data
            };
        }

        else if (check === "city") {
            dropdown.value = data.value;
            dropdown.label = data.label;
            new_data[index].city = dropdown;

            let obj_new = {
                value: cityList.find((x) => x.cityid === data.value)?.stateid,
                label: cityList.find((x) => x.cityid === data.value)?.statename,
            };
            new_data[index].state = obj_new;

            updatedList[index] = {
                ...updatedList[index], [check]: data, cityid: data.value, stateid: obj_new.value, statename: obj_new.label
            };

        } else if (check === "state") {
            dropdown.value = data.value;
            dropdown.label = data.label;
            new_data[index].state = dropdown;
        } else if (check === "country") {
            dropdown.value = data.value;
            dropdown.label = data.label;

            new_data[index].country = dropdown;
            updatedList[index] = {
                ...updatedList[index],
                [check]: dropdown, countryid: data.value
            }
        }
        else if (check === "status") {
            new_data[index].iscurrentlyworking = !new_data[index].iscurrentlyworking;
            updatedList[index] = {
                ...updatedList[index],
                iscurrentlyworking: new_data[index].iscurrentlyworking
            }
            if (new_data[index].iscurrentlyworking) {
                let month = new Date().getMonth() + 1;
                let year = new Date().getFullYear();

                new_data[index].toDateSelect.month = monthList.find((x) => x.id == month)?.id;
                new_data[index].toDateSelect.year = yearList.find((x) => x.name == year)?.name;

                if (new_data[index].fromDateSelect.year !== "" && new_data[index].fromDateSelect.month !== "") {
                    let fromDate = convertDateToYYYMMDD(new_data[index].fromDateSelect);
                    let toDate = convertDateToYYYMMDD(new_data[index].toDateSelect);

                    if (new Date(fromDate) <= new Date(toDate)) {
                        new_data[index].fromDateValid = false;
                    } else {
                        new_data[index].fromDateValid = true;
                    }
                    updatedList[index] = {
                        ...updatedList[index],
                        fromDateValid: new_data[index].fromDateValid
                    }
                }
            } else {
                new_data[index].toDateSelect = {
                    month: "",
                    year: "",
                };
            }
            updatedList[index] = {
                ...updatedList[index],
                toDateSelect: new_data[index].toDateSelect
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
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                fromDateSelect: new_data[index].fromDateSelect
            }
        } else if (check === "toYear") {
            if (data === "Select year") {
                new_data[index].toDateSelect.year = "";
            } else {
                new_data[index].toDateSelect.year = yearList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                toDateSelect: new_data[index].toDateSelect
            }
        } else if (check === "fromMonth") {
            if (data === "Select year") {
                new_data[index].fromDateSelect.month = "";
            } else {
                new_data[index].fromDateSelect.month = monthList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                fromDateSelect: new_data[index].fromDateSelect
            }
        } else if (check === "toMonth") {
            if (data === "Select year") {
                new_data[index].toDateSelect.month = "";
            } else {
                new_data[index].toDateSelect.month = monthList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                toDateSelect: new_data[index].toDateSelect

            }
            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
        }
        setFormData(new_data);

        setQualificationData(updatedList);
    }

    const formatCreateLabel = () => { }
    const onCreateEducation = () => { }
    const formatCreateLabel1 = () => { }
    const onCreateFieldOfStudy = () => { }

    const loadOptionsDeb = useCallback(
        debounce((inputValue, callback) => {
            loadOptions(inputValue).then(callback);
        }, 500),
        []
    );

    const loadOptions = async function (inputValue) {
        if (inputValue !== "") {
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
                setCountryList(data);
            } else {
                setCountryList(data);
            }
            setStateList(state_response);
        }
    }, [cityList]);

    return (
        <div>


            <div>
                <h5>Qualification</h5>

                {/* Updated Card */}
                {formDetails?.map((item, index) => (
                    (item?.operation === "add" || item?.operation === "update") &&
                    (
                        <Form key={index}>
                            <div
                                key={index}
                                style={{
                                    border: "2px solid #facc15",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    backgroundColor: "#fefce8",
                                    marginBottom: "20px",
                                    position: "relative",
                                }}
                            >
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "-10px",
                                        right: "10px",
                                        background: "#f59e0b",
                                        color: "white",
                                        padding: "2px 8px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                    }}
                                >
                                    {item?.operation === "add" ? 'Added' : 'Updated'}
                                </span>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label for="jobtitle">
                                                Job title
                                                <span className="required-icon"> *</span>
                                            </Label>

                                            <input
                                                placeholder="Enter job title"
                                                name="jobtitle"
                                                type="text"
                                                id="jobtitle"
                                                value={item.jobtitle}
                                                className={`field-input placeholder-text form-control ${item.error ? "is-invalid" : ""
                                                    }`}
                                                onInput={(evt) =>
                                                    onHandleInputChange("jobtitle", evt.target.value, index)
                                                }
                                            />
                                            <div className="invalid-feedback">
                                                {item.error ? "Job title is required" : ""}
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label for="city" className="fw-semi-bold">
                                                City, State
                                            </Label>
                                            <AsyncSelect
                                                name="skills"
                                                placeholder="Search to select"
                                                cacheOptions
                                                loadOptions={loadOptionsDeb}
                                                styles={customStyles}
                                                isMulti={false}
                                                value={!item.city?.value ? [] : item.city}
                                                onChange={(evt) => onHandleInputChange("city", evt, index)}
                                                className="location-dropdown"
                                            />
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="mb-2">
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
                                            onChange={(evt) => onHandleInputChange("country", evt, index)}
                                        />
                                    </FormGroup>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label for="company" className="fw-semi-bold">
                                                Company
                                            </Label>
                                            <Input
                                                placeholder="Enter company"
                                                name="company"
                                                type="text"
                                                id="company"
                                                value={item.company}
                                                maxLength={50}
                                                className="field-input placeholder-text form-control"
                                                onInput={(evt) =>
                                                    onHandleInputChange("company", evt.target.value, index)
                                                }
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Input
                                                name="currentlyWorking"
                                                id="currentlyWorking"
                                                onInput={(evt) =>
                                                    onHandleInputChange("status", evt.target.value, index)
                                                }
                                                type="checkbox"
                                                checked={item.iscurrentlyworking}
                                            />{" "}
                                            <Label check className="fw-semi-bold">
                                                Currently working
                                            </Label>
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">

                                        <Label>From</Label>
                                        <div className="d-flex gap-2">
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Input
                                                        id={"monthList"}
                                                        name={"monthList"}
                                                        type={"select"}
                                                        className={`form-control ${item?.fromMonthReq || item?.fromDateValid ? "is-invalid" : ""
                                                            }`}
                                                        onChange={(evt) =>
                                                            onHandleInputChange("fromMonth", evt.target.value, index)
                                                        }
                                                    >
                                                        <option key={0}>Select month</option>
                                                        {monthList?.length > 0 &&
                                                            monthList?.map((options) => (
                                                                <option
                                                                    selected={options.id == item?.fromDateSelect?.month}
                                                                    key={options.id}
                                                                    value={options.id}
                                                                >
                                                                    {options.name}
                                                                </option>
                                                            ))}
                                                    </Input>

                                                    <div className="filter-info-text filter-error-msg">
                                                        {item.fromDateValid
                                                            ? "From date should be less than to date"
                                                            : ""}
                                                        {item.fromMonthReq ? "From month is required" : ""}
                                                    </div>
                                                </FormGroup></Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <InputGroup>
                                                        <Input
                                                            id={"yearList"}
                                                            name={"yearList"}
                                                            type={"select"}
                                                            onChange={(evt) =>
                                                                onHandleInputChange("fromYear", evt.target.value, index)
                                                            }
                                                            className={`form-control ${item?.fromYearReq || item?.fromDateValid ? "is-invalid" : ""
                                                                }`}
                                                        >
                                                            <option key={0}>Select year</option>
                                                            {yearList?.length > 0 &&
                                                                yearList?.map((options) => (
                                                                    <option
                                                                        selected={options.name == item?.fromDateSelect?.year}
                                                                        key={options.id}
                                                                        value={options.id}
                                                                    >
                                                                        {options.name}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                    </InputGroup>

                                                    <div className="filter-info-text filter-error-msg">
                                                        {item.fromDateValid
                                                            ? "From date should be less than to date"
                                                            : ""}

                                                        {item.fromYearReq ? "From year is required" : ""}
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label>To</Label>
                                            <div className="d-flex gap-2">
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Input
                                                            id={"monthList"}
                                                            name={"monthList"}
                                                            type={"select"}
                                                            disabled={item?.iscurrentlyworking}
                                                            onChange={(evt) =>
                                                                onHandleInputChange("toMonth", evt.target.value, index)
                                                            }
                                                            className={`form-control ${item?.toMonthReq ? "is-invalid" : ""
                                                                }`}
                                                        >
                                                            <option key={0}>Select month</option>
                                                            {monthList?.length > 0 &&
                                                                monthList?.map((options) => (
                                                                    <option
                                                                        selected={options.id == item?.toDateSelect?.month}
                                                                        key={options.id}
                                                                        value={options.id}
                                                                    >
                                                                        {options.name}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                        <div className="filter-info-text filter-error-msg">
                                                            {item?.toMonthReq ? "To month is required" : ""}
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Input
                                                            id={"yearList"}
                                                            name={"yearList"}
                                                            type={"select"}
                                                            disabled={item?.iscurrentlyworking}
                                                            onChange={(evt) =>
                                                                onHandleInputChange("toYear", evt.target.value, index)
                                                            }
                                                            className={`form-control ${item?.toYearReq ? "is-invalid" : ""
                                                                }`}
                                                        >
                                                            <option key={0}>Select year</option>
                                                            {yearList?.length > 0 &&
                                                                yearList?.map((options) => (
                                                                    <option
                                                                        selected={options.name == item?.toDateSelect?.year}
                                                                        key={options.id}
                                                                        value={options.id}
                                                                    >
                                                                        {options.name}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                        <div className="filter-info-text filter-error-msg">
                                                            {item?.toYearReq ? "To month is required" : ""}
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-12">
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
                                                    onHandleInputChange("description", index, evt.target.value)
                                                }
                                            />

                                            <span className="dropdown-placeholder float-end">
                                                {item.jobdescription ? item.jobdescription.length : 0}/500
                                            </span>
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                ))}
                {/* Deleted Card */}
                {formDetails?.map((item, index) => (
                    item?.operation === "delete" && (
                        <div key={index}
                            style={{
                                border: "2px dashed red",
                                borderRadius: "8px",
                                padding: "16px",
                                backgroundColor: "#fef2f2",
                                position: "relative",
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-10px",
                                    right: "10px",
                                    background: "red",
                                    color: "white",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                }}
                            >
                                Deleted
                            </span>

                            <div style={{ opacity: 0.6, pointerEvents: "none" }}>

                                <div className="row mb-2">
                                    <div className="col-md-6">

                                        <label>Job title</label>
                                        <select className="form-control" disabled defaultValue="HSC">
                                            <option>{item?.jobtitle || ""}</option>
                                        </select>

                                    </div>
                                    <div className="col-md-6">
                                        <label>Company</label>
                                        <select className="form-control" disabled>
                                            <option>{item?.company}</option>
                                        </select>
                                    </div>

                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label>City, State</label>
                                        <select className="form-control" disabled defaultValue="Science">
                                            <option>{item?.city || ""}</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            disabled
                                            value={item?.country}
                                        />
                                    </div>

                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label>From</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-control" disabled>
                                                <option>{item?.fromDateSelect?.month}</option>
                                            </select>
                                            <select className="form-control" disabled>
                                                <option>{item?.fromDateSelect?.year}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label>To</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-control" disabled>
                                                <option>{item?.toDateSelect?.month}</option>
                                            </select>
                                            <select className="form-control" disabled>
                                                <option>{item?.toDateSelect?.year}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h6
                                style={{
                                    textAlign: "center",
                                    marginTop: "10px",
                                    color: "red",
                                    fontWeight: "bold",
                                    transform: "rotate(-10deg)",
                                }}
                            >
                                DELETED
                            </h6>
                        </div >

                    )
                ))
                }
            </div >
        </div >
    );
}
