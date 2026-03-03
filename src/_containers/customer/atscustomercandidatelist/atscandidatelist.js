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
    Input,
    Button
} from "reactstrap";
import { atsActions } from "_store/ats.slice";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import "./atscandidatelist.css"; // add this import
import Loader from "react-loaders";
import AssigneeAtsCandidate from "./AssigneeAtsCandidate";
function ATSCandidateList() {
    let isCompanyAdmin = true;
    let entity = "candidates";
    const title = "Candidate List";
    const icon = "mdi mdi-account-multiple-outline";

    const dispatch = useDispatch();
    
    const data = useSelector((state) => state.ats?.candidates || []);
    const totalRows = useSelector((state) => state.ats?.totalrows || 0);

    const loading = useSelector((state) => state.ats?.loader || false);

    // pagination statex
    const [currentPage, setCurrentPage] = useState(1); // 1-based
    const [perPage, setPerPage] = useState(10);
    const [searchData, setSearchData] = useState("");
    const [statusFilter, setStatusFilter] = useState(0);
    const setSearchText = (text) => {
        setSearchData(text);
    };
    
    const fetchData = async (page = 1, pageSize = perPage, status, searchText) => {
        try {
            const params = { pageNumber: page, pageSize: pageSize, status: status || 0, searchText: searchText || "" };
            const res = await dispatch(atsActions.fetchCustomerCandidates(params));
        } catch (err) {
           
        }
    };

    useEffect(() => {
        // initial load
        fetchData(currentPage, perPage);
    }, [dispatch]);

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
        fetchData(currentPage, perPage, statusFilter, "");
    };

    let columns = [
        {
            name: "Candidate ID",
            id: "candidateid",
            selector: (row) => row.candidateid,
            sortable: true,
        },
        {
            name: "ATS ID",
            id: "atsid",
            selector: (row) => row.atsid,
            sortable: true,
        },
        {
            name: "ATS type",
            id: "atstype",
            selector: (row) => row.atstype,
            sortable: true,
        },
        {
            name: "Candidate name",
            id: "userName",
            selector: (row) => row.firstname + " " + row.lastname,
            sortable: true,
        },
        {
            name: "Email",
            id: "email",
            cell: (row) => (
                <>
                    {row.email}
                </>
            ),
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Phone number",
            id: "phonenumber",
            selector: (row) => {
                const raw = row.phone_number ?? row.phonenumber ?? row.phoneNumber ?? null;
                return raw ? USPhoneNumber(raw) : "-";
            },
            sortable: true,
        },
        {
            name: "Address",
            id: "address",
            cell: (row) => (
                <span className="table-cell" title={removeCommas(row.address ? row.address + ", " + row?.cityname + ", " + row?.statename + ", " + (row.zipcode || "") : "-")}>
                    {removeCommas(row.address ? row.address + ", " + row?.cityname + ", " + row?.statename + ", " + (row.zipcode || "") : "-")}
                </span>
            ),
            selector: (row) =>
                removeCommas(row.address ? row.address + ", " + row?.cityname + ", " + row?.statename + ", " + (row.zipcode || "") : "-"),
            sortable: true,
        },
        {
            name: "Assignee Status",
            cell: (row) => (
                <span className="table-cell" >
                <Button
                    className="no-padding"
                    color="link"
                    onClick={() => updateAssignedDetail(row.atscandidateid,row.isassigned,row.assignedcompanyid,row.assignedcompanyname
                                                        ,row.assignmentstartdate,row.assignmentenddate)}
                >
                    {row.isassigned == 1 ? "Assigned" : "Not assigned"}
                </Button>
                </span>
            ),
            sortable: true,
            selector: (row) => row.isassigned,
            //minWidth: "400px",
        },


    ];

    const removeCommas = (input) => {
        // return data.replace(/(,)+/g, ",").replace(/^,|,$/g, "");
        return input.replace(/(,\s*)+/g, ", ").replace(/^, |, $/g, "").trim();
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
    const [openBDModal, setOpenBDModal] = useState(false);
    const [atsCandidateId, setAtsCandidateId] = useState(null);
    const[isAssigned,setIsAssigned]=useState(false);
    const[assignedCompanyId,setAssignedCompanyId]=useState(null);
    const[assignmentStartDate,setAssignmentStartDate]=useState(null);
    const[assignmentEndDate,setAssignmentEndDate]=useState(null);
    const[assignedCompanyName,setAssignedCompanyName]=useState(null);   
    const updateAssignedDetail = (atsCandidateId,isAssigned,assignedCompanyId,assignedCompanyName,assignmentStartDate,assignmentEndDate) => {
        setAtsCandidateId(atsCandidateId); 
        setIsAssigned(isAssigned);
        setAssignedCompanyId(assignedCompanyId);  
        setAssignedCompanyName(assignedCompanyName);  
        setAssignmentStartDate(assignmentStartDate);
        setAssignmentEndDate(assignmentEndDate);
        setOpenBDModal(true);
    };
    const onCloseBDModal = () => {
        setOpenBDModal(false);
        setAtsCandidateId(null);
    };
    const handleRefreshData = () => {
        fetchData(currentPage, perPage, statusFilter, searchData);
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
                                        // className="cust-rep-list-view"
                                        customStyles={customStyles}
                                        columns={columns}
                                        pagination
                                        fixedHeader
                                        progressPending={loading}
                                        paginationServer
                                        paginationTotalRows={totalRows}
                                        paginationPerPage={perPage}
                                        paginationDefaultPage={currentPage}
                                        onChangePage={handlePageChange}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                    />
                                    
                                    {openBDModal ? (
                                            <AssigneeAtsCandidate
                                              isOpen={openBDModal}
                                              atsCandidateId={atsCandidateId}
                                              isAssigned={isAssigned}
                                              assignedCompanyId={assignedCompanyId}
                                              assignedCompanyName={assignedCompanyName}
                                              assignmentStartDate={assignmentStartDate}
                                              assignmentEndDate={assignmentEndDate}
                                              onClose={() => onCloseBDModal()}
                                              onRefresh={handleRefreshData}
                                              
                                              //isAdmin={true}
                                            />
                                          ) : (
                                            <></>
                                          )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ATSCandidateList;