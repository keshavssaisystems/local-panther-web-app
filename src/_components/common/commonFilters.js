import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card,
    CardBody,
    Form,
    Col,
    Row,
    InputGroup,
    Input,
    Button,
} from "reactstrap";
import { getHiringMangerList, dropdownActions } from "_store";
import {
    setSelectedOpt,
    setSearchText,
    setHiringManagerId,
    setJobStatus,
    setPlaceHolder,
    clearFilters,
    setInterviewFeedbackStatusId,
    setStartDate,
    setEndDate
} from "_store/commonCustFiltersSlice";
import DatePicker from "react-datepicker";
import {
    faCalendarAlt,
    faSearch,
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "reactstrap";
export const CommonFilters = ({ onSearchData, onJobStatusChange, onJobHiringMangerChange, showHiringManager = true,
    showJobStatus = true,
    showSearch = true,
    showClearButtonAtStart = false,
    showClearButtonAtEnd = false,
    showOnlyJobTitle = false,
    interviewFeedbackStatus,
    showInterviewFeedbackStatus = false,
    showFromDateToDate = false,
    onClearFilters,
    showAssignButton = false,
    selectedJobsCount = 0,
    onAssignClick = null,
    viewType=null
}) => {
    const dispatch = useDispatch();

    const [filteredItems, setFilteredItems] = useState([]);
    // 🔹 Redux state for filters
    const { selectedOpt, searchText, hiringManagerId, jobStatus, placeHolder, startDate, endDate, interviewFeedbackStatusId } = useSelector(
        (state) => state.commonCustFilters
    );

    // 🔹 Hiring Manager dropdown list
    const hiringManagerDownList = useSelector(
        (state) => state?.customerReportReducer?.hiringmangers
    );

    // 🔹 Fetch hiring managers
    useEffect(() => {
        const companyId = Number(localStorage.getItem("companyid"));
        dispatch(getHiringMangerList(companyId));
        if (!hiringManagerId) {
            dispatch(setHiringManagerId(localStorage.getItem("userId")));
        }
    }, [dispatch]);

    // 🔹 Handle search type (JobTitle, City, etc.)
    const handleSelectChange = (e) => {
        const value = e.target.value;
        dispatch(setSelectedOpt(value));
        dispatch(setSearchText(""));

        const placeholderText =
            value === "JobTitle"
                ? "Search job title"
                : "Search " + value.toLowerCase();
        dispatch(setPlaceHolder(placeholderText));
    };

    // 🔹 Handle job status change
    const handleJobStatusChange = (value) => {
        dispatch(setJobStatus(value));
        //if (onJobStatusChange) onJobStatusChange(value);
    };

    // 🔹 Handle hiring manager change
    const handleHiringManagerChange = (value) => {
        dispatch(setHiringManagerId(value));
        //if (onJobHiringMangerChange) onJobHiringMangerChange(value);
    };

    // 🔹 Clear filters
    const handleClearFilters = (e) => {
        dispatch(clearFilters());
        e.preventDefault();
        if (onClearFilters) onClearFilters();
    };

    // 🔹 Submit (search)
    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearchData) onSearchData();
    };

    const handleInterviewFeedbackStatusId = (value) => {
        dispatch(setInterviewFeedbackStatusId(value));
    }
    const searchOptionDropdown = async (option) => {
        if (selectedOpt !== "JobTitle") {
            // Handle other search options
            return;
        }
        if (option?.length >= 2) {
            let companyId = Number(localStorage.getItem("companyid"));
            let filter = {
                companyId: companyId,
                isClose: 0,
                searchText: option.replaceAll(" ", "_"),
            }
            let response = await dispatch(dropdownActions.getJobsListThunk(filter));
            if (response?.payload) {
                setFilteredItems(response.payload);
            }
            else {
                setFilteredItems([]);
            }
        }
    };

    const handleSelectSearch = (value) => {
        dispatch(setSearchText(value.jobtitle));

        setFilteredItems([]); // close suggestions
    };

    const searchOptions = showOnlyJobTitle
        ? [{ value: "JobTitle", label: "Job Title" }]
        : [
            { value: "JobTitle", label: "Job Title" },
            { value: "State", label: "State" },
            { value: "City", label: "City" },
            { value: "Skills", label: "Skill" },
        ];

    const [interviewStatusId, setInterviewStatusId] = useState("");
    // const [interviewFeedbackStatusId, setInterviewFeedbackStatusId] = useState("");
    // const [startDate, setStartDate] = useState(null);
    // const [endDate, setEndDate] = useState(null);
    const interviewStatus = useSelector((state) => state?.dropdownReducer?.interviewStatus || []);
    // const interviewFeedbackStatus = useSelector(
    //     (state) => state?.dropdownReducer?.interviewFeedbackStatus || []
    // );
    const handleInterviewFilters = () => {
        if (onSearchData)
            onSearchData({
                interviewStatusId,
                interviewFeedbackStatusId,
                startDate,
                endDate,
            });
    };

    // 🔹 Handle start date change
    const handleStartDateChange = (value) => {
        dispatch(setStartDate(value));
    };

    // 🔹 Handle end date change
    const handleEndDateChange = (value) => {
        dispatch(setEndDate(value));
    };

    const onInterviewSearchClear = () => { };

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    return (
        <Col md="12">
            <Card className="main-card mb-3 card-filter filter-toolbar">
                <CardBody>
                    <div className="filter-toolbar-inner">
                        <div className="filter-label">Filters:</div>
                        <div className="filter-controls">
                            <Row className="gx-2 gy-3 align-items-center filter-row">
                                {/* Hiring Manager */}
                                <Col xs={12} sm={6} md={4} lg={2}>
                                    <Input
                                        id="hiringManagerId"
                                        type="select"
                                        value={hiringManagerId}
                                        onChange={(e) =>
                                            handleHiringManagerChange(e.target.value)
                                        }
                                        className="filter-select"
                                    >
                                        <option value={""}>Select a Hiring Manager</option>
                                        {hiringManagerDownList?.length > 0 &&
                                            hiringManagerDownList.map((data) => (
                                                <option value={data.id} key={data.id}>
                                                    {data.name}
                                                </option>
                                            ))}
                                    </Input>
                                </Col>

                                {/* Job Type */}
                                {showJobStatus && (
                                    <Col xs={12} sm={6} md={3} lg={2}>
                                        <Input
                                            id="jobStatus"
                                            name="jobStatus"
                                            type="select"
                                            value={jobStatus}
                                            onChange={(e) => handleJobStatusChange(e.target.value)}
                                            className="filter-select"
                                        >
                                            <option value={""}>Select job type</option>
                                            <option value={"Publish"}>Publish jobs</option>
                                            <option value={"Draft"}>Draft jobs</option>
                                            <option value={"Closed"}>Closed jobs</option>
                                        </Input>
                                    </Col>
                                )}
                                {/* Clear Filters */}
                                {/* {showClearButtonAtStart && (
                                    <Col xs={12} sm={12} md={2} lg={2} className="text-md-start text-left">

                                        <div className="filter-actions1">
                                            <Button
                                                color="link"
                                                className="clear-filters w-100"
                                                onClick={(e) => handleClearFilters(e)}
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>

                                    </Col>)} */}
                                {showInterviewFeedbackStatus && (
                                    <Col xs="12" sm="12" md="6" lg="2">
                                        <Input
                                            type="select"
                                            id="interviewFeedbackStatusId"
                                            title="Interview Status"
                                            value={interviewFeedbackStatusId}
                                            name="interviewFeedbackStatusId"
                                            placeholder="Interview Feedback Status"
                                            onChange={(e) => {
                                                handleInterviewFeedbackStatusId(e.target.value);
                                            }}                      >
                                            <option value={""}>Interview Feedback Status</option>
                                            {interviewFeedbackStatus?.length > 0 ? (
                                                interviewFeedbackStatus.map((data) => (
                                                    <option value={data.id} key={data.id}>
                                                        {data.name}
                                                    </option>
                                                ))
                                            ) : null}
                                        </Input>
                                    </Col>
                                )}
                                {showFromDateToDate && (
                                    <>
                                        <Col xs="12" sm="12" md="6" lg="2">
                                            <InputGroup>
                                                <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                                </div>
                                                <DatePicker
                                                    name="startDate"
                                                    id="startDate"
                                                    placeholderText="From"
                                                    className="form-control"
                                                    selected={startDate}
                                                    maxDate={endDate}
                                                    showMonthDropdown
                                                    showYearDropdown

                                                    onChange={(date) => {
                                                        // handleDateChange("startDate", date);
                                                        setStartDate(date);
                                                        handleStartDateChange(date);
                                                    }}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col xs="12" sm="12" md="6" lg="2">
                                            <InputGroup >
                                                <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                                </div>
                                                <DatePicker
                                                    name="endDate"
                                                    id="endDate"
                                                    placeholderText="To"
                                                    className="form-control"
                                                    selected={endDate}
                                                    minDate={startDate}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    onChange={(date) => {
                                                        handleEndDateChange(date);
                                                        setEndDate(date);
                                                    }}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </>
                                )}

                                {/* Search */}
                                <Col xs={12} sm={12} md={12} lg={4}>
                                    <Form onSubmit={handleSearch}>
                                        <InputGroup className="filter-search-group1">
                                            <Input
                                                name="searchType"
                                                type="select"
                                                className="fw-bold search-dropdown"
                                                value={selectedOpt}
                                                onChange={handleSelectChange}
                                            >
                                                {searchOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Input>
                                            <Input
                                                id="searchText"
                                                type="search"
                                                placeholder={placeHolder}
                                                value={searchText}
                                                onChange={(e) => {
                                                    dispatch(setSearchText(e.target.value));
                                                    searchOptionDropdown(e.target.value);
                                                }}
                                                className="filter-search-input"
                                            />
                                            {filteredItems.length > 0 && (
                                                <ul
                                                    style={{
                                                        listStyle: "none",
                                                        margin: 0,
                                                        padding: "4px",
                                                        border: "1px solid #ccc",
                                                        borderTop: "none",
                                                        position: "absolute",
                                                        width: "100%",
                                                        background: "#fff",
                                                        zIndex: 1000,
                                                        maxHeight: "150px",
                                                        overflowY: "auto",
                                                    }}
                                                >
                                                    {filteredItems.map((item, index) => (
                                                        <li
                                                            key={index}
                                                            style={{ padding: "6px", cursor: "pointer" }}
                                                            onClick={() => handleSelectSearch(item)}
                                                        >
                                                            {item.jobtitle}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {/* <Button
                                                color={"primary"}
                                                className="input-group-text search-icon"
                                                type="submit"
                                            >
                                                <FontAwesomeIcon icon={faSearch} />
                                                Search
                                            </Button>
                                            <Button
                                                // color="danger"
                                                className="input-group-text filter-search-btn"
                                                type="button"
                                                onClick={(e) => handleClearFilters(e)}
                                            >
                                                Clear
                                            </Button> */}

                                            {showSearch && (
                                                <Button
                                                    style={{ background: "rgb(47 71 155)" }}
                                                    className="input-group-text search-icon"
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    Search
                                                </Button>)}
                                            {showClearButtonAtEnd && (
                                                <Button
                                                    color="link"
                                                    type="button"
                                                    className="input-group-text filter-search-btn"
                                                    onClick={handleClearFilters}
                                                >
                                                    Clear
                                                </Button>)}
                                        </InputGroup>
                                    </Form>
                                </Col>
                                {/* Assign To Button */}
                                {showAssignButton &&  (
                                    <Col xs={12} sm={6} md={4} lg={2} className="ms-auto d-flex justify-content-end align-items-center">
                                        <span id="assignTooltipWrapper">
                                            <Button
                                                className="assign-to-btn"
                                                style={{
                                                    backgroundColor: "#2F479B",
                                                    borderColor: "#0D6EFD",
                                                    border: "1px solid #0D6EFD",
                                                    borderRadius: "4px",
                                                    color: "white",
                                                    padding: "8px 18px",
                                                    maxHeight: "150px"
                                                }}
                                                onClick={onAssignClick}
                                                disabled={selectedJobsCount === 0}
                                                >
                                                Assign To
                                            </Button>
                                        </span> 
                                        {selectedJobsCount === 0 && viewType === "list" && (
                                            <Tooltip
                                                placement="left"
                                                isOpen={tooltipOpen}
                                                target="assignTooltipWrapper"
                                                toggle={toggleTooltip}
                                            >
                                                Select one or more jobs to assign to a manager.
                                            </Tooltip>
                                        )}
                                        {selectedJobsCount === 0 && viewType === "block" && (
                                            <Tooltip
                                                placement="left"
                                                isOpen={tooltipOpen}
                                                target="assignTooltipWrapper"
                                                toggle={toggleTooltip}
                                                style={{maxWidth: "250px"}}
                                            >
                                                Switch to List View to assign jobs to Hiring Managers.
                                            </Tooltip>
                                        )}
                                        
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};
