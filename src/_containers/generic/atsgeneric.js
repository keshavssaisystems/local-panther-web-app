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

import { fetchATSGenericList } from "_store/atsgeneric.slice";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import "./atsgeneric.css"; // add this import
import Loader from "react-loaders";
import { useLocation } from "react-router-dom";
import { param } from "jquery";
const ATSGenericList = () => {
    console.log("ATS Hiring Contact List component rendered");
    let isCompanyAdmin = true;

    const icon = "mdi mdi-account-multiple-outline";

    const dispatch = useDispatch();
    // read candidates and loading directly from redux so component re-renders when data arrives
    const data = useSelector((state) => state.atsgeneric.atsgeneric || []);
    const loading = useSelector((state) => state.atsgeneric?.loader || false);

    const location = useLocation(); 
    const path = location.pathname.toLowerCase();
    //for path
    const endpointMap = { "/ats/atscompany": "Get_ATS_Company_List", 
                         "/ats/atscontact": "Get_ATS_HiringManagerContact_List", 
                         "/ats/atsassignee": "Get_ATS_EmployeeAssignedUsers_List",
                        };
    const endpoint = endpointMap[path];
    //for title
    const titleMap = {
      "/ats/atscompany": "ATS Company List",
      "/ats/atscontact": "ATS Hiring Manager List",
      "/ats/atsassignee": "ATS Assignee List",
    };
    const title =  titleMap[path] || "ATS";
    //for entity
    const entityMap = {
      "ats/atscompany": "atscompany",
      "ats/atscontact": "atscontact",
      "ats/atsassignee":"atsassignee",
    };
    let entity = entityMap[path];


    
    // pagination state
    const [currentPage, setCurrentPage] = useState(1); 
    const [perPage, setPerPage] = useState(10);
    const totalRows = useSelector((state) => state.atsgeneric?.totalrows || 0);
    const [searchData, setSearchData] = useState("");
    const [statusFilter, setStatusFilter] = useState(3);
    const setSearchText = (text) => {
        setSearchData(text);
    };
    const generateColumns = (rows) => {
        if (!rows || rows.length === 0) return [];

        const sample = rows[0]; // take first row keys

        return Object.keys(sample).map((key) => ({
            name: key.replace(/([A-Z])/g, " $1")       // convert camelCase 
                    .replace(/_/g, " ")              // convert snake_case
                    .replace(/\b\w/g, (c) => c.toUpperCase()), // capitalize words
            selector: (row) => {
            if (key === "isactive") {
                return row[key] ? "Active" : "Inactive";
            }
            return row[key] ?? "-";
            },
            wrap :true,
            sortable: true  
        }));
    };  
     const dynamicColumns = generateColumns(data);
   // fetch helper - requests server with paging params and updates local totalRows
    const fetchData =async (page = 1, pageSize = perPage, statusFilter, searchText = "") => {
         try {
                const params = {    
                SearchText: searchText || "",
                IsActive: statusFilter || 3,
                currentpage: page,
                PageSize: pageSize,
                };
    
                await dispatch(fetchATSGenericList({endpoint,params}));
                
            } 
            catch (error) {
                    console.error("ATS Hiring Contact list fetch failed", error);
            }
};

    useEffect(() => {
        setSearchData("");
        setStatusFilter(3);
        setCurrentPage(1);
        fetchData(1, perPage, 3, "");
    
    },[path]);

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
        const newStatus = Number(status);
        setStatusFilter(newStatus);
        fetchData(currentPage, perPage, newStatus, searchData);
    };

    const onClearSearch = () => {
        setSearchData("");
        fetchData(currentPage, perPage, statusFilter, "");
    };
    
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
                                            value={statusFilter}
                                            onChange={(e) => onStatusSelect(e.target.value)}
                                        >
                                            <option value={3}>All status</option>
                                            <option value={1}>Active</option>
                                            <option value={0}>In-active</option>
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
                                                onClick={(evt) => fetchData(currentPage, perPage, statusFilter, searchData)}
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
                                        columns={dynamicColumns}
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

export default ATSGenericList;