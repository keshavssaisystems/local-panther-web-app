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
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import debounce from "lodash/debounce";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import "./aiCommon.scss"
export function EducationAIProfile({ educationData, setEducationData }) {
    const dispatch = useDispatch();


    const studyFieldList = useSelector((state) => state.getStudyField.studyFieldList);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [monthList, setMonthList] = useState(useSelector((state) => state.monthList.user.data));
    const [yearList, setYearList] = useState(useSelector((state) => state.yearList.user.data));
    const educationList = useSelector((state) => state.educationLevelReducer.educationList);
    console.log("educationData", educationData);

    const [check, setCheck] = useState("add");
    const [formDetails, setFormData] = useState([]);


    useEffect(() => {
        loadData();
        getDropdownLists();


    }, []);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [fromDateSelect, setFromDateSelect] = useState({
        month: "",
        year: "",
    });
    const [toDateSelect, setToDateSelect] = useState({
        month: "",
        year: "",
    });

    const getDropdownLists = async function () {

        await dispatch(yearActions.getyear());
        await dispatch(monthActions.getmonth());
    };

    // Initialize formDetails from educationData when it loads/changes
    useEffect(() => {
        if (educationData && educationData.length > 0) {
            // Map educationData to formDetails structure as needed
            setFormData(
                educationData.map((edu) => ({
                    ...edu,
                    // Optionally, ensure fields are objects for controlled selects
                    levelofeducation: edu.levelofeducation
                        ? { label: edu.levelofeducation, value: edu.levelofeducation }
                        : null,
                    fieldofstudy: edu.fieldofstudy
                        ? { label: edu.fieldofstudy, value: edu.fieldofstudy }
                        : null,
                    school: edu?.school,
                    iscurrentlystudying: edu?.iscurrentlystudying,
                    startdate: edu?.startdate,
                    enddate: edu?.startdate,
                    fromDateSelect: {
                        month: edu?.fromDateSelect?.month,
                        year: edu?.fromDateSelect?.year,
                    },
                    toDateSelect: {
                        month: edu?.toDateSelect?.month,
                        year: edu?.toDateSelect?.year,
                    },
                    error: edu?.error,
                    fromDateValid: edu?.fromDateValid ?? false,
                    fromMonthReq: edu?.fromMonthReq ?? false,
                    fromYearReq: edu?.fromYearReq ?? false,
                    toMonthReq: edu?.toMonthReq ?? false,
                    toYearReq: edu?.toYearReq ?? false,
                    // Add other fields as needed
                }))
            );
        }
    }, [educationData]);

    const loadData = () => { }

    const onHandleInputChange = function (check, data, index) {
        let new_data = [...formDetails];
        let dropdown = { value: 0, label: "", };
        const updatedList = [...educationData];

        if (check === "levelofeducation") {
            dropdown.value = data.value;
            dropdown.label = data.label;
            new_data[index].levelofeducation = dropdown;
            if (new_data[index].levelofeducation !== "") {
                new_data[index].error = false;
            }
            updatedList[index] = {
                ...updatedList[index],
                [check]: data.label, levelofeducationid: data.value
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
        else if (check === "school") {
            new_data[index].school = data;
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

        else if (check === "currentlyStudying") {
            new_data[index].iscurrentlystudying = !new_data[index].iscurrentlystudying;
            updatedList[index] = {
                ...updatedList[index],
                iscurrentlystudying: new_data[index].iscurrentlystudying
            }
            if (new_data[index].iscurrentlystudying) {
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

                if (new_data[index].fromDateSelect.month === "") {
                    new_data[index].fromMonthReq = false;
                    new_data[index].fromYearReq = false;
                } else {
                    new_data[index].fromYearReq = true;
                }
            } else {
                new_data[index].fromYearReq = false;
                if (new_data[index].fromDateSelect.month === "") {
                    new_data[index].fromMonthReq = true;
                }

                new_data[index].fromDateSelect.year = yearList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                fromMonthReq: new_data[index].fromMonthReq,
                fromYearReq: new_data[index].fromYearReq,
                fromDateSelect: new_data[index].fromDateSelect

            }
        } else if (check === "toYear") {
            if (data === "Select year") {
                new_data[index].toDateSelect.year = "";

                if (new_data[index].toDateSelect.month === "") {
                    new_data[index].toMonthReq = false;
                    new_data[index].toYearReq = false;
                } else {
                    new_data[index].toYearReq = true;
                }
            } else {
                new_data[index].toYearReq = false;
                if (new_data[index].toDateSelect.month === "") {
                    new_data[index].toMonthReq = true;
                }
                new_data[index].toDateSelect.year = yearList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                toMonthReq: new_data[index].toMonthReq,
                toYearReq: new_data[index].toYearReq,
                toDateSelect: new_data[index].toDateSelect

            }
        } else if (check === "fromMonth") {
            if (data === "Select month") {
                new_data[index].fromDateSelect.month = "";

                if (new_data[index].fromDateSelect?.year === "") {
                    new_data[index].fromMonthReq = false;
                    new_data[index].fromYearReq = false;
                } else {
                    new_data[index].fromMonthReq = true;
                }
            } else {
                new_data[index].fromMonthReq = false;
                if (new_data[index].fromDateSelect?.year === "") {
                    new_data[index].fromYearReq = true;
                }

                new_data[index].fromDateSelect.month = monthList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                fromMonthReq: new_data[index].fromMonthReq,
                fromYearReq: new_data[index].fromYearReq,
                fromDateSelect: new_data[index].fromDateSelect

            }
        } else if (check === "toMonth") {
            if (data === "Select month") {
                new_data[index].toDateSelect.month = "";

                if (new_data[index].toDateSelect.year === "") {
                    new_data[index].toMonthReq = false;
                    new_data[index].toYearReq = false;
                } else {
                    new_data[index].toMonthReq = true;
                }
            } else {
                new_data[index].toMonthReq = false;
                if (new_data[index].toDateSelect.year === "") {
                    new_data[index].toYearReq = true;
                }

                new_data[index].toDateSelect.month = monthList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }
            updatedList[index] = {
                ...updatedList[index],
                fromDateValid: new_data[index].fromDateValid,
                toMonthReq: new_data[index].toMonthReq,
                toYearReq: new_data[index].toYearReq,
                toDateSelect: new_data[index].toDateSelect

            }
            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
        }
        setFormData(new_data);

        setEducationData(updatedList);
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
                <h5>Education</h5>

                {/* Updated Card */}
                {formDetails?.map((edu, index) => (
                    (edu?.operation === "add" || edu?.operation === "update") &&
                    (

                        <Form key={index}>
                            <div
                                className={edu?.operation === "update" ? "ai-section ai-update" : "ai-section ai-new"}
                            >
                                <span
                                    className={edu?.operation === "update" ? "ai-badge badge-update" : "ai-badge badge-new"}
                                >
                                    {edu?.operation === "add" ? 'New' : 'Update'}
                                </span>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label for="levelofeducation">
                                                Level of education
                                                <span className="required-icon"> *</span>
                                            </Label>

                                            <CreatableSelect
                                                isMulti={false}
                                                name="levelofeducation"
                                                options={educationList}
                                                value={edu?.levelofeducation?.value ? edu?.levelofeducation : null}
                                                className="location-dropdown-education"
                                                placeholder="Select..."
                                                onChange={(evt) =>
                                                    onHandleInputChange("levelofeducation", evt, index)
                                                }
                                                formatCreateLabel={formatCreateLabel}
                                                onCreateOption={(e) => onCreateEducation(e, index)}
                                            />

                                            <div className="filter-info-text filter-error-msg">
                                                {edu.error ? "Level of education is required" : ""}
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label for="fieldofstudy">Field of study
                                            </Label>
                                            <CreatableSelect
                                                placeholder="Select..."
                                                name="studyField"
                                                options={studyFieldList}
                                                isMulti={false}
                                                value={edu?.fieldofstudy?.value ? edu?.fieldofstudy : null}
                                                className="location-dropdown-education"
                                                onChange={(evt) =>
                                                    onHandleInputChange("fieldofstudy", evt, index)
                                                }
                                                formatCreateLabel={formatCreateLabel1}
                                                onCreateOption={(e) => onCreateFieldOfStudy(e, index)}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <FormGroup>
                                        <Label>School</Label>
                                        <input
                                            type="text"
                                            name="school"
                                            placeholder="Enter school"
                                            id="school"
                                            maxLength={50}
                                            value={edu?.school || ""}
                                            onInput={(evt) =>
                                                onHandleInputChange("school", evt.target.value, index)
                                            }
                                            className="field-input placeholder-text form-control"
                                        />
                                    </FormGroup>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label>City, State</Label>
                                            <AsyncSelect
                                                name="skills"
                                                placeholder="Search to select"
                                                loadOptions={loadOptionsDeb}
                                                cacheOptions
                                                isMulti={false}
                                                className="location-dropdown"
                                                value={!edu?.city?.value ? [] : edu?.city}
                                                defaultOptions={selectedLocation}
                                                onChange={(evt) => onHandleInputChange("city", evt, index)}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label>Country</Label>
                                            <AsyncSelect
                                                name="country"
                                                placeholder="Select"
                                                defaultOptions={countryList}
                                                isMulti={false}
                                                value={!edu?.country?.value ? [] : edu?.country}
                                                onChange={(evt) => onHandleInputChange("country", evt, index)}
                                            />
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
                                                        className={`form-control ${edu?.fromMonthReq || edu?.fromDateValid ? "is-invalid" : ""
                                                            }`}
                                                        onChange={(evt) =>
                                                            onHandleInputChange("fromMonth", evt.target.value, index)
                                                        }
                                                    >
                                                        <option key={0}>Select month</option>
                                                        {monthList?.length > 0 &&
                                                            monthList?.map((options) => (
                                                                <option
                                                                    selected={options.id == edu?.fromDateSelect?.month}
                                                                    key={options.id}
                                                                    value={options.id}
                                                                >
                                                                    {options.name}
                                                                </option>
                                                            ))}
                                                    </Input>

                                                    <div className="filter-info-text filter-error-msg">
                                                        {edu.fromDateValid
                                                            ? "From date should be less than to date"
                                                            : ""}
                                                        {edu.fromMonthReq ? "From month is required" : ""}
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
                                                            className={`form-control ${edu?.fromYearReq || edu?.fromDateValid ? "is-invalid" : ""
                                                                }`}
                                                        >
                                                            <option key={0}>Select year</option>
                                                            {yearList?.length > 0 &&
                                                                yearList?.map((options) => (
                                                                    <option
                                                                        selected={options.name == edu?.fromDateSelect?.year}
                                                                        key={options.id}
                                                                        value={options.id}
                                                                    >
                                                                        {options.name}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                    </InputGroup>

                                                    <div className="filter-info-text filter-error-msg">
                                                        {edu.fromDateValid
                                                            ? "From date should be less than to date"
                                                            : ""}

                                                        {edu.fromYearReq ? "From year is required" : ""}
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
                                                            disabled={edu?.iscurrentlystudying}
                                                            onChange={(evt) =>
                                                                onHandleInputChange("toMonth", evt.target.value, index)
                                                            }
                                                            className={`form-control ${edu?.toMonthReq ? "is-invalid" : ""
                                                                }`}
                                                        >
                                                            <option key={0}>Select month</option>
                                                            {monthList?.length > 0 &&
                                                                monthList?.map((options) => (
                                                                    <option
                                                                        selected={options.id == edu?.toDateSelect?.month}
                                                                        key={options.id}
                                                                        value={options.id}
                                                                    >
                                                                        {options.name}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                        <div className="filter-info-text filter-error-msg">
                                                            {edu?.toMonthReq ? "To month is required" : ""}
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Input
                                                            id={"yearList"}
                                                            name={"yearList"}
                                                            type={"select"}
                                                            disabled={edu?.iscurrentlystudying}
                                                            onChange={(evt) =>
                                                                onHandleInputChange("toYear", evt.target.value, index)
                                                            }
                                                            className={`form-control ${edu?.toYearReq ? "is-invalid" : ""
                                                                }`}
                                                        >
                                                            <option key={0}>Select year</option>
                                                            {yearList?.length > 0 &&
                                                                yearList?.map((options) => (
                                                                    <option
                                                                        selected={options.name == edu?.toDateSelect?.year}
                                                                        key={options.id}
                                                                        value={options.id}
                                                                    >
                                                                        {options.name}
                                                                    </option>
                                                                ))}
                                                        </Input>
                                                        <div className="filter-info-text filter-error-msg">
                                                            {edu?.toYearReq ? "To month is required" : ""}
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                ))}
                {/* Deleted Card */}
                {formDetails?.map((edu, index) => (
                    edu?.operation === "delete" && (

                        <div key={index} className="ai-section-delete">
                            <span className="ai-badge-delete">
                                Delete
                            </span>

                            <div style={{ opacity: 0.6, pointerEvents: "none" }}>

                                <div className="row mb-2">
                                    <div className="col-md-6">

                                        <label>Level of education</label>
                                        <select className="form-control" disabled defaultValue="HSC">
                                            <option>{edu?.levelofeducation?.label || ""}</option>
                                        </select>

                                    </div>

                                    <div className="col-md-6">
                                        <label>Field of study</label>
                                        <select className="form-control" disabled defaultValue="Science">
                                            <option>{edu?.fieldofstudy?.label || ""}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label>School</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={edu?.school}
                                    />
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label>City, State</label>
                                        <select className="form-control" disabled>
                                            <option>{edu?.city}</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Country</label>
                                        <select className="form-control" disabled>
                                            <option>{edu?.country}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label>From</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-control" disabled>
                                                <option>{edu?.fromMonth}</option>
                                            </select>
                                            <select className="form-control" disabled>
                                                <option>{edu?.fromYear}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label>To</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-control" disabled>
                                                <option>{edu?.toMonth}</option>
                                            </select>
                                            <select className="form-control" disabled>
                                                <option>{edu?.toYear}</option>
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
