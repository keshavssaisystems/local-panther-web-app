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
const ATSGenericList = () => {
    console.log("ATS Hiring Contact List component rendered");
    let isCompanyAdmin = true;
    let entity = "Contact";
    const title = "ATS Hiring Manager";
    const icon = "mdi mdi-account-multiple-outline";

    const dispatch = useDispatch();
    // read candidates and loading directly from redux so component re-renders when data arrives
    const data = useSelector((state) => state.atsgeneric.atsgeneric || []);
    //console.log("data",data);
    const loading = useSelector((state) => state.atsgeneric?.loader || false);

    // pagination state
    const [currentPage, setCurrentPage] = useState(1); // 1-based
    const [perPage, setPerPage] = useState(10);
    const totalRows = useSelector((state) => state.atsgeneric?.totalrows || 0);
    const [searchData, setSearchData] = useState("");
    const [statusFilter, setStatusFilter] = useState(0);
    const setSearchText = (text) => {
        setSearchData(text);
    };
   // fetch helper - requests server with paging params and updates local totalRows
    const fetchData =async (page = 1, pageSize = perPage, status = 0, searchText = "") => {
         try {
                const params = {
                SearchText: searchText || "",
                IsActive: status === 0 ? null : status,
                currentpage: page,
                PageSize: pageSize,
                };
                 await dispatch(fetchATSGenericList(params));
                //console.log("new",res)
                // const payload = res?.payload || {};
                // const total =
                // payload?.total ||
                // payload?.totalRecords ||
                // payload?.totalCount ||
                // payload?.data?.totalRows ||
                // payload?.data?.totalRecords ||
                // (Array.isArray(payload?.data?.data) ? payload?.data?.length : 0);
                // console.log("Total rows:", total);
            } 
            catch (error) {
                    console.error("ATS Hiring Contact list fetch failed", error);
            }
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
    console.log("RAW ROWS:", JSON.stringify(data, null, 2))
    const columns = [
  {
    name: "Hiring Manager ID",
    selector: row => row.hiringmanagercontactid,
    sortable: true,
  },
  {
    name: "Name",
    selector: row => row.name,
    sortable: true,
  },
  {
    name: "ATS Type",
    selector: row => row.atstype ?? "-",
  },
  {

    name: "Email",
    selector: row => row.email,
  },
  {
    name: "Phone",
    selector: row => row.phonenumber,
  },
  {
    name: "Status",
    selector: row => (row.isactive ? "Active" : "Inactive"),
    sortable: true,
  },
];


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
                                            <option value={1}>All status</option>
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

export default ATSGenericList;