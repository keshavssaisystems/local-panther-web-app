import React, { useEffect, useState } from "react";
import PageTitle from "_components/common/pagetitle";
import { USPhoneNumber } from "_helpers/helper";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input,
    Button

} from "reactstrap";


import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import "./reports.css"; 
import Loader from "react-loaders";
import { useLocation } from "react-router-dom";
import AddClient from "_containers/customer/atscompanylist/addclient";
import { reportsReducer } from "_containers/customer/genericreports/reports.slice";
import { fetchReportList } from "_containers/customer/genericreports/reports.slice";

const ReportsList = () => {
    console.log("ATS Hiring Contact List component rendered");
    let isCompanyAdmin = true;

    const icon = "mdi mdi-account-multiple-outline";

    const location = useLocation(); 
    const path = location.pathname.toLowerCase();

    //for path  
    const endpointMap = { "/report/customer-jobs/10": "Report10Jobs", 
                          "/ats/atscontact": "Get_ATS_HiringManagerContact_List", 
                          "/ats/atsassignee": "Get_ATS_EmployeeAssignedUsers_List",
                        };
    const endpoint = endpointMap[path];

    const dispatch = useDispatch();
    // read candidates and loading directly from redux so component re-renders when data arrives
    
    const data = useSelector((state) => state.reportsReducer.reportsdata|| []);
    
    const header = useSelector((state) => state.reportsReducer?.header|| {});
   
    const loading = useSelector((state) => state.reportsdata?.loader || false);
   // const hiringManagerDownList = useSelector((state) => state?.customerReportReducer?.hiringmangers);
    //const { customerList = [] } = useSelector( (state) => state.adminReportReducer);

    
    
    //for title
    const titleMap = {  
      "/ats/atscompany": "Client List",
      "/ats/atscontact": "Contact List",
      "/ats/atsassignee": "Assignee List",
    };
    const title =  titleMap[path] || "ATS";
    //for entity
    const entityMap = {
      "ats/atscompany": "atscompany",
      "ats/atscontact": "atscontact",
      "ats/atsassignee":"atsassignee",
    };
    let entity = entityMap[path];

    //add user
    const [showAddClient, setShowAddClient] = useState(false);

    
    
    // pagination state
    const [currentPage, setCurrentPage] = useState(1); 
    const [perPage, setPerPage] = useState(10);
    const totalRows = useSelector((state) => state.reportsdata?.totalrows || 0);
    const [searchData, setSearchData] = useState("");
    const [statusFilter, setStatusFilter] = useState(3);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [subsidiaryId, setSubsidiaryId] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [jobId, setJobId] = useState();
    const [jobSelected, setJobSelected] = useState(null);
    const [recommStatusId, setRecommStatusId] = useState("");
    const [candidateDropDownList, setCandidateDropDownList] = useState([]);
    const [jobDropDownList, setJobDropDownList] = useState([]);
    const [recommendedJobStatusList, setRecommendedJobStatusList] = useState([]);
    let [hiringmanagerId, setHiringMangerId] = useState();
    const [roleId, setRoleId] = useState();
    const [customerId, setCustomerId] = useState("");
    
    const setSearchText = (text) => {
        setSearchData(text);
    };

    // Load candidate and job dropdowns on component mount
    useEffect(() => {
        // Load candidates - adjust this based on your actual API
        // This is a placeholder; replace with your actual candidate fetch action
        setCandidateDropDownList([]);
        setJobDropDownList([]);
    }, []);

    // const debouncedFetchJobs = React.useMemo(
    //     () =>
    //         debounce((inputValue, callback) => {
    //             // Replace with actual job dropdown fetch based on your API
    //             // Example: dispatch(getJobDropdown(inputValue)).then((res) => {
    //             const data = jobDropDownList || [];
    //             const options = data.map((j) => ({
    //                 label: j.jobtitle || j.name,
    //                 value: j.jobid || j.id,
    //                 jobid: j.jobid || j.id,
    //             }));
    //             callback(options);
    //         }, 300),
    //     [jobDropDownList]
    // );

    // const loadJobOptions = (inputValue) =>
    //     new Promise((resolve) => debouncedFetchJobs(inputValue, resolve));

    // const custJobSelectStyles = {
    //     menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: 0 }),
    //     menu: (base) => ({ ...base, borderRadius: 0 }),
    //     menuList: (base) => ({ ...base, borderRadius: 0 }),
    //     control: (base, state) => ({
    //         ...base,
    //         minHeight: "38px",
    //         height: "38px",
    //         boxShadow: state.isFocused ? base.boxShadow : "none",
    //         borderRadius: 0,
    //     }),
    //     valueContainer: (base) => ({ ...base, height: "38px", padding: "0 8px" }),
    //     input: (base) => ({ ...base, margin: 0, padding: 0 }),
    //     indicatorsContainer: (base) => ({ ...base, height: "38px" }),
    // };
    //for binding dropdown  subsidiary
    
    //for subsidiary dropdown
    const subsidiaryOptions = React.useMemo(() => {
    const map = new Map();

    data.forEach((item) => {
        if (item.subsidiaryid && !map.has(item.subsidiaryid)) {
        map.set(item.subsidiaryid, {
            id: item.subsidiaryid,
            name: item.subsidiaryName,
        });
        }
    });

    return Array.from(map.values());
    }, [data]);
    //for set header width from array to object
    const headerWidthMap = React.useMemo(() => {
    if (!Array.isArray(header)) return {};

        const map = {};
        header.forEach((h) => {
            map[h.key] = h.width;
        });
        return map;
    }, [header]);
    const generateColumns = (rows,headerWidths={}) => {
        if (!rows || rows.length === 0) return [];

        const sample = rows[0]; // take first row keys

        return Object.keys(sample).map((key) => {
            const width = headerWidths[key]; // setwidth from api
            return {
                     name: key.replace(/([A-Z])/g, "$1")       // convert camelCase 
                        .replace(/_/g, " ")              // convert snake_case
                        .replace(/\b\w/g, (c) => c.toUpperCase()), // capitalize words
                    selector: (row) => {
                        if (key === "isactive") {
                            return row[key] ? "Active" : "Inactive";
                        }
                        return row[key] ?? "-";
                    },
                    
                     wrap :true,
                     sortable: true ,
                     width: width ? `${width}%` : "auto"
            }
        });
    };  
     const dynamicColumns = generateColumns(data,headerWidthMap);
   // fetch helper - requests server with paging params and updates local totalRows
    const fetchData =async (page = 1, pageSize = perPage, statusFilter, searchText = "", startDateParam = null, endDateParam = null, subsidiaryParam = null, candidateParam = null, jobParam = null, recommStatusParam = null) => {
         try {
            const params = {    
               SearchText: searchText || "",
               IsActive: statusFilter ?? 3,
               currentpage: page,
               PageSize: pageSize,
               startDate: startDateParam || null,
               endDate: endDateParam || null,
               subsidiaryid: subsidiaryParam || null,
               candidateid: candidateParam || null,
               jobid: jobParam || null,
               customerrecommendedjobstatusid: recommStatusParam || null,
               };
               await dispatch(fetchReportList({endpoint,params}));
                
            } 
            catch (error) {
                    console.error("ATS Hiring Contact list fetch failed", error);
            }
};

    useEffect(() => {
         setSearchData("");
         setStatusFilter(3);
         setCurrentPage(1);
         fetchData(1, perPage);
    
    },[path]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, perPage, statusFilter, searchData, startDate ? moment(startDate).format("YYYY-MM-DD") : null, endDate ? moment(endDate).format("YYYY-MM-DD") : null, subsidiaryId || null, candidateId || null, jobId || null, recommStatusId || null);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        fetchData(page, newPerPage, statusFilter, searchData, startDate ? moment(startDate).format("YYYY-MM-DD") : null, endDate ? moment(endDate).format("YYYY-MM-DD") : null, subsidiaryId || null, candidateId || null, jobId || null, recommStatusId || null);
    };

    const onStatusSelect = (status) => {
        const newStatus = Number(status);
        setStatusFilter(newStatus);
        fetchData(currentPage, perPage, newStatus, searchData, startDate ? moment(startDate).format("YYYY-MM-DD") : null, endDate ? moment(endDate).format("YYYY-MM-DD") : null, subsidiaryId || null, candidateId || null, jobId || null, recommStatusId || null);
    };

    const onClearSearch = () => {
        setSearchData("");
        setStartDate(null);
        setEndDate(null);
        setSubsidiaryId("");
        setCandidateId("");
        setJobId(null);
        setJobSelected(null);
        setRecommStatusId("");
        fetchData(currentPage, perPage, statusFilter, "", null, null, null, null, null, null);
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
                                
                                <Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            name="subsidiary"
                                            value={subsidiaryId}
                                            placeholder="Subsidiary Id"
                                            id="subsidiary"
                                            onChange={(e) => setSubsidiaryId(e.target.value)}
                                        >
                                        <option value={""}>Select a subsidiary</option>
                                        {subsidiaryOptions.map((item) => (
                                            <option key={item.id} value={item.id}>
                                            {item.name}
                                            </option>
                                        ))} 
                                        </Input>
                                    </FormGroup>
                                </Col>
                                {/* <Col lg="2" md="4" sm="12" xs="12">
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            value={candidateId}
                                            name="candidateid"
                                            id="candidateid"
                                            placeholder="Candidate Id"
                                            onChange={(e) => {
                                                setCandidateId(e.target.value);
                                            }}
                                        >
                                            <option value={""}>Select a candidate</option>
                                            {candidateDropDownList?.length > 0 ? (
                                                candidateDropDownList.map((data) => (
                                                    <option
                                                        value={data.id ? data.id : data.candidateid}
                                                        key={data.id ? data.id : data.candidateid}
                                                    >
                                                        {data.name
                                                            ? data.name
                                                            : data.firstname + " " + data.lastname}
                                                    </option>
                                                ))
                                            ) : (
                                                <></>
                                            )}
                                        </Input>
                                    </FormGroup>
                                </Col> */}
                                {/* <Col lg="2" md="4" sm="12" xs="12">
                                    <FormGroup>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions={(jobDropDownList || []).map((j) => ({
                                                label: j.jobtitle,
                                                value: j.jobid,
                                                jobid: j.jobid,
                                            }))}
                                            loadOptions={loadJobOptions}
                                            className="cust-job-autosuggest"
                                            classNamePrefix="react-select"
                                            placeholder="Search job"
                                            onChange={(selected) => {
                                                setJobId(selected ? selected.jobid : null);
                                                setJobSelected(selected);
                                            }}
                                            value={jobSelected}
                                            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                            menuPosition="fixed"
                                            menuPlacement="auto"
                                            styles={custJobSelectStyles}
                                        />
                                    </FormGroup>
                                </Col> */}
                                 {/* Hiring Manager Matched Candidate List by Job Report */}
                                {/* <Col lg="2" md="4" sm="12" sx="12">
                                    <FormGroup>
                                        <Input
                                                      type="select"
                                                      value={recommStatusId}
                                                      name="customerrecommendedjobstatusid"
                                                      id="customerrecommendedjobstatusid"
                                                      placeholder="Recommended Status Id"
                                                    //   onChange={(e) => {
                                                    //     handleChange(
                                                    //       "customerrecommendedjobstatusid",
                                                    //       e.target.value 
                                                    //     );
                                                    //     setRecommStatusId(e.target.value);
                                                    //   }}
                                                    >
                                                      <option value={""}>Matched</option>
                                                      {recommendedJobStatusList?.length > 0 ? (
                                                        recommendedJobStatusList.map((data) => (
                                                          <option value={data.id} key={data.id}>
                                                            {data.name}
                                                          </option>
                                                        ))
                                                      ) : (
                                                        <></>
                                                      )}
                                        </Input>
                                    </FormGroup>
                                </Col> */}
                                {/*  */}
                                {/* <Col lg="2" md="4" sm="12" sx="12">
                                                  <FormGroup>
                                                    <Input
                                                      type="select"
                                                      value={hiringmanagerId}
                                                      name="hiringmanagerId"
                                                      id="hiringmanagerId"
                                                      placeholder="Hiring Manger"
                                                    //   onChange={(e) => {
                                                    //     handleChange("hiringmanager", e.target.value);
                                                    //     setJobId(e.target.value);
                                                    //   }}
                                                    >
                                                      <option value={""}>Select a Hiring Manger</option>
                                                      {hiringManagerDownList?.length > 0 ? (
                                                        hiringManagerDownList.map((data) => (
                                                          <option value={data.id} key={data.id}>
                                                            {data.name}
                                                          </option>
                                                        ))
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </Input>
                                                  </FormGroup>
                                                </Col>
                                                {roleId === 1 ?
                                                  <Col lg="2" md="4" sm="12" sx="12">
                                                    <FormGroup>
                                                      <Input
                                                        type="select"
                                                        value={customerId}
                                                        name="customerid"
                                                        id="customerid"
                                                        placeholder="Customer ID"
                                                        // onChange={(e) => {
                                                        //   handleChange("companyid", e.target.value);
                                                        //   setCustomerId(e.target.value);
                                                        // }}
                                                      >
                                                        <option value={""}>All Company</option>
                                                        {customerList?.length > 0 ? (
                                                          customerList.map((data) => (
                                                            <option value={data.companyid} key={data.companyid}>
                                                              {data.companyname}
                                                            </option>
                                                          ))
                                                        ) : (
                                                          <></>
                                                        )}
                                                      </Input>
                                                    </FormGroup>
                                                  </Col> : <></>} */}
                                <Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
                                    <FormGroup>
                                        <div className="input-group">
                                            <div className="input-group-text">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                            </div>
                                            <DatePicker
                                                name="startDate"
                                                id="startDate"
                                                placeholderText="MM/DD/YYYY"
                                                className="form-control"
                                                selected={startDate}
                                                maxDate={endDate}
                                                showMonthDropdown
                                                showYearDropdown
                                                onChange={(date) => {
                                                    setStartDate(date);
                                                }}
                                            />
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
                                    <FormGroup>
                                        <div className="input-group">
                                            <div className="input-group-text">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                            </div>
                                            <DatePicker
                                                name="endDate"
                                                id="endDate"
                                                placeholderText="MM/DD/YYYY"
                                                className="form-control"
                                                selected={endDate}
                                                minDate={startDate}
                                                showMonthDropdown
                                                showYearDropdown
                                                onChange={(date) => {
                                                    setEndDate(date);
                                                }}
                                            />
                                        </div>
                                    </FormGroup>
                                </Col>
                                {/* search and clear*/}
                                <Col lg="3" md="4" sm="12" sx="12">
                                                  <Button
                                                    style={{ background: "rgb(47 71 155)" }}
                                                    className="me-4"
                                                    color="primary"
                                                    type="button"
                                                    //onClick={() => onSubmitHandler()}
                                                  >
                                                    <FontAwesomeIcon icon={faSearch} /> Search
                                                  </Button>
                                                  <Button
                                                    // style={{ background: "rgb(47 71 155)" }}
                                                    color="link"
                                                    type="button"
                                                    //onClick={() => onSubmitClear()}
                                                  >
                                                    Clear
                                                  </Button>
                                                </Col>
                                <Col lg="12" md="2" sm="10" sx="12">
                                     {path == "/ats/atscompany" && ( 
                                        <Button 
                                        style={{
                                         background: "#2f479b",
                                         borderColor: "#545cd8",
                                        }}
                                        className="input-group-text float-end mt-1"
                                        color="primary" 
                                        onClick={() => setShowAddClient(true)}
                                        >
                                          Add Client
                                         </Button> )}
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
                                                onClick={(evt) => fetchData(currentPage, perPage, statusFilter, searchData, startDate ? moment(startDate).format("YYYY-MM-DD") : null, endDate ? moment(endDate).format("YYYY-MM-DD") : null, subsidiaryId || null, candidateId || null, jobId || null)}
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
            <AddClient 
                isOpen={showAddClient}
                onClose={() => setShowAddClient(false)}
                onSuccess={() => fetchData(currentPage, perPage, statusFilter, searchData)}
            />
        </div>
    );
};

export default ReportsList;