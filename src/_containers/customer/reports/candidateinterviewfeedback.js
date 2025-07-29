import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Col,
  Row,
  FormGroup,
  InputGroup,
  Button,
  Card,
  CardBody,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSearch,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import {
  getCustReportScheduleIVList,
  getScheduledCandidatesForCustomerDropdown,
  getJobDropdown,
  getCustReportJobDetail,
  getCustReportSchdIntvDetail,
  getReportCandidateInterviewList,
  getHiringMangerList
} from "./customerreport.slice";
import { getCustomerDropdownList } from "_store";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import moment from "moment";
import Loader from "react-loaders";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import { getProfileActions } from "_store";
import { BuildCVModal } from "_components/modal/buildcvmodal";
import { InterViewDetailModal } from "_components/modal/interviewdetailmodal";
import { analytics } from "../../../firebase/index";
import "./customerreport.scss";
import { getTimezoneDateTime } from "_helpers/helper";
import { CustomerReportScheduledInterviews } from "./customerscheduleinterviews";
export function CandidateInterviewFeedback() {
  const dispatch = useDispatch();
  const { id } = useParams();
  let [filter, setFilter] = useState({});
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [jobId, setJobId] = useState();
  let [candidateId, setCandidateId] = useState();
  const [excelData, setExcelData] = useState([]);
  const [showJDModal, setShowJDModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  let [hiringmanagerId, setHiringMangerId] = useState();
  const [customerId, setCustomerId] = useState("");
  const [roleId, setRoleId] = useState();
  const candidateInterviewFeedbackList = useSelector(
    (state) => state?.customerReportReducer?.candidateInterviewFeedbacks
  );
  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const jobDetail = useSelector(
    (state) => state?.customerReportReducer?.jobDetail
  );
  const scheduleInterviewDetail = useSelector(
    (state) => state?.customerReportReducer?.scheduleInterviewDetail
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
  const { customerList = [] } = useSelector(
    (state) => state.adminReportReducer
  );
  useEffect(() => {
    setRoleId(Number(localStorage.getItem("userroleid")));
    let userId = Number(localStorage.getItem("userId"));
    let companyId = Number(localStorage.getItem("companyid"));
    onGetReportCandidateInterviewList({});
    dispatch(getScheduledCandidatesForCustomerDropdown(userId));
    dispatch(getJobDropdown());
    dispatch(getHiringMangerList(companyId));
    dispatch(getCustomerDropdownList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Employer Schedule Interview Report",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  useEffect(() => {
    if (candidateInterviewFeedbackList?.length > 0) {
      let filteredData = candidateInterviewFeedbackList.map((data) => {
        return {
          "Candidate name": data.candidatename,
          "Job title": data.jobtitle,
          "Hiring Manager name": data.hiringmanegername,
          "Interview date & time": data.scheduledate ? getTimezoneDateTime(moment(data.scheduledate.slice(0, 11) + data.starttime).format("YYYY-MM-DD HH:mm:ss"), "MM/DD/YYYY HH:mm:ss") : "",
          "Interviewer Feedback": data.interviewtatus,
          "Current Candidate Status": data.recommendedjobstatus,
          "Company Name": data.companyname
        };
      });
      setExcelData([
        {
          sheetName: "InterviewFeedbacks",
          details: filteredData,
        },
      ]);
    }
  }, [candidateInterviewFeedbackList]);

  const onGetReportCandidateInterviewList = (filter) => {
    let data = {
      ...filter,
      //reportId: id,
    };
    dispatch(getReportCandidateInterviewList(data));
  };

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleDateChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: moment(value).format("YYYY-MM-DD"),
    });
  };

  const onSubmitClear = () => {
    setFilter({});
    setStartDate(null);
    setEndDate(null);
    setCandidateId("");
    setJobId("");
    onGetReportCandidateInterviewList({});
  };

  const onSubmitHandler = () => {
    onGetReportCandidateInterviewList(filter);
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

  const columns = [
    {
      name: <span className="table-title">Candidate name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.candidatename}>
          <Button
            color="link"
            onClick={() => onCandidateClick(row.candidateid)}
          >
            {row.candidatename}
          </Button>
        </span>
      ),
      sortable: true,
      selector: (row) => row.candidatename,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Job title</span>,
      cell: (row) => (
        <span className="table-cell" title={row.jobtitle}>
          <Button
            className="no-padding"
            color="link"
            onClick={() => openJobDetails(row.jobid)}
          >
            {row.jobtitle}
          </Button>
        </span>
      ),
      sortable: true,
      selector: (row) => row.jobtitle,
      minWidth: "300px",
    },
    {
      name: <span className="table-title">Hiring Manager Name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.hiringmanegername}>
          {row.hiringmanegername}
        </span>
      ),
      sortable: true,
      selector: (row) => row.hiringmanegername,
      minWidth: "300px",
    },

    {
      name: <span className="table-title">Interview Date & Time</span>,
      cell: (row) => (
        <span
          className="table-cell"
          title={
            row.scheduledate
              ? getTimezoneDateTime(
                moment(row.scheduledate.slice(0, 11) + row.starttime).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                "MM/DD/YYYY HH:mm:ss"
              )
              : ""
          }
        >
          {row.scheduledate
            ? getTimezoneDateTime(
              moment(row.scheduledate.slice(0, 11) + row.starttime).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              "MM/DD/YYYY HH:mm:ss"
            )
            : ""}

        </span>
      ),
      sortable: true,
      selector: (row) => row.scheduledate,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Interviewer Feedback</span>,
      cell: (row) => (
        <span className="table-cell" title={row.interviewtatus}>
          {row.interviewtatus}
        </span>
      ),
      sortable: true,
      selector: (row) => row.interviewtatus,
      minWidth: "350px",
    },
    {
      name: <span className="table-title">Current Candidate Status</span>,
      cell: (row) => (
        <span className="table-cell" title={row.recommendedjobstatus}>
          {row.recommendedjobstatus}
        </span>
      ),
      sortable: true,
      selector: (row) => row.recommendedjobstatus,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">Company Name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.companyname}>
          {row.companyname}
        </span>
      ),
      sortable: true,
      selector: (row) => row.companyname,
      minWidth: "150px",
    }
  ];

  return (
    <>
      <PageTitle
        heading={"Candidate Interview Feedback Report"}
        icon={titlelogo}
      />
      <Row className="cust-report-job-cont">
        <Col md="12" lg="12" xl="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                Filter by
              </div>
              <div className="btn-actions-pane-right actions-icon-btn">
                <UncontrolledButtonDropdown>
                  <DropdownToggle
                    className="btn-icon btn-icon-only"
                    color="link"
                  >
                    <i className="pe-7s-menu btn-icon-wrapper" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
                    <DropdownItem header>Download report</DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        exportToExcel(
                          excelData,
                          "customerScheduledInterviewReport",
                          true
                        )
                      }
                    >
                      <FontAwesomeIcon
                        className="pe-2"
                        icon={faFileExcel}
                        style={{ boxSizing: "content-box" }}
                      />
                      <span>Excel</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="2" md="4" sm="12" sx="12">
                  <FormGroup>
                    <Input
                      type="select"
                      value={candidateId}
                      name="candidateid"
                      id="candidateid"
                      placeholder="Candidate Id"
                      onChange={(e) => {
                        handleChange("candidate", e.target.value);
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
                </Col>
                <Col lg="2" md="4" sm="12" sx="12">
                  <FormGroup>
                    <Input
                      type="select"
                      value={jobId}
                      name="jobid"
                      id="jobid"
                      placeholder="Job Id"
                      onChange={(e) => {
                        handleChange("jobtitle", e.target.value);
                        setJobId(e.target.value);
                      }}
                    >
                      <option value={""}>Select a job</option>
                      {jobDropDownList?.length > 0 ? (
                        jobDropDownList.map((data) => (
                          <option value={data.jobid} key={data.jobid}>
                            {data.jobtitle}
                          </option>
                        ))
                      ) : (
                        <></>
                      )}
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg="2" md="4" sm="12" sx="12">
                  <FormGroup>
                    <Input
                      type="select"
                      value={hiringmanagerId}
                      name="hiringmanagerId"
                      id="hiringmanagerId"
                      placeholder="Hiring Manger"
                      onChange={(e) => {
                        handleChange("hiringmanager", e.target.value);
                        setJobId(e.target.value);
                      }}
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
                        onChange={(e) => {
                          handleChange("companyid", e.target.value);
                          setCustomerId(e.target.value);
                        }}
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
                  </Col> : <></>}



                <Col lg="2" md="4" sm="12" sx="12" style={{ display: "none" }}>
                  <FormGroup>
                    <InputGroup>
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
                          handleDateChange("startDate", date);
                          setStartDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="2" md="4" sm="12" sx="12" style={{ display: "none" }}>
                  <FormGroup>
                    <InputGroup>
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
                          handleDateChange("endDate", date);
                          setEndDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="3" md="4" sm="12" sx="12">
                  <Button
                    style={{ background: "rgb(47 71 155)" }}
                    className="me-4"
                    color="primary"
                    type="button"
                    onClick={() => onSubmitHandler()}
                  >
                    <FontAwesomeIcon icon={faSearch} /> Search
                  </Button>
                  <Button
                    // style={{ background: "rgb(47 71 155)" }}
                    color="link"
                    type="button"
                    onClick={() => onSubmitClear()}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
              <Row className="mt-1">
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateInterviewFeedbackList?.length > 0 ? (
                      <DataTable
                        columns={columns}
                        data={candidateInterviewFeedbackList}
                        fixedHeader
                        pagination
                        className="cust-rep-list-view"
                      />
                    ) : (
                      <Row className="center-align ">
                        <NoDataFound></NoDataFound>
                      </Row>
                    )}
                  </>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <>
        {" "}
        {showJDModal && jobDetail?.length > 0 ? (
          <CustJobDetailModal
            isOpen={showJDModal}
            data={jobDetail}
            onClose={() => setShowJDModal(false)}
            isAdmin={true}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showProfileModal ? (
          <>
            <BuildCVModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {showIDModal && scheduleInterviewDetail.length > 0 ? (
          <>
            <InterViewDetailModal
              data={scheduleInterviewDetail[0]}
              isOpen={showIDModal}
              onClose={() => {
                setShowIDModal(false);
              }}
              isAdmin={true}
            ></InterViewDetailModal>
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
}
