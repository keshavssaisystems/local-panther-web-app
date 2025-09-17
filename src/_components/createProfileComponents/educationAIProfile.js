import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLevelOfEducation, educationActions, addFieldOfStudy, studyFieldActions, } from "_store";
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

export function EducationAIProfile(props) {
    let educationData = props?.aiResponse;
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
    const loadData1 = function () {
        let data = [];
        if (check === "add") {
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
                fromMonthReq: false,
                fromYearReq: false,
                toMonthReq: false,
                toYearReq: false,
                currentUserId: null,
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
                error: false,
                candidateeducationid: props.aiResponse.candidateeducationid,
                education: {
                    value: props.aiResponse.levelofeducationid,
                    label: props.aiResponse.levelofeducation,
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
                    props.selected.startdate !== "" && props.selected.startdate
                        ? extractDatePart(props.selected.startdate)
                        : null,
                enddate:
                    props.selected.enddate !== "" && props.selected.enddate
                        ? extractDatePart(props.selected.enddate)
                        : null,
                isactive: props.selected.isactive,
                currentUserId: null,
                fromDateValid: false,
                fromMonthReq: false,
                fromYearReq: false,
                toMonthReq: false,
                toYearReq: false,
                fromDateSelect: {
                    month: "",
                    year: "",
                },

                toDateSelect: {
                    month: "",
                    year: "",
                },
            });

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

            loadOptions(props?.selected?.cityname?.slice(0, 3));
        }
        setFormData(data);
    };


    const loadData = function () {
        let data = [];
        props.aiResponse.map((item) => {
            if (item?.operation === "update") {
                data.push({
                    error: false,
                    candidateeducationid: item.candidateeducationid,
                    education: {
                        value: item.levelofeducationid,
                        label: item.levelofeducation,
                    },

                    candidateid: 0,

                    fieldofstudy: {
                        value: item.fieldofstudyid,
                        label: item.fieldofstudy,
                    },
                    school: item.school,
                    city: {
                        value: item.cityid,
                        label: item.cityname,
                    },

                    state: {
                        value: item.stateid,
                        label: item.statename,
                    },

                    country: {
                        value: item.countryid,
                        label: item.countryname,
                    },
                    iscurrentlystudying: item.iscurrentlystudying,
                    startdate:
                        item.startdate !== "" && item.startdate
                            ? extractDatePart(item.startdate)
                            : null,
                    enddate:
                        item.enddate !== "" && item.enddate
                            ? extractDatePart(item.enddate)
                            : null,
                    isactive: true,
                    currentUserId: null,
                    fromDateValid: false,
                    fromMonthReq: false,
                    fromYearReq: false,
                    toMonthReq: false,
                    toYearReq: false,
                    fromDateSelect: {
                        month: "",
                        year: "",
                    },

                    toDateSelect: {
                        month: "",
                        year: "",
                    },
                });

                let idx = data.length - 1;
                if (item.startdate) {
                    let year = new Date(item.startdate).getFullYear();
                    let selectedYear = yearList?.find((x) => x.name == Number(year))?.name;

                    data[idx].fromDateSelect.month = Number(
                        new Date(item.startdate).getMonth() + 1
                    );
                    data[idx].fromDateSelect.year = selectedYear;
                }
                if (item.enddate) {
                    let year = new Date(item.enddate).getFullYear();
                    let selectedYear = yearList?.find((x) => x.name == Number(year))?.name;

                    data[idx].toDateSelect.month = Number(
                        new Date(item.enddate).getMonth() + 1
                    );
                    data[idx].toDateSelect.year = selectedYear;
                }

                loadOptions(item.cityname?.slice(0, 3));

            }
        });
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

    // const loadOptionsDeb = useCallback(
    //     debounce((inputValue, callback) => {
    //         loadOptions(inputValue).then(callback);
    //     }, 500),
    //     [] // Important: memoize once!
    // );

    const loadOptions = async function (inputValue) {
        // if (inputValue.length > 2) {
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
            fromDateSelect: {
                month: "",
                year: "",
            },

            toDateSelect: {
                month: "",
                year: "",
            },
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
        if (check === "levelofeducation") {
            dropdown.value = data.value;
            dropdown.label = data.label;

            new_data[index].education = dropdown;
            if (new_data[index].education !== "") {
                new_data[index].error = false;
            }
        } else if (check === "studyField") {
            dropdown.value = data.value;
            dropdown.label = data.label;
            new_data[index].fieldofstudy = dropdown;
        } else if (check === "school") {
            new_data[index].school = data;
        } else if (check === "city") {
            dropdown.value = data.value;
            dropdown.label = data.label;
            new_data[index].city = dropdown;

            let obj_new = {
                value: cityList.find((x) => x.cityid === data.value)?.stateid,
                label: cityList.find((x) => x.cityid === data.value)?.statename,
            };
            new_data[index].state = obj_new;
        } else if (check === "state") {
            dropdown.value = data.value;
            dropdown.label = data.label;
            new_data[index].state = dropdown;
        } else if (check === "country") {
            dropdown.value = data.value;
            dropdown.label = data.label;

            new_data[index].country = dropdown;
        } else if (check === "currentlyStudying") {
            new_data[index].iscurrentlystudying =
                !new_data[index].iscurrentlystudying;

            if (new_data[index].iscurrentlystudying) {
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
                new_data[index].toDateSelect = {
                    month: "",
                    year: "",
                };
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
        } else if (check === "fromMonth") {
            if (data === "Select month") {
                new_data[index].fromDateSelect.month = "";

                if (new_data[index].fromDateSelect.year === "") {
                    new_data[index].fromMonthReq = false;
                    new_data[index].fromYearReq = false;
                } else {
                    new_data[index].fromMonthReq = true;
                }
            } else {
                new_data[index].fromMonthReq = false;
                if (new_data[index].fromDateSelect.year === "") {
                    new_data[index].fromYearReq = true;
                }

                new_data[index].fromDateSelect.month = monthList?.find(
                    (x) => x.id == Number(data)
                )?.name;
            }

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
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

            new_data[index].fromDateValid = checkDateValidation(new_data[index]);
        }

        setFormData(new_data);
    };
    async function onSubmit() {
        let error_data = [...formDetails];
        for (let i = 0; i < formDetails.length; i++) {
            if (formDetails[i].education.label === "") {
                error_data[i].error = true;
                setFormData(error_data);
                return;
            }

            if (
                formDetails[i].fromMonthReq ||
                formDetails[i].fromYearReq ||
                formDetails[i].toMonthReq ||
                formDetails[i].toYearReq
            ) {
                return;
            }
        }

        let userDetails = JSON.parse(localStorage.getItem("userDetails"));

        let filtered_data = formDetails.map(({ skillid: value, ...rest }) => {
            return {
                candidateeducationid: rest.candidateeducationid,
                candidateid: localStorage.getItem("admcandid")
                    ? Number(localStorage.getItem("admcandid"))
                    : Number(userDetails.InternalUserId),
                levelofeducation: rest.education.label,
                fieldofstudy: rest.fieldofstudy?.label,
                school: rest.school,
                countryid: rest.country.value,
                cityid: rest.city.value,
                stateid: rest.state.value,
                iscurrentlystudying: rest.iscurrentlystudying,
                startdate: convertDateToYYYMMDD(rest.fromDateSelect),
                enddate: convertDateToYYYMMDD(rest.toDateSelect),
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
            // setSuccess(true);
            // setMessage(response.payload.message);
            dispatch(showSnackbar({
                message: response.payload.message,
                type: SNACKBAR_TYPES.SUCCESS,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 2000,
                maxWidth: 500,
            }));
            closeModal();
        } else {
            // setError(true);
            dispatch(showSnackbar({
                message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
                type: SNACKBAR_TYPES.ERROR,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 2000,
                maxWidth: 500,
            }));
        }
    }

    const formatCreateLabel = (inputValue) => {
        if (inputValue !== "" && inputValue.length > 2) {
            return (
                <span style={{ cursor: "pointer" }}>
                    Add new eductaion -{" "}
                    <span style={{ color: "#545cd8" }}>{inputValue}</span>
                </span>
            );
        } else {
            return "";
        }
    };

    const formatCreateLabel1 = (inputValue) => {
        if (inputValue !== "" && inputValue.length > 2) {
            return (
                <span style={{ cursor: "pointer" }}>
                    Add new field of study -{" "}
                    <span style={{ color: "#545cd8" }}>{inputValue}</span>
                </span>
            );
        } else {
            return "";
        }
    };

    const onCreateEducation = async (data, index) => {
        let payload = {
            levelofeducation1: data,
            currentUserId: localStorage.getItem("userId")
                ? Number(localStorage.getItem("userId"))
                : 0,
        };

        let res = await dispatch(addLevelOfEducation(payload));
        if (res?.payload && res?.payload?.statusCode === 201) {
            let formData = [...formDetails];
            formData[index].education.label = res.payload.data.levelofeducation1;
            formData[index].education.value = res.payload.data.levelofeducationid;
            setFormData(formData);
            dispatch(educationActions.getEducation());
        } else {
            console.log(res?.error);
        }
    };

    const onCreateFieldOfStudy = async (data, index) => {
        let payload = {
            fieldofstudy1: data,
            currentUserId: localStorage.getItem("userId")
                ? Number(localStorage.getItem("userId"))
                : 0,
        };

        let res = await dispatch(addFieldOfStudy(payload));
        if (res?.payload && res?.payload?.statusCode === 201) {
            let formData = [...formDetails];
            formData[index].fieldofstudy.label = res.payload.data.fieldofstudy1;
            formData[index].fieldofstudy.value = res.payload.data.fieldofstudyid;
            setFormData(formData);
            dispatch(studyFieldActions.getStudyField());
        } else {
            console.log(res?.error);
        }
    };

    return (
        <div>
            {true &&
                (
                    <div className="profile-view react-date-picker-profile">
                        {educationData.map((item, index) => (
                            <Form>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="levelofeducation" className="fw-semi-bold">
                                                Level of education
                                                <span className="required-icon"> *</span>
                                            </Label>

                                            <CreatableSelect
                                                defaultValue={item.levelofeducation}
                                                isMulti={false}
                                                name="levelofeducation"
                                                options={educationList}
                                                value={item.levelofeducation}
                                                className="location-dropdown-education"
                                                placeholder="Select..."
                                                onChange={(evt) =>
                                                    onHandleInputChange("levelofeducation", evt, index)
                                                }
                                                formatCreateLabel={formatCreateLabel}
                                                onCreateOption={(e) => onCreateEducation(e, index)}
                                            />

                                            <div className="filter-info-text filter-error-msg">
                                                {item.error ? "Level of education is required" : ""}
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <div>
                                            <FormGroup>
                                                <Label for={"studyField"} className="fw-semi-bold">
                                                    Field of study
                                                </Label>
                                                <CreatableSelect
                                                    placeholder="Select..."
                                                    name="studyField"
                                                    options={studyFieldList}
                                                    isMulti={false}
                                                    defaultValue={
                                                        item.fieldofstudy
                                                    }
                                                    value={
                                                        item.fieldofstudy
                                                    }
                                                    className="location-dropdown-education"
                                                    onChange={(evt) =>
                                                        onHandleInputChange("studyField", evt, index)
                                                    }
                                                    formatCreateLabel={formatCreateLabel1}
                                                    onCreateOption={(e) => onCreateFieldOfStudy(e, index)}
                                                />
                                            </FormGroup>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="school" className="fw-semi-bold">
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
                                            <Label for="city" className="fw-semi-bold">
                                                City, State
                                            </Label>
                                            <AsyncSelect
                                                name="skills"
                                                placeholder="Search to select"
                                                // loadOptions={loadOptionsDeb}
                                                cacheOptions
                                                isMulti={false}
                                                className="location-dropdown"
                                                value={!item.city?.value ? [] : item.city}
                                                defaultOptions={selectedLocation}
                                                onChange={(evt) => onHandleInputChange("city", evt, index)}
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
                                                defaultOptions={countryList}
                                                isMulti={false}
                                                value={!item.country?.value ? [] : item.country}
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
                                            <Label check className="fw-semi-bold">
                                                Currently attending
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                {/* <Row className="mt-2 fw-semi-bold">
                            <Label for="fromDate" className="fw-semi-bold">
                                From
                            </Label>
                            <Col md={4}>
                                <FormGroup>
                                    <Input
                                        id={"monthList"}
                                        name={"monthList"}
                                        type={"select"}
                                        className={`form-control ${item.fromMonthReq || item.fromDateValid ? "is-invalid" : ""
                                            }`}
                                        onChange={(evt) =>
                                            onHandleInputChange("fromMonth", evt.target.value, index)
                                        }
                                    >
                                        <option key={0}>Select month</option>
                                        {monthList?.length > 0 &&
                                            monthList?.map((options) => (
                                                <option
                                                    selected={options.id == item.fromDateSelect.month}
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
                                                onHandleInputChange("fromYear", evt.target.value, index)
                                            }
                                            className={`form-control ${item.fromYearReq || item.fromDateValid ? "is-invalid" : ""
                                                }`}
                                        >
                                            <option key={0}>Select year</option>
                                            {yearList?.length > 0 &&
                                                yearList?.map((options) => (
                                                    <option
                                                        selected={options.name == item.fromDateSelect.year}
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
                                        disabled={item.iscurrentlystudying}
                                        onChange={(evt) =>
                                            onHandleInputChange("toMonth", evt.target.value, index)
                                        }
                                        className={`form-control ${item.toMonthReq ? "is-invalid" : ""
                                            }`}
                                    >
                                        <option key={0}>Select month</option>
                                        {monthList?.length > 0 &&
                                            monthList?.map((options) => (
                                                <option
                                                    selected={options.id == item.toDateSelect.month}
                                                    key={options.id}
                                                    value={options.id}
                                                >
                                                    {options.name}
                                                </option>
                                            ))}
                                    </Input>
                                    <div className="filter-info-text filter-error-msg">
                                        {item.toMonthReq ? "To month is required" : ""}
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Input
                                        id={"yearList"}
                                        name={"yearList"}
                                        type={"select"}
                                        disabled={item.iscurrentlystudying}
                                        onChange={(evt) =>
                                            onHandleInputChange("toYear", evt.target.value, index)
                                        }
                                        className={`form-control ${item.toYearReq ? "is-invalid" : ""
                                            }`}
                                    >
                                        <option key={0}>Select year</option>
                                        {yearList?.length > 0 &&
                                            yearList?.map((options) => (
                                                <option
                                                    selected={options.name == item.toDateSelect.year}
                                                    key={options.id}
                                                    value={options.id}
                                                >
                                                    {options.name}
                                                </option>
                                            ))}
                                    </Input>
                                    <div className="filter-info-text filter-error-msg">
                                        {item.toYearReq ? "To month is required" : ""}
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        {index < formDetails.length - 1 ? <hr /> : <></>}

                        {index === formDetails.length - 1 ? (
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
                        )} */}
                            </Form>
                        ))}

                    </div>)}


            <div>
                <h5>Education</h5>

                {/* Updated Card */}
                {educationData?.map((edu, index) => (
                    edu?.operation === "update" &&
                    (

                        <Form>
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
                                    Added
                                </span>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label for="levelofeducation" className="fw-semi-bold">
                                                Level of education
                                                <span className="required-icon"> *</span>
                                            </Label>

                                            <CreatableSelect
                                                defaultValue={edu.levelofeducation}
                                                isMulti={false}
                                                name="levelofeducation"
                                                options={educationList}
                                                value={educationList.find(opt => opt.label === edu.levelofeducation) || null}
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
                                            <label for="fieldofstudy" className="fw-semi-bold">Field of study
                                                <span className="required-icon"> *</span>
                                            </label>
                                            <CreatableSelect
                                                placeholder="Select..."
                                                name="studyField"
                                                options={studyFieldList}
                                                isMulti={false}
                                                defaultValue={
                                                    edu.fieldofstudy?.value == 0 ? [] : edu.fieldofstudy
                                                }
                                                // value={edu.fieldofstudy?.value == 0 ? [] : edu.fieldofstudy}

                                                value={studyFieldList.find(opt => opt.label === edu.fieldofstudy) || null}
                                                className="location-dropdown-education"
                                                onChange={(evt) =>
                                                    onHandleInputChange("studyField", evt, index)
                                                }
                                                formatCreateLabel={formatCreateLabel1}
                                                onCreateOption={(e) => onCreateFieldOfStudy(e, index)}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label>School</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="International College of Arts and Science (UG)"
                                    />
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label>City, State</label>
                                        <select className="form-control" defaultValue="LA">
                                            <option>Los Angeles, California</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Country</label>
                                        <select className="form-control" defaultValue="USA">
                                            <option>USA</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <label>From</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-control" defaultValue="Jan">
                                                <option>Jan</option>
                                            </select>
                                            <select className="form-control" defaultValue="2020">
                                                <option>2020</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label>To</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-control" defaultValue="Aug">
                                                <option>Aug</option>
                                            </select>
                                            <select className="form-control" defaultValue="2025">
                                                <option>2025</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                ))}
                {/* Deleted Card */}
                {educationData?.map((edu, index) => (
                    edu?.operation === "delete" && false && (
                        <Form>
                            <div
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
                                            <label>Level of education</label>
                                            <select className="form-control" disabled defaultValue="HSC">
                                                <option>Higher Secondary Certificate (HSC)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Field of study</label>
                                            <select className="form-control" disabled defaultValue="Science">
                                                <option>Science</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label>School</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            disabled
                                            defaultValue="John Higher Secondary School"
                                        />
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <label>City, State</label>
                                            <select className="form-control" disabled>
                                                <option>Los Angeles, California</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Country</label>
                                            <select className="form-control" disabled>
                                                <option>USA</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <label>From</label>
                                            <div className="d-flex gap-2">
                                                <select className="form-control" disabled>
                                                    <option>Jan</option>
                                                </select>
                                                <select className="form-control" disabled>
                                                    <option>2014</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label>To</label>
                                            <div className="d-flex gap-2">
                                                <select className="form-control" disabled>
                                                    <option>Mar</option>
                                                </select>
                                                <select className="form-control" disabled>
                                                    <option>2016</option>
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
                            </div>
                        </Form>
                    )
                ))}
            </div>)
        </div>
    );
}
