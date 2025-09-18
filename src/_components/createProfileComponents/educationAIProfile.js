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
            new_data[index].school = data.target.value;
            updatedList[index] = {
                ...updatedList[index],
                [check]: data.target.value
            };
        }
        setFormData(new_data);




        setEducationData(updatedList);
    }

    const formatCreateLabel = () => { }
    const onCreateEducation = () => { }
    const formatCreateLabel1 = () => { }
    const onCreateFieldOfStudy = () => { }

    return (
        <div>


            <div>
                <h5>Education</h5>

                {/* Updated Card */}
                {formDetails?.map((edu, index) => (
                    (edu?.operation === "add" || edu?.operation === "update") &&
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
                                            <Label for="levelofeducation">
                                                Level of education
                                                <span className="required-icon"> *</span>
                                            </Label>

                                            <CreatableSelect
                                                isMulti={false}
                                                name="levelofeducation"
                                                options={educationList}
                                                value={edu.levelofeducation.value ? edu.levelofeducation : null}
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
                                                <span className="required-icon"> *</span>
                                            </Label>
                                            <CreatableSelect
                                                placeholder="Select..."
                                                name="studyField"
                                                options={studyFieldList}
                                                isMulti={false}
                                                value={edu.fieldofstudy.value ? edu.fieldofstudy : null}
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
                                            className="form-control"
                                            //defaultValue="International College of Arts and Science (UG)"
                                            value={edu?.school || ""}
                                            onChange={(evt) =>
                                                onHandleInputChange("school", evt, index)
                                            }
                                        />
                                    </FormGroup>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label>City, State</Label>
                                            <select className="form-control" defaultValue="LA">
                                                <option>Los Angeles, California</option>
                                            </select>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label>Country</Label>
                                            <select className="form-control" defaultValue="USA">
                                                <option>USA</option>
                                            </select>
                                        </FormGroup>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label>From</Label>
                                            <div className="d-flex gap-2">
                                                <select className="form-control" defaultValue="Jan">
                                                    {monthList.map((month, ind) => (< option
                                                        onChange={(evt) =>
                                                            onHandleInputChange("startdatemonth", evt, index)
                                                        }

                                                    > {month.name}</option>))}
                                                </select>
                                                <select className="form-control" defaultValue="2020">
                                                    {yearList.map((year, ind) => (
                                                        < option onChange={(evt) =>
                                                            onHandleInputChange("startdateyear", evt, index)
                                                        }> {year.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <Label>To</Label>
                                            <div className="d-flex gap-2">
                                                <select className="form-control" defaultValue="Aug">
                                                    {monthList.map((month, ind) => (
                                                        < option onChange={(evt) =>
                                                            onHandleInputChange("enddateyear", evt, index)
                                                        }> {month.name}</option>))}
                                                </select>
                                                <select className="form-control" defaultValue="2025">
                                                    {yearList.map((year, ind) => (< option onChange={(evt) =>
                                                            onHandleInputChange("enddateyear", evt, index)
                                                        }> {year.name}</option>))}
                                                </select>
                                            </div>
                                        </FormGroup>
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
            </div>
        </div >
    );
}
