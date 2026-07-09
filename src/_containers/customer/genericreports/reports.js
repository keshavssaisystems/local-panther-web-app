import React, { useEffect, useState } from "react";
import PageTitle from "_components/common/pagetitle";
import { USPhoneNumber, getTimezoneDateTime } from "_helpers/helper";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import AsyncSelect from "react-select/async";
import { CompanyFilter } from "../../admin/filterComponent";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { faFileExcel, faDownload, faFileDownload } from "@fortawesome/free-solid-svg-icons";
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
    getJobDropdownByUserid,
    getCandidateSearchDropdown,
    getCustReportJobDetail,
} from "../reports/customerreport.slice";
import { getProfileActions, getHiringMangerList, getHiringMangerListDynamic, getInterviewStatusDropDownThunk } from "_store";
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
    const endpointMap = {
        "/report/customer-jobs/10": id,
        "/report/customer-scheduled-interviews/11": "Report11ScheduledInterviews",
    };
    const endpoint = id;

    const dispatch = useDispatch();

    let data = useSelector((state) => state.reportsReducer.reportsdata || []);

    let header = useSelector((state) => state.reportsReducer?.header || {});
    let pagetitle = useSelector((state) => state.reportsReducer?.pagetitle);
    let filter = useSelector((state) => state.reportsReducer?.filters || {});


    const loading = useSelector((state) => state.reportsReducer?.loader || false);

    let totalRows = useSelector((state) => state.reportsReducer?.totalrows || 0);

    const jobDetail = useSelector((state) => state?.customerReportReducer?.jobDetail);
    const scheduleInterviewDetail = useSelector((state) => state?.customerReportReducer?.scheduleInterviewDetail);


    const title = pagetitle || "Report";

    const entityMap = {

    };
    let entity = entityMap[path];

    // pagination state
    let [jobfilter, setFilter] = useState({});
    let [currentPage, setCurrentPage] = useState(1);
    let [perPage, setPerPage] = useState();
    const [searchData, setSearchData] = useState("");
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 90);
        return date;
    });
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate());
        return date;
    });
    const [subsidiaryId, setSubsidiaryId] = useState("");
    const [company, setCompany] = useState([]);
    const [candidateId, setCandidateId] = useState("");
    const [candidateSelected, setCandidateSelected] = useState(null);
    const [jobId, setJobId] = useState();
    const [jobSelected, setJobSelected] = useState(null);
    const [recommStatusId, setRecommStatusId] = useState(-1);
    const [hiringmanagerId, setHiringMangerId] = useState(null);
    const [roleId, setRoleId] = useState();
    const [customerId, setCustomerId] = useState("");
    const [showJDModal, setShowJDModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [scoreJson, setScoreJson] = useState(null);
    const [jobTitle, setJobTitle] = useState(null);
    const [showIDModal, setShowIDModal] = useState(false);
    const [jobStatus, setJobStatus] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [profileStatusFilter, setProfileStatusFilter] = useState(null);
    const [profileSourceFilter, setProfileSourceFilter] = useState(null);
    const [minMatch, setMinMatch] = useState(null);
    const [maxMatch, setMaxMatch] = useState(null);
    const [showCustomMatch, setShowCustomMatch] = useState(false);
    let [isexport, setIsExport] = useState(0);
    const interviewFeedbackStatus = useSelector((state) => state.scheduleInterview.interviewStatus);
    const [interviewFeedbackStatusId, setInterviewFeedbackStatusId] = useState(0);
    const [offerStatusId, setOfferStatusId] = useState("");
    const [prescreenStatusFilter, setPrescreenStatusFilter] = useState("");

    const setSearchText = (text) => {
        setSearchData(text);
    };
    const recommendedJobStatusList = useSelector(
        (state) => state?.customerReportReducer?.recommendedJobStatusList
    );
    const handleChange = (name, value) => {
        setFilter({
            ...filter,
            [name]: value,
        });
    };

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

        const safeSheetName = title && title.length > 30 ? "Report" : (title || "Report");
        return [
            {
                sheetName: safeSheetName,
                details: filteredData,
            },
        ];
    }, [data, exportColumns, title]);

    // for job dropdown with search in customer job aging report

    const custJobSelectStyles = {
        menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: 0 }),
        menu: (base) => ({ ...base, borderRadius: 0 }),
        menuList: (base) => ({ ...base, borderRadius: 0 }),
        control: (base, state) => ({
            ...base,
            minHeight: "38px",
            height: "38px",
            boxShadow: state.isFocused ? base.boxShadow : "none",
            borderRadius: 0,
        }),
        valueContainer: (base) => ({ ...base, height: "38px", padding: "0 8px" }),
        input: (base) => ({ ...base, margin: 0, padding: 0 }),
        indicatorsContainer: (base) => ({ ...base, height: "38px" }),
    };
    const debouncedFetch = React.useMemo(
        () =>
            debounce((inputValue, callback) => {
                dispatch(getJobDropdownByUserid({ search: inputValue.inputValue, userId: inputValue.hiringmanagerId })).then((res) => {
                    const data = res?.payload?.data || [];
                    const options = data.map((j) => ({
                        label: j.jobtitle || j.name,
                        value: j.jobid || j.id,
                        jobid: j.jobid || j.id,
                    }));
                    callback(options);
                });
            }, 300),
        [dispatch]
    );

    const jobDropDownList = useSelector(
        (state) => state?.customerReportReducer?.jobDropDownList
    );
    const candidateDropDownList = useSelector(
        (state) => state?.customerReportReducer?.candidateDropDownList
    );
    const hiringManagerDownList = useSelector(
        (state) => state?.customerReportReducer?.hiringmangers
    );
    const loadJobOptions = (inputValue) => {
        if (inputValue.length >= 2) {
            return new Promise((resolve) => debouncedFetch({ inputValue: inputValue, hiringmanagerId: hiringmanagerId }, resolve));
        }
        return Promise.resolve([]);
    }
    const handleexportToExcel = () => {
        data = []; // to avoid export with current data, as we are fetching new data with isexport flag
        fetchData(1, 10000, startDate, endDate, searchData, candidateSelected, subsidiaryId, company,
            hiringmanagerId, jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, recommStatusId, jobId, minMatch, maxMatch, interviewFeedbackStatusId, offerStatusId, prescreenStatusFilter).then(() => {
                setIsExport(1)
            });
    };
    useEffect(() => {
        if (isexport === 1 && data.length > 0 && excelData && excelData.length > 0 && excelData[0].details && excelData[0].details.length > 0) {
            exportToExcel(excelData, `${title || "Report"}_Export`, true);
        }
        if (isexport === 1 && data.length > 0 && excelData && excelData.length > 0 && excelData[0].details && excelData[0].details.length > 0) {
            fetchData(currentPage, perPage, startDate, endDate, searchData, candidateSelected, subsidiaryId, company, hiringmanagerId, jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, recommStatusId, jobId, minMatch, maxMatch, interviewFeedbackStatusId, offerStatusId, prescreenStatusFilter);
            setIsExport(0); // reset export flag after export is done
        }
    }, [isexport]);

    // candidate dropdown with search
    const debouncedFetchCandidate = React.useMemo(
        () =>
            debounce((inputValue, callback) => {
                dispatch(getCandidateSearchDropdown(inputValue)).then((res) => {
                    const data = res?.payload?.data || [];
                    const options = data.map((c) => ({
                        label: c.candidatename || c.name || c.fullname || "",
                        value: c.candidateid || c.id,
                        candidateid: c.candidateid || c.id,
                    }));
                    callback(options);
                });
            }, 300),
        [dispatch]
    );

    const loadCandidateOptions = (inputValue) =>
        new Promise((resolve) => debouncedFetchCandidate(inputValue, resolve));


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
            .filter(col => col.isvisible === 1)
            .map(col => {
                return {
                    // name: <span className="table-title">{col.label}</span>,
                    name: <span className="table-title">
                        {col.label
                            .replace(/([A-Z])/g, "$1")       // convert camelCase 
                            .replace(/_/g, " ")              // convert snake_case
                            .replace(/\b\w/g, (c) => c.toUpperCase())
                        }</span>, // capitalize words
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
                        } else if (col.key === "viewreport") {
                            return (
                                <span className="table-cell" title={value}>
                                    <Button
                                        color="link"
                                        onClick={() => onViewReportClick(row)}
                                    >
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
                                        {getTimezoneDateTime(moment(value).format("MM/DD/YYYY HH:mm:ss"), "MM/DD/YYYY hh:mm A")}

                                        {/* {value} */}
                                    </Button>
                                </span>
                            );
                        } else if (col.key.endsWith('phone') && value && value !== '' && value !== null && value !== '-') {
                            return <span className="table-cell" title={value}>{USPhoneNumber(value)}</span>
                        } else if ((col.key.toLowerCase().indexOf("data") !== -1 || col.key.toLowerCase().endsWith('date')) 
                            && value && value !== '' && value !== '-' && value !== null && value !== undefined) {
                            return <span className="table-cell" title={getTimezoneDateTime(moment(value).format("MM/DD/YYYY HH:mm:ss"), "MM/DD/YYYY hh:mm A")}>
                                {getTimezoneDateTime(moment(value).format("MM/DD/YYYY HH:mm:ss"), "MM/DD/YYYY hh:mm A")}</span>
                        } else if (col.key === "prescreenquestionsandresponse") {
                            const urlRegex = /(https?:\/\/[^\s]+)/g;
                            const renderWithLinks = (text) => {
                                if (!text || text === '-') return text;
                                return text.split('\n').map((line, lineIdx) => {
                                    const parts = line.split(urlRegex);
                                    return (
                                        <div key={lineIdx} style={{ marginBottom: '6px' }}>
                                            {parts.map((part, i) =>
                                                /^https?:\/\//i.test(part) ? (
                                                    <Button
                                                        key={i}
                                                        tag="a"
                                                        href={part}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        size="sm"
                                                        color="primary"
                                                        style={{ padding: '2px 8px', fontSize: '11px' }}
                                                    >
                                                        Response
                                                    </Button>
                                                ) : (
                                                    <span key={i}>{part}</span>
                                                )
                                            )}
                                        </div>
                                    );
                                });
                            };
                            return (
                                <span className="table-cell" title={value}>
                                    <div style={{ maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                        {renderWithLinks(value)}
                                    </div>
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
    const fetchData = async (
        currentPage_,
        perPage_,
        startDate_,
        endDate_,
        searchData_,
        candidateSelected_,
        subsidiaryId_,
        company_,
        hiringmanagerId_,
        jobStatus_,
        statusFilter_,
        profileStatusFilter_,
        profileSourceFilter_,
        recommStatusId_,
        jobId_,
        minMatch_,
        maxMatch_,
        interviewFeedbackStatusId_ = 0,
        offerStatusId_ = "",
        prescreenStatusFilter_ = "",
        isexport_ = 0
    ) => {
        try {
            let parameterParts = [];
            parameterParts.push(`@currentpage=${currentPage_ || 1}`);
            parameterParts.push(`@PageSize=${perPage_ || 10}`);
            filter.searchData === 1 && searchData_ !== '' && parameterParts.push(`@SearchText='${searchData_}'`);
            parameterParts.push(`@startdate='${startDate_ ? moment(startDate_).format("YYYY-MM-DD") : null}'`);
            parameterParts.push(`@enddate='${endDate_ ? moment(endDate_).format("YYYY-MM-DD") : null}'`);
            filter.candidateFilter === 1 && candidateSelected_ && parameterParts.push(`@candidateid=${candidateSelected_?.candidateid}`);
            filter.subsidary === 1 && parameterParts.push(`@subsidiaryid=${subsidiaryId_ || null}`);
            filter.companyFilter === 1 && company_?.value && parameterParts.push(`@companyid=${company_.value}`);
            filter.hiringManager === 1 && hiringmanagerId_ && parameterParts.push(`@hiringmanagerid=${hiringmanagerId_}`);
            filter.jobStatus === 1 && (jobStatus_ !== null && jobStatus_ !== '' && jobStatus_ !== "") && parameterParts.push(`@jobStatus=${jobStatus_ || null}`);
            filter.currentStatus === 1 && statusFilter_ !== 'All status' && parameterParts.push(`@isactive=${statusFilter_}`);
            filter.profileStatus === 1 && profileStatusFilter_ !== null && parameterParts.push(`@profilestatus=${profileStatusFilter_}`);
            filter.profileSource === 1 && (profileSourceFilter_ !== null && profileSourceFilter_ !== '' && profileSourceFilter_ !== "") && parameterParts.push(`@profilesource=${profileSourceFilter_}`);
            filter.recommendedStatus === 1 && (recommStatusId_ !== null && recommStatusId_ !== '' && recommStatusId_ !== "") && parameterParts.push(`@recommendedjobstatusid=${recommStatusId_ || null}`);
            filter.jobFilter === 1 && jobId_ && parameterParts.push(`@jobid=${jobId_}`);
            filter.matchPercentageFilter === 1 && (minMatch_ !== null && minMatch_ !== undefined) && parameterParts.push(`@minmatch=${minMatch_}`);
            filter.matchPercentageFilter === 1 && (maxMatch_ !== null && maxMatch_ !== undefined) && parameterParts.push(`@maxmatch=${maxMatch_}`);
            filter.interviewFeedbackStatus === 1 && interviewFeedbackStatusId_ && Number(interviewFeedbackStatusId_) !== 0 && parameterParts.push(`@interviewfeedbackstatusid=${interviewFeedbackStatusId_}`);
            filter.offerStatus === 1 && offerStatusId_ !== "" && offerStatusId_ !== null && parameterParts.push(`@offerstatusid=${offerStatusId_}`);
            filter.prescreenStatus === 1 && prescreenStatusFilter_ !== "" && prescreenStatusFilter_ !== null && parameterParts.push(`@prescreenStatus=${prescreenStatusFilter_}`);
            isexport_ === 1 && parameterParts.push(`@isexport=${isexport_}`);
            const params = parameterParts.join(",");
            await dispatch(fetchReportList({ endpoint, params }));
            parameterParts = [];
            setIsExport(0);
            setPerPage(perPage);
        } catch (error) {
            console.error("list fetch failed", error);
        }
    };

    useEffect(() => {
        setSearchData("");
        setJobStatus("");
        setCurrentPage(1);
        setPerPage(10);
        filter = {};
        data = [];
        setCompany([]);
        const startdate = new Date();
        startdate.setDate(startdate.getDate() - 90);
        const enddate = new Date();
        enddate.setDate(enddate.getDate());
        setStartDate(startdate);
        setEndDate(enddate);
        const hmId = localStorage.getItem("userId");
        const userroleid = localStorage.getItem("userroleid");
        if (userroleid && Number(userroleid) > 1) { // which is usually the role id for hiring manager
            setHiringMangerId(hmId ? Number(hmId) : null);
        } else {
            setHiringMangerId(null);
        }
        // new Promise((resolve) => debouncedFetch({ inputValue: "", hiringmanagerId: hmId }, resolve));
        setJobSelected(null);
        setOfferStatusId("");
        fetchData(1, 10, startdate, enddate, "", candidateSelected, subsidiaryId, null, hiringmanagerId, jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, recommStatusId, null, null, null, 0, "", "");
        // handleClear();
    }, [path]);

    // useEffect(() => {
    //     fetchData(currentPage, perPage, startDate, endDate, searchData, candidateSelected, subsidiaryId, company, hiringmanagerId, jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, recommStatusId, jobId);

    // }, [jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, company,
    //     recommStatusId, jobId, hiringmanagerId, candidateSelected, startDate, endDate]);


    useEffect(() => {
        new Promise((resolve) => debouncedFetch({ inputValue: "", hiringmanagerId: hiringmanagerId }, resolve));
    }, [hiringmanagerId]);


    useEffect(() => {
        const companyId = Number(localStorage.getItem("companyid"));
        // dispatch(getJobDropdownByUserid({inputValue:"", hiringmanagerId}));
        dispatch(getCandidateSearchDropdown());
        dispatch(getRecommendedJobStatus());
        dispatch(getInterviewStatusDropDownThunk());
        dispatch(getHiringMangerListDynamic({ companyId: companyId, endpoint: "allUserListByCompanyForReport" }));
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, perPage, startDate, endDate, searchData, candidateSelected, subsidiaryId, company, hiringmanagerId, jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, recommStatusId, jobId, minMatch, maxMatch, interviewFeedbackStatusId, offerStatusId, prescreenStatusFilter);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        fetchData(page, newPerPage, startDate, endDate, searchData, candidateSelected, subsidiaryId, company, hiringmanagerId, jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, recommStatusId, jobId, minMatch, maxMatch, interviewFeedbackStatusId, offerStatusId, prescreenStatusFilter);
    };

    const handleSearch = () => {
        // setPerPage(perPage);
        fetchData(currentPage, perPage, startDate, endDate, searchData, candidateSelected, subsidiaryId, company, hiringmanagerId, jobStatus, statusFilter, profileStatusFilter, profileSourceFilter, recommStatusId, jobId, minMatch, maxMatch, interviewFeedbackStatusId, offerStatusId, prescreenStatusFilter);
    };
    const handleClear = () => {
        // Reset all local state variables
        setSearchData("");  // Uncommented - this was missing
        setStartDate(null);
        setEndDate(null);
        setSubsidiaryId("");
        setCandidateId("");
        setCandidateSelected(null);
        setJobId(null);
        setJobSelected(null);
        setRecommStatusId(-1);
        setStatusFilter(null);
        setProfileStatusFilter(null);
        setProfileSourceFilter(null);
        setInterviewFeedbackStatusId(0);
        setOfferStatusId("");
        setPrescreenStatusFilter("");
        setHiringMangerId(null);
        setCompany([]);
        setMinMatch(null);
        setMaxMatch(null);
        setShowCustomMatch(false);
        setCurrentPage(1);
        setPerPage(10);
        new Promise((resolve) => debouncedFetch({ inputValue: "", hiringmanagerId: hiringmanagerId }, resolve));
        // Reset job filter state to clear all filter conditions in Redux
        setFilter({});
        setJobStatus("");

        // Fetch data with no filters
        fetchData(1, 10, null, null, "", null, "", [], null, "", null, null, null, null, null, null, null, 0, "", ""); // Reset to first page with current perPage
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

    const onViewReportClick = async (row) => {
        const sanitizedScoreJson = row?.scorejson
            ? (typeof row.scorejson === "string"
                ? row.scorejson.replace(/'/g, '"').replace(/([a-zA-Z])"([a-zA-Z])/g, "$1'$2")
                : row.scorejson)
            : null;
        setScoreJson(sanitizedScoreJson);
        setJobTitle(row?.jobtitle || "");
        const response = await dispatch(getProfileActions.getCandidate(row.candidateid));
        if (response?.payload) {
            setShowReportModal(true);
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
    const onProfileStatusSelect = (status) => {
        setProfileStatusFilter(status);
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

                                <div className="btn-actions-pane-right actions-icon-btn" >
                                    <button className="btn btn-primary export-btn"
                                        style={{ background: "rgb(47 71 155)" }}
                                        title="Download Excel Report"
                                        onClick={() => handleexportToExcel()}
                                        disabled={
                                            !excelData ||
                                            excelData.length === 0 ||
                                            !excelData[0].details ||
                                            excelData[0].details.length === 0
                                        }>
                                        <FontAwesomeIcon icon={faFileDownload} /> Excel Export
                                    </button>
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
                                    {filter.companyFilter === 1 && (
                                        <Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
                                            <FormGroup>
                                                <CompanyFilter
                                                    name={"companyId"}
                                                    placeholder={"Search Company"}
                                                    onChange={(name, value, e) => {
                                                        handleChange(name, value);
                                                        setCompany(e);
                                                        setHiringMangerId(null);
                                                        dispatch(getHiringMangerListDynamic({ companyId: e.value ? e.value : 0, endpoint: "allUserListByCompanyForReport" }));
                                                    }}
                                                    value={company}
                                                />
                                            </FormGroup>
                                        </Col>
                                    )}
                                    {filter.hiringManager === 1 && (<Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
                                        <FormGroup>
                                            <Input
                                                id="hiringManagerId"
                                                type="select"
                                                value={hiringmanagerId || ""}
                                                placeholder="Search Hiring Manager"
                                                onChange={(e) => setHiringMangerId(e.target.value || null)}
                                            >
                                                <option value={""}>All Hiring Manager</option>
                                                {hiringManagerDownList?.length > 0 &&
                                                    hiringManagerDownList.map((data) => (
                                                        <option value={data.id} key={data.id}>
                                                            {data.name}
                                                        </option>
                                                    ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>)}
                                    {filter.currentStatus === 1 && (<Col lg="2" md="4" sm="12" xs="12">
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
                                    </Col>)}
                                    {filter.profileStatus === 1 && (<Col lg="2" md="4" sm="12" xs="12">
                                        <FormGroup>
                                            <Input
                                                type="select"
                                                name="profileStatus"
                                                value={profileStatusFilter ?? ""}
                                                onChange={(e) => onProfileStatusSelect(e.target.value === "" ? null : e.target.value)}
                                            >
                                                <option value={""}>All profile status</option>
                                                <option value={"1"}>Complete</option>
                                                <option value={"0"}>In-Complete</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>)}
                                    {filter.interviewFeedbackStatus === 1 && (
                                        <Col lg="2" md="4" sm="12" xs="12">
                                            <Input
                                                type="select"
                                                title="Interview Status"
                                                value={interviewFeedbackStatusId}
                                                name="interviewFeedbackStatusId"
                                                id="InterviewFeedbackStatus"
                                                placeholder="Interview Feedback Status"
                                                onChange={(e) => {
                                                    setInterviewFeedbackStatusId(e.target.value);
                                                }}                      >
                                                <option value={""}>ALL Interview Feedback</option>
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

                                    {filter.profileSource === 1 && (<Col lg="2" md="4" sm="12" xs="12">
                                        <FormGroup>
                                            <Input
                                                type="select"
                                                name="profileSource"
                                                value={profileSourceFilter ?? ""}
                                                onChange={(e) => setProfileSourceFilter(e.target.value === "" ? null : e.target.value)}
                                            >
                                                <option value={""}>All source</option>
                                                <option value={"1"}>EcoSystem</option>
                                                <option value={"0"}>Outside</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>)}

                                    {filter.jobFilter == 1 && (
                                        <Col lg="2" md="4" sm="12" sx="12">
                                            <FormGroup>
                                                <AsyncSelect
                                                    cacheOptions
                                                    defaultOptions={[
                                                        { label: "Select All", value: null, jobid: null },
                                                        ...(jobDropDownList || []).map((j) => ({
                                                            label: j.jobtitle,
                                                            value: j.jobid,
                                                            jobid: j.jobid,
                                                        })),
                                                    ]}
                                                    loadOptions={loadJobOptions}
                                                    className="cust-job-autosuggest"
                                                    classNamePrefix="react-select"
                                                    placeholder="Search job"
                                                    onChange={(selected) => {
                                                        handleChange("jobid", selected ? selected.jobid : null);
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
                                        </Col>
                                    )}

                                    {filter.matchPercentageFilter == 1 && (
                                        <Col lg="2" md="4" sm="12" xs={12}>
                                            <FormGroup>
                                                <Input
                                                    type="select"
                                                    value={showCustomMatch ? 'custom' : (minMatch !== null && maxMatch !== null ? `${minMatch}-${maxMatch}` : '')}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        if (!v) {
                                                            setMinMatch(null);
                                                            setMaxMatch(null);
                                                            setShowCustomMatch(false);
                                                        } else if (v === 'custom') {
                                                            setShowCustomMatch(true);
                                                            setMinMatch(null);
                                                            setMaxMatch(null);
                                                        } else {
                                                            setShowCustomMatch(false);
                                                            const parts = v.split('-');
                                                            setMinMatch(parts[0] ? Number(parts[0]) : null);
                                                            setMaxMatch(parts[1] ? Number(parts[1]) : null);
                                                        }
                                                    }}
                                                >
                                                    <option value="">Match% Range</option>
                                                    <option value="40-70">40% to 70%</option>
                                                    <option value="70-90">70% to 90%</option>
                                                    <option value="90-100">90% to 100%</option>
                                                    {/* <option value="custom">Custom</option> */}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    )}

                                    {showCustomMatch && (
                                        <>
                                            <Col lg="1" md="2" sm="6" xs={6}>
                                                <FormGroup>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        placeholder="Min %"
                                                        value={minMatch ?? ''}
                                                        onChange={(e) => setMinMatch(e.target.value ? Number(e.target.value) : null)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="1" md="2" sm="6" xs={6}>
                                                <FormGroup>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        placeholder="Max %"
                                                        value={maxMatch ?? ''}
                                                        onChange={(e) => setMaxMatch(e.target.value ? Number(e.target.value) : null)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </>
                                    )}

                                    {filter.candidateFilter == 1 && (
                                        <Col lg="2" md="4" sm="12" sx="12">
                                            <FormGroup>
                                                <AsyncSelect
                                                    cacheOptions
                                                    defaultOptions={[
                                                        { label: "Select All", value: null, candidateid: null },
                                                        ...(candidateDropDownList || []).map((c) => ({
                                                            label: c.candidatename || c.name,
                                                            value: c.candidateid,
                                                            candidateid: c.candidateid,
                                                        }))
                                                    ]}
                                                    loadOptions={loadCandidateOptions}
                                                    className="cust-candidate-autosuggest"
                                                    classNamePrefix="react-select"
                                                    placeholder="Search Candi..."
                                                    onChange={(selected) => {
                                                        handleChange("candidateid", selected ? selected.candidateid : null);
                                                        setCandidateId(selected ? selected.candidateid : null);
                                                        setCandidateSelected(selected);
                                                    }}
                                                    value={candidateSelected}
                                                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                                    menuPosition="fixed"
                                                    menuPlacement="auto"
                                                    styles={custJobSelectStyles}
                                                />
                                            </FormGroup>
                                        </Col>
                                    )}

                                    {/* Hiring Manager Matched Candidate List by Job Report */}
                                    {filter.recommendedStatus == 1 && (<Col lg="2" md="4" sm="12" sx="12">
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
                                                <option value={-1}>All</option>
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
                                                <option value={-2}>Presented</option>

                                            </Input>
                                        </FormGroup>
                                    </Col>)}
                                    {filter.offerStatus == 1 && (<Col lg="2" md="4" sm="12" sx="12">
                                        <FormGroup>
                                            <Input
                                                type="select"
                                                value={offerStatusId}
                                                name="offerstatusid"
                                                id="offerstatusid"
                                                placeholder="Offer Status"
                                                title="Offer Status"
                                                onChange={(e) => {
                                                    setOfferStatusId(e.target.value);
                                                }}
                                            >
                                                <option value={""}>All</option>
                                                <option value={5}>Accepted</option>
                                                <option value={6}>Declined</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>)}
                                    {filter.prescreenStatus === 1 && (<Col lg="2" md="4" sm="12" sx="12">
                                        <FormGroup>
                                            <Input
                                                type="select"
                                                value={prescreenStatusFilter}
                                                name="prescreenStatus"
                                                id="prescreenStatus"
                                                title="Prescreen Status"
                                                onChange={(e) => setPrescreenStatusFilter(e.target.value)}
                                            >
                                                <option value={""}>All</option>
                                                <option value={1}>Completed</option>
                                                <option value={0}>Pending</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>)}
                                    {filter.jobStatus == 1 && (
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


                                    {filter.startDate == 1 && (<Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
                                        <FormGroup>
                                            <div className="input-group">
                                                <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                                </div>
                                                <DatePicker
                                                    name="startDate"
                                                    id="startDate"
                                                    placeholderText="From date"
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
                                    {filter.endDate == 1 && (<Col xxl={2} xl={2} md={3} lg={3} sm={12} xs={12}>
                                        <FormGroup>
                                            <div className="input-group">
                                                <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                                </div>
                                                <DatePicker
                                                    name="endDate"
                                                    id="endDate"
                                                    placeholderText="To date"
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
            {showReportModal ? (
                <BuildCVModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    scoreJson={scoreJson}
                    jobTitle={jobTitle}
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
