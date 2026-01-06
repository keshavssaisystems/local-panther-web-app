import React, { useEffect, useState } from "react";
import PageTitle from "_components/common/pagetitle";
import { USPhoneNumber } from "_helpers/helper";
import DataTable from "react-data-table-component";
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input
} from "reactstrap";
import { atsActions } from "_store/ats.slice";
import { fetchATSCompanyList } from "_store/ats.slice";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import "./atscompanylist.css"; // add this import
import Loader from "react-loaders";
const ATSCompanyList = () => {
    console.log("ATSCompanyList component rendered");
    let isCompanyAdmin = true;
    let entity = "ATS Company";
    const title = "ATSCompany List";
    const icon = "mdi mdi-account-multiple-outline";

    const dispatch = useDispatch();
    // read candidates and loading directly from redux so component re-renders when data arrives
    const data = useSelector((state) => state.ats?.companyList || []);
    console.log(data);
    const loading = useSelector((state) => state.ats?.loader || false);


    

    // pagination state
    const [currentPage, setCurrentPage] = useState(1); // 1-based
    const [perPage, setPerPage] = useState(10);
    const totalRows = useSelector((state) => state.ats?.totalrows || 0);
    const [searchData, setSearchData] = useState("");
    const [statusFilter, setStatusFilter] = useState(0);
    const setSearchText = (text) => {
        setSearchData(text);
    };
    // fetch helper - requests server with paging params and updates local totalRows
    // const fetchData = async (page = 1, pageSize = perPage, status, searchText) => {
    //     try {
    //         const params = {endpoint:"Get_ATS_Company_List", pageNumber: page, pageSize: pageSize, status: status || 0, searchText: searchText || "" };
    //         const res = await dispatch(fetchATSCompanyList(params));
            
    //         // try to derive total rows from common response shapes
    //         const payload = res?.payload || {};
    //         console.log(payload);
    //         const total =
    //             payload?.total ||
    //             payload?.totalRecords ||
    //             payload?.totalCount ||
    //             payload?.data?.total ||
    //             payload?.data?.totalRecords ||
    //             // fallback to length of returned array
    //             (Array.isArray(payload?.data) ? payload.data.length : data.length);

    //         // setTotalRows(Number(total) || 0);
    //         console.log("Total rows:", data);
    //     } catch (err) {
            
    //     }
    // };
    const fetchData = (page = 1, pageSize = perPage, status = 0, searchText = "") => {
    dispatch(
        fetchATSCompanyList({
            SearchText: searchText,
            IsActive: status === 0 ? null : status,
            currentpage: page,
            PageSize: pageSize
        })
    );
};

    useEffect(() => {
        fetchData(1, perPage, statusFilter, searchData);
    
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, perPage, statusFilter, searchData);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        fetchData(page, newPerPage, statusFilter, searchData);
    };

    const onStatusSelect = (status) => {
        // implement status filter logic here
        setStatusFilter(status);
        fetchData(currentPage, perPage, status, searchData);
    };

    const onClearSearch = () => {
        setSearchData("");
        fetchData(1, perPage, statusFilter, "");
    };

    let columns = [
    {
        name: "Company ID",
        selector: (row) => row.pkatscompanyid,
        sortable: true
    },
    {
        name: "ATS Company ID",
        selector: (row) => row.atscompanyid,
        sortable: true
    },
    {
        name: "Company Name",
        selector: (row) => row.companyname,
        sortable: true
    },
    {
        name: "ATS Type",
        selector: (row) => row.atstype || "-",
        sortable: true
    },
    {
        name: "Email",
        selector: (row) => row.email || "-",
        sortable: true
    },
    {
        name: "Phone",
        selector: (row) => row.phonenumber || "-",
        sortable: true
    },
    {
        name: "Status",
        selector: (row) => row.isactive ? "Active" : "Inactive",
        sortable: true
    }
];

    const removeCommas = (input) => {
        // return data.replace(/(,)+/g, ",").replace(/^,|,$/g, "");
        return input.replace(/(,\s*)+/g, ", ").replace(/^, |, $/g, "").trim();
    }
    const getCity = (cityObj) => {
        if (!cityObj) return "";
        const city = JSON.parse(cityObj);
        return city.cityname || "";
    }
    const getState = (stateObj) => {
        if (!stateObj) return "";
        const state = JSON.parse(stateObj);
        return state.statename || "";
    }

    const customStyles = {
        headCells: {
            style: {
                color: "#2F479B",
                fontFamily: "Capitana",
                fontSize: "16px",
                fontWeight: "400",
            },
        },
    };
    return (
        <div>
            <Row>
                <Col md="12">
                    <PageTitle
                        heading={entity === "roles" ? "Menu Mapping" : title}
                    // icon={icon}
                    />
                </Col>

                <Col md="12">
                    <Card className="mb-3">
                        <CardBody>
                            {loading && (
                                <div className="overlay-loader">
                                    <Loader
                                        type="line-scale-pulse-out-rapid"
                                        className="d-flex justify-content-center"
                                    />
                                </div>
                            )}
                            <Row className="mb-3">

                                <Col
                                    xxl={isCompanyAdmin ? 3 : 2}
                                    xl={isCompanyAdmin ? 3 : 2}
                                    md={isCompanyAdmin ? 4 : 3}
                                    lg={isCompanyAdmin ? 3 : 2}
                                    sm={12}
                                    xs={12}
                                >
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            name="status"
                                            defaultValue="Active"
                                            onChange={(e) => onStatusSelect(e.target.value)}
                                        >
                                            <option value={0}>All status</option>
                                            <option value={1}>Active</option>
                                            <option value={2}>In-active</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <div
                                        className={cx(
                                            "candidate-search-wrapper search-wrapper candidate-seacrh-mt float-end",
                                            {
                                                active: true,
                                            }
                                        )}
                                    >
                                        <div className="input-holder float-end">
                                            <input
                                                type="text"
                                                className="search-input search-placeholder"
                                                id="search-input"
                                                value={searchData}
                                                onInput={(evt) => setSearchText(evt.target.value)}
                                                placeholder="Search.."
                                            />
                                            <button
                                                className="btn-close"
                                                onClick={(evt) => onClearSearch()}
                                            />
                                            <button
                                                onClick={(evt) => fetchData(1, perPage, 0, searchData)}
                                                className="search-icon"
                                            >
                                                <span />
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* wrap table to enable horizontal scrolling */}
                            <div className="table-scroll-wrapper">
                                <div className="table-inner">
                                    <DataTable
                                        data={data}
                                        columns={columns}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={totalRows}
                                        paginationPerPage={perPage}
                                        paginationDefaultPage={currentPage}
                                        onChangePage={handlePageChange}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        progressPending={loading}
                                        fixedHeader
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ATSCompanyList;