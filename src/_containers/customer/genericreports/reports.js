import React, { useEffect, useState } from "react";
import PageTitle from "_components/common/pagetitle";
import { USPhoneNumber } from "_helpers/helper";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import AsyncSelect from "react-select/async";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { exportToExcel } from "react-json-to-excel";
import debounce from "lodash/debounce";
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input,
    CardHeader,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button

} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import "./reports.css"; 
import Loader from "react-loaders";
import { useLocation } from "react-router-dom";
import { reportsReducer } from "_containers/customer/genericreports/reports.slice";
import { fetchReportList } from "_containers/customer/genericreports/reports.slice";
import { set } from "lodash";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import {
    getCustReportSchdIntvDetail,
    getRecommendedJobStatus,
    getCustReportJobDetail,
} from "../reports/customerreport.slice";
import { getProfileActions } from "_store";
import { BuildCVModal } from "_components/modal/buildcvmodal";
import { InterViewDetailModal } from "_components/modal/interviewdetailmodal";
import { useParams } from "react-router-dom";
import { fi } from "date-fns/locale";
const ReportsList = () => {
    
    let isCompanyAdmin = true;
    const { id } = useParams();
    const icon = "mdi mdi-account-multiple-outline";

    const location = useLocation(); 
    const path = location.pathname.toLowerCase();

    //for path  
    const endpointMap = { "/report/customer-jobs/10": id,
                          "/report/customer-scheduled-interviews/11":"Report11ScheduledInterviews",
                        };
    const endpoint = id;

    const dispatch = useDispatch();
    
    const data = useSelector((state) => state.reportsReducer.reportsdata|| []);
    
    const header = useSelector((state) => state.reportsReducer?.header|| {});
    const pagetitle = useSelector((state) => state.reportsReducer?.pagetitle);
    var filter=useSelector((state) => state.reportsReducer?.filters|| {});
    
   
    const loading = useSelector((state) => state.reportsReducer?.loader || false);

    const totalRows = useSelector((state) => state.reportsReducer?.totalrows || 0);
    
    const jobDetail = useSelector((state) => state?.customerReportReducer?.jobDetail);
    const scheduleInterviewDetail = useSelector((state) => state?.customerReportReducer?.scheduleInterviewDetail);
    
   // const hiringManagerDownList = useSelector((state) => state?.customerReportReducer?.hiringmangers);
    //const { customerList = [] } = useSelector( (state) => state.adminReportReducer);

    
    const title =  pagetitle || "Report";
    
    const entityMap = {
      
    };
    let entity = entityMap[path];

    // pagination state
    const [currentPage, setCurrentPage] = useState(1); 
    const [perPage, setPerPage] = useState(10);
    const [searchData, setSearchData] = useState("");
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
    let   [hiringmanagerId, setHiringMangerId] = useState();
    const [roleId, setRoleId] = useState();
    const [customerId, setCustomerId] = useState("");
    const [showJDModal, setShowJDModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showIDModal, setShowIDModal] = useState(false);
    const [jobStatus, setJobStatus] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    
    const setSearchText = (text) => {
        setSearchData(text);
    };

    // const debouncedFetch = React.useMemo(
    // () =>
    //     debounce((inputValue, callback) => {
    //     dispatch(getJobDropdown(inputValue)).then((res) => {
    //         const jobs = res?.payload?.data || [];
    //         callback(
    //         jobs.map((j) => ({
    //             label: j.jobtitle,
    //             value: j.jobid,
    //             jobid: j.jobid,
    //         }))
    //         );
    //     });
    //     }, 300),
    // [dispatch]
    // );

    const loadJobOptions = (inputValue) =>
    new Promise((resolve) => {
        if (!inputValue) {
            resolve(jobOptions.map((j) => ({
                label: j.jobtitle,
                value: j.jobid,
                jobid: j.jobid,
            })));
            return;
        }
        const filtered = jobOptions.filter(j =>
            j.jobtitle.toLowerCase().includes(inputValue.toLowerCase())
        );
        resolve(filtered.map((j) => ({
            label: j.jobtitle,
            value: j.jobid,
            jobid: j.jobid,
        })));
    });
    //excel
    const exportColumns = React.useMemo(() => {
        if (!Array.isArray(header)) return [];
        return header.filter((col) => col.isexport === 1);
    }, [header]);

    const excelData = React.useMemo(() => {
        if (!data || data.length === 0) return [];

        const filteredData = data.map((row, index) => {
            const obj = {};

            exportColumns.forEach((col) => {
            if (col.key === "rownumber") {
                obj[col.label] = index + 1;
            } else if (col.key === "isactive") {
                obj[col.label] = row[col.key] ? "Active" : "Inactive";
            } else {
                obj[col.label] = row[col.key] ?? "";
            }
            });

            return obj;
        });

        return [
            {
            sheetName: title || "Report",
            details: filteredData,
            },
        ];
    }, [data, exportColumns, title]);


    //for candidate dropdown
    const candidateOptions = React.useMemo(() => {
    const map = new Map();

    data.forEach((item) => {
        const id = item.candidateid || item.id;
        const name =
        item.candidatename ||
        (item.firstname && item.lastname
            ? item.firstname + " " + item.lastname
            : null);

        if (id && name && !map.has(id)) {
        map.set(id, { id, name });
        }
    });

    return Array.from(map.values());
    }, [data]);

    //for job dropdown
    const jobOptions = React.useMemo(() => {
        const map = new Map();

        data.forEach((item) => {
            if (item.jobid && !map.has(item.jobid)) {
            map.set(item.jobid, {
                jobid: item.jobid,
                jobtitle: item.jobtitle,
            });
            }
        });

        return Array.from(map.values());
    }, [data]);
   
    
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
    
    const generateColumns = (columnMetadata = []) => {
            if (!Array.isArray(columnMetadata)) return [];

            const getDisplayValue = (col, row) => {
                if (col.key === "isactive") {
                    return row[col.key] ? "Active" : "Inactive";
                }
                if (col.key === "createddate" && row[col.key]) {
                    return moment(row[col.key]).format("MM/DD/YYYY");
                }
                return row[col.key] ?? "-";
            };

            return columnMetadata
                // backend decides visibility
                .filter(col => col.isvisible === 1 )
                .map(col => {
                return {
                    name: <span className="table-title">{col.label}</span>,
                    selector: row => getDisplayValue(col, row),
                    cell: (row) => {
                        const value = getDisplayValue(col, row);
                        if (col.key === "jobtitle") {
                            return (
                                <span className="table-cell" title={value}>
                                    <Button
                                        className="no-padding"
                                        color="link"
                                        onClick={() => openJobDetails(row.jobid)}
                                    >
                                        {value}
                                    </Button>
                                </span>
                            );
                        } else if (col.key === "candidatename") {
                            return (
                                <span className="table-cell" title={value}>
                                    <Button
                                        color="link"
                                        onClick={() => onCandidateClick(row.candidateid)}
                                    >
                                        {" "}
                                        {value}
                                    </Button>
                                </span>
                            );
                        } else if (col.key === "scheduledate") {
                            return (
                                <span className="table-cell" title={value}>
                                    <Button
                                        color="link"
                                        onClick={() => onInterviewDetailClick(row.scheduleinterviewid)}
                                    >
                                        {value}
                                    </Button>
                                </span>
                            );
                        } else {
                            return <span className="table-cell" title={value}>{value}</span>;
                        }
                    },
                    minWidth: col.width,
                    wrap: true,
                    sortable: true,
                };
        
        });
    };

    const columns = React.useMemo(
    () => generateColumns(header),
    [header]
    );

   // fetch helper - requests server with paging params and updates local totalRows
    const fetchData =async () => {
         try {

            let parameterParts = []
            parameterParts.push(`@currentpage=${currentPage || 1}`);
            parameterParts.push(`@PageSize=${perPage || 10}`);
            filter.searchData === 1 && searchData !== '' && parameterParts.push(`@SearchText='${searchData || ""}'`);
            filter.startDate === 1 && startDate !== null && parameterParts.push(`@startdate='${startDate ? moment(startDate).format("YYYY-MM-DD") : null}'`);
            filter.endDate === 1 && endDate !== null && parameterParts.push(`@enddate='${endDate ? moment(endDate).format("YYYY-MM-DD") : null}'`);
            filter.candidate === 1 && parameterParts.push(`@candidateid=${candidateId || null}`);
            filter.subsidary === 1 && parameterParts.push(`@subsidiaryid=${subsidiaryId || null}`);
            filter.job === 1 && parameterParts.push(`@jobid=${jobId || null}`);
            filter.jobStatus === 1 && parameterParts.push(`@jobStatus=${jobStatus || null}`);
            filter.currentStatus === 1 && statusFilter !== 'All status' && parameterParts.push(`@isactive=${statusFilter}`);   
            filter.recommendedStatus === 1 && (recommStatusId !== null || recommStatusId !== '' ) && parameterParts.push(`@recommendedjobstatusid=${recommStatusId || null}`);
            const params = parameterParts.join(",");
            await dispatch(fetchReportList({endpoint,params}));
                
            } 
            catch (error) {
                    console.error("list fetch failed", error);
            }
};

    useEffect(() => {
         setSearchData("");
         setCurrentPage(1);
         setStatusFilter(null);
         fetchData();
    
    },[path]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
         fetchData();
        // fetchData(page, perPage, searchData, startDate ? moment(startDate).format("YYYY-MM-DD") : null, endDate ? moment(endDate).format("YYYY-MM-DD") : null, subsidiaryId || null, candidateId || null, jobId || null, recommStatusId || null);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
         fetchData();
        // fetchData(page, newPerPage, searchData, startDate ? moment(startDate).format("YYYY-MM-DD") : null, endDate ? moment(endDate).format("YYYY-MM-DD") : null, subsidiaryId || null, candidateId || null, jobId || null, recommStatusId || null);
    };

    const handleSearch = () => {
        fetchData();
    };
    const handleClear = () => {
        
        setSearchData("");
        setStartDate(null);
        setEndDate(null);
        setSubsidiaryId("");
        setCandidateId("");
        setJobId(null);
        setJobSelected(null);
        setRecommStatusId(null);
        setCurrentPage(1);

        fetchData(1, perPage, "", null, null, null, null, null, null);
    };

    const openJobDetails = async (jobId) => {
        let res = await dispatch(getCustReportJobDetail(jobId));

        if (res?.payload?.statusCode === 200) {
            setShowJDModal(true);
        }
    };

    const onCandidateClick = async (candidateId) => {
        const response = await dispatch(
            getProfileActions.getCandidate(candidateId)
        );
        if (response?.payload) {
            setShowProfileModal(true);
        }
    };

    const onInterviewDetailClick = async (interviewdetailid) => {
        const response = await dispatch(
            getCustReportSchdIntvDetail(interviewdetailid)
        );
        if (response?.payload) {
            setShowIDModal(true);
        }
    };
    const onStatusSelect = (status) => {
        setStatusFilter(status);
        // fetchData();
    };

    return (
        <>
            <div>
            <Row>
                <Col md="12">
                    <PageTitle
                        heading={entity === "roles" ? "Menu Mapping" : title}
                    icon={titlelogo}
                    />
                </Col>

                <Col md="12">
                    <Card className="mb-3">
                       <CardHeader className="card-header-tab">
                            <div className="card-header-title font-size-lg text-capitalize fw-normal">
                            Filter by
                            </div>

                            <div className="btn-actions-pane-right actions-icon-btn">
                            <UncontrolledButtonDropdown>
                                <DropdownToggle className="btn-icon btn-icon-only" color="link">
                                <i className="pe-7s-menu btn-icon-wrapper" />
                                </DropdownToggle>

                                <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
                                <DropdownItem header>Download report</DropdownItem>

                                <DropdownItem
                                    onClick={() =>
                                        exportToExcel(excelData, `${title || "Report"}_Export`, true)
                                    }
                                    >
                                    <FontAwesomeIcon className="pe-2" icon={faFileExcel} />
                                    <span>Excel</span>
                                </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            </div>
                        </CardHeader>
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

                                {filter.subsidary===1 &&(<Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
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
                                </Col>)}
                                {filter.candidate===1 &&( <Col lg="2" md="4" sm="12" xs="12">
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            value={candidateId}
                                            name="candidateid"
                                            id="candidateid"
                                            onChange={(e) => setCandidateId(e.target.value)}
                                            >
                                            <option value={""}>Select a candidate</option>

                                            {candidateOptions.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                {c.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col> )}
                                {filter.currentStatus===1 &&( <Col lg="2" md="4" sm="12" xs="12">
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            name="status"
                                            value={statusFilter}
                                            onChange={(e) => onStatusSelect(e.target.value)}
                                        >
                                            <option value={null}>All status</option>
                                            <option value={'1'}>Active</option>
                                            <option value={'0'}>In-active</option>
                                        </Input>
                                        </FormGroup>
                                </Col> )}
                                {filter.job===1 &&(<Col lg="2" md="4" sm="12" xs="12">
                                    <FormGroup>
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions={jobOptions.map((j) => ({
                                                label: j.jobtitle,
                                                value: j.jobid,
                                                jobid: j.jobid,
                                            }))}
                                            loadOptions={loadJobOptions}
                                            placeholder="Select job"
                                            onChange={(selected) => {
                                                setJobId(selected ? selected.jobid : null);
                                                setJobSelected(selected);
                                            }}
                                            value={jobSelected}
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />

                                    </FormGroup>
                                </Col> )}
                                {/* Hiring Manager Matched Candidate List by Job Report */}
                                {filter.recommendedStatus==1 &&(<Col lg="2" md="4" sm="12" sx="12">
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            value={recommStatusId}
                                            name="customerrecommendedjobstatusid"
                                            id="customerrecommendedjobstatusid"
                                            placeholder="Recommended Status Id"
                                            title="Recommended Status Id"
                                            onChange={(e) => {
                                                setRecommStatusId(e.target.value);
                                            }}
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
                                </Col> )}
                                {filter.jobStatus==1 &&(
                                <Col xxl="2" xl="2" lg="3" md="4" sm="12" xs="12">
                                    <FormGroup>
                                    <Input
                                        name="jobStatus"
                                        type="select"
                                        value={jobStatus}
                                        onChange={(e) =>
                                        setJobStatus(e.target.value)
                                        }
                                    >
                                        <option value={""}>All jobs</option>
                                        <option value={"Publish"}>Publish jobs</option>
                                        <option value={"Draft"}>Draft jobs</option>
                                        <option value={"Closed"}>Closed jobs</option>
                                    </Input>
                                    </FormGroup>
                                </Col>
                                )}
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
                                {filter.startDate==1 &&(<Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
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
                                )}
                                {filter.endDate==1 &&(<Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
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
                                </Col>)}
                                {/* search and clear*/}
                                <Col lg="3" md="4" sm="12" sx="12">
                                    <Button
                                        style={{ background: "rgb(47 71 155)" }}
                                        className="me-4"
                                        color="primary"
                                        type="button"
                                        onClick={handleSearch}                                               
                                    >
                                        <FontAwesomeIcon icon={faSearch} /> Search
                                    </Button>
                                    <Button
                                        // style={{ background: "rgb(47 71 155)" }}
                                        color="link"
                                        type="button"
                                        onClick={handleClear}
                                    >
                                        Clear
                                    </Button>
                                </Col>

                                

                            </Row>

                            {/* wrap table to enable horizontal scrolling */}
                            <div className="table-scroll-wrapper">
                                <div className="table-inner cust-rep-list-view">
                                    
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
        {showJDModal && jobDetail?.length > 0 ? (
            <CustJobDetailModal
                isOpen={showJDModal}
                data={jobDetail}
                onClose={() => setShowJDModal(false)}
                isAdmin={true}
            />
        ) : null}
        {showProfileModal ? (
            <BuildCVModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        ) : null}
        {showIDModal && scheduleInterviewDetail?.length > 0 ? (
            <InterViewDetailModal
                data={scheduleInterviewDetail[0]}
                isOpen={showIDModal}
                onClose={() => setShowIDModal(false)}
                isAdmin={true}
            />
        ) : null}
        </>
    );
};

export default ReportsList;