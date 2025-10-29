import React, { useEffect } from "react";
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
import { getHiringMangerList } from "_store";
import {
    setSelectedOpt,
    setSearchText,
    setHiringManagerId,
    setJobStatus,
    clearFilters,
} from "_store/commonCustFiltersSlice";

export const CommonFilters = ({ onSearchData, onJobStatusChange, onJobHiringMangerChange, setSelectedOpt, setSearchText, setHiringMangerId, setPlaceHolder }) => {
    const dispatch = useDispatch();

    // 🔹 Redux state for filters
    const { selectedOpt, searchText, hiringManagerId, jobStatus, placeHolder } = useSelector(
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
    }, [dispatch]);

    // 🔹 Handle search type (JobTitle, City, etc.)
    const handleSelectChange = (e) => {
        const value = e.target.value;
        dispatch(setSelectedOpt(value));
        dispatch(setSearchText(""));
        dispatch(setHiringManagerId(""));

        const placeholderText =
            value === "JobTitle"
                ? "Search job title"
                : "Search " + value.toLowerCase();
        dispatch({ type: "CommonFilters/setPlaceHolder", payload: placeholderText });
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
    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    // 🔹 Submit (search)
    const handleSearch = (e) => {
        e.preventDefault();
       // if (onSearchData) onSearchData();
    };

    return (
        <Col md="12">
            <Card className="main-card mb-3 card-filter filter-toolbar">
                <CardBody>
                    <div className="filter-toolbar-inner">
                        <div className="filter-label">Filters:</div>

                        <div className="filter-controls">
                            <Row className="gx-2 gy-3 align-items-center filter-row">
                                {/* Hiring Manager */}
                                <Col xs={12} sm={6} md={4} lg={3}>
                                    <Input
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
                                <Col xs={12} sm={6} md={3} lg={2}>
                                    <Input
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

                                {/* Clear Filters */}
                                <Col xs={12} sm={12} md={2} lg={2} className="text-md-start text-left">
                                    <div className="filter-actions1">
                                        <Button
                                            color="link"
                                            className="clear-filters w-100"
                                            onClick={handleClearFilters}
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                </Col>

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
                                                <option value={"JobTitle"}>Search</option>
                                                <option value={"State"}>State</option>
                                                <option value={"City"}>City</option>
                                                <option value={"Skills"}>Skill</option>
                                            </Input>
                                            <Input
                                                type="search"
                                                placeholder={placeHolder}
                                                value={searchText}
                                                onChange={(e) =>
                                                    dispatch(setSearchText(e.target.value))
                                                }
                                                className="filter-search-input"
                                            />
                                            <Button
                                                color={"primary"}
                                                className="input-group-text filter-search-btn"
                                                type="submit"
                                            >
                                                Search
                                            </Button>
                                        </InputGroup>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};
